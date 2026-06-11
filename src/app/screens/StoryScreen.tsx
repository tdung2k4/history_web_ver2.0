import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { UNITS } from "../store";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, X } from "lucide-react";

type Scene = {
  character: string;
  characterTitle: string;
  avatar: string;
  side: "left" | "right";
  lines: string[];
};

const STORIES: Record<string, {
  title: string;
  era: string;
  backdrop: { from: string; to: string };
  artEmoji: string;
  scenes: Scene[];
  decision?: { question: string; choices: { text: string; outcome: string; isHistorical: boolean }[] };
}> = {
  "u1-l1": {
    title: "Vua Hùng Dựng Nước",
    era: "2879 TCN",
    backdrop: { from: "#2d1400", to: "#1a0c00" },
    artEmoji: "🏯",
    scenes: [
      {
        character: "Lạc Long Quân",
        characterTitle: "Thần Long — Vua các vùng sông nước",
        avatar: "🐉",
        side: "left",
        lines: [
          "Ta và Âu Cơ đã sinh ra một bọc trứng kỳ diệu. Từ đó nở ra một trăm người con.",
          "Nhưng ta là con của Rồng, nàng là con của Tiên. Ta phải trở về biển sâu.",
        ],
      },
      {
        character: "Âu Cơ",
        characterTitle: "Tiên Nữ — Mẹ của trăm con",
        avatar: "🦅",
        side: "right",
        lines: [
          "Năm mươi người con theo ta lên rừng núi cao, lập nước Văn Lang.",
          "Người con trưởng nhất trở thành Hùng Vương đầu tiên — khởi nguồn dân tộc Việt.",
        ],
      },
    ],
    decision: {
      question: "Vua Hùng cần chọn kinh đô cho nước Văn Lang. Bạn sẽ chọn đâu?",
      choices: [
        { text: "Vùng đất Phong Châu — thấp, gần sông, dễ trồng lúa", outcome: "Phong Châu trở thành kinh đô Văn Lang. Vùng đất màu mỡ, thuận lợi cho nông nghiệp lúa nước.", isHistorical: true },
        { text: "Núi cao phía Bắc — hiểm trở, dễ phòng thủ", outcome: "Nếu chọn núi cao, việc canh tác sẽ khó khăn và dân số khó tăng trưởng.", isHistorical: false },
      ],
    },
  },
  "u2-l1": {
    title: "Hai Bà Trưng Khởi Nghĩa",
    era: "40 SCN",
    backdrop: { from: "#2d0808", to: "#1a0404" },
    artEmoji: "⚔️",
    scenes: [
      {
        character: "Trưng Trắc",
        characterTitle: "Nữ tướng — Lãnh đạo cuộc khởi nghĩa",
        avatar: "⚔️",
        side: "left",
        lines: [
          "Chồng ta — Thi Sách — đã bị giết bởi Tô Định. Mối thù này ta không thể nuốt.",
          "Khắp đất nước, nhân dân đang rên xiết dưới ách đô hộ hà khắc của nhà Hán.",
        ],
      },
      {
        character: "Trưng Nhị",
        characterTitle: "Em gái — Phó tướng vĩ đại",
        avatar: "🛡️",
        side: "right",
        lines: [
          "Chị ơi, hơn 65 thành trì đã đầu hàng ta. Chỉ trong vài tháng!",
          "Dân tộc ta đã chứng minh: phụ nữ có thể dẫn đầu cuộc kháng chiến vĩ đại nhất.",
        ],
      },
    ],
  },
};

