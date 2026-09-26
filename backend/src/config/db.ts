import { PrismaClient } from "@prisma/client";

// Tại sao cần "singleton" (chỉ 1 instance duy nhất)?
// Nếu mỗi file tự "new PrismaClient()" thì mỗi lần import sẽ mở
// 1 connection pool riêng tới MySQL -> rất nhanh hết connection.
// Cách làm ở đây: tạo 1 lần duy nhất, import ra dùng chung ở mọi nơi.

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export default prisma;
