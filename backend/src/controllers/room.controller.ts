import { Request, Response } from "express";
import * as roomService from "../services/room.services";

export async function createRoom(req: Request, res: Response) {
    try {
        const { deckId } = req.body;
        if (!deckId) return res.status(400).json({ message: "Thiếu deckId" });

        const hostId = BigInt(req.userId as string);
        const room = await roomService.createRoom(hostId, BigInt(deckId));
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Lỗi" });
    }
}

export async function joinRoom(req: Request, res: Response) {
    try {
        const userId = BigInt(req.userId as string);
        const room = await roomService.joinRoom(req.params.code as string, userId);
        res.json(room);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Lỗi" });
    }
}

export async function getRoom(req: Request, res: Response) {
    try {
        const room = await roomService.getRoomByCode(req.params.code as string);
        res.json(room);
    } catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : "Lỗi" });
    }
}