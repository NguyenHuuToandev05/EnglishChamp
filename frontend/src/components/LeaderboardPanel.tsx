import { ChevronRight, PlusCircle, Swords, FileInput, Lightbulb } from "lucide-react";

interface LeaderboardEntry {
    rank: number;
    username: string;
    streak?: string;
    xp: number;
    initials: string;
    color: string;
    isYou?: boolean;
}

interface LeaderboardPanelProps {
    entries: LeaderboardEntry[];
    you: LeaderboardEntry;
    onViewAll?: () => void;
}

export default function LeaderboardPanel({ entries, onViewAll }: LeaderboardPanelProps) {
    return (
        <div className="w-[300px] flex flex-col gap-4">
            {/* Leaderboard card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-display font-bold text-sm text-slate-900">Giải đấu Hạng Vàng</h3>
                            <span className="text-xs text-amber-500 font-bold">🛡️</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            Làm mới sau 2 ngày 14 giờ
                        </p>
                    </div>
                    <button
                        onClick={onViewAll}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline shrink-0"
                    >
                        Xem tất cả
                    </button>
                </div>

                {/* Rows */}
                <div className="space-y-1">
                    {entries.map((entry) => (
                        <div
                            key={entry.rank}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                                entry.isYou
                                    ? "bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold"
                                    : "hover:bg-slate-50 text-slate-700"
                            }`}
                        >
                            <span className={`w-4 text-center font-bold text-[11px] ${
                                entry.rank === 1 ? "text-amber-500" : entry.rank === 2 ? "text-slate-400" : entry.rank === 3 ? "text-amber-700" : "text-slate-400"
                            }`}>
                                #{entry.rank}
                            </span>

                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                style={{ background: entry.color }}
                            >
                                {entry.initials}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate leading-tight">
                                    {entry.username}
                                </p>
                                {entry.streak && (
                                    <p className="text-[10px] text-slate-400 font-medium truncate">
                                        {entry.streak}
                                    </p>
                                )}
                            </div>

                            <span className="font-extrabold shrink-0 text-slate-900">
                                {entry.xp.toLocaleString("vi-VN")} XP
                            </span>
                        </div>
                    ))}
                </div>

                {/* Bottom banner in leaderboard */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                    <p className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 py-2 rounded-xl">
                        Top 10 sẽ thăng hạng lên <strong>Giải Lam Ngọc</strong>
                    </p>
                </div>
            </div>

            {/* Quick Actions card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <h4 className="font-display font-bold text-xs text-slate-900 mb-3 uppercase tracking-wider">
                    Thao tác nhanh
                </h4>
                <div className="space-y-2">
                    <QuickActionBtn icon={<PlusCircle size={16} className="text-indigo-600" />} label="Tạo thẻ mới" />
                    <QuickActionBtn icon={<Swords size={16} className="text-emerald-600" />} label="Tạo trận đấu 1v1" />
                    <QuickActionBtn icon={<FileInput size={16} className="text-amber-600" />} label="Nhập bộ thẻ Anki/Excel" />
                </div>
            </div>

            {/* Tip box */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb size={16} />
                </div>
                <div>
                    <h5 className="font-bold text-xs text-indigo-950 mb-1">Mẹo ghi nhớ</h5>
                    <p className="text-[11px] text-indigo-900/80 leading-relaxed font-medium">
                        Học 15 phút trước khi đi ngủ giúp tăng cường củng cố liên kết thần kinh và nâng cao khả năng ghi nhớ ngày hôm sau lên 23%.
                    </p>
                </div>
            </div>
        </div>
    );
}

function QuickActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
        </button>
    );
}