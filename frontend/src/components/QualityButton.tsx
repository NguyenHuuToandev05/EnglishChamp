interface QualityButtonsProps {
    onSelect: (quality: number) => void;
}

const options = [
    { label: "Quên", quality: 1, keyHint: "1", classes: "bg-danger/15 text-danger hover:bg-danger/25" },
    { label: "Khó", quality: 3, keyHint: "2", classes: "bg-gold/15 text-gold hover:bg-gold/25" },
    { label: "Nhớ", quality: 4, keyHint: "3", classes: "bg-primary/15 text-primary-light hover:bg-primary/25" },
    { label: "Dễ", quality: 5, keyHint: "4", classes: "bg-success/15 text-success hover:bg-success/25" },
];

export default function QualityButtons({ onSelect }: QualityButtonsProps) {
    return (
        <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
            {options.map((opt) => (
                <button
                    key={opt.quality}
                    onClick={() => onSelect(opt.quality)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl font-semibold transition-colors ${opt.classes}`}
                >
                    <span>{opt.label}</span>
                    <span className="text-xs opacity-70 font-mono">{opt.keyHint}</span>
                </button>
            ))}
        </div>
    );
}