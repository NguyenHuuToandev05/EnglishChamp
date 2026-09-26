import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { createRoomState, getRoomState, removeRoomState } from "./roomState";
import { calculateMultiplayerElo } from "../services/elo.services";

const JWT_SECRET = process.env.JWT_SECRET ?? "fallback_secret_khong_an_toan";

export function registerRoomHandlers(io: Server) {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token as string | undefined;
        if (!token) return next(new Error("Thiếu token"));

        try {
            const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
            socket.data.userId = payload.userId; // gắn userId vào socket, dùng lại ở các event sau
            next();
        } catch {
            next(new Error("Token không hợp lệ"));
        }
    });

    io.on("connection", (socket: Socket) => {
        const userId = socket.data.userId as string;
        console.log(`[socket] User ${userId} kết nối (${socket.id})`);

        socket.on("join_room", async ({ roomCode }: { roomCode: string }) => {
            try {
                const room = await prisma.room.findUnique({
                    where: { roomCode },
                    include: { players: { include: {} } },
                });
                if (!room) return socket.emit("error_message", "Không tìm thấy phòng");

                // socket.join() là khái niệm của Socket.IO: gom nhiều socket vào 1 "kênh"
                // để sau này broadcast (io.to(roomCode).emit(...)) chỉ những người trong phòng nhận được.
                socket.join(roomCode);

                // Báo cho những người ĐÃ ở trong phòng biết có người mới vào
                socket.to(roomCode).emit("player_joined", { userId });

                // Lấy danh sách người chơi hiện tại kèm thông tin cơ bản, trả về cho người vừa join
                const players = await prisma.user.findMany({
                    where: { id: { in: room.players.map((p) => p.userId) } },
                    select: { id: true, username: true, avatarUrl: true, eloRating: true },
                });

                socket.emit("room_joined", { room, players });
            } catch (error) {
                socket.emit("error_message", "Lỗi khi join phòng");
            }
        });

        // ---- HOST BẮT ĐẦU TRẬN ----
        socket.on("start_game", async ({ roomCode }: { roomCode: string }) => {
            try {
                const room = await prisma.room.findUnique({ where: { roomCode } });
                if (!room) return socket.emit("error_message", "Không tìm thấy phòng");
                if (room.hostId.toString() !== userId) {
                    return socket.emit("error_message", "Chỉ chủ phòng mới được bắt đầu trận");
                }
                if (room.status !== "waiting") {
                    return socket.emit("error_message", "Trận đã bắt đầu rồi");
                }

                const allCards = await prisma.flashcard.findMany({
                    where: { deckId: room.deckId },
                    select: { id: true },
                });
                if (allCards.length < room.roundsTotal) {
                    return socket.emit("error_message", "Deck không đủ thẻ cho số vòng đã set");
                }
                const shuffled = allCards.sort(() => Math.random() - 0.5).slice(0, room.roundsTotal);

                const state = createRoomState(
                    roomCode,
                    room.deckId.toString(),
                    room.timePerRoundSec,
                    room.roundsTotal
                );
                state.flashcardIds = shuffled.map((c) => c.id.toString());

                await prisma.room.update({
                    where: { id: room.id },
                    data: { status: "in_progress", startedAt: new Date() },
                });

                io.to(roomCode).emit("game_started", { roundsTotal: room.roundsTotal });

                setTimeout(() => startNextRound(io, roomCode), 2000);
            } catch (error) {
                socket.emit("error_message", "Lỗi khi bắt đầu trận");
            }
        });
        // ---- NGƯỜI CHƠI GỬI CÂU TRẢ LỜI ----
        socket.on("submit_answer", async ({ roomCode, answerText }: { roomCode: string; answerText: string }) => {
            const state = getRoomState(roomCode);
            if (!state || state.roundStartedAt === null) return;

            // Chặn trả lời 2 lần trong cùng 1 vòng
            if (state.answers.has(userId)) return;

            const answerTimeMs = Date.now() - state.roundStartedAt;
            const flashcardId = state.flashcardIds[state.currentRoundIndex];
            const flashcard = await prisma.flashcard.findUnique({ where: { id: BigInt(flashcardId) } });
            if (!flashcard) return;

            // So sánh không phân biệt hoa/thường và khoảng trắng thừa
            const isCorrect = answerText.trim().toLowerCase() === flashcard.backText.trim().toLowerCase();
            const points = calculatePoints(isCorrect, answerTimeMs, state.timePerRoundSec);

            state.answers.set(userId, { userId, isCorrect, answerTimeMs, points });
            socket.emit("answer_received", { isCorrect, points });

            if (state.answers.size >= state.playerIds.size) {
                endRound(io, roomCode);
            }
        });

        socket.on("disconnect", () => {
            console.log(`[socket] User ${userId} ngắt kết nối`);
        });
    });
}
async function startNextRound(io: Server, roomCode: string) {
    const state = getRoomState(roomCode);
    if (!state) return;

    state.currentRoundIndex += 1;
    state.answers.clear();
    state.roundStartedAt = Date.now();

    const flashcardId = state.flashcardIds[state.currentRoundIndex];
    const flashcard = await prisma.flashcard.findUnique({ where: { id: BigInt(flashcardId) } });
    if (!flashcard) return;

    io.to(roomCode).emit("round_start", {
        roundNumber: state.currentRoundIndex + 1,
        roundsTotal: state.roundsTotal,
        flashcardId,
        frontText: flashcard.frontText,
        phonetic: flashcard.phonetic,
        timeLimitSec: state.timePerRoundSec,
    });

    // Hẹn giờ: nếu hết thời gian mà vẫn còn người chưa trả lời -> tự động kết thúc vòng
    state.roundTimer = setTimeout(() => {
        endRound(io, roomCode);
    }, state.timePerRoundSec * 1000);
}

