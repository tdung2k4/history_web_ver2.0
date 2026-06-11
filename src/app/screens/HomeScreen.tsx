import { useNavigate } from "react-router";
import { UNITS, useApp, MASCOTS } from "../store";
import { motion, AnimatePresence } from "motion/react";
import { Lock, CheckCircle2, Flame, Crown, Scroll, BookOpen, ChevronRight, Zap, Star } from "lucide-react";
import { useAppSound } from "../hooks/useAppSound";

const ZIGZAG = [0, 72, 0, -72, 0, 72, 0, -72, 0, 72];

const RECENT_UNLOCKS = [
  { id: "r1", title: "Trống Đồng Đông Sơn", era: "2879 TCN", icon: "🥁", unitId: "u1" },
  { id: "r2", title: "Thành Cổ Loa", era: "257 TCN", icon: "🏯", unitId: "u1" },
  { id: "r3", title: "Trận Bạch Đằng", era: "938 SCN", icon: "⚓", unitId: "u2" },
];

// Warm historical backgrounds - light & cinematic
const UNIT_WARM_BG: Record<string, { from: string; to: string; path: string; accent: string }> = {
  u1: {
    from: "#4a2c0a",
    to: "#2d1400",
    path: "linear-gradient(160deg, #f9f0de 0%, #f0e6cc 40%, #e8d9b8 100%)",
    accent: "#c07a1a",
  },
  u2: {
    from: "#5c1a1a",
    to: "#3b0e0e",
    path: "linear-gradient(160deg, #fdf0ec 0%, #f5ddd8 40%, #ead0c8 100%)",
    accent: "#c0392b",
  },
  u3: {
    from: "#1a3d2e",
    to: "#0d2418",
    path: "linear-gradient(160deg, #eef8f2 0%, #d8f0e4 40%, #c5e8d6 100%)",
    accent: "#1a7a50",
  },
  u4: {
    from: "#1a2050",
    to: "#0d1230",
    path: "linear-gradient(160deg, #eef0fc 0%, #d8dcf8 40%, #c8cef0 100%)",
    accent: "#2a3aab",
  },
};

