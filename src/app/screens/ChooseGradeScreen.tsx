import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../store";
import { motion } from "motion/react";
import OnboardingLayout from "../components/OnboardingLayout";
import { Backpack, BookOpen, BookMarked, Library, GraduationCap } from "lucide-react";

const GRADES = [
  { id: "grade6",  label: "Lớp 6",             sub: "THCS",               Icon: Backpack, color: "#3b82f6", bg: "linear-gradient(135deg, #eff6ff, #dbeafe)" },
  { id: "grade7",  label: "Lớp 7",             sub: "THCS",               Icon: Backpack, color: "#3b82f6", bg: "linear-gradient(135deg, #eff6ff, #dbeafe)" },
  { id: "grade8",  label: "Lớp 8",             sub: "THCS",               Icon: BookOpen, color: "#4f46e5", bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)" },
  { id: "grade9",  label: "Lớp 9",             sub: "THCS",               Icon: BookOpen, color: "#6366f1", bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)" },
  { id: "grade10", label: "Lớp 10",            sub: "THPT",               Icon: BookMarked, color: "#8b5cf6", bg: "linear-gradient(135deg, #f5f3ff, #ede9fe)" },
  { id: "grade11", label: "Lớp 11",            sub: "THPT",               Icon: Library, color: "#a855f7", bg: "linear-gradient(135deg, #faf5ff, #f3e8ff)" },
  { id: "grade12", label: "Lớp 12",            sub: "THPT",               Icon: Library, color: "#d946ef", bg: "linear-gradient(135deg, #fdf4ff, #fae8ff)" },
  { id: "uni",     label: "Đại học & Người lớn", sub: "Cao đẳng / ĐH",    Icon: GraduationCap, color: "#f59e0b", bg: "linear-gradient(135deg, #fffbeb, #fef3c7)" },
];

export default function ChooseGradeScreen() {
  const nav = useNavigate();
  const { user, setUser } = useApp();
  const [grade, setGrade] = useState(user.grade);

  const footer = (
    <motion.button
      whileHover={{ y: -2, boxShadow: "0 7px 0 #b45309" }}
      whileTap={{ y: 3, boxShadow: "0 2px 0 #b45309" }}
      onClick={() => {
        if (!grade) return;
        setUser({ ...user, grade });
        nav("/onboarding/time");
      }}
      disabled={!grade}
      className="w-full py-3.5 rounded-2xl text-white uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: grade ? "#f0b429" : "#d1d5db",
        boxShadow: grade ? "0 5px 0 #d97706" : "0 5px 0 #9ca3af",
      }}
    >
      TIẾP TỤC →
    </motion.button>
  );

  return (
    <OnboardingLayout
      step={2}
      totalSteps={3}
      title="Bạn đang học lớp nào?"
      subtitle="Giúp chúng tôi đề xuất nội dung phù hợp với cấp độ của bạn"
      onBack={() => nav("/onboarding/name")}
      footer={footer}
    >
      <div className="max-w-lg mx-auto space-y-3 pb-4">
        {GRADES.map((g, i) => {
          const selected = grade === g.id;
          return (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setGrade(g.id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left"
              style={{
                background: selected ? "#f0b429" : "white",
                borderColor: selected ? "#d97706" : "#f3f4f6",
                boxShadow: selected ? "0 4px 12px rgba(240,180,41,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              {/* Icon badge */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all"
                style={{
                  background: selected ? "rgba(255,255,255,0.25)" : g.bg,
                  boxShadow: selected ? "inset 0 2px 4px rgba(255,255,255,0.4)" : "inset 0 2px 4px rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.05)",
                  border: selected ? "1px solid rgba(255,255,255,0.4)" : `1px solid ${g.color}30`
                }}
              >
                <g.Icon size={22} strokeWidth={2.5} style={{ color: selected ? "#fff" : g.color }} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="truncate"
                  style={{
                    color: selected ? "white" : "#1c1917",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {g.label}
                </p>
                <p
                  style={{
                    color: selected ? "rgba(255,255,255,0.75)" : "#9ca3af",
                    fontSize: 13,
                  }}
                >
                  {g.sub}
                </p>
              </div>

              {/* Radio */}
              <div
                className="w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center"
                style={{
                  borderColor: selected ? "white" : "#d1d5db",
                  background: selected ? "white" : "transparent",
                }}
              >
                {selected && (
                  <div className="w-3 h-3 rounded-full" style={{ background: "#f0b429" }} />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </OnboardingLayout>
  );
}