// Chấm điểm 1 câu trả lời: đúng + nhanh -> điểm cao. Sai -> 0 điểm.
function calculatePoints(isCorrect: boolean, answerTimeMs: number, timeLimitSec: number): number {
    if (!isCorrect) return 0;

    const BASE_POINTS = 1000;
    const MIN_POINTS = 100;

    const timeLimitMs = timeLimitSec * 1000;
    const ratio = Math.max(0, 1 - answerTimeMs / timeLimitMs);
    const points = Math.round(MIN_POINTS + (BASE_POINTS - MIN_POINTS) * ratio);

    return points;
}

async function endRound(io: Server, roomCode: string) {
    const state = getRoomState(roomCode);
    if (!state) return;

    if (state.roundTimer) {
        clearTimeout(state.roundTimer);
        state.roundTimer = null;
    }

    const flashcardId = state.flashcardIds[state.currentRoundIndex];
    const flashcard = await prisma.flashcard.findUnique({ where: { id: BigInt(flashcardId) } });

    // Cộng dồn điểm vòng này vào tổng điểm từng người
    const roundResults = Array.from(state.answers.entries()).map(([uid, ans]) => {
        const total = (state.totalScores.get(uid) ?? 0) + ans.points;
        state.totalScores.set(uid, total);
        return { userId: uid, isCorrect: ans.isCorrect, answerTimeMs: ans.answerTimeMs, points: ans.points, totalScore: total };
    });

    // Người không kịp trả lời vòng này -> vẫn xuất hiện trong bảng điểm với 0 điểm vòng
    for (const uid of state.playerIds) {
        if (!state.answers.has(uid)) {
            const total = state.totalScores.get(uid) ?? 0;
            roundResults.push({ userId: uid, isCorrect: false, answerTimeMs: -1, points: 0, totalScore: total });
        }
    }

    io.to(roomCode).emit("round_end", {
        roundNumber: state.currentRoundIndex + 1,
        correctAnswer: flashcard?.backText,
        results: roundResults,
    });

    // Còn vòng tiếp theo hay đã hết?
    if (state.currentRoundIndex + 1 < state.roundsTotal) {
        setTimeout(() => startNextRound(io, roomCode), 3000); // nghỉ 3s giữa các vòng cho mọi người xem kết quả
    } else {
        setTimeout(() => finishGame(io, roomCode), 3000);
    }
}

async function finishGame(io: Server, roomCode: string) {
    const state = getRoomState(roomCode);
    if (!state) return;

    const room = await prisma.room.findUnique({ where: { roomCode }, include: { players: true } });
    if (!room) return;

    const ranked = Array.from(state.totalScores.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([userId, score], index) => ({ userId, score, rank: index + 1 }));

    // Tính ELO mới dựa trên hạng
    const eloInputs = ranked.map((r) => {
        const roomPlayer = room.players.find((p) => p.userId.toString() === r.userId);
        return { userId: r.userId, rating: roomPlayer?.eloBefore ?? 1200, rank: r.rank };
    });
    const newRatings = calculateMultiplayerElo(eloInputs);

    // Ghi kết quả xuống DB - CHỈ ghi 1 lần duy nhất lúc này (không ghi mỗi vòng)
    for (const r of ranked) {
        const newElo = newRatings.get(r.userId)!;
        await prisma.roomPlayer.update({
            where: { roomId_userId: { roomId: room.id, userId: BigInt(r.userId) } },
            data: { totalScore: r.score, finalRank: r.rank, eloAfter: newElo },
        });
        await prisma.user.update({
            where: { id: BigInt(r.userId) },
            data: { eloRating: newElo },
        });
    }

    await prisma.room.update({
        where: { id: room.id },
        data: { status: "finished", endedAt: new Date() },
    });

    io.to(roomCode).emit("game_over", {
        finalRanking: ranked.map((r) => ({
            ...r,
            eloBefore: eloInputs.find((e) => e.userId === r.userId)?.rating,
            eloAfter: newRatings.get(r.userId),
        })),
    });

    removeRoomState(roomCode);
}