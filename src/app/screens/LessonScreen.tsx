import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { UNITS, useApp } from "../store";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Heart, Check, X, Crown } from "lucide-react";
import confetti from "canvas-confetti";
import PremiumModal from "../components/PremiumModal";
import { useAppSound } from "../hooks/useAppSound";

type Q = { q: string; options: string[]; answer: number };

const QUESTIONS: Record<string, Q[]> = {
  default: [
    { q: "Ai là người sáng lập nhà nước Văn Lang?", options: ["Vua Hùng", "An Dương Vương", "Lý Thái Tổ", "Lê Lợi"], answer: 0 },
    { q: "Trận Bạch Đằng năm 938 do ai chỉ huy?", options: ["Trần Hưng Đạo", "Ngô Quyền", "Lý Thường Kiệt", "Quang Trung"], answer: 1 },
    { q: "Hai Bà Trưng khởi nghĩa chống lại ai?", options: ["Quân Tống", "Quân Mông Cổ", "Quân Hán", "Quân Minh"], answer: 2 },
    { q: "Ai đại phá quân Thanh năm 1789?", options: ["Quang Trung", "Lê Lợi", "Lý Thường Kiệt", "Trần Hưng Đạo"], answer: 0 },
    { q: "Thành Cổ Loa do ai xây dựng?", options: ["Vua Hùng", "An Dương Vương", "Lý Thái Tổ", "Lý Bí"], answer: 1 },
  ],
};

const LETTERS = ["A", "B", "C", "D"];