export default function HomeScreen() {
  const { user } = useApp();
  const nav = useNavigate();
  const playClick = useAppSound("click");
  const userMascot = MASCOTS.find(m => m.id === user.mascotId) || MASCOTS[0];

  const activeUnitIdx = (() => {
    for (let i = 0; i < UNITS.length; i++) {
      const prevDone = i === 0 || UNITS[i - 1].lessons.every(l => user.completedLessons.includes(l.id));
      if (prevDone && !UNITS[i].lessons.every(l => user.completedLessons.includes(l.id))) return i;
    }
    return UNITS.length - 1;
  })();

  const activeUnit = UNITS[activeUnitIdx];
  const completedInActive = activeUnit.lessons.filter(l => user.completedLessons.includes(l.id)).length;
  const nextLesson = activeUnit.lessons.find(l => !user.completedLessons.includes(l.id));
  const upcomingUnit = UNITS[activeUnitIdx + 1];
  const getLessonPath = (lesson: typeof UNITS[0]["lessons"][0]) =>
    lesson.type === "story" ? `/story/${lesson.id}` : `/lesson/${lesson.id}`;

  return (
    <div
      className="pb-28 lg:pb-10"
      style={{ background: "linear-gradient(180deg, #fdf8ef 0%, #f7f0e2 50%, #f2e8d5 100%)", minHeight: "100vh" }}
    >



      {/* ══════════════════════════════════════════
          HERO — Compact banner, focus trên bản đồ
      ══════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{ minHeight: 200, maxHeight: 220 }}
      >
        {/* Warm layered background */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${activeUnit.bgFrom} 0%, ${activeUnit.bgTo} 100%)` }} />
        {/* Warm amber vignette instead of cold black */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(80,40,0,0.1) 0%, rgba(40,18,0,0.55) 100%)" }} />
        {/* Warm sepia grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            opacity: 0.4,
          }}
        />
        {/* Warm gold ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 25% 55%, rgba(255,200,80,0.12) 0%, transparent 65%)" }} />
        {/* Parchment-like top edge */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,210,100,0.5), transparent)" }} />

        {/* Content — compact layout */}
        <div className="relative z-10 px-5 lg:px-10 py-5 max-w-3xl flex flex-col justify-center" style={{ minHeight: 200 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>

            {/* Chapter badge — Duolingo pill style */}
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,200,60,0.2)",
                  border: "2px solid rgba(255,200,60,0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Star className="w-3 h-3" style={{ color: "#fbbf24", fill: "#fbbf24" }} />
                <span style={{
                  color: "#fde68a",
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: "0.05em",
                }}>
                  Chương {activeUnitIdx + 1}
                </span>
              </motion.div>
              <span style={{ color: "rgba(220,190,140,0.65)", fontSize: 11, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
                {activeUnit.era}
              </span>
            </div>

            {/* Hero title — Nunito playful, NO uppercase transform */}
            <h1
              className="mb-1"
              style={{
                fontFamily: '"Nunito", sans-serif',
                color: "#fff8ec",
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: 900,
                lineHeight: 1.2,
                textShadow: "0 2px 16px rgba(0,0,0,0.7)",
                letterSpacing: "-0.01em",
              }}
            >
              {activeUnit.title}
            </h1>
            <p className="mb-4" style={{
              color: "#c8a878",
              fontSize: 12,
              lineHeight: 1.5,
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 500,
              maxWidth: 260,
            }}>
              {activeUnit.description}
            </p>

            {/* Progress + CTA — compact row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Progress pill */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(30,15,0,0.45)",
                  border: "1.5px solid rgba(255,200,80,0.3)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex gap-1">
                  {activeUnit.lessons.map((l) => (
                    <div
                      key={l.id}
                      className="rounded-full transition-all"
                      style={{
                        width: 7,
                        height: 7,
                        background: user.completedLessons.includes(l.id)
                          ? "#fbbf24"
                          : "rgba(255,255,255,0.15)",
                        boxShadow: user.completedLessons.includes(l.id) ? "0 0 5px rgba(251,191,36,0.7)" : "none",
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: "#fdd580", fontSize: 11, fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
                  {completedInActive}/{activeUnit.lessons.length}
                </span>
                <Zap className="w-3 h-3" style={{ color: "#f0a020" }} />
                <span style={{ color: "#c8a070", fontSize: 10, fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}>XP</span>
              </div>

              {/* CTA button — Duolingo 3D style */}
              {nextLesson && (
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 8px 0 #7c2d0a, 0 0 24px rgba(255,180,40,0.4)" }}
                  whileTap={{ y: 4, boxShadow: "0 2px 0 #7c2d0a" }}
                  onClick={() => { playClick(); nav(getLessonPath(nextLesson)); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #f5b830)",
                    boxShadow: "0 5px 0 #7c2d0a",
                    color: "#1c0800",
                    fontFamily: '"Nunito", sans-serif',
                    fontWeight: 900,
                    fontSize: 13,
                    letterSpacing: "0.02em",
                  }}
                >
                  <Flame className="w-4 h-4" />
                  {completedInActive === 0 ? "Bắt đầu thôi! ⚔️" : "Tiếp tục nào! ⚡"}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #fdf8ef)" }}
        />
      </div>

      {/* ══════════════════════════════════════════
          DAILY CHALLENGE — Quest board strip
      ══════════════════════════════════════════ */}
      <div className="px-4 lg:px-12 py-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3 p-3.5 rounded-2xl max-w-4xl mx-auto"
          style={{
            background: "linear-gradient(135deg, rgba(255,248,230,0.97), rgba(254,240,200,0.9))",
            border: "2px solid rgba(251,191,36,0.35)",
            borderLeft: "4px solid #f59e0b",
            boxShadow: "0 3px 12px rgba(180,100,0,0.1)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0"
            style={{
              background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              boxShadow: "0 3px 8px rgba(180,100,0,0.2), 0 3px 0 #d97706",
            }}
          >
            ⚡
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="mb-0.5" style={{
              color: "#b45309",
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: "0.05em",
            }}>
              🎯 Thử thách hôm nay
            </p>
            <p style={{ color: "#78716c", fontSize: 12, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
              Hoàn thành 1 bài học · Giữ chuỗi ngày! 🔥
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl" style={{ background: "rgba(234,88,12,0.1)", border: "2px solid rgba(234,88,12,0.2)" }}>
            <Flame className="w-4 h-4" style={{ color: "#ea580c" }} />
            <span style={{ color: "#ea580c", fontWeight: 900, fontSize: 20, fontFamily: '"Nunito", sans-serif', lineHeight: 1 }}>{user.streak}</span>
            <span style={{ color: "#a8a29e", fontSize: 9, fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}>ngày</span>
          </div>
        </motion.div>

        {/* Quick Menu cho Học sinh lớn */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 max-w-4xl mx-auto mt-4"
        >
          <button onClick={() => { playClick(); nav("/store"); }} className="bg-blue-50 border-2 border-blue-200 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors shadow-[0_4px_0_#bfdbfe] hover:translate-y-1 hover:shadow-[0_0px_0_#bfdbfe]">
            <span className="text-2xl">🏪</span>
            <span className="text-blue-600 font-black text-xs uppercase tracking-wide">Cửa Hàng</span>
          </button>
          <button onClick={() => { playClick(); nav("/pvp"); }} className="bg-red-50 border-2 border-red-200 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-red-100 transition-colors shadow-[0_4px_0_#fecaca] hover:translate-y-1 hover:shadow-[0_0px_0_#fecaca]">
            <span className="text-2xl">⚔️</span>
            <span className="text-red-600 font-black text-xs uppercase tracking-wide">Đấu Trường</span>
          </button>
          <button onClick={() => { playClick(); nav("/flashcard"); }} className="bg-green-50 border-2 border-green-200 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-green-100 transition-colors shadow-[0_4px_0_#bbf7d0] hover:translate-y-1 hover:shadow-[0_0px_0_#bbf7d0]">
            <span className="text-2xl">🗂️</span>
            <span className="text-green-600 font-black text-xs uppercase tracking-wide">Luyện Thi</span>
          </button>
        </motion.div>

      </div>

      {/* ══════════════════════════════════════════
          RECENTLY UNLOCKED
      ══════════════════════════════════════════ */}
      {user.completedLessons.length > 0 && (
        <div className="py-3">
          <div className="px-4 lg:px-10 mb-3 max-w-4xl mx-auto flex items-center justify-between">
            <p style={{
              color: "#92400e",
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 900,
              fontSize: 14,
            }}>🏅 Vừa mở khóa</p>
            <button className="flex items-center gap-1" style={{ color: "#b45309", fontSize: 12, fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}>
              Xem tất cả <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-3 px-4 lg:px-12 overflow-x-auto pb-2 scrollbar-hide">
            {RECENT_UNLOCKS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  width: 134,
                  border: "1px solid rgba(200,160,80,0.3)",
                  background: "linear-gradient(160deg, rgba(255,252,242,0.98), rgba(250,242,220,0.95))",
                  boxShadow: "0 2px 12px rgba(150,90,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
                }}
                whileHover={{ y: -4, boxShadow: "0 8px 28px rgba(180,100,0,0.18)" }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: 72,
                    background: "linear-gradient(155deg, #6b3a1f, #4a2410)",
                    fontSize: 38,
                  }}
                >
                  {item.icon}
                </div>
                <div className="p-3">
                  <p style={{ color: "#92400e", fontSize: 11, fontWeight: 800, lineHeight: 1.35, fontFamily: '"Nunito", sans-serif' }}>{item.title}</p>
                  <p style={{ color: "#b8a898", fontSize: 10, marginTop: 2, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>{item.era}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          CAMPAIGN MAP — All chapters
      ══════════════════════════════════════════ */}
      <div className="px-4 lg:px-10 pt-4 pb-2 max-w-4xl mx-auto flex items-center gap-3">
        <span style={{ fontSize: 20 }}>🗺️</span>
        <p style={{
          color: "#92400e",
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: 16,
          letterSpacing: "-0.01em",
        }}>Bản đồ chiến dịch</p>
        <div style={{ flex: 1, height: 2, background: "linear-gradient(to right, rgba(180,100,0,0.2), transparent)", borderRadius: 99 }} />
      </div>

      <div className="px-4 lg:px-12 max-w-4xl mx-auto space-y-5 pb-4">
        {UNITS.map((unit, ui) => {
          const prevDone = ui === 0 || UNITS[ui - 1].lessons.every(l => user.completedLessons.includes(l.id));
          const unitLocked = !prevDone;
          const completedIn = unit.lessons.filter(l => user.completedLessons.includes(l.id)).length;
          const pct = Math.round((completedIn / unit.lessons.length) * 100);
          const isActive = ui === activeUnitIdx;
          const warmBg = UNIT_WARM_BG[unit.id] || UNIT_WARM_BG.u1;

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + ui * 0.1, type: "spring", stiffness: 220, damping: 24 }}
              className="rounded-3xl overflow-hidden"
              style={{
                border: `1.5px solid ${isActive ? "rgba(212,140,40,0.55)" : unitLocked ? "rgba(220,210,195,0.8)" : "rgba(210,200,180,0.6)"}`,
                boxShadow: isActive
                  ? "0 8px 40px rgba(180,100,0,0.16), 0 2px 8px rgba(0,0,0,0.06)"
                  : "0 2px 12px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.7) inset",
              }}
            >
              {/* Chapter header */}
              <div
                className="relative overflow-hidden"
                style={{ background: `linear-gradient(145deg, ${unit.bgFrom} 0%, ${unit.bgTo} 100%)`, minHeight: unitLocked ? 80 : 114 }}
              >
                {/* Warm grain */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(255,200,80,0.08) 0%, transparent 70%)" }} />
                {/* Background art */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2 select-none pointer-events-none" style={{ fontSize: 60, opacity: 0.14 }}>
                  {unit.artEmoji}
                </div>

                <div className="relative z-10 px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{
                        color: "#fde68a",
                        fontFamily: '"Nunito", sans-serif',
                        fontWeight: 800,
                        fontSize: 11,
                      }}>
                        ✦ Chương {ui + 1}
                      </span>
                      {unitLocked && <span style={{ fontSize: 11 }}>🔒</span>}
                      {pct === 100 && (
                        <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(22,163,74,0.2)", color: "#4ade80", fontSize: 10, fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>✓ Xong</span>
                      )}
                      {isActive && !unitLocked && pct < 100 && (
                        <motion.span
                          animate={{ opacity: [1, 0.35, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(217,119,6,0.28)", color: "#fdd580", fontSize: 10, fontWeight: 600, fontFamily: '"Nunito", sans-serif' }}
                        >
                          ● Đang học
                        </motion.span>
                      )}
                    </div>
                    <h2 style={{
                      fontFamily: '"Nunito", sans-serif',
                      color: unitLocked ? "#7a6850" : "#fff8ec",
                      fontSize: "clamp(14px, 2.5vw, 18px)",
                      fontWeight: 900,
                      lineHeight: 1.2,
                      letterSpacing: "-0.01em",
                    }}>
                      {unit.title}
                    </h2>
                    {!unitLocked && (
                      <p style={{ color: "#b09070", fontSize: 11, marginTop: 3, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>{unit.era}</p>
                    )}
                  </div>

                  {!unitLocked && (
                    <div
                      className="shrink-0 px-3.5 py-2.5 rounded-xl text-center"
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,200,80,0.25)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div style={{ color: "#fdd580", fontWeight: 800, fontSize: 16, fontFamily: '"Nunito", sans-serif' }}>{completedIn}</div>
                      <div style={{ color: "#8a7060", fontSize: 9, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>/ {unit.lessons.length}</div>
                      <div style={{ color: "#907868", fontSize: 8.5, fontFamily: '"Nunito", sans-serif', fontWeight: 700, marginTop: 1 }}>BÀI HỌC</div>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {!unitLocked && (
                  <div className="px-5 pb-4 relative z-10">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(to right, #d97706, #fbbf24)", boxShadow: "0 0 8px rgba(251,191,36,0.5)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, delay: 0.3 + ui * 0.08 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Path section — Seamless Vertical Map */}
              {!unitLocked && (
                <div 
                  className="pt-4 pb-0 relative w-full overflow-hidden flex justify-center"
                  style={{ background: "#ebd2a9" }}
                >
                  <UnitPath
                    unit={unit}
                    completedLessons={user.completedLessons}
                    warmAccent={warmBg.accent}
                    onNavigate={(id) => {
                      playClick();
                      const l = unit.lessons.find(x => x.id === id);
                      if (l) nav(getLessonPath(l));
                    }}
                  />
                </div>
              )}

              {/* Locked placeholder */}
              {unitLocked && (
                <div className="px-5 py-4 flex items-center gap-3.5" style={{ background: "rgba(240,234,218,0.7)" }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(220,212,198,0.8)", border: "1px solid rgba(200,190,170,0.6)" }}
                  >
                    <Lock className="w-4 h-4" style={{ color: "#a8a29e" }} />
                  </div>
                  <div>
                    <p style={{ color: "#9a8878", fontSize: 12, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>Hoàn thành chương trước để mở khóa</p>
                    <p style={{ color: "#c4b9ad", fontSize: 11, marginTop: 2, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>{unit.era}</p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════
          UPCOMING — Teaser for what's next
      ══════════════════════════════════════════ */}
      {upcomingUnit && (
        <div className="px-4 lg:px-12 pt-6 pb-4 max-w-4xl mx-auto">
          <p style={{ color: "#92400e", fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Sắp Tới</p>
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(248,244,232,0.9), rgba(242,234,216,0.8))",
              border: "1.5px dashed rgba(185,160,110,0.45)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: "rgba(220,210,190,0.7)", border: "1px solid rgba(190,175,145,0.5)" }}
            >
              {upcomingUnit.artEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: "#b09878", fontSize: 11, marginBottom: 3, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>Chương tiếp theo</p>
              <p style={{ color: "#78614a", fontSize: 14, fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>{upcomingUnit.title}</p>
              <p style={{ color: "#c4b9ad", fontSize: 11, marginTop: 2, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>{upcomingUnit.era}</p>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: "rgba(210,198,178,0.5)", border: "1px solid rgba(190,178,155,0.4)" }}>
              <Lock className="w-3.5 h-3.5" style={{ color: "#a8a29e" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type UnitType = typeof UNITS[0];

// ─── Whimsical Decoration data ──────────────────────────────────────────────────────────
const DECORATIONS = [
  { img: "/assets/cartoon_house.png", side: "left",  offsetX: -90, offsetY: -30, scale: 1.1, isBig: true },
  { img: "/assets/round_bush.png", side: "right", offsetX:  70, offsetY:  20, scale: 0.8, isBig: false },
  { img: "/assets/swirly_tree.png", side: "right", offsetX:  85, offsetY: -20, scale: 1.2, isBig: true },
  { img: "/assets/cartoon_drum.png", side: "left",  offsetX: -85, offsetY:  10, scale: 1.0, isBig: false },
  { img: "/assets/swirly_tree.png", side: "left",  offsetX: -80, offsetY:  50, scale: 1.1, isBig: true },
  { img: "/assets/cartoon_house.png", side: "right", offsetX:  80, offsetY: -40, scale: 1.05, isBig: true },
  { img: "/assets/round_bush.png", side: "left",  offsetX: -75, offsetY: -10, scale: 0.9, isBig: false },
  { img: "/assets/cartoon_drum.png", side: "right", offsetX:  65, offsetY:  35, scale: 1.1, isBig: false },
  { img: "/assets/swirly_tree.png", side: "left",  offsetX: -70, offsetY:  25, scale: 1.0, isBig: true },
  { img: "/assets/round_bush.png", side: "right", offsetX:  75, offsetY: -15, scale: 1.0, isBig: false },
] as const;

// ─── UnitPath ─────────────────────────────────────────────────────────────────
function UnitPath({ unit, completedLessons, warmAccent, onNavigate }: {
  unit: UnitType;
  completedLessons: string[];
  warmAccent: string;
  onNavigate: (id: string) => void;
}) {
  const lessons = unit.lessons;

  // Percentage coordinates for the path (bottom to top)
  const NODE_POSITIONS = [
    { top: 85, left: 60 },
    { top: 72, left: 80 },
    { top: 60, left: 55 },
    { top: 48, left: 30 },
    { top: 36, left: 45 },
    { top: 25, left: 65 },
    { top: 15, left: 35 },
    { top: 8,  left: 20 },
    { top: 4,  left: 50 },
    { top: 2,  left: 70 },
  ];

  const nodes = lessons.map((lesson, i) => {
    const isDone    = completedLessons.includes(lesson.id);
    const prevDone  = i === 0 || completedLessons.includes(lessons[i - 1].id);
    const isLocked  = !prevDone;
    const isCurrent = !isDone && !isLocked;
    const isBoss    = lesson.type === "boss";
    const size = isBoss ? 96 : isCurrent ? 88 : 72;
    const pos = NODE_POSITIONS[i % NODE_POSITIONS.length];
    
    return { lesson, isDone, isLocked, isCurrent, isBoss, size, pos };
  });

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto" 
      style={{ aspectRatio: "1/1", minHeight: 600 }}
    >
      {/* ── Seamless Painted Map Background ──────────────────────────────── */}
      <div 
        className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
        style={{ 
          backgroundImage: "url('/assets/map_bg_original.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "inset 0 10px 30px rgba(0,0,0,0.05)",
          border: "2px solid rgba(255,255,255,0.2)"
        }}
      />

      {/* ── Lesson nodes overlay ───────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {nodes.map((node, idx) => (
          <LessonNode
            key={node.lesson.id}
            node={node}
            accent={unit.accent}
            warmAccent={warmAccent}
            delay={idx * 0.06}
            onClick={() => !node.isLocked && onNavigate(node.lesson.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── LessonNode ───────────────────────────────────────────────────────────────
function LessonNode({ node, accent, warmAccent, delay, onClick }: {
  node: {
    lesson: UnitType["lessons"][0];
    isDone: boolean;
    isLocked: boolean;
    isCurrent: boolean;
    isBoss: boolean;
    size: number;
    pos: { top: number, left: number };
  };
  accent: string;
  warmAccent: string;
  delay: number;
  onClick: () => void;
}) {
  const { lesson, isDone, isLocked, isCurrent, isBoss, size, pos } = node;

  // 3D bubble backgrounds (Design Spec)
  const nodeBg = isLocked
    ? "linear-gradient(180deg, #f3f4f6 0%, #d1d5db 100%)" // Xám sáng giống mây
    : isBoss
    ? "radial-gradient(circle at 35% 28%, #fde68a 0%, #f59e0b 35%, #dc2626 75%, #991b1b 100%)"
    : isCurrent
    ? "radial-gradient(circle at 35% 28%, #fde68a 0%, #f59e0b 45%, #d97706 80%, #b45309 100%)"
    : isDone
    ? "radial-gradient(circle at 38% 28%, #6ee7b7 0%, #10b981 50%, #059669 80%, #065f46 100%)"
    : `radial-gradient(circle at 38% 28%, rgba(255,255,255,0.2) 0%, ${accent} 60%)`;

  const nodeBorder = isLocked
    ? "2px solid #ffffff" // Viền trắng nổi bật
    : isBoss
    ? "3px solid rgba(255,220,80,0.9)"
    : isCurrent
    ? "3px solid rgba(255,220,80,0.9)"
    : isDone
    ? "2.5px solid rgba(52,211,153,0.7)"
    : "2px solid rgba(255,210,100,0.7)";

  const nodeShadow = isLocked
    ? "0 6px 0 #9ca3af, 0 8px 15px rgba(0,0,0,0.15)" // Bóng xám đậm
    : isBoss
    ? "0 8px 0 #7f1d1d, 0 0 40px rgba(239,68,68,0.5)"
    : isCurrent
    ? "0 7px 0 #7c2d12, 0 0 0 6px rgba(251,191,36,0.25), 0 0 32px rgba(251,191,36,0.55)"
    : isDone
    ? "0 5px 0 #047857, 0 8px 20px rgba(5,150,105,0.35)"
    : `0 5px 0 rgba(0,0,0,0.3)`;

  const iconColor = isLocked
    ? "#ffffff" // Icon khóa màu trắng
    : isBoss
    ? "#fef3c7"
    : isCurrent
    ? "#7c2d12"
    : isDone
    ? "#d1fae5"
    : "#fffbeb";

  const labelColor = isLocked
    ? "rgba(150,150,150,0.8)"
    : isCurrent
    ? "#fde68a"
    : isDone
    ? "#6ee7b7"
    : "rgba(220,210,190,0.85)";

  const Icon = isBoss
    ? Crown
    : lesson.type === "story"
    ? Scroll
    : BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
      className="absolute flex flex-col items-center"
      style={{ 
        left: `calc(${pos.left}% - ${size / 2}px)`, 
        top: `calc(${pos.top}% - ${size / 2}px)`, 
        zIndex: 2,
        pointerEvents: "auto"
      }}
    >
      {/* ── Floating START label ──────────────────────────── */}
      <AnimatePresence>
        {isCurrent && (
          <motion.div
            className="absolute flex flex-col items-center"
            style={{
              top: -54,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              pointerEvents: "none",
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="px-3 py-1.5 rounded-lg whitespace-nowrap"
              style={{
                background: "#1b4332",
                border: "1.5px solid rgba(251,191,36,0.8)",
                color: "#fde68a",
                fontFamily: '"Nunito", sans-serif',
                fontSize: 10,
                fontWeight: 800,
                boxShadow: "0 0 16px rgba(251,191,36,0.4)",
                letterSpacing: "0.06em",
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              {isBoss ? "⚔️ Thử thách" : "▶ Bắt đầu"}
            </motion.div>
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "5px solid rgba(251,191,36,0.8)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Outer glow / pulse ring ───────────────────────── */}
      {isCurrent && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size + 28,
            height: size + 28,
            left: -14,
            top: -14,
            border: "3px solid rgba(251,191,36,0.5)",
          }}
          animate={{ opacity: [0.6, 0.05, 0.6], scale: [1, 1.22, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {isBoss && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size + 28,
            height: size + 28,
            left: -14,
            top: -14,
            border: "3px solid rgba(239,68,68,0.5)",
          }}
          animate={{ opacity: [0.6, 0.05, 0.6], scale: [1, 1.18, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* ── 3D Bubble Node button ─────────────────────────── */}
      <motion.button
        whileHover={!isLocked ? { scale: 1.1, y: -4 } : {}}
        whileTap={!isLocked ? { scale: 0.93, y: 5 } : {}}
        onClick={onClick}
        disabled={isLocked}
        className="rounded-full flex items-center justify-center relative"
        style={{
          width: size,
          height: size,
          background: nodeBg,
          border: nodeBorder,
          boxShadow: nodeShadow,
          cursor: isLocked ? "not-allowed" : "pointer",
          flexShrink: 0,
        }}
      >
        {/* Inner specular highlight */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 0.55,
            height: size * 0.28,
            top: size * 0.1,
            left: size * 0.18,
            background: "rgba(255,255,255,0.28)",
            filter: "blur(3px)",
          }}
        />
        {isLocked ? (
          <Lock
            style={{ width: size * 0.36, height: size * 0.36, color: iconColor }}
          />
        ) : isDone ? (
          <CheckCircle2
            style={{ width: size * 0.44, height: size * 0.44, color: iconColor }}
          />
        ) : (
          <Icon
            style={{ width: size * 0.42, height: size * 0.42, color: iconColor }}
          />
        )}
      </motion.button>

      {/* Labels are hidden as requested by user */}
    </motion.div>
  );
}
