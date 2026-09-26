import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.services";

export async function register(req: Request, res: Response) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Thiếu username, email hoặc password" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password phải từ 6 ký tự" });
        }

        const user = await registerUser(username, email, password);
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Đăng ký thất bại" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu email hoặc password" });
        }

        const result = await loginUser(email, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error instanceof Error ? error.message : "Đăng nhập thất bại" });
    }
}