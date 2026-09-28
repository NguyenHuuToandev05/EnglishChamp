import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    Volume2,
    ChevronRight,
    RotateCcw,
    Zap,
    Star,
    Clock,
    Target,
    BookOpen,
} from "lucide-react";
import { getDueCards, submitReview } from "../api/review.api";
import type { Flashcard } from "../types/flashcard";

/* ── Mock fallback cards (when API is empty / dev) ── */
const MOCK_CARDS: Flashcard[] = [
    {
        id: "c1",
        word: "PERSISTENT",
        phonetic: "/pəˈsɪstənt/",
        meaning: "Kiên trì; bền bỉ không bỏ cuộc",
        example: '"She was persistent in pursuing her goal despite the difficulties."',
        exampleVi: "Cô ấy kiên trì theo đuổi mục tiêu của mình bất chấp mọi khó khăn.",
        deckId: "1",
    } as unknown as Flashcard,
    {
        id: "c2",
        word: "METICULOUS",
        phonetic: "/məˈtɪkjʊləs/",
        meaning: "Tỉ mỉ; cẩn thận từng chi tiết",
        example: '"He was meticulous in checking every detail of the report."',
        exampleVi: "Anh ấy cẩn thận kiểm tra từng chi tiết của báo cáo.",
        deckId: "1",
    } as unknown as Flashcard,
    {
        id: "c3",
        word: "ELOQUENT",
        phonetic: "/ˈɛləkwənt/",
        meaning: "Hùng hồn; diễn đạt lưu loát và thuyết phục",
        example: '"The president gave an eloquent speech about unity."',
        exampleVi: "Tổng thống đã có bài phát biểu hùng hồn về sự đoàn kết.",
        deckId: "1",
    } as unknown as Flashcard,
    {
        id: "c4",
        word: "AMBIGUOUS",
        phonetic: "/æmˈbɪɡjʊəs/",
        meaning: "Mơ hồ; có thể hiểu theo nhiều cách",
        example: '"The contract contained several ambiguous clauses."',
        exampleVi: "Hợp đồng có một số điều khoản mơ hồ.",
        deckId: "1",
    } as unknown as Flashcard,
    {
        id: "c5",
        word: "PRAGMATIC",
        phonetic: "/præɡˈmætɪk/",
        meaning: "Thực dụng; chú trọng thực tế hơn lý thuyết",
        example: '"We need a pragmatic approach to solve this problem."',
        exampleVi: "Chúng ta cần cách tiếp cận thực dụng để giải quyết vấn đề này.",
        deckId: "1",
    } as unknown as Flashcard,
];

const DECK_NAMES: Record<string, string> = {
    "1": "IELTS Academic 3000",
    "2": "TOEIC Mastery",
    "3": "Oxford 5000",
};

