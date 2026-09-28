import { useState } from "react";
import {
    Swords,
    Trophy,
    Zap,
    Users,
    Clock,
    Target,
    Crown,
    Shield,
    Flame,
    Star,
    Play,
    TrendingUp,
    BookOpen,
    ChevronRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const mockUser = { username: "Alex", level: 18, xp: 12450, isPro: false };

const MODES = [
    {
        id: "quick",
        title: "Đấu nhanh",
        subtitle: "Ghép cặp ngẫu nhiên với đối thủ cùng trình",
        icon: <Zap size={22} />,
        color: "#5b4ef5",
        colorDim: "#eef2ff",
        badge: "Phổ biến",
        avgTime: "3-5 phút",
        players: "1.2k đang chơi",
    },
    {
        id: "ranked",
        title: "Xếp hạng",
        subtitle: "Thi đấu để leo hạng và nhận phần thưởng mùa",
        icon: <Trophy size={22} />,
        color: "#f59e0b",
        colorDim: "#fffbeb",
        badge: "Xếp hạng",
        avgTime: "5-8 phút",
        players: "840 đang chơi",
    },
    {
        id: "practice",
        title: "Tập luyện",
        subtitle: "Đấu với bot để luyện kỹ năng không lo mất điểm",
        icon: <Shield size={22} />,
        color: "#10b981",
        colorDim: "#ecfdf5",
        badge: "Không xếp hạng",
        avgTime: "2-4 phút",
        players: "Luôn sẵn sàng",
    },
];

const mockRecentMatches = [
    { id: "m1", opponent: "Diana K.", result: "win", xp: 45, accuracy: 94, deck: "IELTS Academic", time: "24 phút trước", initials: "DK", color: "#f59e0b" },
    { id: "m2", opponent: "Marcus L.", result: "win", xp: 60, accuracy: 100, deck: "TOEIC Mastery", time: "5 giờ trước", initials: "ML", color: "#6366f1" },
    { id: "m3", opponent: "Yuki T.", result: "loss", xp: 12, accuracy: 71, deck: "Oxford 5000", time: "Hôm qua", initials: "YT", color: "#ef4444" },
    { id: "m4", opponent: "Chris B.", result: "win", xp: 38, accuracy: 88, deck: "IELTS Academic", time: "2 ngày trước", initials: "CB", color: "#0ea5e9" },
];

const mockTopArena = [
    { rank: 1, username: "Sofia H.", wins: 42, winRate: 87, initials: "SH", color: "#f59e0b" },
    { rank: 2, username: "Kenji S.", wins: 38, winRate: 84, initials: "KS", color: "#6366f1" },
    { rank: 3, username: "Liam O.", wins: 31, winRate: 81, initials: "LO", color: "#ef4444" },
    { rank: 4, username: "Alex (Bạn)", wins: 21, winRate: 75, initials: "AN", color: "#5b4ef5", isYou: true },
];

export default function ArenaPage() {
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const [matchmaking, setMatchmaking] = useState(false);
    const [countdown, setCountdown] = useState(0);

    function handleFindMatch(modeId: string) {
        setSelectedMode(modeId);
        setMatchmaking(true);
        let c = 3;
        setCountdown(c);
        const iv = setInterval(() => {
            c--;
            setCountdown(c);
            if (c <= 0) {
                clearInterval(iv);
                setMatchmaking(false);
                setSelectedMode(null);
            }
        }, 1000);
    }

    return (
        <div className="flex bg-[#f4f5fb] min-h-screen">
            <Sidebar user={mockUser} />
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar streakDays={7} xp={12450} rankLabel="Hạng Vàng III" username={mockUser.username} />

                <main className="flex-1 px-8 pb-10">
                    {/* Header */}
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                                <Swords size={22} className="text-red-500" />
                            </div>
                            <div>
                                <h1 className="font-display text-2xl font-black text-slate-900">Đấu trường 1v1</h1>
                                <p className="text-xs text-slate-400 font-medium">Thách đấu người chơi trong thời gian thực</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            2,040 người đang online
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {[
                            { label: "Tổng trận", value: "28", icon: <Swords size={16} />, color: "#5b4ef5", bg: "#eef2ff" },
                            { label: "Tỷ lệ thắng", value: "75%", icon: <Target size={16} />, color: "#10b981", bg: "#ecfdf5" },
                            { label: "Chuỗi thắng", value: "3", icon: <Flame size={16} />, color: "#f59e0b", bg: "#fffbeb" },
                            { label: "Hạng Arena", value: "#4 / 1.2k", icon: <Crown size={16} />, color: "#f59e0b", bg: "#fffbeb" },
                        ].map((s) => (
                            <div key={s.label} className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg, color: s.color }}>
                                    {s.icon}
                                </div>
                                <div>
                                    <p className="font-black text-xl text-slate-900">{s.value}</p>
                                    <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-6">
                        {/* Left: mode selection + matchmaking */}
                        <div className="flex-1 min-w-0">
                            <h2 className="font-display font-extrabold text-base text-slate-900 mb-4">Chọn chế độ đấu</h2>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {MODES.map((mode) => (
                                    <div
                                        key={mode.id}
                                        className={`bg-white border rounded-3xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                            selectedMode === mode.id ? "ring-2 shadow-md" : "border-slate-100"
                                        }`}
                                        style={{
                                            borderColor: selectedMode === mode.id ? mode.color : undefined,
                                        }}
                                        onClick={() => setSelectedMode(mode.id)}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div
                                                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                                                style={{ background: mode.colorDim, color: mode.color }}
                                            >
                                                {mode.icon}
                                            </div>
                                            <span
                                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                style={{ background: mode.colorDim, color: mode.color }}
                                            >
                                                {mode.badge}
                                            </span>
                                        </div>
                                        <h3 className="font-display font-extrabold text-sm text-slate-900 mb-1">{mode.title}</h3>
                                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-3">{mode.subtitle}</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                                <Clock size={11} /> {mode.avgTime}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                                <Users size={11} /> {mode.players}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Deck selector */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-display font-extrabold text-sm text-slate-900">Chọn bộ thẻ đấu</h3>
                                    <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-0.5">
                                        Xem tất cả <ChevronRight size={12} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2.5">
                                    {[
                                        { id: "1", name: "IELTS Academic 3000", tag: "IELTS", color: "#5b4ef5", bg: "#eef2ff" },
                                        { id: "2", name: "TOEIC Mastery", tag: "TOEIC", color: "#10b981", bg: "#ecfdf5" },
                                        { id: "3", name: "Oxford 5000", tag: "OXFORD", color: "#f59e0b", bg: "#fffbeb" },
                                    ].map((d, i) => (
                                        <button
                                            key={d.id}
                                            className={`flex flex-col gap-1.5 p-3 rounded-2xl border text-left transition-all ${
                                                i === 0 ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-100 hover:border-slate-200"
                                            }`}
                                        >
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md w-fit" style={{ background: d.bg, color: d.color }}>{d.tag}</span>
                                            <p className="text-xs font-bold text-slate-800 leading-tight">{d.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Find match button */}
                            {matchmaking ? (
                                <div className="bg-white border border-indigo-100 rounded-3xl p-6 text-center shadow-sm">
                                    <div className="flex items-center justify-center gap-3 mb-3">
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce"
                                                    style={{ animationDelay: `${i * 0.15}s` }}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm font-bold text-indigo-700">Đang tìm đối thủ...</p>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium mb-4">Demo: kết thúc sau {countdown}s</p>
                                    <button
                                        onClick={() => { setMatchmaking(false); setSelectedMode(null); }}
                                        className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                    >
                                        Hủy tìm kiếm
                                    </button>
                                </div>
                            ) : (
                                <button
                                    id="arena-find-match"
                                    onClick={() => handleFindMatch(selectedMode ?? "quick")}
                                    disabled={!selectedMode}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-extrabold text-white transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
                                    style={{ background: selectedMode ? "linear-gradient(135deg, #5b4ef5, #6366f1)" : "#94a3b8" }}
                                >
                                    <Play size={16} fill="white" />
                                    {selectedMode ? `Tìm trận — ${MODES.find((m) => m.id === selectedMode)?.title}` : "Chọn chế độ để bắt đầu"}
                                </button>
                            )}

                            {/* Recent matches */}
                            <div className="mt-6">
                                <h2 className="font-display font-extrabold text-base text-slate-900 mb-4">Trận đấu gần đây</h2>
                                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                    {mockRecentMatches.map((match, idx) => (
                                        <div
                                            key={match.id}
                                            className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
                                            style={{ borderBottom: idx < mockRecentMatches.length - 1 ? "1px solid #f1f5f9" : "none" }}
                                        >
                                            <div
                                                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                                style={{ background: match.color }}
                                            >
                                                {match.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900">vs {match.opponent}</p>
                                                <p className="text-xs text-slate-400 font-medium">{match.deck} · {match.time}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-emerald-600">{match.accuracy}%</p>
                                                <p className="text-[10px] text-slate-400">chính xác</p>
                                            </div>
                                            <div className="text-center min-w-[70px]">
                                                {match.result === "win" ? (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                                                        Thắng +{match.xp} XP
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-500">
                                                        Thua +{match.xp} XP
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right panel */}
                        <div className="w-64 shrink-0 flex flex-col gap-4">
                            {/* Arena rank */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-5 shadow-md">
                                <div className="flex items-center gap-2 mb-4">
                                    <Crown size={18} className="text-yellow-300" />
                                    <p className="text-sm font-extrabold text-white">Hạng Arena của bạn</p>
                                </div>
                                <div className="text-center mb-4">
                                    <p className="text-4xl font-black text-white">#4</p>
                                    <p className="text-indigo-200 text-xs font-semibold mt-1">trong 1,200 người</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-3 space-y-2">
                                    {[
                                        { label: "Trận thắng", value: "21" },
                                        { label: "Tỷ lệ thắng", value: "75%" },
                                        { label: "XP Arena", value: "1,840" },
                                    ].map((s) => (
                                        <div key={s.label} className="flex items-center justify-between">
                                            <span className="text-indigo-200 text-xs font-semibold">{s.label}</span>
                                            <span className="text-white text-xs font-bold">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Arena */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Top Đấu trường</p>
                                <div className="space-y-3">
                                    {mockTopArena.map((p) => (
                                        <div key={p.rank} className={`flex items-center gap-2.5 p-2 rounded-xl ${p.isYou ? "bg-indigo-50" : ""}`}>
                                            <span className="text-xs font-black text-slate-400 w-5">#{p.rank}</span>
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                                style={{ background: p.color }}
                                            >
                                                {p.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold truncate" style={{ color: p.isYou ? "#5b4ef5" : "#0f172a" }}>
                                                    {p.username}
                                                </p>
                                                <p className="text-[10px] text-slate-400">{p.winRate}% thắng</p>
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{p.wins}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star size={14} className="text-amber-500 fill-amber-500" />
                                    <p className="text-xs font-extrabold text-amber-900">Mẹo thi đấu</p>
                                </div>
                                <div className="space-y-2 text-xs text-amber-800 font-medium">
                                    {[
                                        { icon: <BookOpen size={11} />, tip: "Ôn bộ thẻ trước khi đấu để tăng tỷ lệ thắng" },
                                        { icon: <TrendingUp size={11} />, tip: "Đấu xếp hạng vào buổi tối để tìm đối thủ nhanh hơn" },
                                        { icon: <Zap size={11} />, tip: "Trả lời nhanh giúp tích điểm combo x2 XP" },
                                    ].map((t, i) => (
                                        <div key={i} className="flex items-start gap-2 text-amber-700">
                                            <span className="mt-0.5 shrink-0 text-amber-500">{t.icon}</span>
                                            <span>{t.tip}</span>
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
