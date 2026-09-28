import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    BookOpen,
    Play,
    MoreHorizontal,
    Filter,
    Clock,
    ChevronRight,
    Zap,
    TrendingUp,
    Layers,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const mockUser = { username: "Alex", level: 18, xp: 12450, isPro: false };

const mockDecks = [
    {
        id: "1",
        tag: "IELTS",
        level: "C1",
        title: "IELTS Academic 3000",
        subtitle: "Từ vựng học thuật cốt lõi cho kỳ thi IELTS",
        total: 3000,
        learned: 1920,
        due: 18,
        streak: 7,
        color: "#5b4ef5",
        colorDim: "#eef2ff",
        colorBorder: "#c7d2fe",
        lastStudied: "24 phút trước",
    },
    {
        id: "2",
        tag: "TOEIC",
        level: "B2",
        title: "TOEIC Mastery",
        subtitle: "Giao tiếp doanh nghiệp & văn phòng",
        total: 2000,
        learned: 1640,
        due: 12,
        streak: 5,
        color: "#10b981",
        colorDim: "#ecfdf5",
        colorBorder: "#a7f3d0",
        lastStudied: "2 giờ trước",
    },
    {
        id: "3",
        tag: "OXFORD",
        level: "C2",
        title: "Oxford 5000",
        subtitle: "Cụm từ ngữ nâng cao chuẩn Oxford",
        total: 5000,
        learned: 2050,
        due: 14,
        streak: 3,
        color: "#f59e0b",
        colorDim: "#fffbeb",
        colorBorder: "#fde68a",
        lastStudied: "Hôm qua",
    },
    {
        id: "4",
        tag: "SAT",
        level: "C2",
        title: "SAT Vocabulary",
        subtitle: "Từ vựng nâng cao dành cho kỳ thi SAT",
        total: 1500,
        learned: 320,
        due: 45,
        streak: 0,
        color: "#ef4444",
        colorDim: "#fef2f2",
        colorBorder: "#fecaca",
        lastStudied: "3 ngày trước",
    },
    {
        id: "5",
        tag: "DAILY",
        level: "A2",
        title: "Daily Conversations",
        subtitle: "Hội thoại hàng ngày cho người mới bắt đầu",
        total: 800,
        learned: 680,
        due: 5,
        streak: 12,
        color: "#0ea5e9",
        colorDim: "#f0f9ff",
        colorBorder: "#bae6fd",
        lastStudied: "1 giờ trước",
    },
    {
        id: "6",
        tag: "IDIOMS",
        level: "B2",
        title: "English Idioms & Phrases",
        subtitle: "Thành ngữ và cụm động từ thông dụng",
        total: 600,
        learned: 140,
        due: 0,
        streak: 0,
        color: "#8b5cf6",
        colorDim: "#f5f3ff",
        colorBorder: "#ddd6fe",
        lastStudied: "Tuần trước",
    },
];

const FILTERS = ["Tất cả", "Đang học", "Hoàn thành", "Sắp đến hạn"];

