// JSON.stringify() không hỗ trợ sẵn kiểu BigInt (giới hạn của chuẩn JSON).
// Đoạn này dạy cho BigInt cách tự chuyển thành string mỗi khi bị serialize,
// để res.json() không bị crash mỗi khi trả về field kiểu BigInt (id, deckId...).
declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function () {
    return this.toString();
};

export { };