// Mở rộng type Request của Express để thêm field userId
// (sau khi middleware xác thực xong sẽ gắn userId vào đây)
declare namespace Express {
    export interface Request {
        userId?: string;
    }
}