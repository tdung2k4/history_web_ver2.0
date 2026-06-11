import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../store";
import { motion } from "motion/react";
import OnboardingLayout from "../components/OnboardingLayout";
import { Check, Clock } from "lucide-react";

type TimeId = "5" | "15" | "20" | "custom";

const PRESETS = [
  {
    id: "5" as TimeId,
    mins: 5,
    label: "5 phút/ngày",
    desc: "Học nhanh",
    badge: "Cơ bản",
    icon: "⚡",
  },
  {
    id: "15" as TimeId,
    mins: 15,
    label: "15 phút/ngày",
    desc: "Cân bằng",
    badge: "Phổ biến",
    icon: "🎯",
    recommended: true,
  },
  {
    id: "20" as TimeId,
    mins: 20,
    label: "20 phút/ngày",
    desc: "Tích cực",
    badge: "Nâng cao",
    icon: "🚀",
  },
];

export default function ChooseStudyTimeScreen() {
  const nav = useNavigate();
  const { user, setUser } = useApp();
  const [selected, setSelected] = useState<TimeId>("15");
  const [customMins, setCustomMins] = useState(15);

  const finalMins = selected === "custom" ? customMins : Number(selected);

  const footer = (
    <div>
      <motion.button
        whileHover={{ y: -2, boxShadow: "0 6px 0 #b45309" }}
        whileTap={{ y: 3, boxShadow: "0 0px 0 #b45309" }}
        onClick={() => {
          setUser({ ...user, studyMinutes: finalMins, isNewUser: false });
          nav("/home");
        }}
        className="w-full py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
        style={{
          background: "#fcc117",
          boxShadow: "0 4px 0 #d97706",
          color: "#111827",
          fontWeight: 900,
          fontSize: 16,
          fontFamily: '"Nunito", sans-serif',
        }}
      >
        HOÀN TẤT & BẮT ĐẦU HỌC <span style={{ fontSize: 18 }}>✨</span>
      </motion.button>
      <p className="text-center text-stone-500 text-xs mt-4" style={{ fontWeight: 600 }}>
        🎉 Sẵn sàng khám phá lịch sử cùng History Alive!
      </p>
    </div>
  );

  return (
    <OnboardingLayout
      step={3}
      totalSteps={3}
      title="Bạn muốn học bao lâu mỗi ngày?"
      subtitle="Chúng tôi sẽ tạo lộ trình học tập phù hợp cho bạn"
      onBack={() => nav("/onboarding/grade")}
      footer={footer}
    >
      <div className="max-w-lg mx-auto space-y-4 pb-4">
        {/* Preset options */}
        {PRESETS.map((p, i) => {
          const isSelected = selected === p.id;
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelected(p.id)}
              className="w-full flex items-center gap-4 p-4 rounded-3xl border-2 transition-all text-left relative"
              style={{
                background: isSelected ? "#fcc117" : "white",
                borderColor: isSelected ? "#eab308" : "#f3f4f6",
                boxShadow: isSelected
                  ? "0 4px 0 #eab308"
                  : "0 4px 0 #f3f4f6",
              }}
            >
              {/* Recommended badge */}
              {p.recommended && (
                <div
                  className="absolute -top-3 right-4 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"
                  style={{
                    background: "#111827",
                    color: "#fcc117",
                    fontWeight: 800,
                    fontSize: 12,
                    border: "2px solid white"
                  }}
                >
                  <span style={{ fontSize: 12 }}>✨</span> Đề xuất
                </div>
              )}

              {/* Icon badge */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: isSelected ? "white" : "#fef9c3",
                  fontSize: 24
                }}
              >
                {p.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p style={{ color: "#111827", fontWeight: 800, fontSize: 18, fontFamily: '"Nunito", sans-serif' }}>
                  {p.label}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ color: isSelected ? "#4b5563" : "#6b7280", fontSize: 14, fontWeight: 600, fontFamily: '"Nunito", sans-serif' }}>
                    {p.desc}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs"
                    style={{
                      background: isSelected ? "#111827" : "#f3f4f6",
                      color: isSelected ? "#fcc117" : "#6b7280",
                      fontWeight: 800,
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
              </div>

              {/* Checkbox */}
              <div
                className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all"
                style={{
                  border: isSelected ? "none" : "2px solid #d1d5db",
                  background: isSelected ? "#111827" : "transparent",
                }}
              >
                {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
            </motion.button>
          );
        })}

        {/* Custom slider card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-3xl border-2"
          style={{ 
            background: "white", 
            borderColor: selected === "custom" ? "#eab308" : "#f3f4f6",
            boxShadow: selected === "custom" ? "0 4px 0 #eab308" : "0 4px 0 #f3f4f6",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center" 
                style={{ background: "#fcc117" }}
              >
                <Clock className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-stone-800" style={{ fontWeight: 800, fontSize: 16, fontFamily: '"Nunito", sans-serif', maxWidth: 100, lineHeight: 1.2 }}>
                Tinh chỉnh thời gian
              </span>
            </div>
            <div
              className="px-4 py-2 text-black shadow-sm"
              style={{ 
                background: "#fcc117", 
                fontWeight: 900, 
                fontSize: 16, 
                fontFamily: '"Nunito", sans-serif',
                minWidth: 70, 
                textAlign: "center",
                borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%", // Tự tạo hình dạng tròn lồi như trong ảnh
                borderRadius: "40px 30px 40px 30px / 30px 40px 30px 40px",
                borderBottomRightRadius: "60px 40px",
                borderTopLeftRadius: "60px 40px"
              }}
            >
              <div style={{ lineHeight: 1.2 }}>{customMins}</div>
              <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.2 }}>phút</div>
            </div>
          </div>

          <div className="px-1 pb-1">
            <div className="relative w-full h-3 rounded-full" style={{ background: "#e5e7eb" }}>
              {/* Fill Track */}
              <div 
                className="absolute left-0 top-0 h-full rounded-full pointer-events-none" 
                style={{ 
                  width: `${((customMins - 5) / 55) * 100}%`,
                  background: "#fcc117"
                }} 
              />
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={customMins}
                onChange={(e) => {
                  setCustomMins(Number(e.target.value));
                  setSelected("custom");
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {/* Custom Thumb */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full pointer-events-none"
                style={{ 
                  background: "#fcc117",
                  left: `calc(${((customMins - 5) / 55) * 100}% - 14px)`,
                  boxShadow: "0 3px 0 #d97706",
                  border: "2px solid #eab308"
                }}
              />
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <span style={{ color: "#6b7280", fontSize: 14, fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>5 phút</span>
            <span style={{ color: "#6b7280", fontSize: 14, fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>60 phút</span>
          </div>
        </motion.div>

        {/* TIP BOX - Hình 2 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 p-5 rounded-3xl flex gap-4 items-start"
          style={{ background: "#fcc117" }}
        >
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0" style={{ fontSize: 26, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            💡
          </div>
          <div className="flex-1">
            <h3 style={{ color: "#111827", fontSize: 18, fontWeight: 900, fontFamily: '"Nunito", sans-serif', marginBottom: 4 }}>
              Học đều đặn hiệu quả hơn!
            </h3>
            <p style={{ color: "#374151", fontSize: 15, fontWeight: 500, fontFamily: '"Nunito", sans-serif', lineHeight: 1.5 }}>
              Nghiên cứu cho thấy học 15 phút/ngày hiệu quả hơn học dồn 2 giờ vào cuối tuần.
            </p>
          </div>
        </motion.div>

      </div>
    </OnboardingLayout>
  );
}
