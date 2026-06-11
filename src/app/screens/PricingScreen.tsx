import { motion } from "motion/react";
import { Crown, Check, Infinity as InfinityIcon, MessageCircle, BarChart3, Palette, Zap, ArrowLeft, Star } from "lucide-react";
import { useApp } from "../store";
import { useNavigate } from "react-router";
import { useIsPremium } from "../hooks/useIsPremium";

const FREE_FEATURES = [
  "5 tim mỗi ngày",
  "Truy cập Chương 1 & 2",
  "Bảng xếp hạng tuần",
  "3 nhiệm vụ hàng ngày",
  "Thành tựu cơ bản",
];

const PRO_FEATURES = [
  { icon: InfinityIcon, text: "Tim không giới hạn", color: "#f43f5e" },
  { icon: MessageCircle, text: "AI Chat không giới hạn", color: "#8b5cf6" },
  { icon: BarChart3, text: "Báo cáo học tập chi tiết", color: "#0ea5e9" },
  { icon: Palette, text: "Avatar & Huy hiệu Premium", color: "#d97706" },
  { icon: Zap, text: "Không quảng cáo", color: "#059669" },
  { icon: Crown, text: "Mở khóa tất cả chương", color: "#f0b429" },
  { icon: Star, text: "XP Bonus +50% mỗi bài", color: "#ea580c" },
];

