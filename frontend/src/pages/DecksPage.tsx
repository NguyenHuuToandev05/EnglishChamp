import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const mockUser = { username: "Alex Nguyễn", level: 18, xp: 12450, isPro: false };

export default function DecksPage() {
    const navigate = useNavigate();
    return (
        <div className="flex" style={{ minHeight: "100vh" }}>
            <Sidebar user={mockUser} />
            <div className="flex-1 flex flex-col">
                <TopBar streakDays={7} xp={12450} rankLabel="Hạng Vàng III" username={mockUser.username} />
                <main className="flex-1 px-8 pb-10 pt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="font-display text-2xl font-bold text-text">Bộ thẻ từ của tôi</h1>
                        <button
                            id="btn-create-deck"
                            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl gradient-primary text-white glow-primary"
                        >
                            <Plus size={16} />
                            Tạo bộ thẻ mới
                        </button>
                    </div>
                    <div className="relative mb-6 max-w-sm">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
                        <input
                            type="text"
                            placeholder="Tìm bộ thẻ..."
                            className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none"
                            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                        />
                    </div>
                    {/* Empty state / placeholder */}
                    <div className="flex flex-col items-center justify-center py-24 rounded-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--color-primary-dim)" }}>
                            <BookOpen size={28} style={{ color: "var(--color-primary-light)" }} />
                        </div>
                        <h3 className="font-display font-bold text-lg text-text mb-2">Quản lý bộ thẻ từ</h3>
                        <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>Trang này sẽ hiển thị toàn bộ bộ thẻ từ của bạn.</p>
                        <button onClick={() => navigate("/study/1")} className="text-sm font-semibold px-5 py-2.5 rounded-xl gradient-primary text-white">
                            Học thử ngay →
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
