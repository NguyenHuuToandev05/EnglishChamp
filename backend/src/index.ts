import "./config/bigInt";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import deckRoutes from "./routes/deck.routes";
import reviewRoutes from "./routes/review.routes";
import roomRoutes from "./routes/room.routes";
import { registerRoomHandlers } from "./sockets/room.socket";

const app = express();

// ---- Middleware cơ bản ----
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express.json()); // cho phép đọc req.body dạng JSON

// ---- Routes ----
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/decks", deckRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/rooms", roomRoutes);


// ---- HTTP server + Socket.IO ----
// Lý do phải tạo httpServer riêng thay vì app.listen() trực tiếp:
// Socket.IO cần "gắn" vào cùng 1 HTTP server với Express để dùng chung 1 cổng (port).
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN ?? "*" },
});
registerRoomHandlers(io);

const PORT = process.env.PORT ?? 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server đang chạy ở http://localhost:${PORT}`);
});