export default function DecksPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("Tất cả");
    const [view, setView] = useState<"grid" | "list">("grid");

    const filtered = mockDecks.filter((d) => {
        const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
            d.tag.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            activeFilter === "Tất cả" ||
            (activeFilter === "Đang học" && d.learned < d.total && d.streak > 0) ||
            (activeFilter === "Hoàn thành" && d.learned >= d.total * 0.9) ||
            (activeFilter === "Sắp đến hạn" && d.due > 0);
        return matchSearch && matchFilter;
    });

    return (
        <div className="flex bg-[#f4f5fb] min-h-screen">
            <Sidebar user={mockUser} />
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar streakDays={7} xp={12450} rankLabel="Hạng Vàng III" username={mockUser.username} />

                <main className="flex-1 px-8 pb-10">
                    {/* Header */}
                    <div className="flex items-center justify-between py-6">
                        <div>
                            <h1 className="font-display text-2xl font-black text-slate-900">Kho bộ thẻ của tôi</h1>
                            <p className="text-sm text-slate-400 font-medium mt-0.5">
                                {mockDecks.length} bộ thẻ · {mockDecks.reduce((a, d) => a + d.due, 0)} thẻ cần ôn hôm nay
                            </p>
                        </div>
                        <button
                            id="btn-create-deck"
                            className="flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-2xl bg-[#5b4ef5] text-white shadow-md shadow-indigo-200 hover:bg-indigo-600 transition-all hover:scale-105"
                        >
                            <Plus size={16} />
                            Tạo bộ thẻ mới
                        </button>
                    </div>

                    {/* Stats summary row */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { label: "Tổng từ đã học", value: mockDecks.reduce((a, d) => a + d.learned, 0).toLocaleString("vi-VN"), icon: <BookOpen size={16} />, color: "#5b4ef5", bg: "#eef2ff" },
                            { label: "Thẻ cần ôn hôm nay", value: mockDecks.reduce((a, d) => a + d.due, 0), icon: <Clock size={16} />, color: "#f59e0b", bg: "#fffbeb" },
                            { label: "Tổng tiến độ", value: `${Math.round(mockDecks.reduce((a, d) => a + d.learned / d.total, 0) / mockDecks.length * 100)}%`, icon: <TrendingUp size={16} />, color: "#10b981", bg: "#ecfdf5" },
                        ].map((s) => (
                            <div key={s.label} className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg, color: s.color }}>
                                    {s.icon}
                                </div>
                                <div>
                                    <p className="font-black text-xl text-slate-900">{s.value}</p>
                                    <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search + Filter row */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative flex-1 max-w-xs">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="decks-search"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tìm bộ thẻ..."
                                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                            {FILTERS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        activeFilter === f
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <button
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Filter size={13} />
                            Lọc thêm
                        </button>

                        {/* View toggle */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 ml-auto">
                            <button
                                onClick={() => setView("grid")}
                                className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                <Layers size={14} />
                            </button>
                            <button
                                onClick={() => setView("list")}
                                className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                <MoreHorizontal size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Deck Grid */}
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 rounded-3xl bg-white border border-slate-100 shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                                <BookOpen size={28} className="text-indigo-400" />
                            </div>
                            <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Không tìm thấy</h3>
                            <p className="text-sm text-slate-400">Thử tìm kiếm với từ khóa khác</p>
                        </div>
                    ) : (
                        <div className={`${view === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col gap-3"}`}>
                            {filtered.map((deck) => {
                                const pct = Math.round((deck.learned / deck.total) * 100);
                                return (
                                    <div
                                        key={deck.id}
                                        className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
                                        style={{ borderTop: `3px solid ${deck.color}` }}
                                        onClick={() => navigate(`/study/${deck.id}`)}
                                    >
                                        {/* Top row */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                                    style={{ background: deck.colorDim, color: deck.color }}
                                                >
                                                    {deck.tag}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
                                                    {deck.level}
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-7 h-7 rounded-lg text-slate-300 hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center transition-colors"
                                            >
                                                <MoreHorizontal size={15} />
                                            </button>
                                        </div>

                                        <h3 className="font-display font-extrabold text-sm text-slate-900 mb-0.5 leading-tight">
                                            {deck.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-medium mb-4 leading-relaxed">{deck.subtitle}</p>

                                        {/* Progress bar */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-semibold text-slate-500">
                                                    {deck.learned.toLocaleString("vi-VN")} / {deck.total.toLocaleString("vi-VN")} từ
                                                </span>
                                                <span className="text-xs font-bold" style={{ color: deck.color }}>{pct}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${pct}%`, background: deck.color }}
                                                />
                                            </div>
                                        </div>

                                        {/* Bottom row */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {deck.due > 0 ? (
                                                    <span
                                                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                        style={{ background: deck.colorDim, color: deck.color }}
                                                    >
                                                        {deck.due} thẻ cần ôn
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-400">
                                                        Đã ôn xong hôm nay
                                                    </span>
                                                )}
                                                {deck.streak > 0 && (
                                                    <span className="text-xs font-semibold text-amber-600 flex items-center gap-0.5">
                                                        🔥 {deck.streak}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/study/${deck.id}`); }}
                                                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl text-white shadow-sm transition-all hover:scale-105 group-hover:opacity-100"
                                                style={{ background: deck.color }}
                                            >
                                                <Play size={11} fill="white" />
                                                Học
                                            </button>
                                        </div>

                                        <p className="text-[10px] text-slate-300 font-medium mt-2.5 text-right">
                                            {deck.lastStudied}
                                        </p>
                                    </div>
                                );
                            })}

                            {/* Add new card */}
                            <button
                                onClick={() => {}}
                                className="border-2 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group min-h-[200px]"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                    <Plus size={22} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">Tạo bộ thẻ mới</p>
                                    <p className="text-xs text-slate-300 mt-0.5">Thêm từ vựng của riêng bạn</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Recommended decks */}
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="font-display font-extrabold text-base text-slate-900">Gợi ý cho bạn</h2>
                                <p className="text-xs text-slate-400 font-medium">Dựa trên cấp độ và mục tiêu của bạn</p>
                            </div>
                            <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-0.5">
                                Khám phá thư viện <ChevronRight size={13} />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { emoji: "🎯", title: "Cambridge C1 Advanced", tag: "C1", users: "12.4k người học", xp: "+180 XP hoàn thành" },
                                { emoji: "🌐", title: "Business English Pro", tag: "B2", users: "8.2k người học", xp: "+120 XP hoàn thành" },
                                { emoji: "📰", title: "Academic Writing", tag: "C1", users: "5.8k người học", xp: "+95 XP hoàn thành" },
                            ].map((rec) => (
                                <div key={rec.title} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                                    <span className="text-2xl shrink-0">{rec.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-900 truncate">{rec.title}</p>
                                        <p className="text-xs text-slate-400 font-medium">{rec.users}</p>
                                        <p className="text-[10px] font-bold text-indigo-500 mt-0.5 flex items-center gap-0.5">
                                            <Zap size={10} className="fill-indigo-500" /> {rec.xp}
                                        </p>
                                    </div>
                                    <button className="shrink-0 w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors">
                                        <Plus size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