export default function LessonScreen() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { user, setUser, completeLesson } = useApp();

  const lesson = useMemo(() => {
    for (const u of UNITS) {
      const l = u.lessons.find((x) => x.id === id);
      if (l) return l;
    }
    return null;
  }, [id]);

  const questions = QUESTIONS.default;
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [hearts, setHearts] = useState(user.hearts);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  // Hearts refill: 1 tim hồi sau 1 giờ (Option B)
  const REFILL_MINUTES = 60;

  // Âm thanh
  const playClick = useAppSound("click");
  const playSuccess = useAppSound("success");
  const playError = useAppSound("error");
  const playLevelUp = useAppSound("levelUp");
  const playModal = useAppSound("modal");

  useEffect(() => {
    if (done) {
      confetti({ particleCount: 130, spread: 90, origin: { y: 0.6 }, colors: ["#d97706", "#f0b429", "#fbbf24", "#fff"] });
    }
  }, [done]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8f4e0" }}>
        <div className="text-center">
          <p className="text-stone-500">Không tìm thấy bài học.</p>
          <button onClick={() => { playClick(); nav("/home"); }} className="mt-3 px-4 py-2 rounded-lg text-amber-600">Quay lại</button>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const progress = ((idx + (checked ? 1 : 0)) / questions.length) * 100;
  const isCorrect = sel === q.answer;

  const check = () => {
    if (sel === null) return;
    setChecked(true);
    if (sel === q.answer) {
      setCorrect((c) => c + 1);
      playSuccess();
    } else {
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);
      playError();
      // Trigger premium modal when hearts run out
      if (newHearts === 0) {
        setTimeout(() => { playModal(); setShowPremiumModal(true); }, 800);
      }
    }
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      completeLesson(lesson.id, lesson.xp);
      setUser({ ...user, hearts });
      setDone(true);
      playLevelUp();
      return;
    }
    playClick();
    setIdx((i) => i + 1);
    setSel(null);
    setChecked(false);
  };

  // ── Victory screen ──
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#f8f4e0" }}>
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: "2px solid #fde68a" }}>
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center relative overflow-hidden" style={{ background: "linear-gradient(160deg, #1c0a00 0%, #2d1400 100%)" }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, #d97706, transparent)" }} />
              <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: 2 }} className="text-6xl mb-4">
                🎖️
              </motion.div>
              <h2 className="mb-1" style={{ fontFamily: '"Nunito", sans-serif', color: "#f0c070", fontSize: 22, fontWeight: 700, letterSpacing: "0.08em" }}>
                Chiến Thắng!
              </h2>
              <p style={{ color: "#c4a882", fontSize: 13 }}>{lesson.title}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 px-6 py-5" style={{ background: "#fffbeb" }}>
              <StatBox label="XP Kiếm Được" value={`+${lesson.xp}`} icon="⚡" color="#d97706" />
              <StatBox label="Câu Đúng" value={`${correct}/${questions.length}`} icon="✓" color="#059669" />
              <StatBox label="Tim Còn Lại" value={`${hearts}`} icon="❤️" color="#dc2626" />
            </div>

            {/* XP Bonus teaser (Pro) — Câu 4 Option A */}
            {!user.isPremium && (
              <div
                className="mx-6 mb-4 px-4 py-3 rounded-2xl flex items-center justify-between gap-3"
                style={{ background: "linear-gradient(135deg, rgba(28,13,0,0.06), rgba(217,119,6,0.08))", border: "1px solid rgba(240,180,41,0.2)", borderRadius: 16 }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 16 }}>&#x26A1;</span>
                  <div>
                    <p style={{ color: "#92400e", fontSize: 11, fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>Pro Bonus!</p>
                    <p style={{ color: "#a8a29e", fontSize: 10, fontFamily: '"Nunito", sans-serif' }}>
                      Pro users nhận +{Math.round(lesson.xp * 0.5)} XP bônus (x1.5)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="shrink-0 px-3 py-1.5 rounded-xl"
                  style={{ background: "linear-gradient(135deg, #d97706, #f0b429)", color: "#1c0800", fontSize: 10, fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}
                >
                  👑 Pro
                </button>
              </div>
            )}

            {/* Hearts refill info — Câu 3 Option B (1 giờ/1 tim) */}
            {hearts < 5 && !user.isPremium && (
              <div
                className="mx-6 mb-4 px-4 py-2.5 rounded-2xl flex items-center gap-2"
                style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)", borderRadius: 16 }}
              >
                <span style={{ fontSize: 14 }}>❤️</span>
                <p style={{ color: "#9f1239", fontSize: 11, fontFamily: '"Nunito", sans-serif' }}>
                  Tim hồi sau <strong>1 giờ/tim</strong> · Pro users học không hết tim
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="px-6 pb-6" style={{ background: "#fffbeb" }}>
              <motion.button
                whileHover={{ y: -2, boxShadow: "0 8px 0 #92400e, 0 0 24px rgba(217,119,6,0.3)" }}
                whileTap={{ y: 3, boxShadow: "0 2px 0 #92400e" }}
                onClick={() => nav("/home")}
                className="w-full py-3.5 rounded-2xl uppercase tracking-widest"
                style={{ background: "linear-gradient(135deg, #d97706, #f0b429)", boxShadow: "0 5px 0 #92400e", color: "#1c0800", fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: "0.12em" }}
              >
                Tiếp Tục Hành Trình →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Quiz screen ──
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8f4e0" }}>
      {/* Top HUD */}
      <div className="px-4 lg:px-8 py-3 flex items-center gap-4" style={{ borderBottom: "1px solid #fde68a" }}>
        <button onClick={() => nav("/home")} className="p-2 rounded-xl transition hover:bg-amber-50" style={{ color: "#a8a29e" }}>
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "#fef3c7" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(to right, #d97706, #f0b429)" }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Hearts HUD */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Heart className="w-4 h-4 fill-current" style={{ color: hearts <= 1 ? "#dc2626" : "#dc2626" }} />
          <span style={{ color: hearts <= 1 ? "#dc2626" : "#dc2626", fontWeight: 700, fontSize: 14 }}>{hearts}</span>
        </div>
      </div>

      {/* Hearts = 1 warning banner */}
      <AnimatePresence>
        {hearts === 1 && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="px-4 py-2.5 flex items-center justify-between gap-3"
            style={{ background: "linear-gradient(135deg, rgba(254,226,226,0.95), rgba(252,165,165,0.3))", borderBottom: "1px solid rgba(220,38,38,0.2)" }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 16 }}>❤️</span>
              <span style={{ color: "#991b1b", fontSize: 12, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
                Chỉ còn 1 Tim! Sai thêm 1 lần sẽ dừng học.
              </span>
            </div>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0"
              style={{ background: "linear-gradient(135deg, #d97706, #f0b429)", color: "#1c0800", fontSize: 11, fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}
            >
              <Crown className="w-3 h-3" />
              Pro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question area */}
      <div className="flex-1 px-4 lg:px-8 py-8 max-w-2xl mx-auto w-full">
        <p className="mb-4 uppercase tracking-widest" style={{ color: "#a8a29e", fontSize: 11, fontFamily: '"Nunito", sans-serif' }}>
          Câu hỏi {idx + 1} / {questions.length}
        </p>

        <motion.h2
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 leading-snug"
          style={{ color: "#1c1917", fontSize: "clamp(18px, 3.5vw, 24px)", fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}
        >
          {q.q}
        </motion.h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const isSel = sel === i;
            const isCorrectOpt = checked && i === q.answer;
            const isWrongSel = checked && isSel && i !== q.answer;

            return (
              <motion.button
                key={`${idx}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => {
                  if (!checked) {
                    playClick();
                    setSel(i);
                  }
                }}
                whileHover={!checked ? { x: 3 } : {}}
                whileTap={!checked ? { scale: 0.99 } : {}}
                className="w-full text-left flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all"
                style={{
                  background: isCorrectOpt ? "#ecfdf5" : isWrongSel ? "#fef2f2" : isSel ? "#fffbeb" : "#ffffff",
                  borderColor: isCorrectOpt ? "#059669" : isWrongSel ? "#dc2626" : isSel ? "#d97706" : "#fde68a",
                  boxShadow: isSel && !checked ? "0 0 0 1px rgba(217,119,6,0.15)" : "none",
                  cursor: checked ? "default" : "pointer",
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm"
                  style={{
                    background: isCorrectOpt ? "#059669" : isWrongSel ? "#dc2626" : isSel ? "#d97706" : "#fef3c7",
                    color: isCorrectOpt || isWrongSel || isSel ? "#ffffff" : "#92400e",
                    fontWeight: 700,
                    fontFamily: '"Nunito", sans-serif',
                    fontSize: 12,
                  }}
                >
                  {isCorrectOpt ? "✓" : isWrongSel ? "✗" : LETTERS[i]}
                </div>
                <span style={{ color: isCorrectOpt ? "#065f46" : isWrongSel ? "#991b1b" : isSel ? "#92400e" : "#57534e", fontSize: 14, flex: 1 }}>
                  {opt}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <AnimatePresence>
        {checked ? (
          <motion.div
            key="feedback"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="border-t-2 px-4 lg:px-8 py-5"
            style={{ background: isCorrect ? "#ecfdf5" : "#fef2f2", borderColor: isCorrect ? "#059669" : "#dc2626" }}
          >
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: isCorrect ? "#059669" : "#dc2626" }}>
                  {isCorrect ? <Check className="w-5 h-5 text-white" /> : <X className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <p style={{ color: isCorrect ? "#065f46" : "#991b1b", fontWeight: 700, fontSize: 14 }}>
                    {isCorrect ? "Tuyệt vời!" : "Sai rồi!"}
                  </p>
                  {!isCorrect && <p style={{ color: "#57534e", fontSize: 12 }}>Đáp án: {q.options[q.answer]}</p>}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={next}
                className="px-6 py-2.5 rounded-xl uppercase tracking-widest shrink-0"
                style={{
                  background: isCorrect ? "linear-gradient(135deg, #d97706, #f0b429)" : "linear-gradient(135deg, #dc2626, #ef4444)",
                  color: isCorrect ? "#1c0800" : "#ffffff",
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  boxShadow: `0 4px 0 ${isCorrect ? "#92400e" : "#991b1b"}`,
                }}
              >
                Tiếp tục
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="check"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="border-t px-4 lg:px-8 py-5"
            style={{ background: "#fffbeb", borderColor: "#fde68a" }}
          >
            <div className="max-w-2xl mx-auto">
              <motion.button
                whileHover={sel !== null ? { y: -2, boxShadow: "0 8px 0 #92400e, 0 0 20px rgba(217,119,6,0.25)" } : {}}
                whileTap={sel !== null ? { y: 3 } : {}}
                onClick={check}
                disabled={sel === null}
                className="w-full py-3.5 rounded-2xl uppercase tracking-widest transition-all"
                style={{
                  background: sel !== null ? "linear-gradient(135deg, #d97706, #f0b429)" : "#f3f3f3",
                  color: sel !== null ? "#1c0800" : "#a8a29e",
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  boxShadow: sel !== null ? "0 5px 0 #92400e" : "none",
                  cursor: sel === null ? "not-allowed" : "pointer",
                }}
              >
                Kiểm Tra
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium modal — triggered when hearts = 0 */}
      {showPremiumModal && (
        <PremiumModal
          trigger="hearts"
          onClose={() => setShowPremiumModal(false)}
          onSuccess={() => {
            setHearts(999); // unlimited hearts after upgrade
          }}
        />
      )}
    </div>
  );
}

function StatBox({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="rounded-2xl p-3 text-center" style={{ background: "#ffffff", border: "1.5px solid #fde68a" }}>
      <div className="text-xl mb-1">{icon}</div>
      <div style={{ color, fontWeight: 700, fontSize: 18 }}>{value}</div>
      <div style={{ color: "#a8a29e", fontSize: 10 }}>{label}</div>
    </div>
  );
}
