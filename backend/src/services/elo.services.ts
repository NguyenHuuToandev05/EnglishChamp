// ELO gốc (cờ vua) chỉ tính cho 2 người. Với phòng nhiều người (3-8 người),
// rồi lấy trung bình - tức mỗi người "đấu" ngầm với tất cả người còn lại.

interface PlayerEloInput {
    userId: string;
    rating: number; // ELO 
    rank: number;
}

const K_FACTOR = 32; // hệ số "biến động" - càng cao thì điểm thay đổi càng mạnh sau 1 trận

export function calculateMultiplayerElo(players: PlayerEloInput[]): Map<string, number> {
    const n = players.length;
    const newRatings = new Map<string, number>();

    if (n < 2) {
        players.forEach((p) => newRatings.set(p.userId, p.rating));
        return newRatings;
    }

    for (const player of players) {
        // dựa theo công thức ELO gốc, rồi lấy trung bình so với tất cả đối thủ.
        let expectedSum = 0;
        for (const opponent of players) {
            if (opponent.userId === player.userId) continue;
            expectedSum += 1 / (1 + Math.pow(10, (opponent.rating - player.rating) / 400));
        }
        const expectedScore = expectedSum / (n - 1);

        // Actual score: hạng càng cao (rank=1) thì điểm càng gần 1, hạng bét gần 0.
        // Ví dụ phòng 4 người: rank1 -> 1.0, rank2 -> 0.67, rank3 -> 0.33, rank4 -> 0
        const actualScore = (n - player.rank) / (n - 1);

        const delta = Math.round(K_FACTOR * (actualScore - expectedScore));
        newRatings.set(player.userId, player.rating + delta);
    }

    return newRatings;
}