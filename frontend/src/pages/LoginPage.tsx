import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch {
            setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#f4f5fb]">
            {/* Soft ambient background circles */}
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

            <div className="w-full max-w-sm relative z-10">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-[#5b4ef5] flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Zap size={20} className="text-white" fill="white" />
                    </div>
                    <span className="font-display text-2xl font-black tracking-tight text-slate-900">
                        English<span className="text-indigo-600">Champ</span>
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
                    <h1 className="font-display text-2xl font-black text-slate-900 mb-1">Chào bạn 👋</h1>
                    <p className="text-xs font-medium text-slate-400 mb-6">
                        Đăng nhập để học từ vựng và tham gia bảng xếp hạng.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="login-email"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="alex@example.com"
                                className="w-full text-xs font-medium px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="login-password"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                            >
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full text-xs font-medium px-4 py-3 pr-11 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="text-xs font-semibold px-4 py-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full text-xs font-extrabold py-3.5 rounded-2xl bg-[#5b4ef5] text-white shadow-md shadow-indigo-200 hover:bg-indigo-600 transition-all mt-2"
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
                        </button>
                    </form>

                    <div className="mt-5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-center">
                        <p className="text-[11px] font-medium text-indigo-900">
                            💡 <i>Mẹo test:</i> Điền bất kỳ email/mật khẩu nào (ví dụ: <code>alex@example.com</code> / <code>123456</code>) để thử giao diện.
                        </p>
                    </div>
                </div>

                <p className="text-center text-[11px] font-medium text-slate-400 mt-6">
                    © 2026 EnglishChamp. Tất cả quyền được bảo lưu.
                </p>
            </div>
        </div>
    );
}