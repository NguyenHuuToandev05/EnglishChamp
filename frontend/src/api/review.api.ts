import apiClient from "./client";
import type { Flashcard } from "../types/flashcard";

export async function getDueCards(deckId: string): Promise<Flashcard[]> {
    const res = await apiClient.get<Flashcard[]>(`/review/due/${deckId}`);
    return res.data;
}

// quality: 1 = Quên, 3 = Khó, 4 = Nhớ, 5 = Dễ (thang điểm SM-2 gốc là 0-5)
export async function submitReview(flashcardId: string, quality: number) {
    const res = await apiClient.post("/review/submit", { flashcardId, quality });
    return res.data;
}