const QUALITY_BUTTONS = [
    { label: "Chưa nhớ", key: "1", quality: 1, color: "#ef4444", bg: "#fef2f2", border: "#fecaca", count: "1 lần/h" },
    { label: "Khó", key: "2", quality: 3, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", count: "4 lần/h" },
    { label: "Nhớ tốt", key: "3", quality: 4, color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", count: "8 lần/h" },
    { label: "Rất dễ", key: "4", quality: 5, color: "#5b4ef5", bg: "#eef2ff", border: "#c7d2fe", count: "Hôm sau" },
];

const MODES = [
    { id: "spaced", label: "Ôn lặp ngắt quãng" },
    { id: "space", label: "Space" },
    { id: "listen", label: "Lịp thẻ" },
];

export default function StudyPage() {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();

    const [cards, setCards] = useState<Flashcard[]>([]);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeMode, setActiveMode] = useState("spaced");
    const [sessionXP, setSessionXP] = useState(0);
    const [accuracy] = useState(92);
    const [elapsed, setElapsed] = useState(0); // seconds
    const [cardFlipAnim, setCardFlipAnim] = useState(false);
    const [grading, setGrading] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Timer
    useEffect(() => {
        timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    useEffect(() => {
        if (!deckId) return;
        getDueCards(deckId)
            .then((data) => setCards(data.length > 0 ? data : MOCK_CARDS))
            .catch(() => setCards(MOCK_CARDS))
            .finally(() => setLoading(false));
    }, [deckId]);

    const currentCard = cards[index] as (Flashcard & { phonetic?: string; meaning?: string; example?: string; exampleVi?: string }) | undefined;
    const isDone = !loading && cards.length > 0 && index >= cards.length;
    const progressPercent = cards.length > 0 ? Math.round((index / cards.length) * 100) : 0;
    const deckName = DECK_NAMES[deckId ?? "1"] ?? "Bộ từ vựng";

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    async function handleGrade(quality: number) {
        if (!currentCard || submitting) return;
        setGrading(quality);
        setSubmitting(true);
        try {
            await submitReview(currentCard.id, quality);
            if (quality >= 4) setSessionXP((x) => x + (quality === 5 ? 10 : 7));
            else if (quality === 3) setSessionXP((x) => x + 4);
        } catch {
            // mock: still advance
        } finally {
            setTimeout(() => {
                setCardFlipAnim(false);
                setFlipped(false);
                setIndex((i) => i + 1);
                setGrading(null);
                setSubmitting(false);
            }, 200);
        }
    }

    const handleFlip = useCallback(() => {
        setCardFlipAnim(true);
        setTimeout(() => {
            setFlipped((f) => !f);
            setCardFlipAnim(false);
        }, 150);
    }, []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!currentCard) return;
            if (e.code === "Space") { e.preventDefault(); handleFlip(); }
            if (flipped) {
                if (e.key === "1") handleGrade(1);
                if (e.key === "2") handleGrade(3);
                if (e.key === "3") handleGrade(4);
                if (e.key === "4") handleGrade(5);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentCard, flipped, submitting]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#f4f5fb" }}>
            {/* ── Top bar ── */}
            <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
                <button
                    id="study-back"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span>Quay lại tổng quan</span>
                </button>

                <div className="h-5 w-px bg-slate-200 mx-1" />

                {/* Deck name */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{deckName}</span>
                    <ChevronRight size={14} className="text-slate-300" />
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">C1</span>
                </div>

                {/* Mode tabs */}
                <div className="flex items-center gap-1 ml-4 bg-slate-100 rounded-xl p-1">
                    {MODES.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setActiveMode(m.id)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                activeMode === m.id
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {/* Progress counter */}
                <div className="ml-auto flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">
                        {Math.min(index, cards.length)}/{cards.length} thẻ
                    </span>
                    {/* Progress bar */}
                    <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progressPercent}%`,
                                background: "linear-gradient(90deg, #5b4ef5, #818cf8)",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">

                {/* Loading */}
                {loading && (
                    <div className="text-center">
                        <div className="w-14 h-14 rounded-2xl animate-pulse mx-auto mb-4 bg-slate-200" />
                        <p className="text-slate-400 font-medium">Đang tải thẻ...</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && cards.length === 0 && (
                    <div className="text-center">
                        <CheckCircle2 size={56} className="mx-auto mb-4 text-emerald-500" />
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Tuyệt vời! 🎉</h2>
                        <p className="text-slate-400 mb-6">Deck này chưa có thẻ nào cần ôn hôm nay.</p>
                        <button
                            onClick={() => navigate("/")}
                            className="text-sm font-bold px-6 py-3 rounded-xl bg-[#5b4ef5] text-white shadow-md shadow-indigo-200 hover:bg-indigo-600 transition-all"
                        >
                            Về Dashboard
                        </button>
                    </div>
                )}

                {/* Done */}
                {!loading && isDone && (
                    <div className="text-center max-w-sm">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Xuất sắc!</h2>
                        <p className="text-slate-500 mb-1">
                            Bạn đã ôn hết <strong className="text-slate-900">{cards.length} thẻ</strong> trong phiên này.
                        </p>
                        <p className="text-sm font-bold text-indigo-600 mb-8">+{sessionXP} XP kiếm được!</p>

                        {/* Result Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {[
                                { label: "Thời gian", value: formatTime(elapsed), icon: <Clock size={16} /> },
                                { label: "Độ chính xác", value: `${accuracy}%`, icon: <Target size={16} /> },
                                { label: "Thẻ ôn", value: String(cards.length), icon: <BookOpen size={16} /> },
                            ].map((s) => (
                                <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
                                    <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">{s.icon}</div>
                                    <p className="font-bold text-slate-900 text-lg">{s.value}</p>
                                    <p className="text-xs text-slate-400">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => { setIndex(0); setFlipped(false); setSessionXP(0); setElapsed(0); }}
                                className="flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                                <RotateCcw size={15} />
                                Ôn lại
                            </button>
                            <button
                                id="study-done-back"
                                onClick={() => navigate("/")}
                                className="text-sm font-bold px-5 py-3 rounded-2xl bg-[#5b4ef5] text-white shadow-md shadow-indigo-200 hover:bg-indigo-600 transition-all"
                            >
                                Về Dashboard →
                            </button>
                        </div>
                    </div>
                )}

                {/* Active card */}
                {!loading && currentCard && !isDone && (
                    <>
                        {/* Flashcard */}
                        <div
                            id="flashcard-main"
                            onClick={handleFlip}
                            className="w-full max-w-2xl cursor-pointer select-none"
                            style={{
                                transition: "transform 0.15s ease",
                                transform: cardFlipAnim ? "scale(0.97)" : "scale(1)",
                            }}
                        >
                            <div
                                className="bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-200/60 p-10 text-center"
                                style={{ minHeight: 280 }}
                            >
                                {/* Sound icon */}
                                <div className="flex justify-end mb-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); }}
                                        className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <Volume2 size={16} />
                                    </button>
                                </div>

                                {!flipped ? (
                                    /* Front */
                                    <div className="flex flex-col items-center justify-center gap-3 py-4">
                                        <h2
                                            className="font-display font-black text-5xl tracking-tight text-slate-900"
                                            style={{ letterSpacing: "0.05em" }}
                                        >
                                            {(currentCard as { word?: string }).word ?? currentCard.id}
                                        </h2>
                                        {(currentCard as { phonetic?: string }).phonetic && (
                                            <p className="text-base text-slate-400 font-medium">
                                                {(currentCard as { phonetic?: string }).phonetic}
                                            </p>
                                        )}
                                        {(currentCard as { example?: string }).example && (
                                            <div className="mt-4 border-t border-slate-100 pt-5 max-w-lg">
                                                <p className="text-slate-600 italic text-sm leading-relaxed font-medium">
                                                    {(currentCard as { example?: string }).example}
                                                </p>
                                                {(currentCard as { exampleVi?: string }).exampleVi && (
                                                    <p className="text-slate-400 text-xs mt-1.5">
                                                        {(currentCard as { exampleVi?: string }).exampleVi}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* Back */
                                    <div className="flex flex-col items-center justify-center gap-3 py-4">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 mb-1">
                                            <Star size={12} className="text-indigo-500 fill-indigo-500" />
                                            <span className="text-xs font-bold text-indigo-600">Nghĩa</span>
                                        </div>
                                        <h2 className="font-display font-bold text-2xl text-slate-900">
                                            {(currentCard as { meaning?: string }).meaning ?? "—"}
                                        </h2>
                                        {(currentCard as { word?: string }).word && (
                                            <p className="text-sm text-slate-400 font-medium">
                                                {(currentCard as { word?: string }).word} · {(currentCard as { phonetic?: string }).phonetic}
                                            </p>
                                        )}
                                        {(currentCard as { example?: string }).example && (
                                            <div className="mt-3 border-t border-slate-100 pt-4 max-w-lg">
                                                <p className="text-slate-600 italic text-sm leading-relaxed">
                                                    {(currentCard as { example?: string }).example}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Flip hint / Quality buttons */}
                        {!flipped ? (
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <kbd className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white border border-slate-200 text-slate-500 shadow-sm">
                                    Space
                                </kbd>
                                <span>để lật thẻ và đánh giá</span>
                            </div>
                        ) : (
                            <div className="w-full max-w-2xl">
                                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                    Đánh giá mức độ ghi nhớ
                                </p>
                                <div className="grid grid-cols-4 gap-3">
                                    {QUALITY_BUTTONS.map((btn) => (
                                        <button
                                            key={btn.key}
                                            id={`grade-${btn.quality}`}
                                            onClick={() => handleGrade(btn.quality)}
                                            disabled={submitting}
                                            className="flex flex-col items-center gap-1.5 py-3.5 px-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                            style={{
                                                background: grading === btn.quality ? btn.color : btn.bg,
                                                color: grading === btn.quality ? "white" : btn.color,
                                                border: `1.5px solid ${btn.border}`,
                                            }}
                                        >
                                            <span>{btn.label}</span>
                                            <span
                                                className="text-[10px] font-medium opacity-70"
                                            >
                                                {btn.key} · {btn.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Bottom Stats Bar ── */}
            {!loading && !isDone && (
                <div className="border-t border-slate-100 bg-white px-8 py-3">
                    <div className="max-w-2xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Clock size={13} className="text-slate-400" />
                                <span>Thời gian: <strong className="text-slate-700">{formatTime(elapsed)}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Target size={13} className="text-emerald-500" />
                                <span>Độ chính xác: <strong className="text-emerald-600">{accuracy}%</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Zap size={13} className="text-indigo-500" />
                                <span>Số thẻ còn lại hôm nay: <strong className="text-slate-700">{Math.max(0, cards.length - index)}</strong></span>
                            </div>
                        </div>
                        <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                            <Star size={12} className="fill-indigo-600" />
                            +{sessionXP} XP phiên này
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}