export default function StoryScreen() {
  const { id = "" } = useParams();
  const nav = useNavigate();

  const lesson = (() => {
    for (const u of UNITS) {
      const l = u.lessons.find((x) => x.id === id);
      if (l) return { ...l, unit: u };
    }
    return null;
  })();

  const story = STORIES[id];

  const [sceneIdx, setSceneIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [decided, setDecided] = useState<number | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [phase, setPhase] = useState<"story" | "decision" | "outcome">("story");
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  const currentScene = story?.scenes[sceneIdx];
  const currentLine = currentScene?.lines[lineIdx] ?? "";

  // Typewriter effect
  useEffect(() => {
    if (!currentLine) return;
    setDisplayedText("");
    setTypingDone(false);
    let i = 0;
    const tick = setInterval(() => {
      i++;
      setDisplayedText(currentLine.slice(0, i));
      if (i >= currentLine.length) {
        clearInterval(tick);
        setTypingDone(true);
      }
    }, 22);
    return () => clearInterval(tick);
  }, [sceneIdx, lineIdx]);

  if (!lesson || !story) {
    nav(`/lesson/${id}`);
    return null;
  }

  const advance = () => {
    if (!typingDone) {
      setDisplayedText(currentLine);
      setTypingDone(true);
      return;
    }

    const scene = story.scenes[sceneIdx];
    if (lineIdx + 1 < scene.lines.length) {
      setLineIdx((l) => l + 1);
    } else if (sceneIdx + 1 < story.scenes.length) {
      setSceneIdx((s) => s + 1);
      setLineIdx(0);
    } else if (story.decision) {
      setPhase("decision");
    } else {
      nav(`/lesson/${id}`);
    }
  };

  const chooseDecision = (idx: number) => {
    setDecided(idx);
    setTimeout(() => setPhase("outcome"), 400);
  };

  const totalSceneLines = story.scenes.reduce((s, sc) => s + sc.lines.length, 0);
  const doneLines = story.scenes.slice(0, sceneIdx).reduce((s, sc) => s + sc.lines.length, 0) + lineIdx;
  const progressPct = (doneLines / totalSceneLines) * 100;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden select-none"
      style={{ background: `linear-gradient(160deg, ${story.backdrop.from} 0%, ${story.backdrop.to} 100%)` }}
    >
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(240,180,41,0.07) 0%, transparent 65%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, backgroundImage: "linear-gradient(rgba(240,180,41,1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,180,41,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex-1 h-1 rounded-full overflow-hidden mr-4" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(to right, #d97706, #f0b429)" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <button
          onClick={() => nav(`/lesson/${id}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(196,168,130,0.7)", fontSize: 12 }}
        >
          <span>Bỏ qua</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center px-6 pt-4 pb-2">
        <p style={{ color: "rgba(196,168,130,0.5)", fontSize: 10, letterSpacing: "0.3em", marginBottom: 4 }}>{story.era}</p>
        <h1 style={{ fontFamily: '"Cinzel", serif', color: "#f0c070", fontSize: "clamp(18px, 4vw, 26px)", fontWeight: 700 }}>{story.title}</h1>
      </div>

      {/* ── Story phase ── */}
      <AnimatePresence mode="wait">
        {phase === "story" && currentScene && (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-end pb-8 px-5 relative z-10"
            onClick={advance}
          >
            {/* Giant art emoji */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none select-none" style={{ fontSize: "clamp(80px, 16vw, 140px)", opacity: 0.2, filter: "drop-shadow(0 0 30px rgba(240,180,41,0.3))" }}>
              {story.artEmoji}
            </div>

            {/* Character floating avatar */}
            <div className={`flex mb-5 ${currentScene.side === "right" ? "justify-end" : "justify-start"}`}>
              <motion.div
                key={`${sceneIdx}-avatar`}
                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 72, height: 72, fontSize: 36, background: "radial-gradient(circle at 38% 32%, rgba(240,180,41,0.2) 0%, rgba(0,0,0,0.7) 65%)", border: "2px solid rgba(240,180,41,0.4)", boxShadow: "0 0 24px rgba(240,180,41,0.25)" }}
                >
                  {currentScene.avatar}
                </motion.div>
                <div className="text-center">
                  <p style={{ color: "#f0c070", fontSize: 12, fontFamily: '"Cinzel", serif', fontWeight: 700 }}>{currentScene.character}</p>
                  <p style={{ color: "#c4a882", fontSize: 10 }}>{currentScene.characterTitle}</p>
                </div>
              </motion.div>
            </div>

            {/* Dialogue bubble */}
            <motion.div
              key={`${sceneIdx}-${lineIdx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 mb-4 relative"
              style={{ background: "rgba(20,10,0,0.85)", border: "1px solid rgba(240,180,41,0.25)", backdropFilter: "blur(12px)" }}
            >
              <p style={{ color: "#f8f0e0", fontSize: 15, lineHeight: 1.8, fontStyle: "italic" }}>
                "{displayedText}
                {!typingDone && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>}
                "
              </p>
            </motion.div>

            {/* Tap to continue hint */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {story.scenes.map((_, si) => (
                  <div
                    key={si}
                    className="rounded-full"
                    style={{ width: 6, height: 6, background: si === sceneIdx ? "#d97706" : "rgba(255,255,255,0.15)" }}
                  />
                ))}
              </div>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl"
                style={{ background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.3)" }}
              >
                <span style={{ color: "#f0c070", fontSize: 12, fontFamily: '"Cinzel", serif' }}>Tiếp theo</span>
                <ChevronRight className="w-4 h-4" style={{ color: "#f0c070" }} />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── Decision phase ── */}
        {phase === "decision" && story.decision && (
          <motion.div
            key="decision"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col justify-center px-5 pb-10 gap-4 relative z-10"
          >
            <div className="text-center mb-2">
              <div
                className="inline-block px-3 py-1 rounded-lg mb-3"
                style={{ background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.3)" }}
              >
                <span style={{ color: "#f0c070", fontSize: 10, fontFamily: '"Cinzel", serif', letterSpacing: "0.18em" }}>⚔️ QUYẾT ĐỊNH CỦA BẠN</span>
              </div>
              <p style={{ color: "#f8f0e0", fontSize: 16, lineHeight: 1.6, fontStyle: "italic" }}>{story.decision.question}</p>
            </div>

            {story.decision.choices.map((choice, ci) => (
              <motion.button
                key={ci}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => chooseDecision(ci)}
                className="text-left p-5 rounded-2xl"
                style={{ background: "rgba(20,10,0,0.8)", border: "1.5px solid rgba(240,180,41,0.25)", backdropFilter: "blur(12px)" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.3)" }}
                  >
                    <span style={{ color: "#f0c070", fontSize: 13, fontFamily: '"Cinzel", serif', fontWeight: 700 }}>{ci + 1}</span>
                  </div>
                  <p style={{ color: "#c4a882", fontSize: 14, lineHeight: 1.6 }}>{choice.text}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* ── Outcome phase ── */}
        {phase === "outcome" && decided !== null && story.decision && (
          <motion.div
            key="outcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col justify-center px-5 pb-10 gap-5 relative z-10"
          >
            {/* Your choice */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(20,10,0,0.8)", border: "1px solid rgba(240,180,41,0.2)" }}>
              <p className="mb-2" style={{ color: "#a8a29e", fontSize: 11, letterSpacing: "0.14em" }}>BẠN ĐÃ CHỌN</p>
              <p style={{ color: "#f0c070", fontSize: 14, lineHeight: 1.6 }}>{story.decision.choices[decided].text}</p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(240,180,41,0.2)" }} />
              <span style={{ color: "#a8a29e", fontSize: 11, letterSpacing: "0.12em" }}>vs</span>
              <div className="flex-1 h-px" style={{ background: "rgba(240,180,41,0.2)" }} />
            </div>

            {/* Historical outcome */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: story.decision.choices[decided].isHistorical ? "rgba(5,150,105,0.12)" : "rgba(220,38,38,0.1)",
                border: `1px solid ${story.decision.choices[decided].isHistorical ? "rgba(52,211,153,0.3)" : "rgba(220,38,38,0.3)"}`,
              }}
            >
              <p className="mb-2" style={{ color: story.decision.choices[decided].isHistorical ? "#34d399" : "#f87171", fontSize: 11, letterSpacing: "0.14em" }}>
                {story.decision.choices[decided].isHistorical ? "✓ ĐÚNG VỚI LỊCH SỬ" : "✗ LỊCH SỬ ĐÃ KHÁC"}
              </p>
              <p style={{ color: "#c4a882", fontSize: 14, lineHeight: 1.6 }}>{story.decision.choices[decided].outcome}</p>
            </div>

            {/* Proceed to quiz */}
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 8px 0 #92400e, 0 0 24px rgba(217,119,6,0.3)" }}
              whileTap={{ y: 3, boxShadow: "0 2px 0 #92400e" }}
              onClick={() => nav(`/lesson/${id}`)}
              className="py-4 rounded-2xl uppercase tracking-widest"
              style={{ background: "linear-gradient(135deg, #d97706, #f0b429)", boxShadow: "0 5px 0 #92400e", color: "#1c0800", fontFamily: '"Cinzel", serif', fontWeight: 700, fontSize: 13 }}
            >
              Vào Thử Thách →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
