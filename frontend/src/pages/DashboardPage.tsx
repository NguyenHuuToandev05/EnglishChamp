import { useNavigate } from "react-router-dom";
import { Flame, BookOpen, TrendingUp, Award, Play } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import StatCard from "../components/StatCard";
import DeckProgressCard from "../components/DeckProgressCard";
import LeaderboardPanel from "../components/LeaderboardPanel";

/* ── Mock Data matching Screenshot ── */
const mockUser = {
    username: "Alex",
    level: 18,
    xp: 12450,
    isPro: false,
};

const mockDecks = [
    {
        id: "1",
        tag: "IELTS",
        levelTag: "C1",
        title: "IELTS Academic 3...",
        subtitle: "Từ vựng học thuật cốt lõi",
        percent: 64,
        dueCards: 18,
        colorScheme: "purple" as const,
    },
    {
        id: "2",
        tag: "TOEIC",
        levelTag: "B2",
        title: "TOEIC Mastery",
        subtitle: "Giao tiếp doanh nghiệp",
        percent: 82,
        dueCards: 12,
        colorScheme: "green" as const,
    },
    {
        id: "3",
        tag: "OXFORD",
        levelTag: "C2",
        title: "Oxford 5000",
        subtitle: "Cụm từ ngữ nâng cao",
        percent: 41,
        dueCards: 14,
        colorScheme: "orange" as const,
    },
];

const mockRecentActivity = [
    {
        id: "a1",
        mode: "Đấu 1v1",
        sub: "vs Diana • Realtime",
        tag: "IELTS Academic",
        accuracy: 94,
        result: "Chiến thắng",
        xp: "+45 XP",
        time: "24 phút trước",
        isWin: true,
        typeColor: "emerald",
    },
    {
        id: "a2",
        mode: "Ôn lặp ngắt quãng",
        sub: "20 Flashcard",
        tag: "Oxford 5000",
        accuracy: 88,
        result: "+33 XP",
        xp: "+33 XP",
        time: "2 giờ trước",
        isWin: false,
        typeColor: "indigo",
    },
    {
        id: "a3",
        mode: "Đấu 1v1",
        sub: "vs Marcus • Realtime",
        tag: "TOEIC Mastery",
        accuracy: 100,
        result: "Chiến thắng",
        xp: "+60 XP",
        time: "5 giờ trước",
        isWin: true,
        typeColor: "emerald",
    },
    {
        id: "a4",
        mode: "Luyện phản xạ nhanh",
        sub: "Nâng cao phản xạ",
        tag: "IELTS Academic",
        accuracy: 75,
        result: "+16 XP",
        xp: "+16 XP",
        time: "Hôm qua",
        isWin: false,
        typeColor: "indigo",
    },
];

const mockLeaderboard = [
    { rank: 1, username: "Sofia H.", streak: "Chuỗi 14 ngày", xp: 3420, initials: "SH", color: "#f59e0b" },
    { rank: 2, username: "Kenji S.", streak: "Chuỗi 9 ngày", xp: 3110, initials: "KS", color: "#6366f1" },
    { rank: 3, username: "Liam O.", streak: "Chuỗi 8 ngày", xp: 2890, initials: "LO", color: "#ef4444" },
    { rank: 4, username: "David W.", streak: "", xp: 2640, initials: "DW", color: "#64748b" },
    { rank: 5, username: "Elena K.", streak: "", xp: 2565, initials: "EK", color: "#0284c7" },
    { rank: 6, username: "Alex (Bạn)", streak: "Chuỗi 7 ngày", xp: 2450, initials: "AN", color: "#5b4ef5", isYou: true },
];
const mockYou = { rank: 6, username: "Alex (Bạn)", streak: "Chuỗi 7 ngày", xp: 2450, initials: "AN", color: "#5b4ef5", isYou: true };

