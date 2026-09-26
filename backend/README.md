# Backend - English Learning App

## Yêu cầu trước khi chạy
- Node.js >= 18
- MySQL đã cài và đang chạy (local hoặc Docker)

## Setup lần đầu

```bash
npm install
cp .env.example .env
```

Mở `.env`, sửa `DATABASE_URL` cho đúng thông tin MySQL của bạn:
```
DATABASE_URL="mysql://<user>:<password>@localhost:3306/english_app"
```

Tạo database (nếu chưa có):
```sql
CREATE DATABASE english_app CHARACTER SET utf8mb4;
```

Generate Prisma Client (bắt buộc, phải chạy được internet để tải engine):
```bash
npx prisma generate
```

Đẩy schema Prisma xuống MySQL (tạo bảng thật):
```bash
npx prisma db push
```

## Chạy dev server

```bash
npm run dev
```

Server chạy ở `http://localhost:4000`. Test thử:
- `GET http://localhost:4000/api/health` → check server sống chưa
- `GET http://localhost:4000/api/health/db` → check kết nối MySQL

## Cấu trúc thư mục

```
src/
├── config/       # kết nối DB, biến cấu hình
├── routes/       # định nghĩa URL endpoint
├── controllers/  # nhận request, trả response
├── services/     # logic nghiệp vụ (SM-2, ELO...)
├── middleware/   # auth, error handling
├── sockets/      # Socket.IO - xử lý phòng đấu real-time
└── index.ts      # entry point
```

## Ghi chú
- File `prisma/schema.prisma` hiện chỉ có bảng `User` để test kết nối trước.
  Các bảng khác (decks, flashcards, rooms...) sẽ được thêm dần ở các bước tiếp theo,
  bám theo `schema.sql` gốc.
