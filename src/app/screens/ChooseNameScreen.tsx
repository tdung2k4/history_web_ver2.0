import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp, MASCOTS } from "../store";
import { motion, AnimatePresence } from "motion/react";
import OnboardingLayout from "../components/OnboardingLayout";

export default function ChooseNameScreen() {
  const nav = useNavigate();
  const { user, setUser } = useApp();
  const [name, setName] = useState(user.name || "");
  const [mascotId, setMascotId] = useState(user.mascotId || "mieu");
  const [focused, setFocused] = useState(false);

  const selectedMascot = MASCOTS.find(m => m.id === mascotId) || MASCOTS[0];
  const canContinue = name.trim().length > 0;

  // Sanitize input — không store HTML-encoded values
  const handleName = (val: string) => {
    const safe = val.replace(/[<>'"&]/g, "");
    setName(safe);
  };

  const generateName = () => {
    const adjs = ["Thông thái", "Dũng cảm", "Nhanh nhẹn", "Đáng yêu", "Bí ẩn", "Lém lỉnh", "Thần tốc", "Nhí nhố", "Siêu phàm"];
    const randomAdj = adjs[Math.floor(Math.random() * adjs.length)];
    setName(`${selectedMascot.name} ${randomAdj}`);
  };

  const footer = (
    <motion.button
      whileHover={canContinue ? { y: -2, boxShadow: "0 8px 0 #7c2d12, 0 0 24px rgba(240,180,41,0.35)" } : {}}
      whileTap={canContinue ? { y: 3, boxShadow: "0 2px 0 #7c2d12" } : {}}
      onClick={() => {
        if (!canContinue) return;
        setUser({ ...user, name: name.trim(), avatar: mascotId, mascotId });
        nav("/onboarding/grade");
      }}
      disabled={!canContinue}
      className="w-full py-4 rounded-2xl uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      style={{
        background: canContinue
          ? "linear-gradient(135deg, #c07000 0%, #d97706 35%, #f0b429 65%, #d97706 100%)"
          : "linear-gradient(135deg, #c0b89a, #aca090)",
        boxShadow: canContinue ? "0 5px 0 #7c2d12" : "0 5px 0 #908880",
        color: "#1c0800",
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 900,
        fontSize: 14,
      }}
    >
      Tiếp tục nào! →
    </motion.button>
  );

  return (
    <OnboardingLayout
      step={1}
      totalSteps={3}
      title="Mình gọi bạn là gì?"
      subtitle="Chọn linh vật đồng hành và đặt tên của bạn"
      footer={footer}
    >
      <div className="max-w-lg mx-auto space-y-5 pb-4">

        {/* ── Mascot Preview ── */}
        <div className="flex flex-col items-center gap-1 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={mascotId}
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -10 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="relative"
            >
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ boxShadow: [
                  `0 0 0 0 ${selectedMascot.color}40`,
                  `0 0 0 18px ${selectedMascot.color}00`,
                ]}}
                transition={{ duration: 1.8, repeat: Infinity }}
                style={{ borderRadius: "50%" }}
              />
              {/* Mascot image */}
              <motion.div
                whileHover={{ 
                  scale: 1.15, 
                  y: -15,
                  rotate: [0, -8, 8, -8, 8, 0],
                  transition: { rotate: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }, type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.9, y: 5 }}
                className="w-36 h-36 flex items-center justify-center cursor-pointer"
                style={{ background: "transparent", border: "none" }}
              >
                <motion.img
                  animate={{ y: [0, -6, 0], scaleY: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  src={selectedMascot.img}
                  alt={selectedMascot.name}
                  className="w-full h-full object-contain"
                  style={{ 
                    filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.35))",
                    transform: "scale(1.3)" 
                  }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            key={`label-${mascotId}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-2"
          >
            <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: 18, color: selectedMascot.color }}>
              {selectedMascot.name}
            </p>
            <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: 12, color: "#9a8878" }}>
              {selectedMascot.desc}
            </p>
          </motion.div>
        </div>

        {/* ── Mascot Grid 3×2 ── */}
        <div>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 13, color: "#78614a", marginBottom: 12 }}>
            🎭 Chọn linh vật của bạn
          </p>
          <div className="grid grid-cols-3 gap-3">
            {MASCOTS.map((m) => {
              const isSelected = m.id === mascotId;
              return (
                <motion.button
                  key={m.id}
                  onClick={() => setMascotId(m.id)}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all"
                  style={{
                    background: isSelected ? m.bg : "rgba(255,252,242,0.85)",
                    border: isSelected
                      ? `2.5px solid ${m.color}`
                      : "2px solid rgba(220,210,190,0.6)",
                    boxShadow: isSelected
                      ? `0 4px 16px ${m.color}35, 0 4px 0 ${m.color}20`
                      : "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    className="w-20 h-20 flex items-center justify-center"
                    style={{
                      background: "transparent",
                      filter: isSelected ? "none" : "saturate(0.7) brightness(0.95)",
                      transition: "filter 0.2s",
                    }}
                  >
                    <img
                      src={m.img}
                      alt={m.name}
                      className="w-full h-full object-contain"
                      style={{ 
                        transform: "scale(1.3)",
                        filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.2))"
                      }}
                    />
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: m.color }}
                    >
                      <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Input tên ── */}
        <div>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 13, color: "#78614a", marginBottom: 8 }}>
            ✏️ Tên của bạn
          </p>
          <div className="relative">
            <input
              value={name}
              onChange={(e) => handleName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canContinue) {
                  setUser({ ...user, name: name.trim(), avatar: mascotId, mascotId });
                  nav("/onboarding/grade");
                }
              }}
              maxLength={20}
              placeholder={`Biệt danh của ${selectedMascot.name}...`}
              className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all"
              style={{
                background: focused ? "#fff" : "rgba(255,255,255,0.7)",
                border: focused
                  ? `2px solid ${selectedMascot.color}`
                  : "2px solid rgba(220,210,190,0.6)",
                fontSize: 15,
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 600,
                color: "#1c1209",
                boxShadow: focused
                  ? `0 0 0 3px ${selectedMascot.color}18, 0 2px 8px rgba(0,0,0,0.06)`
                  : "0 1px 4px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
              }}
            />
            <motion.button
              onClick={generateName}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              title="Gợi ý tên ngẫu nhiên"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
              style={{ fontSize: 20 }}
            >
              ✨
            </motion.button>
          </div>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: "#b8a898", marginTop: 6, fontWeight: 600 }}>
            Tối đa 20 ký tự · Không dùng ký tự đặc biệt
          </p>
        </div>

      </div>
    </OnboardingLayout>
  );
}
