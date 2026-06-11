import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

const FLOATS = [
  { sym: "🏛️", x: 8, y: 12, size: 22, delay: 0 },
  { sym: "⚔️", x: 82, y: 8, size: 18, delay: 0.4 },
  { sym: "📜", x: 18, y: 68, size: 20, delay: 0.8 },
  { sym: "🗺️", x: 75, y: 70, size: 22, delay: 0.2 },
  { sym: "🎖️", x: 50, y: 6, size: 16, delay: 1.1 },
  { sym: "👑", x: 90, y: 42, size: 18, delay: 0.6 },
  { sym: "🛡️", x: 5, y: 40, size: 16, delay: 1.4 },
  { sym: "🥁", x: 38, y: 82, size: 20, delay: 0.3 },
  { sym: "📯", x: 62, y: 85, size: 16, delay: 1.0 },
  { sym: "⚡", x: 28, y: 15, size: 14, delay: 0.7 },
];

export default function SplashScreen() {
  const nav = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => nav("/login"), 3600);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{
        background: "linear-gradient(145deg, #1c0d00 0%, #150900 35%, #0a0600 65%, #060400 100%)",
      }}
    >
      {/* ── Layered ambient glows ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 75% 55% at 50% 46%, rgba(240,180,41,0.14) 0%, transparent 65%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 40% 30% at 30% 70%, rgba(180,83,9,0.08) 0%, transparent 55%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 30% 25% at 75% 25%, rgba(120,53,15,0.06) 0%, transparent 50%)" }}
      />

      {/* ── Grid pattern ── */}
      <div className="grid-overlay" />

      {/* ── Floating historical symbols ── */}
      {FLOATS.map((f, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0.05], y: [0, -18, 0] }}
          transition={{ duration: 5 + i * 0.4, repeat: Infinity, delay: f.delay, ease: "easeInOut" }}
          style={{
            fontSize: f.size,
            left: `${f.x}%`,
            top: `${f.y}%`,
            filter: "blur(0.4px)",
          }}
        >
          {f.sym}
        </motion.span>
      ))}

      {/* ── Decorative horizontal lines ── */}
      <motion.div
        className="absolute w-full pointer-events-none"
        style={{ top: "calc(50% - 60px)" }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.4, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="mx-8 lg:mx-24 h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(240,180,41,0.25) 20%, rgba(240,180,41,0.5) 50%, rgba(240,180,41,0.25) 80%, transparent)",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute w-full pointer-events-none"
        style={{ top: "calc(50% + 60px)" }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.55, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="mx-8 lg:mx-24 h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(240,180,41,0.15) 20%, rgba(240,180,41,0.3) 50%, rgba(240,180,41,0.15) 80%, transparent)",
          }}
        />
      </motion.div>

      {/* ── Core content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        {/* Logo medallion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 13, delay: 0.1 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(240,180,41,0.2), 0 0 60px rgba(240,180,41,0.06)",
                "0 0 40px rgba(240,180,41,0.45), 0 0 100px rgba(240,180,41,0.12)",
                "0 0 20px rgba(240,180,41,0.2), 0 0 60px rgba(240,180,41,0.06)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 h-28 rounded-full flex items-center justify-center text-6xl mx-auto relative"
            style={{
              background: "radial-gradient(circle at 38% 30%, rgba(240,180,41,0.3) 0%, rgba(25,12,0,0.97) 60%)",
              border: "1.5px solid rgba(240,180,41,0.55)",
            }}
          >
            🏛️
            {/* Inner ring */}
            <div
              className="absolute inset-2 rounded-full border pointer-events-none"
              style={{ borderColor: "rgba(240,180,41,0.15)" }}
            />
          </motion.div>
        </motion.div>

        {/* Corner ornaments */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center gap-4 mb-4"
        >
          <div style={{ color: "rgba(240,180,41,0.3)", fontSize: 14 }}>◆</div>
          <div style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, rgba(240,180,41,0.4))" }} />
          <div style={{ color: "rgba(196,168,130,0.6)", fontSize: 10, fontFamily: '"Cinzel", serif', letterSpacing: "0.3em" }}>
            HISTORY ALIVE
          </div>
          <div style={{ width: 60, height: 1, background: "linear-gradient(to left, transparent, rgba(240,180,41,0.4))" }} />
          <div style={{ color: "rgba(240,180,41,0.3)", fontSize: 14 }}>◆</div>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.8 }}
          style={{
            fontFamily: '"Cinzel Decorative", "Cinzel", serif',
            color: "#f0c878",
            fontSize: "clamp(24px, 5.5vw, 42px)",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textShadow: "0 0 30px rgba(240,180,41,0.4), 0 0 80px rgba(240,180,41,0.1)",
            lineHeight: 1.15,
            marginBottom: 12,
          }}
        >
          HISTORY
          <br />
          <span style={{ fontSize: "0.7em", letterSpacing: "0.35em", color: "#d4aa58" }}>ALIVE</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.58, duration: 0.8 }}
          style={{
            color: "#8a7055",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginBottom: 44,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
          }}
        >
          Sống trong lịch sử · Chinh phục thời gian
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-14 max-w-sm"
        >
          {[
            { icon: "⚔️", text: "Chiến dịch tương tác" },
            { icon: "📜", text: "Câu chuyện điện ảnh" },
            { icon: "🏆", text: "Hệ thống thành tựu" },
            { icon: "🔥", text: "Streak hàng ngày" },
          ].map(({ icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.07 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full"
              style={{
                background: "rgba(240,180,41,0.07)",
                border: "1px solid rgba(240,180,41,0.18)",
                color: "#9a8060",
                fontSize: 11,
                fontFamily: '"Inter", sans-serif',
                backdropFilter: "blur(8px)",
              }}
            >
              <span>{icon}</span>
              <span style={{ fontWeight: 500 }}>{text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Progress bar */}
          <div
            className="rounded-full overflow-hidden"
            style={{ width: 120, height: 2, background: "rgba(240,180,41,0.1)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #d97706, #f0b429)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.1, duration: 2.2, ease: "easeInOut" }}
            />
          </div>

          {/* Dots */}
          <div className="flex gap-2 items-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{ background: "#d97706", width: 5, height: 5 }}
                animate={{ opacity: [0.12, 1, 0.12], scale: [0.7, 1.3, 0.7] }}
                transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom tag */}
      <motion.p
        className="absolute bottom-8 tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.6, duration: 1 }}
        style={{ color: "#5a3820", fontSize: 9, letterSpacing: "0.26em", fontFamily: '"Inter", sans-serif' }}
      >
        Lịch Sử Việt Nam · Từ Nguồn Gốc Đến Hiện Đại
      </motion.p>
    </div>
  );
}
