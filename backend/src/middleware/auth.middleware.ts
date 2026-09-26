import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "fallback_secret_khong_an_toan";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    // Convention chuẩn: client gửi token qua header "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Thiếu token, vui lòng đăng nhập" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = payload.userId; // gắn userId vào req để controller phía sau dùng
        next(); // token hợp lệ -> cho đi tiếp
    } catch (error) {
        // Token sai hoặc đã hết hạn (expiresIn: "7d" lúc tạo)
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
}