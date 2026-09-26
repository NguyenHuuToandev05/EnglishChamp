import { Router } from "express";
import { listDecks, getDeck, createDeck, addFlashcard } from "../controllers/deck.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", listDecks);
router.get("/:id", getDeck);
router.post("/", requireAuth, createDeck);
router.post("/:id/flashcards", requireAuth, addFlashcard);

export default router;