import { Request, Response } from "express";
import * as reviewService from "../services/review.services";

export async function getDueCards(req: Request, res: Response) {
    const deckId = BigInt(req.params.deckId as string);
    const userId = BigInt(req.userId as string);

    const cards = await reviewService.getDueCards(userId, deckId);
    res.json(cards);
}

export async function submitReview(req: Request, res: Response) {
    try {
        const { flashcardId, quality } = req.body;
        if (flashcardId === undefined || quality === undefined) {
            return res.status(400).json({ message: "Thiếu flashcardId hoặc quality" });
        }

        const userId = BigInt(req.userId as string);
        const result = await reviewService.submitReview(userId, BigInt(flashcardId), Number(quality));
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Lỗi" });
    }
}