export default function PricingScreen() {
  const { startTrial, upgradeToPremium } = useApp();
  const nav = useNavigate();
  const isPremium = useIsPremium();

  const handleTrial = () => {
    startTrial();
    nav("/home");
  };

  const handlePremium = () => {
    upgradeToPremium();
    nav("/home");
  };

  return (
    <div
      className="min-h-screen overflow-y-auto pb-12"
      style={{ background: "linear-gradient(175deg, #0a0600 0%, #150900 35%, #1c0d00 100%)" }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div style={{ background: "radial-gradient(ellipse 80% 50% at 50% 10%, rgba(240,180,41,0.1) 0%, transparent 60%)" }} className="absolute inset-0" />
        <div className="grain-overlay" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 px-4 pt-5 pb-2 flex items-center gap-3">
        <button
          onClick={() => nav(-1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)", color: "#a8a29e", border: "1px solid rgba(240,180,41,0.15)" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Hero */}
      <div className="relative z-10 text-center px-6 pt-4 pb-8">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(240,180,41,0.4), transparent)" }} />

        <motion.div
          animate={{ boxShadow: ["0 0 30px rgba(240,180,41,0.2)", "0 0 60px rgba(240,180,41,0.45)", "0 0 30px rgba(240,180,41,0.2)"] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
          style={{
            background: "linear-gradient(145deg, rgba(45,20,0,0.95), rgba(15,8,0,0.95))",
            border: "2px solid rgba(240,180,41,0.5)",
          }}
        >
          <Crown className="w-10 h-10" style={{ color: "#f0b429" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: '"Cinzel Decorative", "Cinzel", serif', color: "#f0c070", fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 700, letterSpacing: "0.04em", textShadow: "0 0 32px rgba(240,180,41,0.3)" }}
        >
          History Alive Pro
        </motion.h1>
        <p style={{ color: "#7a6040", fontSize: 14, marginTop: 8, fontFamily: '"Inter", sans-serif' }}>
          Nâng tầm hành trình khám phá lịch sử của bạn
        </p>

        {isPremium && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.3)" }}>
            <Check className="w-4 h-4" style={{ color: "#34d399" }} />
            <span style={{ color: "#34d399", fontSize: 13, fontWeight: 600 }}>Bạn đang dùng Pro!</span>
          </div>
        )}
      </div>

      <div className="relative z-10 px-4 max-w-lg mx-auto space-y-4">

        {/* ── Pricing Card — Pro Plan ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl overflow-hidden relative"
          style={{
            background: "linear-gradient(145deg, #1e0d00, #160800)",
            border: "2px solid rgba(240,180,41,0.5)",
            boxShadow: "0 0 40px rgba(217,119,6,0.15), 0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* Popular badge */}
          <div className="absolute top-0 right-6 -translate-y-1/2">
            <div
              className="px-4 py-1.5 rounded-full flex items-center gap-1.5"
              style={{ background: "linear-gradient(135deg, #b85c00, #f0b429)", boxShadow: "0 4px 0 #7c2d0a" }}
            >
              <Star className="w-3 h-3" style={{ color: "#1c0800", fill: "#1c0800" }} />
              <span style={{ color: "#1c0800", fontSize: 10, fontWeight: 800, fontFamily: '"Cinzel", serif', letterSpacing: "0.1em" }}>
                PHỔ BIẾN NHẤT
              </span>
            </div>
          </div>

          <div className="px-6 pt-7 pb-6">
            <p style={{ color: "#c4a882", fontSize: 12, fontFamily: '"Inter", sans-serif', marginBottom: 4 }}>Pro Plan</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span style={{ color: "#f0c070", fontSize: 38, fontWeight: 800, fontFamily: '"Inter", sans-serif', lineHeight: 1 }}>59.000đ</span>
              <span style={{ color: "#7a6040", fontSize: 14 }}>/tháng</span>
            </div>
            <p style={{ color: "#d97706", fontSize: 13, fontWeight: 600, fontFamily: '"Inter", sans-serif', marginBottom: 20 }}>
              Dùng thử MIỄN PHÍ 3 ngày
            </p>

            {/* CTA chính — Trial */}
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 10px 0 #7c2d0a, 0 0 32px rgba(255,180,40,0.45)" }}
              whileTap={{ y: 3, boxShadow: "0 2px 0 #7c2d0a" }}
              onClick={handleTrial}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mb-3"
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

            {/* Secondary — Đăng ký ngay */}
            <button
              onClick={handlePremium}
              className="w-full py-2.5 text-center rounded-xl"
              style={{
                background: "transparent",
                border: "1px solid rgba(240,180,41,0.25)",
                color: "#7a6040",
                fontFamily: '"Inter", sans-serif',
                fontSize: 12,
              }}
            >
              Đăng ký ngay không cần dùng thử
            </button>
          </div>
        </motion.div>

        {/* Feature comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(240,180,41,0.12)" }}
        >
          <div className="px-5 pt-5 pb-4">
            <p style={{ color: "#c4a882", fontSize: 11, fontFamily: '"Cinzel", serif', letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
              Pro Bao Gồm
            </p>
            <div className="space-y-3">
              {PRO_FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${f.color}18` }}>
                    <f.icon className="w-3.5 h-3.5" style={{ color: f.color }} />
                  </div>
                  <span style={{ color: "#c4a882", fontSize: 13, fontFamily: '"Inter", sans-serif' }}>{f.text}</span>
                  <Check className="w-4 h-4 ml-auto shrink-0" style={{ color: "#34d399" }} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Free vs Pro divider */}
          <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(240,180,41,0.08)" }}>
            <p style={{ color: "#4a3820", fontSize: 11, fontFamily: '"Inter", sans-serif', marginBottom: 10 }}>Gói Miễn Phí bao gồm:</p>
            <div className="space-y-2">
              {FREE_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(100,90,80,0.2)" }}>
                    <Check className="w-2.5 h-2.5" style={{ color: "#6b6560" }} />
                  </div>
                  <span style={{ color: "#6b6560", fontSize: 12, fontFamily: '"Inter", sans-serif' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Edu Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,200,200,0.15)" }}
        >
          <div className="px-5 py-5">
            <p style={{ color: "#9a9a9a", fontSize: 12, fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: 3 }}>Edu Plan</p>
            <p style={{ color: "#6b6b6b", fontSize: 11, fontFamily: '"Inter", sans-serif', marginBottom: 12 }}>Dành cho trường học & tổ chức giáo dục</p>
            <div className="space-y-2 mb-4">
              {["Quản lý học sinh", "Dashboard theo dõi tiến độ", "Tùy chỉnh nội dung", "Hỗ trợ ưu tiên"].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#6b6b6b" }} />
                  <span style={{ color: "#7a7a7a", fontSize: 12, fontFamily: '"Inter", sans-serif' }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              className="w-full py-3 rounded-xl"
              style={{
                background: "transparent",
                border: "1.5px solid rgba(200,200,200,0.3)",
                color: "#9a9a9a",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Liên Hệ Tư Vấn →
            </button>
          </div>
        </motion.div>

        {/* Trust signals */}
        <p className="text-center pt-2" style={{ color: "#3a2d20", fontSize: 11, fontFamily: '"Inter", sans-serif' }}>
          🔒 Hủy bất cứ lúc nào · Thanh toán qua MoMo, ZaloPay, Banking
        </p>
      </div>
    </div>
  );
}
