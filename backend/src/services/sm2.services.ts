// Thuật toán SM-2 (SuperMemo 2) - cùng nền tảng thuật toán Anki đang dùng.
//
// "quality" là điểm người dùng tự đánh giá sau khi trả lời (0-5):
//   0-2 = KHÔNG nhớ / trả lời sai -> phải học lại từ đầu
//   3-5 = CÓ nhớ, càng cao thì càng dễ nhớ -> giãn thời gian ôn ra xa hơn
//
// Sau này ở frontend có thể đơn giản hoá thành 4 nút:
//   "Quên" (quality=1) / "Khó" (quality=3) / "Nhớ" (quality=4) / "Dễ" (quality=5)

export interface SM2Input {
    quality: number;         // 0-5, người dùng tự đánh giá
    easinessFactor: number;  // độ "dễ nhớ" hiện tại của thẻ này (mặc định 2.5)
    repetitions: number;     // số lần trả lời đúng LIÊN TIẾP
    intervalDays: number;    // khoảng cách lần ôn trước (ngày)
}

export interface SM2Result {
    easinessFactor: number;
    repetitions: number;
    intervalDays: number;
    nextReviewAt: Date;
    status: "learning" | "review" | "mastered";
}

export function calculateSM2(input: SM2Input): SM2Result {
    const { quality, repetitions, intervalDays } = input;
    let easinessFactor = input.easinessFactor;

    // Công thức gốc SM-2: cập nhật độ dễ nhớ (EF) dựa trên quality vừa trả lời.
    // Quality thấp -> EF giảm (thẻ này "khó nhớ" hơn với user này).
    // Quality cao -> EF tăng (thẻ này "dễ nhớ" với user này).
    easinessFactor =
        easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // EF không được thấp hơn 1.3 (giới hạn cứng của thuật toán gốc,
    // để tránh interval bị co lại quá nhanh, quá vô lý)
    if (easinessFactor < 1.3) easinessFactor = 1.3;

    let newRepetitions: number;
    let newInterval: number;

    if (quality < 3) {
        // Trả lời sai/quên -> reset lại, coi như học lại từ đầu, ôn lại SAU 1 NGÀY
        newRepetitions = 0;
        newInterval = 1;
    } else {
        // Trả lời đúng -> tăng repetitions, giãn interval ra xa hơn
        newRepetitions = repetitions + 1;

        if (newRepetitions === 1) {
            newInterval = 1; // lần đúng đầu tiên -> ôn lại sau 1 ngày
        } else if (newRepetitions === 2) {
            newInterval = 6; // lần đúng thứ 2 -> ôn lại sau 6 ngày
        } else {
            // Từ lần thứ 3 trở đi: interval mới = interval cũ * EF (tăng dần theo cấp số)
            newInterval = Math.round(intervalDays * easinessFactor);
        }
    }

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

    // Trạng thái chỉ để hiển thị UI (vd: thanh progress "đã thành thục bao nhiêu %")
    let status: SM2Result["status"] = "learning";
    if (newRepetitions >= 2 && newInterval >= 6) status = "review";
    if (newRepetitions >= 5 && newInterval >= 30) status = "mastered";

    return { easinessFactor, repetitions: newRepetitions, intervalDays: newInterval, nextReviewAt, status };
}