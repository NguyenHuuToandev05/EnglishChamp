import prisma from "../config/db";

export async function getMatchHistory(userId: bigint, limit = 20) {
    const history = await prisma.roomPlayer.findMany({
        where: { userId, room: { status: "finished" } },
        include: { room: { include: { deck: { select: { title: true } } } } },
        orderBy: { room: { endedAt: "desc" } },
        take: limit,
    });

    return history.map((h) => ({
        roomCode: h.room.roomCode,
        deckTitle: h.room.deck.title,
        finalRank: h.finalRank,
        totalScore: h.totalScore,
        eloBefore: h.eloBefore,
        eloAfter: h.eloAfter,
        eloChange: h.eloAfter !== null ? h.eloAfter - h.eloBefore : null,
        playedAt: h.room.endedAt,
    }));
}