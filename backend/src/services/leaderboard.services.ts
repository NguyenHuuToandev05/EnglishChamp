import prisma from "../config/db";

export async function getTopPlayers(limit = 50) {
    return prisma.user.findMany({
        orderBy: { eloRating: "desc" },
        take: limit,
        select: {
            id: true,
            username: true,
            avatarUrl: true,
            eloRating: true,
            level: true,
        },
    });
}