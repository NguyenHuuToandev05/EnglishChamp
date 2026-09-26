import { Request, Response } from "express";
import * as leaderboardService from "../services/leaderboard.services";

export async function getLeaderboard(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const players = await leaderboardService.getTopPlayers(limit);

    // Gắn thêm "rank" (1, 2, 3...) dựa theo thứ tự trả về, tiện cho frontend hiển thị luôn
    const ranked = players.map((p, index) => ({ ...p, rank: index + 1 }));

    res.json(ranked);
}