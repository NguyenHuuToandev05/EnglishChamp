import { useState, useEffect, useRef } from "react";
import {
    Users,
    Crown,
    Shield,
    Swords,
    Copy,
    LogOut,
    Send,
    Zap,
    Clock,
    BookOpen,
    ChevronDown,
    Star,
    MessageSquare,
    Settings2,
    Wifi,
    Check,
    Trophy,
    Timer,
    Flame,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const mockUser = { username: "Alex", level: 18, xp: 12450, isPro: false };

const ROOM_CODE = "IELTS-#892023";

const GAME_MODES = [
    {
        id: "battle",
        label: "Đấu sinh tử (Battle Royale)",
        desc: "Người chơi chọn và trả lời các thẻ từ bộ từ vựng của mình. Ai trả lời đúng nhiều nhất thắng.",
        color: "#5b4ef5",
        bg: "#eef2ff",
        icon: <Swords size={14} />,
        badge: "Mới",
        badgeBg: "#fee2e2",
        badgeColor: "#dc2626",
    },
    {
        id: "gold",
        label: "Vàng bón Cải điền",
        desc: "Người chơi không thể dùng thẻ đã sử dụng. Mục tiêu là giành được nhiều điểm nhất trong thời gian quy định.",
        color: "#f59e0b",
        bg: "#fffbeb",
        icon: <Star size={14} />,
        badge: null,
        badgeBg: undefined,
        badgeColor: undefined,
    },
    {
        id: "speed",
        label: "Đua tốc độ (Speedrun)",
        desc: "Người chơi phải hoàn thành bộ thẻ nhanh nhất có thể. Thời gian và độ chính xác quyết định người thắng.",
        color: "#10b981",
        bg: "#ecfdf5",
        icon: <Timer size={14} />,
        badge: null,
        badgeBg: undefined,
        badgeColor: undefined,
    },
];

const DECKS = [
    { id: "ielts", label: "IELTS Academic 3000 (Band 7)", tag: "IELTS", color: "#5b4ef5", bg: "#eef2ff" },
    { id: "toeic", label: "TOEIC Mastery", tag: "TOEIC", color: "#10b981", bg: "#ecfdf5" },
    { id: "oxford", label: "Oxford 5000", tag: "OXFORD", color: "#f59e0b", bg: "#fffbeb" },
    { id: "cambridge", label: "Cambridge English", tag: "CAM", color: "#6366f1", bg: "#eef2ff" },
];

const INITIAL_PLAYERS = [
    {
        id: "p1",
        name: "AlexVarlex",
        level: "Band 7.5 • IELTS",
        initials: "AV",
        color: "#5b4ef5",
        isHost: true,
        isReady: true,
        isYou: true,
        winRate: 88,
        streak: 5,
    },
    {
        id: "p2",
        name: "ElenVocab",
        level: "Band 7.0 • IELTS",
        initials: "EV",
        color: "#f59e0b",
        isHost: false,
        isReady: true,
        isYou: false,
        winRate: 76,
        streak: 3,
    },
    {
        id: "p3",
        name: "DragonSlayer",
        level: "Band 7.5 • IELTS",
        initials: "DS",
        color: "#ef4444",
        isHost: false,
        isReady: false,
        isYou: false,
        winRate: 91,
        streak: 12,
    },
    {
        id: "p4",
        name: "Sarah_TOEIC",
        level: "Band 7.0 • IELTS",
        initials: "ST",
        color: "#10b981",
        isHost: false,
        isReady: true,
        isYou: false,
        winRate: 72,
        streak: 2,
    },
];

const SLOT_PLACEHOLDERS = [
    { id: "s1", label: "Vị trí trống", sublabel: "Mời bạn bè" },
    { id: "s2", label: "Vị trí trống", sublabel: "Mời bạn bè" },
    { id: "s3", label: "Vị trí trống", sublabel: "Mời bạn bè" },
];

const INITIAL_MESSAGES = [
    { id: "m1", sender: "AlexVarlex", initials: "AV", color: "#5b4ef5", text: "Chào mọi người! Sẵn sàng chưa các bạn ơi?", isYou: false },
    { id: "m2", sender: "ElenVocab", initials: "EV", color: "#f59e0b", text: "Quay bị nhớ lại trạng thái sẵn sàng của vọng Curriculum đã học được theo từng mục tiêu bằng học tiếng Anh", isYou: false },
    { id: "m3", sender: "DragonSlayer", initials: "DS", color: "#ef4444", text: "DragonSlayer tạo ra bộ từ vựng mới từ câu hỏi trong ngữ cảnh bất kỳ! không điền 30 giây nhé mọi người", isYou: false },
    { id: "m4", sender: "Sarah_TOEIC", initials: "ST", color: "#10b981", text: "Sarah_TOEIC: Sẵn rồi! Let's go! 🔥", isYou: false },
];

export default function LobbyPage() {
    const [selectedMode, setSelectedMode] = useState("battle");
    const [selectedDeck, setSelectedDeck] = useState("ielts");
    const [isReady, setIsReady] = useState(false);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputMsg, setInputMsg] = useState("");
    const [questionCount, setQuestionCount] = useState(10);
    const [timeLimit, setTimeLimit] = useState(15);
    const [copied, setCopied] = useState(false);
    const [deckDropdown, setDeckDropdown] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const playerCount = INITIAL_PLAYERS.length;
    const readyPlayers = INITIAL_PLAYERS.filter((p) => !p.isYou && p.isReady).length + (isReady ? 1 : 0);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function handleCopyCode() {
        navigator.clipboard.writeText(ROOM_CODE).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleSendMessage() {
        if (!inputMsg.trim()) return;
        setMessages((prev) => [
            ...prev,
            {
                id: `msg-${Date.now()}`,
                sender: "Alex (Bạn)",
                initials: "AX",
                color: "#5b4ef5",
                text: inputMsg.trim(),
                isYou: true,
            },
        ]);
        setInputMsg("");
    }

    const currentMode = GAME_MODES.find((m) => m.id === selectedMode)!;
    const currentDeck = DECKS.find((d) => d.id === selectedDeck)!;

    return (
        <div className="flex bg-[#f4f5fb] min-h-screen">
            <Sidebar user={mockUser} />
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar streakDays={7} xp={12450} rankLabel="Hạng Vàng III" username={mockUser.username} />

                <main className="flex-1 px-8 pb-10">
                    {/* Header */}
                    <div className="flex items-center justify-between py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                <Users size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="font-display text-2xl font-black text-slate-900">Phòng Đấu Cao Thủ IELTS</h1>
                                <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                        <Users size={11} /> {playerCount} Phòng đợi
                                    </span>
                                    <span className="text-xs font-semibold flex items-center gap-1">
                                        <Wifi size={11} className="text-emerald-500" />
                                        <span className="text-emerald-600">Kết nối tốt</span>
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                        <Crown size={11} className="text-amber-500" /> Host: Chiều Ấu – By Phúc/Toàn
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopyCode}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                                <span className="font-mono tracking-wide">{ROOM_CODE}</span>
                            </button>

                            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                                <Copy size={13} />
                                Sao chép liên kết
                            </button>

                            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-red-600 hover:bg-red-100 transition-all shadow-sm">
                                <LogOut size={13} />
                                Rời phòng
                            </button>
                        </div>
                    </div>

                    {/* Room style badge */}
                    <div className="flex items-center gap-2 mb-5">
                        <span className="text-xs font-semibold text-slate-500">Kiểu phòng:</span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                            <Star size={10} className="text-indigo-500" /> Chiều Ấu – By Phúc/Toàn
                        </span>
                    </div>

                    <div className="flex gap-5">
                        {/* LEFT: Players + Chat */}
                        <div className="flex-1 min-w-0 flex flex-col gap-4">
                            {/* Players section */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                                    <h2 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-2">
                                        <Users size={15} className="text-indigo-500" />
                                        Danh sách người chơi
                                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                            {playerCount} người
                                        </span>
                                    </h2>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Đồng bộ hóa phòng chờ
                                    </div>
                                </div>

                                <div className="px-5 pb-5">
                                    {/* Player grid */}
                                    <div className="grid grid-cols-4 gap-3 mb-3">
                                        {INITIAL_PLAYERS.map((player) => (
                                            <div
                                                key={player.id}
                                                className={`relative rounded-2xl border p-4 text-center transition-all ${
                                                    player.isYou
                                                        ? "border-indigo-200 bg-indigo-50/50 ring-2 ring-indigo-100"
                                                        : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                                                }`}
                                            >
                                                {player.isHost && (
                                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                                        <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-white whitespace-nowrap">
                                                            <Crown size={8} /> Host
                                                        </span>
                                                    </div>
                                                )}

                                                <div
                                                    className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-lg font-black text-white mb-2 ring-4 ring-white shadow-sm"
                                                    style={{ background: player.color }}
                                                >
                                                    {player.initials}
                                                </div>

                                                <p className="text-xs font-extrabold text-slate-900 truncate">{player.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium truncate mb-2">{player.level}</p>

                                                <div className="flex items-center justify-center gap-2 mb-2.5">
                                                    <span className="text-[9px] font-semibold text-slate-500 flex items-center gap-0.5">
                                                        <Trophy size={8} className="text-amber-500" /> {player.winRate}%
                                                    </span>
                                                    {player.streak > 0 && (
                                                        <span className="text-[9px] font-semibold text-orange-500 flex items-center gap-0.5">
                                                            <Flame size={8} /> {player.streak}
                                                        </span>
                                                    )}
                                                </div>

                                                {player.isYou ? (
                                                    <button
                                                        onClick={() => setIsReady((r) => !r)}
                                                        className={`w-full text-[10px] font-bold py-1 rounded-lg transition-all ${
                                                            isReady
                                                                ? "bg-emerald-500 text-white"
                                                                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                                        }`}
                                                    >
                                                        {isReady ? "✓ Đã sẵn sàng" : "Bấm sẵn sàng"}
                                                    </button>
                                                ) : (
                                                    <div
                                                        className={`text-[10px] font-bold py-1 rounded-lg ${
                                                            player.isReady
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : "bg-amber-50 text-amber-600"
                                                        }`}
                                                    >
                                                        {player.isReady ? "✓ Đã sẵn sàng" : "Đang chờ chọn..."}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Empty slots */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {SLOT_PLACEHOLDERS.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="rounded-2xl border-2 border-dashed border-slate-200 p-4 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer"
                                            >
                                                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-slate-100 mb-2">
                                                    <Users size={16} className="text-slate-400" />
                                                </div>
                                                <p className="text-[11px] font-semibold text-slate-400">{slot.label}</p>
                                                <p className="text-[10px] text-slate-300 mt-0.5">{slot.sublabel}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Chat section */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden" style={{ minHeight: 280 }}>
                                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
                                    <h2 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-2">
                                        <MessageSquare size={14} className="text-indigo-500" />
                                        Trò chuyện nhanh trong phòng
                                    </h2>
                                    <span className="text-[10px] font-semibold text-slate-400">Quy chơi: Lịch sự & Vui lòng</span>
                                </div>

                                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2.5" style={{ maxHeight: 200 }}>
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex items-start gap-2.5 ${msg.isYou ? "flex-row-reverse" : ""}`}>
                                            <div
                                                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5"
                                                style={{ background: msg.color }}
                                            >
                                                {msg.initials}
                                            </div>
                                            <div className={`max-w-[75%] flex flex-col ${msg.isYou ? "items-end" : "items-start"}`}>
                                                {!msg.isYou && (
                                                    <span className="text-[9px] font-bold text-slate-400 mb-0.5 ml-0.5">{msg.sender}</span>
                                                )}
                                                <div
                                                    className={`text-xs font-medium px-3 py-1.5 rounded-2xl leading-relaxed ${
                                                        msg.isYou
                                                            ? "bg-indigo-600 text-white rounded-tr-sm"
                                                            : "bg-slate-100 text-slate-700 rounded-tl-sm"
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
                                    <input
                                        type="text"
                                        value={inputMsg}
                                        onChange={(e) => setInputMsg(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                        placeholder="Nhập tin nhắn hoặc động viên đồng đội..."
                                        className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all font-medium"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white transition-all shrink-0 shadow-sm"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Settings + Actions */}
                        <div className="w-72 shrink-0 flex flex-col gap-4">
                            {/* Game settings panel */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Settings2 size={15} className="text-indigo-500" />
                                    <h3 className="font-display font-extrabold text-sm text-slate-900">Cài đặt trận đấu</h3>
                                    <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Chỉnh phòng</span>
                                </div>

                                {/* Deck selector */}
                                <div className="mb-4">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                        Bộ từ vựng đấu <span className="text-slate-300 font-medium normal-case">Chọn trước</span>
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={() => setDeckDropdown((d) => !d)}
                                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 hover:border-indigo-300 transition-all"
                                        >
                                            <span className="flex items-center gap-2 min-w-0">
                                                <span
                                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0"
                                                    style={{ background: currentDeck.bg, color: currentDeck.color }}
                                                >
                                                    {currentDeck.tag}
                                                </span>
                                                <span className="truncate">{currentDeck.label}</span>
                                            </span>
                                            <ChevronDown size={13} className={`transition-transform shrink-0 ml-1 ${deckDropdown ? "rotate-180" : ""}`} />
                                        </button>

                                        {deckDropdown && (
                                            <div className="absolute top-full mt-1 left-0 right-0 z-10 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                                                {DECKS.map((deck) => (
                                                    <button
                                                        key={deck.id}
                                                        onClick={() => { setSelectedDeck(deck.id); setDeckDropdown(false); }}
                                                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-left hover:bg-slate-50 transition-colors ${
                                                            deck.id === selectedDeck ? "bg-indigo-50 text-indigo-700" : "text-slate-700"
                                                        }`}
                                                    >
                                                        <span
                                                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0"
                                                            style={{ background: deck.bg, color: deck.color }}
                                                        >
                                                            {deck.tag}
                                                        </span>
                                                        {deck.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Game mode */}
                                <div className="mb-4">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Chế độ chơi</label>
                                    <div className="space-y-2">
                                        {GAME_MODES.map((mode) => (
                                            <button
                                                key={mode.id}
                                                onClick={() => setSelectedMode(mode.id)}
                                                className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                                                    selectedMode === mode.id
                                                        ? "border-indigo-200 bg-indigo-50/60 ring-2 ring-indigo-100"
                                                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                                }`}
                                            >
                                                <div
                                                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                                    style={{ background: mode.bg, color: mode.color }}
                                                >
                                                    {mode.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                                        <p className="text-[11px] font-extrabold text-slate-900 leading-tight">{mode.label}</p>
                                                        {mode.badge && (
                                                            <span
                                                                className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                                                                style={{ background: mode.badgeBg, color: mode.badgeColor }}
                                                            >
                                                                {mode.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2">{mode.desc}</p>
                                                </div>
                                                {selectedMode === mode.id && (
                                                    <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                                                        <Check size={9} className="text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Question & time settings */}
                                <div className="mb-4 grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                                            <BookOpen size={9} /> Số thẻ / lượt
                                        </label>
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                                            {[10, 15, 20].map((n) => (
                                                <button
                                                    key={n}
                                                    onClick={() => setQuestionCount(n)}
                                                    className={`flex-1 text-[11px] font-bold py-1.5 transition-all ${
                                                        questionCount === n
                                                            ? "bg-indigo-600 text-white"
                                                            : "text-slate-600 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    {n}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                                            <Clock size={9} /> Thời gian / thẻ
                                        </label>
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                                            {[10, 15, 20].map((n) => (
                                                <button
                                                    key={n}
                                                    onClick={() => setTimeLimit(n)}
                                                    className={`flex-1 text-[11px] font-bold py-1.5 transition-all ${
                                                        timeLimit === n
                                                            ? "bg-indigo-600 text-white"
                                                            : "text-slate-600 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    {n}s
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Difficulty notice */}
                                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                                    <Shield size={13} className="text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-amber-700 font-semibold leading-relaxed">
                                        Độ khó điều chỉnh tự động theo trình độ người chơi trong phòng.
                                    </p>
                                </div>
                            </div>

                            {/* Ready status & start */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                        <Zap size={13} className="text-indigo-500" />
                                        Trạng thái phòng
                                    </p>
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                        {readyPlayers}/{playerCount} sẵn sàng
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full h-2 bg-slate-100 rounded-full mb-4 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(readyPlayers / playerCount) * 100}%`,
                                            background: "linear-gradient(90deg, #5b4ef5, #6366f1)",
                                        }}
                                    />
                                </div>

                                <p className="text-[11px] text-slate-400 font-medium mb-4 flex items-center gap-1.5">
                                    <Users size={11} />
                                    {playerCount} người đang đợi • Bấm sẵn sàng để bắt đầu
                                </p>

                                {/* Ready toggle */}
                                <button
                                    onClick={() => setIsReady((r) => !r)}
                                    className={`w-full py-3 rounded-2xl text-sm font-extrabold transition-all mb-2 flex items-center justify-center gap-2 ${
                                        isReady
                                            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                >
                                    {isReady ? (
                                        <><Check size={15} /> Đã sẵn sàng!</>
                                    ) : (
                                        <><Shield size={15} /> Bấm sẵn sàng</>
                                    )}
                                </button>

                                {/* Start button (host only) */}
                                <button
                                    id="lobby-start-match"
                                    className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-indigo-200"
                                    style={{ background: "linear-gradient(135deg, #5b4ef5 0%, #6366f1 100%)" }}
                                >
                                    <Swords size={15} />
                                    Bắt đầu trận đấu
                                </button>
                            </div>

                            {/* Match info summary */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-4 shadow-md">
                                <p className="text-xs font-bold text-indigo-200 mb-3 flex items-center gap-1.5">
                                    <Trophy size={12} className="text-yellow-300" /> Thông tin trận
                                </p>
                                <div className="space-y-2">
                                    {[
                                        { label: "Chế độ", value: currentMode.label.split(" (")[0] },
                                        { label: "Bộ thẻ", value: currentDeck.tag },
                                        { label: "Số câu hỏi", value: `${questionCount} thẻ` },
                                        { label: "Thời gian / thẻ", value: `${timeLimit}s` },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between">
                                            <span className="text-[11px] text-indigo-300 font-medium">{item.label}</span>
                                            <span className="text-[11px] text-white font-bold">{item.value}</span>
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
