import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { useApp, MASCOTS } from "../store";
import { Map, Target, Trophy, Award, BookOpen, User, LogOut, Flame, Gem, Heart, Zap, Menu, X, Crown, Bot, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useIsPremium } from "../hooks/useIsPremium";
import { useSound } from "../hooks/useSound";
import { useHearts } from "../hooks/useHearts";
import AnimatedMascot from "./AnimatedMascot";

const NAV = [
  { to: "/home",         icon: Map,      label: "Học",          sub: "Chinh phục lịch sử" },
  { to: "/missions",    icon: Target,   label: "Nhiệm Vụ",     sub: "Mục tiêu hàng ngày" },
  { to: "/leaderboard", icon: Trophy,   label: "Xếp Hạng",     sub: "Bảng chiến tích" },
  { to: "/achievements",icon: Award,    label: "Thành Tựu",    sub: "Huy hiệu của bạn" },
  { to: "/collection",  icon: BookOpen, label: "Bộ Sưu Tập",   sub: "Tư liệu lịch sử" },
  { to: "/profile",     icon: User,     label: "Hồ Sơ",        sub: "Thống kê cá nhân" },
];

export default function AppLayout() {
  const { user, isSoundEnabled, toggleSound, updateProfile } = useApp();
  const nav = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [heartsTooltip, setHeartsTooltip] = useState(false);
  const { playPop } = useSound();
  const userMascot = MASCOTS.find(m => m.id === user.mascotId) || MASCOTS[0];

  const { hearts, isPremium, timeLeft, isFull, maxHearts } = useHearts();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen app-bg">
      {/* ── Top bar ── */}
      <header
        className="sticky top-0 z-30"
        style={{
          background: "rgba(250,245,232,0.88)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(240,180,41,0.2)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 4px 20px rgba(0,0,0,0.07)",
        }}
      >
        <div className="px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: "linear-gradient(135deg, rgba(45,20,0,0.95), rgba(15,8,0,0.95))",
                border: "1.5px solid rgba(240,180,41,0.4)",
                boxShadow: "0 2px 12px rgba(217,119,6,0.25), 0 0 0 1px rgba(240,180,41,0.1) inset",
              }}
            >
              🏛️
            </motion.div>
            <div className="hidden sm:block">
              <span
                style={{
                  fontFamily: "Rubik, Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
                  color: "#92400e",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  display: "block",
                  lineHeight: 1.1,
                }}
              >
                HISTORY ALIVE
              </span>
              <span style={{ color: "#c4a882", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Sống trong lịch sử
              </span>
            </div>
          </div>

          {/* Desktop center nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => playPop()}>
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer relative overflow-hidden"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(255,243,196,0.9), rgba(254,230,138,0.6))"
                        : "transparent",
                      color: isActive ? "#92400e" : "#78716c",
                      border: isActive ? "1px solid rgba(240,180,41,0.35)" : "1px solid transparent",
                      boxShadow: isActive ? "0 2px 8px rgba(217,119,6,0.12), 0 1px 0 rgba(255,255,255,0.8) inset" : "none",
                    }}
                  >
                    <n.icon
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: isActive ? "#d97706" : "#a8a29e" }}
                    />
                    <span style={{
                      fontFamily: isActive ? "Rubik, Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" : "Inter, system-ui, sans-serif",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 11.5,
                      letterSpacing: isActive ? "0.06em" : "normal",
                      whiteSpace: "nowrap",
                    }}>
                      {n.label}
                    </span>
                  </motion.div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: HUD stats */}
          <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
            <StatPill icon={<Flame className="w-3.5 h-3.5" style={{ color: "#ea580c" }} />} value={user.streak} label="ngày" color="#ea580c" />
            <StatPill icon={<Gem className="w-3.5 h-3.5" style={{ color: "#0ea5e9" }} />} value={user.gems} color="#0ea5e9" />

            {/* VIP PRO Badge */}
            {isPremium && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#FFC800] to-[#FF9600] text-white shadow-[0_2px_8px_rgba(255,200,0,0.4)]">
                <Crown size={12} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-wider">PRO</span>
              </div>
            )}

            {/* Hearts — clickable upsell */}
            <div className="relative">
              <button
                onClick={() => { if (!isPremium) setHeartsTooltip(v => !v); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: isPremium ? "linear-gradient(135deg, #FFC800, #FF9600)" : (hearts <= 1 ? "rgba(244,63,94,0.12)" : "rgba(255,253,245,0.85)"),
                  border: isPremium ? "none" : (hearts <= 1 ? "1px solid rgba(244,63,94,0.35)" : "1px solid rgba(240,180,41,0.18)"),
                  boxShadow: isPremium ? "0 4px 12px rgba(255,150,0,0.3)" : "0 1px 4px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.8) inset",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Heart className="w-3.5 h-3.5 fill-current" style={{ color: isPremium ? "#FFF" : "#f43f5e" }} />
                <div className="flex items-center gap-1">
                  <span style={{ color: isPremium ? "#FFF" : "#f43f5e", fontWeight: 900, fontSize: 13, fontFamily: '"Nunito", sans-serif' }}>
                    {isPremium ? "Infinity" : hearts}
                  </span>
                  {!isPremium && !isFull && (
                    <span className="text-[#f43f5e] font-black text-[11px] bg-red-100 px-1.5 py-0.5 rounded-md">
                      {formatTime(timeLeft)}
                    </span>
                  )}
                </div>
              </button>

              {/* Tooltip upsell */}
              <AnimatePresence>
                {heartsTooltip && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 4 }}
                    className="absolute top-full right-0 mt-2 w-56 rounded-2xl p-4 z-50"
                    style={{
                      background: "linear-gradient(145deg, #1c0d00, #120800)",
                      border: "1px solid rgba(240,180,41,0.3)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    }}
                  >
                    {!isPremium && !isFull ? (
                      <div className="mb-3">
                        <div className="flex justify-between items-center text-xs text-[#c4a882] font-bold mb-1">
                          <span>Đang hồi tim...</span>
                          <span className="text-[#FFC800]">{formatTime(timeLeft)}</span>
                        </div>
                        <div className="w-full bg-[#3a2818] rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-[#FFC800] h-full transition-all duration-1000 ease-linear"
                            style={{ width: `${100 - (timeLeft / (5 * 60)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-[#58CC02] text-xs font-bold mb-3 text-center">Tim của bạn đã đầy!</p>
                    )}

                    <p style={{ color: "#c4a882", fontSize: 11, fontFamily: '"Inter", sans-serif', marginBottom: 8, lineHeight: 1.5, textAlign: "center" }}>
                      💡 Lên Pro để học không bao giờ lo hết tim!
                    </p>
                    <button
                      onClick={() => { setHeartsTooltip(false); nav("/premium"); }}
                      className="w-full py-2 rounded-xl text-center"
                      style={{ background: "linear-gradient(135deg, #d97706, #f0b429)", color: "#1c0800", fontSize: 11, fontWeight: 700, fontFamily: '"Cinzel", serif' }}
                    >
                      Tìm hiểu về Pro →
                    </button>
                    <button onClick={() => setHeartsTooltip(false)} className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center" style={{ color: "#4a3820" }}>
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="hidden sm:block">
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:brightness-110 transition-all"
                style={{
                  background: "#4a3820",
                  border: "1px solid rgba(240,180,41,0.2)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2) inset",
                }}
                onClick={() => playPop()}
              >
                <div className="flex items-center gap-1 mr-1">
                  {[...Array(5)].map((_, i) => {
                    // Mock progress logic for UI presentation
                    const progress = 0; 
                    const isFilled = i < progress;
                    return (
                      <div 
                        key={i} 
                        className="w-2.5 h-2.5 rounded-full transition-colors duration-300" 
                        style={{ 
                          background: isFilled ? "#FFC800" : "rgba(255,255,255,0.15)",
                          boxShadow: isFilled ? "0 0 6px rgba(255,200,0,0.6)" : "none"
                        }} 
                      />
                    );
                  })}
                </div>
                <span style={{ color: "#FFC800", fontWeight: 800, fontSize: 13, fontFamily: '"Inter", sans-serif' }}>
                  0/5
                </span>
                <div className="flex items-center gap-0.5 text-[#FFC800]">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span style={{ fontWeight: 800, fontSize: 12, fontFamily: '"Inter", sans-serif' }}>XP</span>
                </div>
              </div>
            </div>

            <div className="w-px h-5 hidden lg:block mx-1" style={{ background: "rgba(240,180,41,0.3)" }} />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => nav("/login")}
              className="hidden lg:flex p-2 rounded-xl transition"
              style={{
                color: "#a8a29e",
                background: "rgba(240,180,41,0.08)",
                border: "1px solid rgba(240,180,41,0.15)",
              }}
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 rounded-xl"
              style={{
                color: "#92400e",
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                border: "1px solid rgba(240,180,41,0.4)",
                boxShadow: "0 2px 8px rgba(217,119,6,0.15)",
              }}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden sticky top-16 z-20 overflow-hidden"
            style={{
              background: "rgba(250,245,232,0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(240,180,41,0.25)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <div className="px-4 pt-3 pb-2 grid grid-cols-3 gap-2">
              {NAV.map((n, idx) => {
                const isActive = location.pathname === n.to;
                return (
                  <NavLink key={n.to} to={n.to} onClick={() => { setMenuOpen(false); playClick(); }}>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl transition-all"
                      style={{
                        background: isActive
                          ? "linear-gradient(145deg, #fef3c7, rgba(254,230,138,0.7))"
                          : "rgba(255,255,255,0.5)",
                        border: `1.5px solid ${isActive ? "rgba(240,180,41,0.4)" : "rgba(240,180,41,0.1)"}`,
                        boxShadow: isActive ? "0 2px 12px rgba(217,119,6,0.12)" : "none",
                      }}
                    >
                      <n.icon
                        className="w-5 h-5"
                        style={{ color: isActive ? "#d97706" : "#a8a29e" }}
                      />
                      <span style={{
                        color: isActive ? "#92400e" : "#78716c",
                        fontSize: 10.5,
                        fontFamily: isActive ? "Rubik, Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" : "Inter, system-ui, sans-serif",
                        fontWeight: isActive ? 700 : 500,
                        textAlign: "center",
                      }}>
                        {n.label}
                      </span>
                    </motion.div>
                  </NavLink>
                );
              })}
            </div>

            {/* User row */}
            <div
              className="mx-4 mb-4 px-4 py-3 rounded-2xl flex items-center justify-between gap-3"
              style={{
                background: "linear-gradient(135deg, rgba(255,251,235,0.9), rgba(255,243,196,0.7))",
                border: "1px solid rgba(240,180,41,0.25)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                  style={{
                    background: "radial-gradient(circle at 38% 32%, rgba(240,180,41,0.2) 0%, #fef3c7 65%)",
                    border: "2px solid rgba(217,119,6,0.4)",
                    boxShadow: "0 0 12px rgba(217,119,6,0.2)",
                  }}
                >
                  {userMascot ? <img src={userMascot.img} alt="Mascot" className="w-8 h-8 object-contain" /> : "🦊"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p style={{ color: "#1c1917", fontSize: 13, fontWeight: 700, fontFamily: "Rubik, Inter, system-ui, -apple-system, 'Segoe UI', sans-serif", lineHeight: 1.2 }}>
                      {user.name || "Chiến Binh"}
                    </p>
                    {isPremium && (
                      <span className="px-1.5 py-0.5 rounded-md flex items-center gap-0.5" style={{ background: "linear-gradient(135deg, #d97706, #f0b429)", fontSize: 8, color: "#1c0800", fontWeight: 800 }}>
                        <Crown style={{ width: 8, height: 8 }} />
                        PRO
                      </span>
                    )}
                  </div>
                  <p style={{ color: "#d97706", fontSize: 11, marginTop: 2 }}>
                    ⚡ {user.xp} XP · 🔥 {user.streak} ngày
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { playClick(); toggleSound(); }}
                  className="flex items-center justify-center w-8 h-8 rounded-xl"
                  style={{ color: isSoundEnabled ? "#d97706" : "#a8a29e", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(240,180,41,0.2)" }}
                >
                  {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                {!isPremium && (
                  <button
                    onClick={() => { playClick(); setMenuOpen(false); nav("/premium"); }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
                    style={{ background: "linear-gradient(135deg, #d97706, #f0b429)", color: "#1c0800", fontSize: 10, fontWeight: 800, fontFamily: '"Cinzel", serif' }}
                  >
                    <Crown className="w-3 h-3" />
                    Pro
                  </button>
                )}
                <button
                  onClick={() => { playClick(); nav("/login"); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                  style={{ color: "#78716c", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(240,180,41,0.2)", fontSize: 12 }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Thoát</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <main className="pb-24 lg:pb-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* ── Mobile bottom nav — premium ── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30"
        style={{
          background: "rgba(250,245,232,0.94)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          borderTop: "1px solid rgba(240,180,41,0.2)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.1), 0 -1px 0 rgba(255,255,255,0.8)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex">
          {NAV.slice(0, 5).map((n) => (
            <NavLink key={n.to} to={n.to} className="flex-1">
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="flex flex-col items-center gap-1 py-3 relative"
                >
                  {/* Active indicator pill */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute top-1.5 rounded-full"
                      style={{
                        width: 32,
                        height: 3,
                        background: "linear-gradient(to right, #d97706, #f0b429)",
                        boxShadow: "0 0 8px rgba(240,180,41,0.5)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: isActive ? "linear-gradient(135deg, rgba(255,243,196,0.9), rgba(254,230,138,0.6))" : "transparent",
                      boxShadow: isActive ? "0 2px 8px rgba(217,119,6,0.15)" : "none",
                    }}
                  >
                    <n.icon
                      className="w-4.5 h-4.5"
                      style={{
                        color: isActive ? "#d97706" : "#a8a29e",
                        width: 18,
                        height: 18,
                        transition: "color 0.2s",
                      }}
                    />
                  </div>
                  <span style={{
                    color: isActive ? "#92400e" : "#a8a29e",
                    fontSize: 9.5,
                    fontFamily: isActive ? "Rubik, Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" : "Inter, system-ui, sans-serif",
                    fontWeight: isActive ? 700 : 400,
                    lineHeight: 1,
                    letterSpacing: isActive ? "0.04em" : "normal",
                  }}>
                    {n.label.split(" ")[0]}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Global Animated Mascot */}
      <AnimatedMascot />
    </div>
  );
}

function StatPill({ icon, value, label, color }: { icon: React.ReactNode; value: number; label?: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        background: "rgba(255,253,245,0.85)",
        border: "1px solid rgba(240,180,41,0.18)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.8) inset",
        backdropFilter: "blur(8px)",
      }}
    >
      {icon}
      <span style={{ color, fontWeight: 700, fontSize: 12.5, fontFamily: '"Inter", sans-serif', letterSpacing: "-0.01em" }}>
        {value.toLocaleString()}{label ? ` ${label}` : ""}
      </span>
    </div>
  );
}
