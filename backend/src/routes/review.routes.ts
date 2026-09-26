import { Router } from "express";
import { getDueCards, submitReview } from "../controllers/review.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/due/:deckId", requireAuth, getDueCards);
router.post("/submit", requireAuth, submitReview);

export default router;