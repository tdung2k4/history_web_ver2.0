import { useState } from "react";
import { useApp, MASCOTS } from "../store";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, Zap, Flame, Crown, Lock } from "lucide-react";
import { useIsPremium } from "../hooks/useIsPremium";
import { useNavigate } from "react-router";
import { useSound } from "../hooks/useSound";

type Player = { name: string; xp: number; avatar: string; streak: number };
type TabKey = "week" | "month" | "all";

const TABS: { key: TabKey; label: string }[] = [
  { key: "week", label: "Tuần Này" },
  { key: "month", label: "Tháng Này" },
  { key: "all", label: "Tất Cả" },
];

const DATA: Record<TabKey, Player[]> = {
  week: [
    { name: "Minh Khôi", xp: 1240, avatar: "🎓", streak: 21 },
    { name: "Thanh Hà", xp: 980, avatar: "👧", streak: 18 },
    { name: "Tuấn Anh", xp: 870, avatar: "👦", streak: 15 },
    { name: "Linh Chi", xp: 760, avatar: "👩", streak: 14 },
    { name: "Phúc Hậu", xp: 620, avatar: "🧑", streak: 10 },
    { name: "Bảo Ngọc", xp: 540, avatar: "🙍", streak: 9 },
    { name: "Đức Mạnh", xp: 490, avatar: "👦", streak: 7 },
  ],
  month: [
    { name: "Minh Khôi", xp: 4800, avatar: "🎓", streak: 21 },
    { name: "Bảo Ngọc", xp: 4200, avatar: "🙍", streak: 18 },
    { name: "Phúc Hậu", xp: 3900, avatar: "🧑", streak: 16 },
    { name: "Tuấn Anh", xp: 3500, avatar: "👦", streak: 15 },
    { name: "Thanh Hà", xp: 3200, avatar: "👧", streak: 14 },
    { name: "Linh Chi", xp: 2900, avatar: "👩", streak: 12 },
    { name: "Đức Mạnh", xp: 2600, avatar: "👦", streak: 11 },
  ],
  all: [
    { name: "Thanh Hà", xp: 12400, avatar: "👧", streak: 85 },
    { name: "Minh Khôi", xp: 11800, avatar: "🎓", streak: 72 },
    { name: "Đức Mạnh", xp: 10500, avatar: "👦", streak: 60 },
    { name: "Tuấn Anh", xp: 9800, avatar: "👦", streak: 55 },
    { name: "Linh Chi", xp: 8700, avatar: "👩", streak: 48 },
    { name: "Phúc Hậu", xp: 7600, avatar: "🧑", streak: 42 },
    { name: "Bảo Ngọc", xp: 6900, avatar: "🙍", streak: 38 },
  ],
};

function fmt(n: number) {
  return n.toLocaleString("vi-VN");
}

const PODIUM_CFG = {
  1: { h: 140, bg: "#FFC800", color: "#D89E00", border: "#E5B400", avatarSz: 84, rank: "🥇" },
  2: { h: 100, bg: "#E5E5E5", color: "#AFAFAF", border: "#CCCCCC", avatarSz: 68, rank: "🥈" },
  3: { h: 80,  bg: "#E89B5D", color: "#C67634", border: "#D18B53", avatarSz: 64, rank: "🥉" },
} as const;

function PodiumEntry({ player, rank }: { player: Player; rank: 1 | 2 | 3 }) {
  const c = PODIUM_CFG[rank];
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank === 1 ? 0.05 : rank === 2 ? 0.14 : 0.22, type: "spring", stiffness: 250, damping: 22 }}
      className="flex flex-col items-center relative"
      style={{ width: c.avatarSz + 24 }}
    >
      {/* Crown */}
      {rank === 1 ? (
        <motion.div
          animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 text-5xl z-10 drop-shadow-md"
        >
          👑
        </motion.div>
      ) : (
        <div style={{ height: 40 }} />
      )}

      {/* Avatar */}
      <div
        className="rounded-full flex items-center justify-center relative z-10 bg-white"
        style={{
          width: c.avatarSz,
          height: c.avatarSz,
          border: `4px solid ${c.bg}`,
          boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
        }}
      >
        <span style={{ fontSize: c.avatarSz * 0.55 }}>{player.avatar}</span>
        {/* Rank badge */}
        <div
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full"
          style={{
            backgroundColor: c.bg,
            fontSize: 14,
            color: "white",
            fontWeight: 900,
            boxShadow: `0 3px 0 ${c.border}`,
          }}
        >
          {rank}
        </div>
      </div>

      {/* Name & XP */}
      <div className="text-center mt-5 mb-3 w-full px-1">
        <p className="truncate text-gray-800 font-black text-base tracking-wide">
          {player.name}
        </p>
        <p className="text-[#FF9600] font-bold text-sm mt-0.5">
          {fmt(player.xp)} XP
        </p>
      </div>

      {/* Podium block */}
      <div
        className="flex items-start justify-center rounded-t-[2rem] w-full pt-4 relative overflow-hidden"
        style={{ height: c.h, backgroundColor: c.bg, borderTop: `6px solid ${c.border}` }}
      >
        <span style={{ fontSize: 40, color: c.color, fontWeight: 900, opacity: 0.8 }}>
          {rank}
        </span>
      </div>
    </motion.div>
  );
}

