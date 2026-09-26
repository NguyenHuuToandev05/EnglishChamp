import prisma from "../config/db";
import { calculateSM2 } from "./sm2.services";

// Lấy danh sách thẻ user cần ôn HÔM NAY (đến hạn hoặc chưa từng học)
export async function getDueCards(userId: bigint, deckId: bigint, limit = 20) {
    const now = new Date();

    // Thẻ ĐÃ có tiến độ và đã đến hạn ôn lại
    const dueCards = await prisma.userCardProgress.findMany({
        where: {
            userId,
            nextReviewAt: { lte: now }, // lte = less than or equal, tức "đến hạn hoặc quá hạn"
            flashcard: { deckId },
        },
        include: { flashcard: true },
        orderBy: { nextReviewAt: "asc" }, // ôn thẻ quá hạn lâu nhất trước
        take: limit,
    });

    if (dueCards.length >= limit) {
        return dueCards.map((p) => p.flashcard);
    }

    // Nếu chưa đủ số lượng, bổ sung thêm THẺ MỚI (chưa từng có progress)
    const learnedCardIds = await prisma.userCardProgress.findMany({
        where: { userId, flashcard: { deckId } },
        select: { flashcardId: true },
    });
    const excludeIds = learnedCardIds.map((p) => p.flashcardId);

    const newCards = await prisma.flashcard.findMany({
        where: {
            deckId,
            id: { notIn: excludeIds.length > 0 ? excludeIds : undefined },
        },
        take: limit - dueCards.length,
    });

    return [...dueCards.map((p) => p.flashcard), ...newCards];
}

// Lưu kết quả sau khi user trả lời 1 thẻ
export async function submitReview(userId: bigint, flashcardId: bigint, quality: number) {
    if (quality < 0 || quality > 5) {
        throw new Error("Quality phải từ 0 đến 5");
    }

    // Tìm progress cũ, nếu chưa có (lần đầu học thẻ này) thì dùng giá trị mặc định
    const existing = await prisma.userCardProgress.findUnique({
        where: { userId_flashcardId: { userId, flashcardId } },
    });

    const sm2Result = calculateSM2({
        quality,
        easinessFactor: existing ? Number(existing.easinessFactor) : 2.5,
        repetitions: existing?.repetitions ?? 0,
        intervalDays: existing?.intervalDays ?? 0,
    });

    // upsert = update nếu đã tồn tại, create nếu chưa có (gộp 2 case thành 1 câu lệnh)
    const updated = await prisma.userCardProgress.upsert({
        where: { userId_flashcardId: { userId, flashcardId } },
        update: {
            easinessFactor: sm2Result.easinessFactor,
            repetitions: sm2Result.repetitions,
            intervalDays: sm2Result.intervalDays,
            nextReviewAt: sm2Result.nextReviewAt,
            lastReviewedAt: new Date(),
            lastQuality: quality,
            status: sm2Result.status,
        },
        create: {
            userId,
            flashcardId,
            easinessFactor: sm2Result.easinessFactor,
            repetitions: sm2Result.repetitions,
            intervalDays: sm2Result.intervalDays,
            nextReviewAt: sm2Result.nextReviewAt,
            lastReviewedAt: new Date(),
            lastQuality: quality,
            status: sm2Result.status,
        },
    });

    return updated;
}