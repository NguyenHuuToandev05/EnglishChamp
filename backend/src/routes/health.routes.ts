import { Router } from "express";
import prisma from "../config/db";

const router = Router();

// GET /api/health -> chỉ để check server có chạy không (chưa đụng DB)
router.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Server đang chạy" });
});

// GET /api/health/db -> check server có NÓI CHUYỆN ĐƯỢC với MySQL không
router.get("/db", async (_req, res) => {
  try {
    // Chạy 1 câu SQL đơn giản nhất có thể để test kết nối
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", message: "Kết nối MySQL thành công" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Không kết nối được MySQL",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
