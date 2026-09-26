import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET ?? "fallback_secret_khong_an_toan";
const SALT_ROUNDS = 10;

export async function registerUser(username: string, email: string, password: string) {

    const existing = await prisma.user.findFirst({
        where: { OR: [{ username }, { email }] },
    });
    if (existing) {
        throw new Error("Email đã được sử dụng");
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: { username, email, passwordHash },
    });

    return sanitizeUser(user);
}

export async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Email hoặc mật khẩu không đúng");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error("Email hoặc mật khẩu không đúng");
    }

    const token = generateToken(user.id.toString());
    return { user: sanitizeUser(user), token };
}

function generateToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

function sanitizeUser(user: { passwordHash: string;[key: string]: unknown }) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
}