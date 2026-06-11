import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSound } from "../hooks/useSound";
import { useNavigate } from "react-router";
import { ChevronLeft, Swords, Users, ShieldAlert, Zap } from "lucide-react";
import { useApp } from "../store";

const QUESTIONS = [
  { q: "Trận Bạch Đằng năm 938 do ai lãnh đạo?", opts: ["Ngô Quyền", "Lý Công Uẩn", "Trần Hưng Đạo", "Lê Lợi"], ans: 0 },
  { q: "Quốc hiệu nước ta thời Lý là gì?", opts: ["Đại Cồ Việt", "Đại Việt", "Đại Ngu", "Vạn Xuân"], ans: 1 },
];

export default function PvPScreen() {
  const { playPop, playSuccess } = useSound();
  const { user } = useApp();
  const nav = useNavigate();
  
  const [state, setState] = useState<"lobby" | "searching" | "playing" | "result">("lobby");
  const [qIndex, setQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);

  // Matchmaking simulation
  useEffect(() => {
    if (state === "searching") {
      const t = setTimeout(() => {
        playSuccess();
        setState("playing");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [state, playSuccess]);

  // Question timer
  useEffect(() => {
    if (state === "playing" && timer > 0 && selectedAns === null) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else if (state === "playing" && timer === 0) {
      handleAnswer(-1); // Timeout
    }
  }, [state, timer, selectedAns]);

  const startMatch = () => {
    playPop();
    setState("searching");
  };

  const handleAnswer = (index: number) => {
    if (selectedAns !== null) return;
    setSelectedAns(index);
    playPop();
    
    const isCorrect = index === QUESTIONS[qIndex].ans;
    if (isCorrect) setMyScore(s => s + 1);
    
    // Simulate enemy answering
    const enemyCorrect = Math.random() > 0.4;
    if (enemyCorrect) setEnemyScore(s => s + 1);

    setTimeout(() => {
      if (qIndex < QUESTIONS.length - 1) {
        setQIndex(prev => prev + 1);
        setSelectedAns(null);
        setTimer(10);
      } else {
        setState("result");
      }
    }, 2000);
  };

  if (state === "lobby") {
    return (
      <div className="min-h-screen bg-[#1E1E28] font-['Nunito',sans-serif] text-white flex flex-col">
        <div className="pt-6 px-4 md:px-8 flex items-center justify-between">
          <button onClick={() => { playPop(); nav(-1); }} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronLeft size={28} strokeWidth={3} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <Swords size={120} className="text-[#FF4B4B] mb-8" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Đấu Trường 1v1</h1>
          <p className="text-gray-400 font-bold text-center max-w-sm mb-12">Đặt cược 50 Kim Cương và đối đầu với người chơi khác để giành lấy vinh quang!</p>
          <button onClick={startMatch} className="w-full max-w-sm bg-[#FF4B4B] hover:bg-[#E53935] text-white py-5 rounded-[2rem] font-black text-2xl shadow-[0_6px_0_#C62828] transition-all hover:translate-y-1 hover:shadow-[0_0px_0_#C62828] flex items-center justify-center gap-3">
            <Swords strokeWidth={3} /> TÌM ĐỐI THỦ
          </button>
        </div>
      </div>
    );
  }

  if (state === "searching") {
    return (
      <div className="min-h-screen bg-[#1E1E28] font-['Nunito',sans-serif] text-white flex flex-col items-center justify-center px-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Users size={80} className="text-[#1CB0F6] mb-8" strokeWidth={1.5} />
        </motion.div>
        <h2 className="text-3xl font-black mb-4">Đang tìm trận...</h2>
        <p className="text-gray-400 font-bold animate-pulse">Chờ một chút, đối thủ đang khởi động!</p>
      </div>
    );
  }

  if (state === "result") {
    const isWin = myScore > enemyScore;
    const isDraw = myScore === enemyScore;
    return (
      <div className="min-h-screen bg-[#1E1E28] font-['Nunito',sans-serif] text-white flex flex-col items-center justify-center px-4">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="text-8xl mb-6">{isWin ? "🏆" : isDraw ? "🤝" : "💀"}</div>
          <h2 className={`text-5xl font-black mb-4 ${isWin ? "text-[#FFC800]" : isDraw ? "text-gray-400" : "text-[#FF4B4B]"}`}>
            {isWin ? "CHIẾN THẮNG!" : isDraw ? "HÒA NHAU!" : "THẤT BẠI"}
          </h2>
          <div className="flex items-center justify-center gap-8 text-3xl font-black mb-12">
            <div className="text-[#58CC02]">{myScore}</div>
            <div className="text-gray-500">-</div>
            <div className="text-[#FF4B4B]">{enemyScore}</div>
          </div>
          <button onClick={() => { playPop(); nav("/home"); }} className="w-full bg-[#1CB0F6] hover:bg-[#1899D6] py-4 rounded-2xl font-black text-xl shadow-[0_4px_0_#1899D6] transition-all">
            Về Trang Chủ
          </button>
        </motion.div>
      </div>
    );
  }

  const q = QUESTIONS[qIndex];

  return (
    <div className="min-h-screen bg-[#1E1E28] font-['Nunito',sans-serif] text-white flex flex-col">
      {/* HUD */}
      <div className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#58CC02] flex items-center justify-center text-2xl border-2 border-white">{user.avatar || "🦊"}</div>
          <div className="text-2xl font-black">{myScore}</div>
        </div>
        <div className="text-3xl font-black text-[#FFC800]">{timer}s</div>
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black">{enemyScore}</div>
          <div className="w-12 h-12 rounded-full bg-[#FF4B4B] flex items-center justify-center text-2xl border-2 border-white">👽</div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12 leading-snug">{q.q}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {q.opts.map((opt, i) => {
            const isSelected = selectedAns === i;
            const isCorrect = i === q.ans;
            const showResult = selectedAns !== null;
            
            let bgClass = "bg-white/10 hover:bg-white/20 text-white";
            if (showResult) {
              if (isCorrect) bgClass = "bg-[#58CC02] text-white";
              else if (isSelected) bgClass = "bg-[#FF4B4B] text-white";
              else bgClass = "bg-white/5 text-gray-500 opacity-50";
            }

            return (
              <button 
                key={i}
                disabled={showResult}
                onClick={() => handleAnswer(i)}
                className={`w-full p-6 rounded-2xl text-xl font-bold transition-all border-2 ${showResult ? "border-transparent" : "border-white/10"} ${bgClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
