import { NavLink as RouterNavLink } from "react-router-dom";
import {
    LayoutGrid,
    BookOpen,
    Swords,
    Trophy,
    Settings,
    Zap,
    Crown,
    Layers,
    UserCheck
} from "lucide-react";

const navItems = [
    { to: "/", label: "Trang chủ ", icon: LayoutGrid },
    { to: "/decks", label: "Phòng học cá nhân", icon: BookOpen },
    { to: "/arena", label: "Đấu trường 1v1", icon: Swords },
    { to: "/lobby", label: "Phòng chờ đấu", icon: UserCheck },
    { to: "/vocab", label: "Kho từ vựng", icon: Layers },
    { to: "/leaderboard", label: "Bảng xếp hạng", icon: Trophy },
    { to: "/settings", label: "Cài đặt", icon: Settings },
];

interface SidebarProps {
    user?: { username: string; level: number; xp: number; isPro?: boolean };
}

export default function Sidebar({ user: _user }: SidebarProps) {
    return (
        <aside
            className="w-[230px] shrink-0 flex flex-col h-screen sticky top-0 bg-white"
            style={{ borderRight: "1px solid #e9ecef" }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-6 py-5">
                <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: "#5b4ef5" }}
                >
                    <Zap size={16} fill="white" />
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="font-display font-extrabold text-base tracking-tight text-slate-900">
                        English
                    </span>
                    <span className="font-display font-bold text-base text-indigo-600">
                        Champ
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 mt-1 space-y-1 overflow-y-auto">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <RouterNavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={17} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                                <span>{label}</span>
                            </>
                        )}
                    </RouterNavLink>
                ))}
            </nav>

            {/* Bottom rank pill */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200/60">
                    <div className="flex items-center gap-2">
                        <Crown size={16} className="text-amber-600" />
                        <div>
                            <p className="text-xs font-bold text-amber-900 leading-tight">Hạng Vàng III</p>
                            <p className="text-[10px] text-amber-700 font-medium">Top 8% toàn khu vực</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}