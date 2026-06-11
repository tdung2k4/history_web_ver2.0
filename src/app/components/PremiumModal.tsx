import { motion, AnimatePresence } from "motion/react";
import { Crown, X, Infinity as InfinityIcon, MessageCircle, BarChart3, Palette, Zap } from "lucide-react";
import { useApp } from "../store";
import { useNavigate } from "react-router";

interface PremiumModalProps {
  onClose: () => void;
  trigger?: "hearts" | "feature" | "general";
  /** Optional: callback sau khi user bắt đầu trial thành công */
  onSuccess?: () => void;
}

const PERKS = [
  { icon: InfinityIcon, text: "Tim không giới hạn — học không bị gián đoạn", color: "#f43f5e" },
  { icon: MessageCircle, text: "Trò chuyện AI không giới hạn", color: "#8b5cf6" },
  { icon: BarChart3, text: "Báo cáo học tập chi tiết", color: "#0ea5e9" },
  { icon: Palette, text: "Avatar & Huy hiệu Premium độc quyền", color: "#d97706" },
  { icon: Zap, text: "Học không quảng cáo, tập trung tối đa", color: "#059669" },
];

const TRIGGER_TEXT = {
  hearts: {
    emoji: "💔",
    title: "Hết Tim Rồi!",
    subtitle: "Nhưng hành trình của bạn chưa kết thúc...",
  },
  feature: {
    emoji: "👑",
    title: "Tính Năng Pro",
    subtitle: "Nâng cấp để mở khóa tính năng đặc biệt này",
  },
  general: {
    emoji: "✨",
    title: "History Alive Pro",
    subtitle: "Nâng tầm hành trình khám phá lịch sử của bạn",
  },
};

export default function PremiumModal({ onClose, trigger = "general", onSuccess }: PremiumModalProps) {
  const { startTrial } = useApp();
  const nav = useNavigate();

  const { emoji, title, subtitle } = TRIGGER_TEXT[trigger];

  const handleTrial = () => {
    startTrial();
    onSuccess?.();
    onClose();
  };

  const handleSeePricing = () => {
    onClose();
    nav("/premium");
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50"
        style={{ background: "rgba(10,6,0,0.72)", backdropFilter: "blur(6px)" }}
      />

      {/* Bottom sheet */}
      <motion.div
        key="sheet"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{
          background: "linear-gradient(165deg, #1c0d00 0%, #120800 40%, #090400 100%)",
          border: "1.5px solid rgba(240,180,41,0.25)",
          borderBottom: "none",
          boxShadow: "0 -16px 64px rgba(0,0,0,0.6), 0 -1px 0 rgba(240,180,41,0.1) inset",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(240,180,41,0.6), transparent)" }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
          style={{ background: "rgba(255,255,255,0.08)", color: "#a8a29e" }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 pt-8 pb-6">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-3"
            >
              {emoji}
            </motion.div>

            {trigger === "hearts" && (
              <div className="flex justify-center gap-1.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(244,63,94,0.1)", border: "1.5px solid rgba(244,63,94,0.2)" }}>
                    <span style={{ fontSize: 14, filter: "grayscale(1)", opacity: 0.4 }}>❤️</span>
                  </div>
                ))}
              </div>
            )}

            <h2 style={{ fontFamily: '"Cinzel", serif', color: "#f0c070", fontSize: 22, fontWeight: 700, letterSpacing: "0.04em" }}>
              {title}
            </h2>
            <p style={{ color: "#7a6040", fontSize: 13, marginTop: 6, fontFamily: '"Inter", sans-serif' }}>
              {subtitle}
            </p>
          </div>

          {/* Perks list */}
          <div className="rounded-2xl p-4 mb-5 space-y-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(240,180,41,0.12)" }}>
            {PERKS.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${perk.color}18`, border: `1px solid ${perk.color}30` }}>
                  <perk.icon className="w-4 h-4" style={{ color: perk.color }} />
                </div>
                <span style={{ color: "#c4a882", fontSize: 13, fontFamily: '"Inter", sans-serif' }}>{perk.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Pricing hint */}
          <div className="text-center mb-4">
            <span style={{ color: "#5a4830", fontSize: 12, fontFamily: '"Inter", sans-serif' }}>
              Chỉ{" "}
            </span>
            <span style={{ color: "#d97706", fontWeight: 800, fontSize: 18, fontFamily: '"Inter", sans-serif' }}>
              59.000đ
            </span>
            <span style={{ color: "#5a4830", fontSize: 12, fontFamily: '"Inter", sans-serif' }}>
              /tháng · hoặc 399.000đ/năm (tiết kiệm 43%)
            </span>
          </div>

          {/* CTA buttons */}
          <motion.button
            whileHover={{ y: -2, boxShadow: "0 10px 0 #7c2d0a, 0 0 32px rgba(255,180,40,0.45)" }}
            whileTap={{ y: 3, boxShadow: "0 2px 0 #7c2d0a" }}
            onClick={handleTrial}
            className="w-full py-4 rounded-2xl mb-3 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #b85c00 0%, #d97706 40%, #f5b830 70%, #d97706 100%)",
              boxShadow: "0 6px 0 #7c2d0a, 0 0 24px rgba(217,119,6,0.3)",
              color: "#1c0800",
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.06em",
            }}
          >
            <Crown className="w-4 h-4" />
            Bắt Đầu 3 Ngày Miễn Phí
          </motion.button>

          <button
            onClick={handleSeePricing}
            className="w-full py-2.5 text-center"
            style={{ color: "#7a6040", fontSize: 13, fontFamily: '"Inter", sans-serif' }}
          >
            Xem tất cả gói →
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-center"
            style={{ color: "#4a3820", fontSize: 12, fontFamily: '"Inter", sans-serif' }}
          >
            Để sau
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
