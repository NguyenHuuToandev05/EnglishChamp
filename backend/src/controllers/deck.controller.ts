import { Request, Response } from "express";
import * as deckService from "../services/deck.services";

export async function listDecks(_req: Request, res: Response) {
    const decks = await deckService.getAllDecks();
    res.json(decks);
}

export async function getDeck(req: Request, res: Response) {
    try {
        const deck = await deckService.getDeckById(BigInt(req.params.id as string));
        res.json(deck);
    } catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : "Lỗi" });
    }
}

export async function createDeck(req: Request, res: Response) {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ message: "Thiếu title" });
    }
    const deck = await deckService.createDeck(BigInt(req.userId as string), title, description);
    res.status(201).json(deck);
}

export async function addFlashcard(req: Request, res: Response) {
    const { frontText, backText, phonetic, exampleSentence } = req.body;
    if (!frontText || !backText) {
        return res.status(400).json({ message: "Thiếu frontText hoặc backText" });
    }
    const card = await deckService.addFlashcard(BigInt(req.params.id as string), {
        frontText, backText, phonetic, exampleSentence,
    });
    res.status(201).json(card);
}