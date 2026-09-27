import { GraduationCap, Briefcase, BookOpen } from "lucide-react";

interface DeckProgressCardProps {
    id: string;
    tag: string;
    levelTag: string;
    title: string;
    subtitle: string;
    percent: number;
    dueCards: number;
    colorScheme: "purple" | "green" | "orange";
    onResume: () => void;
}

const colorMap = {
    purple: {
        iconBg: "#eef2ff",
        iconColor: "#5b4ef5",
        barBg: "#5b4ef5",
        btnBg: "#eef2ff",
        btnText: "#5b4ef5",
        btnHover: "#e0e7ff",
    },
    green: {
        iconBg: "#ecfdf5",
        iconColor: "#10b981",
        barBg: "#10b981",
        btnBg: "#ecfdf5",
        btnText: "#10b981",
        btnHover: "#d1fae5",
    },
    orange: {
        iconBg: "#fffbeb",
        iconColor: "#f59e0b",
        barBg: "#f59e0b",
        btnBg: "#fffbeb",
        btnText: "#f59e0b",
        btnHover: "#fef3c7",
    },
};

export default function DeckProgressCard({
    levelTag,
    title,
    subtitle,
    percent,
    dueCards,
    colorScheme,
    onResume,
}: DeckProgressCardProps) {
    const c = colorMap[colorScheme];

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: c.iconBg, color: c.iconColor }}
                >
                    {colorScheme === "purple" ? (
                        <GraduationCap size={20} />
                    ) : colorScheme === "green" ? (
                        <Briefcase size={20} />
                    ) : (
                        <BookOpen size={20} />
                    )}
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    {levelTag}
                </span>
            </div>

            {/* Title & subtitle */}
            <div className="mb-4">
                <h3 className="font-display font-extrabold text-base text-slate-900 leading-snug mb-1">
                    {title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
            </div>

            {/* Progress */}
            <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-500">Độ thành thạo</span>
                    <span className="text-slate-900 font-bold">{percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, background: c.barBg }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <span className="text-xs font-semibold text-rose-500">
                    {dueCards} thẻ đến hạn
                </span>
                <button
                    onClick={onResume}
                    className="text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
                    style={{ background: c.btnBg, color: c.btnText }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = c.btnHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = c.btnBg)}
                >
                    Học ngay
                </button>
            </div>
        </div>
    );
}