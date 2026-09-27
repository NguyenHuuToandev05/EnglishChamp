import { Search, Flame, Zap, Bell, Trophy } from "lucide-react";

interface TopBarProps {
    streakDays: number;
    xp: number;
    rankLabel: string;
    username: string;
}

export default function TopBar({ streakDays, xp, rankLabel, username }: TopBarProps) {
    const initials = username.slice(0, 2).toUpperCase();

    return (
        <div className="flex items-center gap-3 px-8 py-5 sticky top-0 z-10 bg-[#f4f5fb]/95 backdrop-blur-md">
            {/* Search */}
            <div className="flex-1 relative max-w-sm">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    id="topbar-search"
                    type="text"
                    placeholder="Tìm thẻ, bộ từ vựng hoặc đối thủ..."
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all font-medium"
                />
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
                {/* Streak */}
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-sm text-xs font-semibold text-slate-700">
                    <Flame size={14} className="text-amber-500 fill-amber-500" />
                    <span>{streakDays} ngày liên tục</span>
                </div>

                {/* XP */}
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-sm text-xs font-semibold text-slate-700">
                    <Zap size={14} className="text-indigo-600 fill-indigo-600" />
                    <span>{xp.toLocaleString("vi-VN")} XP</span>
                </div>

                {/* Rank */}
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-sm text-xs font-semibold text-slate-700">
                    <Trophy size={14} className="text-emerald-600" />
                    <span>{rankLabel}</span>
                </div>

                {/* Bell */}
                <button
                    id="topbar-notifications"
                    className="relative w-9 h-9 rounded-full bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <Bell size={16} />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                </button>

                {/* Avatar */}
                <div
                    className="w-9 h-9 rounded-full bg-[#5b4ef5] flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-indigo-100 cursor-pointer"
                    title={username}
                >
                    {initials}
                </div>
            </div>
        </div>
    );
}