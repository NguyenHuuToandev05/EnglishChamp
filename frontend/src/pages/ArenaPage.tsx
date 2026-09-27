import { Swords } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const mockUser = { username: "Alex Nguyễn", level: 18, xp: 12450, isPro: false };

export default function ArenaPage() {
    return (
        <div className="flex" style={{ minHeight: "100vh" }}>
            <Sidebar user={mockUser} />
            <div className="flex-1 flex flex-col">
                <TopBar streakDays={7} xp={12450} rankLabel="Hạng Vàng III" username={mockUser.username} />
                <main className="flex-1 px-8 pb-10 pt-8">
                    <h1 className="font-display text-2xl font-bold text-text mb-2">Phòng chờ đấu</h1>
                    <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>Thách đấu người chơi khác trong thời gian thực</p>
                    <div className="flex flex-col items-center justify-center py-24 rounded-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--color-gold-dim)" }}>
                            <Swords size={28} style={{ color: "var(--color-gold)" }} />
                        </div>
                        <h3 className="font-display font-bold text-lg text-text mb-2">Sắp ra mắt</h3>
                        <p className="text-sm" style={{ color: "var(--color-muted)" }}>Tính năng đấu 1v1 đang được phát triển. Hãy quay lại sớm nhé!</p>
                    </div>
                </main>
            </div>
        </div>
    );
}
