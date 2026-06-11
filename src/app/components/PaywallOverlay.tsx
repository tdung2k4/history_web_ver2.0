import { motion } from "motion/react";
import { Lock, Crown } from "lucide-react";
import { useNavigate } from "react-router";

interface PaywallOverlayProps {
  label?: string;
  /** CTA text trên button nhỏ */
  ctaText?: string;
  /** Có show blur effect không (default true) */
  blur?: boolean;
}

/**
 * Overlay mờ blur dùng để lock premium content inline.
 * Đặt bao quanh content cần gated: <div className="relative"><Content /><PaywallOverlay /></div>
 */
export default function PaywallOverlay({ label = "Chỉ dành cho Pro", ctaText = "Mở khóa", blur = true }: PaywallOverlayProps) {
  const nav = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl z-10"
      style={{
        backdropFilter: blur ? "blur(5px)" : undefined,
        WebkitBackdropFilter: blur ? "blur(5px)" : undefined,
        background: "linear-gradient(145deg, rgba(10,6,0,0.55), rgba(30,15,0,0.65))",
      }}
    >
      {/* Crown badge */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
        style={{
          background: "linear-gradient(135deg, rgba(217,119,6,0.25), rgba(240,180,41,0.15))",
          border: "1.5px solid rgba(240,180,41,0.4)",
          boxShadow: "0 0 20px rgba(217,119,6,0.2)",
        }}
      >
        <Crown className="w-6 h-6" style={{ color: "#f0b429" }} />
      </motion.div>

      <p style={{ color: "#f0c070", fontSize: 12, fontFamily: '"Cinzel", serif', fontWeight: 700, letterSpacing: "0.08em", textAlign: "center", marginBottom: 12 }}>
        {label}
      </p>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 6px 0 #7c2d0a, 0 0 20px rgba(217,119,6,0.4)" }}
        whileTap={{ scale: 0.96 }}
        onClick={() => nav("/premium")}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
        style={{
          background: "linear-gradient(135deg, #b85c00, #d97706, #f5b830)",
          boxShadow: "0 4px 0 #7c2d0a",
          color: "#1c0800",
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.06em",
        }}
      >
        <Lock className="w-3 h-3" />
        {ctaText}
      </motion.button>
    </motion.div>
  );
}
