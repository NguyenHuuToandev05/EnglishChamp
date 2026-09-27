interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string;
    progress?: { current: number; total: number };
    badge?: { text: string; type: "success" | "warning" | "neutral" };
    iconBg?: string;
    iconColor?: string;
}

export default function StatCard({
    icon,
    label,
    value,
    sub,
    progress,
    badge,
    iconBg = "#eef2ff",
    iconColor = "#4f46e5",
}: StatCardProps) {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{label}</span>
                <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: iconBg, color: iconColor }}
                >
                    {icon}
                </div>
            </div>

            <div>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-display text-2xl font-extrabold text-slate-900 leading-none">
                        {value}
                    </span>
                    {progress && (
                        <span className="text-xs font-semibold text-slate-400">
                            / {progress.total} {sub ?? "mục tiêu"}
                        </span>
                    )}
                    {badge && (
                        <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                badge.type === "success"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : badge.type === "warning"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                        >
                            {badge.text}
                        </span>
                    )}
                </div>

                {progress && (
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden my-2">
                        <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (progress.current / progress.total) * 100)}%` }}
                        />
                    </div>
                )}

                {sub && !progress && (
                    <p className="text-[11px] font-medium text-slate-400 mt-1">{sub}</p>
                )}
            </div>
        </div>
    );
}