function Podium({ top3 }: { top3: Player[] }) {
  if (top3.length < 3) return null;
  return (
    <div className="max-w-md mx-auto px-4 mt-6">
      <div className="flex items-end justify-center gap-4">
        <PodiumEntry player={top3[1]} rank={2} />
        <PodiumEntry player={top3[0]} rank={1} />
        <PodiumEntry player={top3[2]} rank={3} />
      </div>
    </div>
  );
}

export default function LeaderboardScreen() {
  const { user } = useApp();
  const isPremium = useIsPremium();
  const [tab, setTab] = useState<TabKey>("week");
  const nav = useNavigate();
  const { playPop } = useSound();
  const data = DATA[tab];

  const PRO_PLAYERS = new Set(["Minh Khôi", "Thanh Hà", "Tuấn Anh"]);

  const withMe = [
    ...data,
    { name: user.name || "Học Sinh", xp: user.xp, avatar: user.avatar || "🦊", streak: user.streak, isMe: true as const },
  ].sort((a, b) => b.xp - a.xp);
  const myRank = withMe.findIndex((p) => "isMe" in p && p.isMe) + 1;

  return (
    <div className="min-h-screen bg-[#FFF9E6] font-['Nunito',sans-serif] pt-24 pb-40 selection:bg-[#FFC800]/30">
      
      {/* ── Header ── */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 text-center pt-4 pb-2">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          Đấu Trường
        </h1>
        <p className="text-lg text-gray-500 font-bold mt-2">
          Cạnh tranh vui vẻ, nhận quà siêu to!
        </p>
      </div>

      {/* ── Tab switcher ── */}
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="flex rounded-full p-1.5 bg-gray-100/80 shadow-inner">
          {TABS.map((t) => {
            const isProTab = t.key === "month" || t.key === "all";
            const locked = isProTab && !isPremium;
            const isActive = tab === t.key;
            return (
              <motion.button
                key={t.key}
                onClick={() => {
                  playPop();
                  if (locked) {
                    nav("/premium");
                    return;
                  }
                  setTab(t.key);
                }}
                whileTap={{ scale: 0.96 }}
                className={`flex-1 py-3.5 rounded-full transition-all relative flex items-center justify-center gap-2 ${
                  isActive ? "bg-white shadow-[0_4px_0_rgba(0,0,0,0.05)] text-[#58CC02]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
                }`}
                style={{
                  fontWeight: isActive ? 900 : 700,
                  fontSize: 15,
                }}
              >
                {locked && <Lock className="w-4 h-4 text-gray-400" />}
                {t.label}
                {locked && <span className="bg-[#FFC800] text-white px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase">Pro</span>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.24 }}
          className="max-w-2xl mx-auto"
        >
          {/* Podium */}
          <Podium top3={data.slice(0, 3)} />

          {/* List rank 4+ */}
          <div className="px-4 md:px-8 mt-6 flex flex-col gap-3">
            {data.slice(3).map((player, i) => (
              <motion.div
                key={`${player.name}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 bg-white rounded-3xl p-4 border-2 border-gray-100 shadow-[0_4px_0_rgba(0,0,0,0.02)]"
              >
                <div className="w-8 text-center shrink-0 font-black text-gray-400 text-lg">
                  {i + 4}
                </div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0 bg-gray-50 border-2 border-gray-100">
                  {player.avatar}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-gray-800 text-lg font-black tracking-wide">
                      {player.name}
                    </p>
                    {PRO_PLAYERS.has(player.name) && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#FFC800] to-[#FF9600] text-white text-[10px] font-black uppercase">
                        <Crown size={10} strokeWidth={3} /> Pro
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[#FF9600]">
                      <Zap size={14} strokeWidth={3} />
                      <span className="text-sm font-bold">{fmt(player.xp)} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#FF4B4B]">
                      <Flame size={14} strokeWidth={3} />
                      <span className="text-sm font-bold">{player.streak} ngày</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Current user sticky row */}
          <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-30 pb-20">
            {/* Solid dock background extending to bottom-0 */}
            <div className="absolute inset-0 bg-[#FFF9E6]/95 backdrop-blur-md pointer-events-auto" />
            {/* Gradient fade */}
            <div className="absolute top-[-30px] left-0 right-0 h-[30px] bg-gradient-to-t from-[#FFF9E6]/95 to-transparent pointer-events-none" />
            
            <div className="relative p-4 md:px-8 pointer-events-auto">
              <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-4">
              <span className="w-8 text-center shrink-0 text-[#FF9600] text-xl font-black">
                #{myRank}
              </span>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0 bg-[#FFF5C2] border-2 border-[#FFC800] overflow-hidden">
                {user.mascotId ? (
                  <img src={MASCOTS.find(m => m.id === user.mascotId)?.img || MASCOTS[0].img} alt="Avatar" className="w-full h-full object-contain scale-125 p-1" />
                ) : (
                  user.avatar || "🦊"
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="truncate text-[#FF9600] text-lg font-black tracking-wide">
                  {user.name || "Học Sinh"}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[#FF9600]">
                    <Zap size={14} strokeWidth={3} />
                    <span className="text-sm font-bold">{user.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#FF4B4B]">
                    <Flame size={14} strokeWidth={3} />
                    <span className="text-sm font-bold">{user.streak} ngày</span>
                  </div>
                </div>
              </div>
              <ChevronUp className="w-6 h-6 shrink-0 text-[#FFC800]" strokeWidth={3} />
            </div>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
