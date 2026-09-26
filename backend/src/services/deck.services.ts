import prisma from "../config/db";

export async function getAllDecks() {
    // Chỉ lấy deck public, kèm số lượng thẻ để hiển thị ngoài danh sách
    return prisma.deck.findMany({
        where: { isPublic: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getDeckById(deckId: bigint) {
    const deck = await prisma.deck.findUnique({
        where: { id: deckId },
        include: { flashcards: true }, // lấy kèm toàn bộ thẻ trong deck
    });
    if (!deck) throw new Error("Không tìm thấy deck");
    return deck;
}

export async function createDeck(ownerId: bigint, title: string, description?: string) {
    return prisma.deck.create({
        data: { ownerId, title, description },
    });
}

export async function addFlashcard(
    deckId: bigint,
    data: { frontText: string; backText: string; phonetic?: string; exampleSentence?: string }
) {
    const card = await prisma.flashcard.create({ data: { deckId, ...data } });

    // Cập nhật lại card_count cho deck (denormalize để query danh sách nhanh hơn)
    await prisma.deck.update({
        where: { id: deckId },
        data: { cardCount: { increment: 1 } },
    });

    return card;
}