export default function DashboardPage() {
    const navigate = useNavigate();

    return (
        <div className="flex bg-[#f4f5fb] min-h-screen">
            <Sidebar user={mockUser} />

            <div className="flex-1 min-w-0 flex flex-col">
                <TopBar
                    streakDays={7}
                    xp={12450}
                    rankLabel="Hạng Vàng III"
                    username={mockUser.username}
                />

                <div className="flex flex-1 min-h-0">
                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0 overflow-y-auto px-8 pb-10">

                        {/* Welcome Banner */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-7 my-6 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                                    <span>TỔNG QUAN HÀNG NGÀY</span>
                                    <span>•</span>
                                    <span>Phiên học #482</span>
                                </div>
                                <h1 className="font-display font-black text-3xl text-slate-900 mb-2">
                                    Chào mừng trở lại, {mockUser.username}
                                </h1>
                                <p className="text-sm font-medium text-slate-500">
                                    Hôm nay bạn có <strong className="text-slate-900">44 thẻ cần ôn tập</strong> trên 3 bộ từ vựng.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate("/decks")}
                                    className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                                >
                                    Khám phá thư viện
                                </button>
                                <button
                                    onClick={() => navigate("/study/1")}
                                    className="px-5 py-3 rounded-2xl bg-[#5b4ef5] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-200 hover:bg-indigo-600 transition-all hover:scale-105"
                                >
                                    <Play size={14} fill="white" />
                                    Bắt đầu ôn tập
                                </button>
                            </div>
                        </div>

                        {/* Stat Grid (4 cards) */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <StatCard
                                icon={<Flame size={18} />}
                                label="Chuỗi học tập"
                                value="7"
                                sub="Kỷ kỷ cá nhân: 14 ngày"
                                badge={{ text: "ngày liên tục", type: "warning" }}
                                iconBg="#fffbeb"
                                iconColor="#f59e0b"
                            />
                            <StatCard
                                icon={<BookOpen size={18} />}
                                label="Đã ôn hôm nay"
                                value="28"
                                progress={{ current: 28, total: 72 }}
                                iconBg="#eef2ff"
                                iconColor="#5b4ef5"
                            />
                            <StatCard
                                icon={<TrendingUp size={18} />}
                                label="Tỷ lệ ghi nhớ"
                                value="88.5%"
                                badge={{ text: "+2.1% tuần này", type: "success" }}
                                sub="Dựa trên 320 lượt lặp lại"
                                iconBg="#ecfdf5"
                                iconColor="#10b981"
                            />
                            <StatCard
                                icon={<Award size={18} />}
                                label="Hạng giải đấu"
                                value="Hạng #6"
                                sub="Cần 115 XP để lên Hạng #5"
                                badge={{ text: "Hạng Vàng III", type: "neutral" }}
                                iconBg="#fffbeb"
                                iconColor="#d97706"
                            />
                        </div>

                        {/* Tiếp tục học */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="font-display font-extrabold text-lg text-slate-900">Tiếp tục học</h2>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                                    3 bộ đang học
                                </span>
                            </div>
                            <button
                                onClick={() => navigate("/decks")}
                                className="text-xs font-bold text-indigo-600 hover:underline"
                            >
                                Xem tất cả bộ thẻ
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {mockDecks.map((deck) => (
                                <DeckProgressCard
                                    key={deck.id}
                                    {...deck}
                                    onResume={() => navigate(`/study/${deck.id}`)}
                                />
                            ))}
                        </div>

                        {/* Hoạt động gần đây */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="font-display font-extrabold text-lg text-slate-900">Hoạt động gần đây</h2>
                                <p className="text-xs font-medium text-slate-400">Nhật ký ôn tập & trận đấu đối kháng</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                                        <th className="py-3.5 px-6">PHIÊN / CHẾ ĐỘ</th>
                                        <th className="py-3.5 px-4">BỘ TỪ VỰNG</th>
                                        <th className="py-3.5 px-4">ĐỘ CHÍNH XÁC</th>
                                        <th className="py-3.5 px-4">ĐIỂM / KẾT QUẢ</th>
                                        <th className="py-3.5 px-6 text-right">THỜI GIAN</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                    {mockRecentActivity.map((act) => (
                                        <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                                        act.typeColor === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                                                    }`}>
                                                        <BookOpen size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-tight">{act.mode}</p>
                                                        <p className="text-[11px] text-slate-400 font-medium">{act.sub}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 font-bold text-slate-800">{act.tag}</td>
                                            <td className="py-4 px-4 font-bold text-emerald-600">{act.accuracy}%</td>
                                            <td className="py-4 px-4">
                                                {act.isWin ? (
                                                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[11px]">
                                                        Chiến thắng (+45 XP)
                                                    </span>
                                                ) : (
                                                    <span className="font-bold text-slate-700">{act.result}</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right text-slate-400 font-medium">{act.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </main>

                    {/* Right Leaderboard Side Panel */}
                    <div className="p-6 pl-0">
                        <LeaderboardPanel
                            entries={mockLeaderboard}
                            you={mockYou}
                            onViewAll={() => navigate("/leaderboard")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}