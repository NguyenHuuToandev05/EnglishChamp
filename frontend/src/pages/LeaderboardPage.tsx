import { useState } from "react";
import {
    Trophy,
    Medal,
    Crown,
    Flame,
    Zap,
    TrendingUp,
    ChevronUp,
    ChevronDown,
    Minus,
    Search,
    Star,
    Shield,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const mockUser = { username: "Alex", level: 18, xp: 12450, isPro: false };

const SEASONS = ["Tuần này", "Tháng này", "Mọi thời đại"];
const TABS = ["Toàn cầu", "Bạn bè", "Khu vực"];

const mockEntries = [
    { rank: 1, username: "Sofia H.", streak: 14, xp: 3420, initials: "SH", color: "#f59e0b", level: "Kim Cương I", change: 0, wins: 42, accuracy: 97 },
    { rank: 2, username: "Kenji S.", streak: 9, xp: 3110, initials: "KS", color: "#6366f1", level: "Kim Cương II", change: 1, wins: 38, accuracy: 95 },
    { rank: 3, username: "Liam O.", streak: 8, xp: 2890, initials: "LO", color: "#ef4444", level: "Bạch Kim I", change: -1, wins: 31, accuracy: 93 },
    { rank: 4, username: "David W.", streak: 4, xp: 2640, initials: "DW", color: "#64748b", level: "Bạch Kim II", change: 2, wins: 27, accuracy: 90 },
    { rank: 5, username: "Elena K.", streak: 6, xp: 2565, initials: "EK", color: "#0284c7", level: "Bạch Kim III", change: 0, wins: 24, accuracy: 89 },
    { rank: 6, username: "Alex (Bạn)", streak: 7, xp: 2450, initials: "AN", color: "#5b4ef5", level: "Hạng Vàng III", change: 1, wins: 21, accuracy: 88, isYou: true },
    { rank: 7, username: "Minh Q.", streak: 3, xp: 2155, initials: "MQ", color: "#38bdf8", level: "Hạng Vàng III", change: -2, wins: 18, accuracy: 86 },
    { rank: 8, username: "Thu Lan", streak: 2, xp: 1998, initials: "TL", color: "#c084fc", level: "Hạng Vàng IV", change: 0, wins: 15, accuracy: 84 },
    { rank: 9, username: "Park J.", streak: 0, xp: 1720, initials: "PJ", color: "#22d3ee", level: "Hạng Bạc I", change: 3, wins: 12, accuracy: 82 },
    { rank: 10, username: "Aisha M.", streak: 5, xp: 1540, initials: "AM", color: "#f43f5e", level: "Hạng Bạc II", change: -1, wins: 10, accuracy: 81 },
];

const TOP3_CONFIG = [
    { bgGradient: "linear-gradient(135deg, #fbbf24, #f59e0b)", trophy: "🥇", size: "large", order: 0 },
    { bgGradient: "linear-gradient(135deg, #94a3b8, #64748b)", trophy: "🥈", size: "medium", order: -1 },
    { bgGradient: "linear-gradient(135deg, #fb923c, #ea580c)", trophy: "🥉", size: "medium", order: 1 },
];

function RankChange({ change }: { change: number }) {
    if (change > 0) return <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600"><ChevronUp size={12} />{change}</span>;
    if (change < 0) return <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-500"><ChevronDown size={12} />{Math.abs(change)}</span>;
    return <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-300"><Minus size={12} /></span>;
}

export default function LeaderboardPage() {
    const [season, setSeason] = useState("Tuần này");
    const [tab, setTab] = useState("Toàn cầu");
    const [search, setSearch] = useState("");

    const you = mockEntries.find((e) => e.isYou)!;
    const top3 = [mockEntries[1], mockEntries[0], mockEntries[2]]; // silver, gold, bronze order

    const filtered = mockEntries.filter((e) =>
        e.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex bg-[#f4f5fb] min-h-screen">
            <Sidebar user={mockUser} />
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar streakDays={7} xp={12450} rankLabel="Hạng Vàng III" username={mockUser.username} />

                <main className="flex-1 px-8 pb-10">
                    {/* Header */}
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                                <Trophy size={22} className="text-amber-500" />
                            </div>
                            <div>
                                <h1 className="font-display text-2xl font-black text-slate-900">Bảng xếp hạng</h1>
                                <p className="text-xs text-slate-400 font-medium">Cạnh tranh với người học khắp nơi</p>
                            </div>
                        </div>

                        {/* Season selector */}
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                            {SEASONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSeason(s)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        season === s
                                            ? "bg-amber-500 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-6">
                        {/* Left: Main Leaderboard */}
                        <div className="flex-1 min-w-0">
                            {/* Podium */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 mb-6 overflow-hidden relative">
                                <div className="absolute inset-0 opacity-10">
                                    {[...Array(6)].map((_, i) => (
                                        <Star key={i} size={40} className="absolute text-white fill-white"
                                            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: 0.3 }} />
                                    ))}
                                </div>
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-6 text-center">
                                    🏆 Top 3 tuần này
                                </p>
                                <div className="flex items-end justify-center gap-4">
                                    {top3.map((entry, idx) => {
                                        const cfg = TOP3_CONFIG[idx];
                                        const isGold = idx === 1;
                                        return (
                                            <div
                                                key={entry.rank}
                                                className="flex flex-col items-center gap-2"
                                                style={{ order: cfg.order }}
                                            >
                                                <div className="text-lg">{cfg.trophy}</div>
                                                <div
                                                    className={`${isGold ? "w-16 h-16" : "w-13 h-13"} rounded-2xl flex items-center justify-center text-white font-black shadow-xl ring-4 ring-white/20`}
                                                    style={{ background: cfg.bgGradient, width: isGold ? 64 : 52, height: isGold ? 64 : 52 }}
                                                >
                                                    <span className={isGold ? "text-xl" : "text-base"}>{entry.initials}</span>
                                                </div>
                                                <div className="text-center">
                                                    <p className={`font-bold text-white ${isGold ? "text-sm" : "text-xs"}`}>{entry.username}</p>
                                                    <p className="text-indigo-200 text-[10px] font-semibold flex items-center justify-center gap-0.5 mt-0.5">
                                                        <Zap size={9} className="fill-indigo-200" />
                                                        {entry.xp.toLocaleString("vi-VN")} XP
                                                    </p>
                                                </div>
                                                <div
                                                    className="w-20 rounded-t-xl flex items-center justify-center"
                                                    style={{ height: isGold ? 56 : 36, background: "rgba(255,255,255,0.15)" }}
                                                >
                                                    <span className="text-white/60 text-xs font-bold">#{entry.rank}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tabs + Search */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                                    {TABS.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTab(t)}
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                tab === t
                                                    ? "bg-indigo-600 text-white shadow-sm"
                                                    : "text-slate-500 hover:text-slate-700"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Tìm người chơi..."
                                        className="text-xs pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-medium w-44 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                {/* Table header */}
                                <div className="grid px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/70"
                                    style={{ gridTemplateColumns: "50px 1fr 90px 90px 80px 80px" }}>
                                    <span>Hạng</span>
                                    <span>Người dùng</span>
                                    <span className="text-center">Chuỗi</span>
                                    <span className="text-center">Chiến thắng</span>
                                    <span className="text-center">Chính xác</span>
                                    <span className="text-right">Điểm XP</span>
                                </div>

                                {filtered.map((entry, idx) => {
                                    const rankEmoji = entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : null;
                                    return (
                                        <div
                                            key={entry.rank}
                                            className="grid items-center px-5 py-3.5 transition-colors cursor-pointer"
                                            style={{
                                                gridTemplateColumns: "50px 1fr 90px 90px 80px 80px",
                                                borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                                                background: entry.isYou
                                                    ? "linear-gradient(90deg, #eef2ff, #f5f3ff)"
                                                    : "transparent",
                                            }}
                                            onMouseEnter={(e) => { if (!entry.isYou) e.currentTarget.style.background = "#f8fafc"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = entry.isYou ? "linear-gradient(90deg, #eef2ff, #f5f3ff)" : "transparent"; }}
                                        >
                                            {/* Rank */}
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-black text-slate-600">
                                                    {rankEmoji ?? `#${entry.rank}`}
                                                </span>
                                                <RankChange change={entry.change} />
                                            </div>

                                            {/* User */}
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                                                    style={{ background: entry.color }}
                                                >
                                                    {entry.initials}
                                                </div>
                                                <div>
                                                    <p
                                                        className="text-sm font-bold leading-tight"
                                                        style={{ color: entry.isYou ? "#5b4ef5" : "#0f172a" }}
                                                    >
                                                        {entry.username}
                                                        {entry.isYou && (
                                                            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600">BẠN</span>
                                                        )}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-slate-400">{entry.level}</p>
                                                </div>
                                            </div>

                                            {/* Streak */}
                                            <div className="text-center">
                                                {entry.streak > 0 ? (
                                                    <span className="text-xs font-bold text-amber-600 flex items-center justify-center gap-0.5">
                                                        🔥 {entry.streak}d
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-300 font-medium">—</span>
                                                )}
                                            </div>

                                            {/* Wins */}
                                            <div className="text-center text-xs font-bold text-slate-700">{entry.wins}</div>

                                            {/* Accuracy */}
                                            <div className="text-center">
                                                <span className="text-xs font-bold text-emerald-600">{entry.accuracy}%</span>
                                            </div>

                                            {/* XP */}
                                            <div className="text-right text-sm font-black text-slate-800">
                                                {entry.xp.toLocaleString("vi-VN")}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right side panel */}
                        <div className="w-72 shrink-0 flex flex-col gap-4">
                            {/* Your rank card */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Hạng của bạn</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-md"
                                        style={{ background: you.color }}
                                    >
                                        {you.initials}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{you.username}</p>
                                        <p className="text-xs text-slate-400 font-medium">{you.level}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {[
                                        { label: "Vị trí", value: `#${you.rank}`, color: "#5b4ef5" },
                                        { label: "Tổng XP", value: you.xp.toLocaleString("vi-VN"), color: "#f59e0b" },
                                        { label: "Chuỗi ngày", value: `🔥 ${you.streak}`, color: "#ef4444" },
                                        { label: "Chính xác", value: `${you.accuracy}%`, color: "#10b981" },
                                    ].map((s) => (
                                        <div key={s.label} className="bg-slate-50 rounded-xl p-2.5">
                                            <p className="text-xs font-bold" style={{ color: s.color }}>{s.value}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                                        <span>Lên hạng #5</span>
                                        <span className="text-indigo-600 font-bold">115 XP nữa</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{ width: "68%", background: "linear-gradient(90deg, #5b4ef5, #818cf8)" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Rank info */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Crown size={18} className="text-amber-600" />
                                    <p className="text-sm font-extrabold text-amber-900">Hạng Vàng III</p>
                                </div>
                                <p className="text-xs text-amber-700 font-medium leading-relaxed mb-3">
                                    Bạn đang ở Top 8% khu vực. Cố gắng thêm một chút để đạt Bạch Kim!
                                </p>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                                    <TrendingUp size={13} />
                                    <span>+1 hạng so với tuần trước</span>
                                </div>
                            </div>

                            {/* Milestones */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Cột mốc sắp tới</p>
                                <div className="space-y-2.5">
                                    {[
                                        { icon: <Medal size={14} />, label: "Đạt hạng Bạch Kim", progress: 68, color: "#0284c7" },
                                        { icon: <Flame size={14} />, label: "Chuỗi 14 ngày", progress: 50, color: "#f59e0b" },
                                        { icon: <Shield size={14} />, label: "30 trận thắng", progress: 70, color: "#10b981" },
                                    ].map((m) => (
                                        <div key={m.label}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600" style={{ color: m.color }}>
                                                    {m.icon} {m.label}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400">{m.progress}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: `${m.progress}%`, background: m.color }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
