import { Router } from "express";
import { createRoom, joinRoom, getRoom } from "../controllers/room.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, createRoom);
router.post("/:code/join", requireAuth, joinRoom);
router.get("/:code", requireAuth, getRoom);

export default router;