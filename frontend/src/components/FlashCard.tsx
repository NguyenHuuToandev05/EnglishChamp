import { Volume2, RotateCw } from "lucide-react";
import type { Flashcard } from "../types/flashcard";

interface FlashCardProps {
    card: Flashcard;
    flipped: boolean;
    onFlip: () => void;
}

export default function FlashCard({ card, flipped, onFlip }: FlashCardProps) {
    return (
        <div className="[perspective:1200px] w-full max-w-2xl">
            <div
                onClick={onFlip}
                className={`relative w-full h-80 cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
            >
                {/* Mặt trước: từ vựng */}
                <div className="absolute inset-0 [backface-visibility:hidden] bg-surface border border-border rounded-2xl flex flex-col items-center justify-center gap-4 px-8">
                    {card.partOfSpeech && (
                        <span className="text-xs font-bold tracking-wide text-primary-light bg-primary/15 px-3 py-1 rounded-full uppercase">
                            {card.partOfSpeech}
                        </span>
                    )}

                    <h2 className="font-display text-5xl font-bold text-center">{card.frontText}</h2>

                    {card.phonetic && (
                        <div className="flex items-center gap-2 text-muted font-mono">
                            <span>{card.phonetic}</span>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary-light hover:bg-primary/25"
                            >
                                <Volume2 size={14} />
                            </button>
                        </div>
                    )}

                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary-light mt-2">
                        <RotateCw size={20} />
                    </div>

                    <p className="text-sm text-muted">Click card or press Space to flip</p>
                </div>

                {/* Mặt sau: nghĩa + ví dụ */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface border border-border rounded-2xl flex flex-col items-center justify-center gap-3 px-10 text-center">
                    <h2 className="font-display text-4xl font-bold text-success">{card.backText}</h2>

                    {card.exampleSentence && (
                        <div className="mt-2 max-w-md">
                            <p className="text-sm italic text-text/90">"{card.exampleSentence}"</p>
                            {card.exampleTranslation && (
                                <p className="text-sm text-muted mt-1">{card.exampleTranslation}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}