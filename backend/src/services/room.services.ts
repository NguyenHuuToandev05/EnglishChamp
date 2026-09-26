import prisma from "../config/db";

// Sinh mã phòng ngẫu nhiên 6 ký tự (chữ hoa + số), dễ đọc để bạn bè gõ tay
function generateRoomCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ ký tự dễ nhầm: O/0, I/1
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

export async function createRoom(hostId: bigint, deckId: bigint) {
    // Đảm bảo mã phòng không trùng (xác suất trùng rất thấp nhưng vẫn nên check)
    let roomCode = generateRoomCode();
    let exists = await prisma.room.findUnique({ where: { roomCode } });
    while (exists) {
        roomCode = generateRoomCode();
        exists = await prisma.room.findUnique({ where: { roomCode } });
    }

    const host = await prisma.user.findUniqueOrThrow({ where: { id: hostId } });

    const room = await prisma.room.create({
        data: {
            roomCode,
            hostId,
            deckId,
            players: {
                create: { userId: hostId, eloBefore: host.eloRating },
            },
        },
        include: { players: true },
    });

    return room;
}

export async function joinRoom(roomCode: string, userId: bigint) {
    const room = await prisma.room.findUnique({
        where: { roomCode },
        include: { players: true },
    });

    if (!room) throw new Error("Không tìm thấy phòng");
    if (room.status !== "waiting") throw new Error("Phòng đã bắt đầu hoặc kết thúc");
    if (room.players.length >= room.maxPlayers) throw new Error("Phòng đã đầy");

    const alreadyIn = room.players.some((p) => p.userId === userId);
    if (alreadyIn) return room; // đã join rồi thì trả về luôn, không lỗi

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    await prisma.roomPlayer.create({
        data: { roomId: room.id, userId, eloBefore: user.eloRating },
    });

    return prisma.room.findUniqueOrThrow({
        where: { id: room.id },
        include: { players: { include: {} } },
    });
}

export async function getRoomByCode(roomCode: string) {
    const room = await prisma.room.findUnique({
        where: { roomCode },
        include: { players: true },
    });
    if (!room) throw new Error("Không tìm thấy phòng");
    return room;
}