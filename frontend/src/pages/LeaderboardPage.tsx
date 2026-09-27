import { Trophy } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const mockUser = { username: "Alex Nguyễn", level: 18, xp: 12450, isPro: false };

const mockEntries = [
    { rank: 1, username: "Kenji S.", xp: 3420, initials: "KS", color: "#6c63ff" },
    { rank: 2, username: "Liam O.", xp: 3120, initials: "LO", color: "#f05a71" },
    { rank: 3, username: "David W.", xp: 2640, initials: "DW", color: "#22c55e" },
    { rank: 4, username: "Diana K.", xp: 2585, initials: "DK", color: "#f5a623" },
    { rank: 5, username: "Alex N. (Bạn)", xp: 2400, initials: "AN", color: "#897bff", isYou: true },
    { rank: 6, username: "Minh Q.", xp: 2155, initials: "MQ", color: "#38bdf8" },
    { rank: 7, username: "Thu Lan", xp: 1998, initials: "TL", color: "#c084fc" },
];

export default function LeaderboardPage() {
    return (
        <div className="flex" style={{ minHeight: "100vh" }}>
            <Sidebar user={mockUser} />
            <div className="flex-1 flex flex-col">
                <TopBar streakDays={7} xp={12450} rankLabel="Hạng Vàng III" username={mockUser.username} />
                <main className="flex-1 px-8 pb-10 pt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Trophy size={24} style={{ color: "var(--color-gold)" }} />
                        <h1 className="font-display text-2xl font-bold text-text">Bảng xếp hạng</h1>
                    </div>

                    <div className="rounded-2xl overflow-hidden max-w-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                        {/* Header */}
                        <div className="grid px-5 py-3 text-xs font-semibold" style={{ gridTemplateColumns: "60px 1fr 120px", color: "var(--color-muted)", borderBottom: "1px solid var(--color-border)" }}>
                            <span>Hạng</span>
                            <span>Người dùng</span>
                            <span className="text-right">Điểm XP</span>
                        </div>

                        {mockEntries.map((entry, idx) => {
                            const rankEmoji = entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : null;
                            return (
                                <div
                                    key={entry.rank}
                                    className="grid items-center px-5 py-3.5 transition-colors"
                                    style={{
                                        gridTemplateColumns: "60px 1fr 120px",
                                        borderBottom: idx < mockEntries.length - 1 ? "1px solid var(--color-border)" : "none",
                                        background: entry.isYou ? "var(--color-primary-dim)" : "transparent",
                                    }}
                                    onMouseEnter={(e) => { if (!entry.isYou) e.currentTarget.style.background = "var(--color-surface-2)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = entry.isYou ? "var(--color-primary-dim)" : "transparent"; }}
                                >
                                    <span className="text-sm font-bold" style={{ color: "var(--color-muted)" }}>
                                        {rankEmoji ?? `#${entry.rank}`}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: entry.color }}>
                                            {entry.initials}
                                        </div>
                                        <span className="text-sm font-semibold" style={{ color: entry.isYou ? "var(--color-primary-light)" : "var(--color-text)" }}>
                                            {entry.username}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-right text-text">{entry.xp.toLocaleString("vi-VN")}</span>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
}
