import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getDueCards, submitReview } from "../api/review.api";
import type { Flashcard } from "../types/flashcard";
import FlashCard from "../components/FlashCard";
import QualityButtons from "../components/QualityButton";

export default function StudyPage() {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();

    const [cards, setCards] = useState<Flashcard[]>([]);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!deckId) return;
        getDueCards(deckId)
            .then(setCards)
            .finally(() => setLoading(false));
    }, [deckId]);

    const currentCard = cards[index];
    const isDone = !loading && cards.length > 0 && index >= cards.length;
    const progressPercent = cards.length > 0 ? Math.round((index / cards.length) * 100) : 0;

    async function handleGrade(quality: number) {
        if (!currentCard || submitting) return;
        setSubmitting(true);
        try {
            await submitReview(currentCard.id, quality);
            setFlipped(false);
            setIndex((i) => i + 1);
        } finally {
            setSubmitting(false);
        }
    }

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!currentCard) return;
            if (e.code === "Space") {
                e.preventDefault();
                setFlipped((f) => !f);
            }
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
        <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
            {/* Top bar */}
            <div
                className="flex items-center gap-6 px-8 py-4 sticky top-0 z-10"
                style={{
                    background: "rgba(12,15,29,0.85)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <button
                    id="study-back"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{ color: "var(--color-muted)" }}
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </button>

                <div>
                    <p className="font-display font-bold text-sm text-text">Đang học</p>
                    <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                        {Math.min(index, cards.length)}/{cards.length} thẻ
                    </p>
                </div>

                {/* Progress bar */}
                <div className="flex-1 h-2 rounded-full" style={{ background: "var(--color-surface-2)" }}>
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progressPercent}%`,
                            background: "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))",
                        }}
                    />
                </div>

                <span className="text-sm font-bold" style={{ color: "var(--color-primary-light)" }}>
                    {progressPercent}%
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-10">
                {loading && (
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-2xl animate-pulse mx-auto mb-4" style={{ background: "var(--color-surface)" }} />
                        <p style={{ color: "var(--color-muted)" }}>Đang tải thẻ...</p>
                    </div>
                )}

                {!loading && cards.length === 0 && (
                    <div className="text-center">
                        <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "var(--color-success)" }} />
                        <h2 className="font-display text-2xl font-bold text-text mb-2">Tuyệt vời! 🎉</h2>
                        <p className="mb-6" style={{ color: "var(--color-muted)" }}>Deck này chưa có thẻ nào cần ôn hôm nay.</p>
                        <button
                            onClick={() => navigate("/")}
                            className="text-sm font-bold px-6 py-3 rounded-xl gradient-primary text-white"
                        >
                            Về Dashboard
                        </button>
                    </div>
                )}

                {!loading && isDone && (
                    <div className="text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="font-display text-3xl font-bold text-text mb-2">Xong hết rồi!</h2>
                        <p className="mb-2" style={{ color: "var(--color-muted)" }}>
                            Bạn đã ôn hết <strong>{cards.length}</strong> thẻ trong phiên này.
                        </p>
                        <p className="text-sm font-semibold mb-6" style={{ color: "var(--color-success)" }}>
                            +{cards.length * 3} XP kiếm được!
                        </p>
                        <button
                            id="study-done-back"
                            onClick={() => navigate("/")}
                            className="text-sm font-bold px-6 py-3 rounded-xl gradient-primary text-white glow-primary"
                        >
                            Về Dashboard →
                        </button>
                    </div>
                )}

                {!loading && currentCard && !isDone && (
                    <>
                        <FlashCard card={currentCard} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />

                        {flipped ? (
                            <QualityButtons onSelect={handleGrade} />
                        ) : (
                            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-muted)" }}>
                                <kbd
                                    className="px-2.5 py-1 rounded-lg text-xs font-mono"
                                    style={{
                                        background: "var(--color-surface-2)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-secondary)",
                                    }}
                                >
                                    Space
                                </kbd>
                                <span>để lật thẻ</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}