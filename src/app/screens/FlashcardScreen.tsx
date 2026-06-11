import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSound } from "../hooks/useSound";
import { useNavigate } from "react-router";
import { ChevronLeft, RotateCcw, BrainCircuit, Check, X } from "lucide-react";

const FLASHCARDS = [
  { id: 1, front: "Năm 938 diễn ra sự kiện gì?", back: "Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng" },
  { id: 2, front: "Lý Thái Tổ dời đô về Thăng Long năm nào?", back: "Năm 1010" },
  { id: 3, front: "Ai là người viết Hịch Tướng Sĩ?", back: "Trần Quốc Tuấn (Trần Hưng Đạo)" },
  { id: 4, front: "Khởi nghĩa Lam Sơn chống quân Minh kéo dài bao lâu?", back: "10 năm (1418 - 1427)" },
  { id: 5, front: "Trận Đống Đa đại phá quân Thanh diễn ra vào thời gian nào?", back: "Dịp Tết Kỷ Dậu (1789)" },
];

export default function FlashcardScreen() {
  const { playPop, playSuccess } = useSound();
  const nav = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const card = FLASHCARDS[currentIndex];

  const handleFlip = () => {
    playPop();
    setIsFlipped(!isFlipped);
  };

  const handleNext = (knewIt: boolean) => {
    if (knewIt) playSuccess();
    else playPop();

    setIsFlipped(false);
    if (currentIndex < FLASHCARDS.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    } else {
      setTimeout(() => setCompleted(true), 150);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-[#F0F8FF] font-['Nunito',sans-serif] flex flex-col items-center justify-center p-6 selection:bg-blue-200">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[2rem] shadow-2xl text-center max-w-md w-full border-4 border-blue-100"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Ôn Tập Hoàn Tất!</h2>
          <p className="text-gray-500 font-bold mb-8">Bạn đã xuất sắc ôn lại toàn bộ thẻ nhớ lịch sử ngày hôm nay.</p>
          <button 
            onClick={() => { playPop(); nav("/home"); }}
            className="w-full bg-[#1CB0F6] hover:bg-[#1899D6] text-white py-4 rounded-2xl font-black text-xl shadow-[0_4px_0_#1899D6] transition-all hover:translate-y-1 hover:shadow-[0_0px_0_#1899D6]"
          >
            Quay Về Trang Chủ
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-['Nunito',sans-serif] selection:bg-blue-200 flex flex-col">
      {/* Header */}
      <div className="pt-6 px-4 md:px-8 flex items-center justify-between">
        <button 
          onClick={() => { playPop(); nav(-1); }}
          className="w-12 h-12 rounded-full bg-white text-gray-500 flex items-center justify-center shadow-sm hover:bg-gray-50"
        >
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-[#1CB0F6]" size={24} strokeWidth={2.5} />
          <span className="font-black text-gray-700 text-lg">Lò Luyện Thi</span>
        </div>
        <div className="w-12" />
      </div>

      {/* Progress Bar */}
      <div className="px-6 md:px-12 mt-6 max-w-3xl mx-auto w-full">
        <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner p-1">
          <motion.div 
            className="h-full bg-[#1CB0F6] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / FLASHCARDS.length) * 100}%` }}
          />
        </div>
        <div className="text-center text-gray-400 font-black mt-2 text-sm uppercase tracking-widest">
          Thẻ {currentIndex + 1} / {FLASHCARDS.length}
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 mt-8 pb-32">
        <div className="relative w-full max-w-lg aspect-[4/3] perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex + (isFlipped ? "-back" : "-front")}
              initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
              transition={{ duration: 0.2 }}
              onClick={handleFlip}
              className="absolute inset-0 cursor-pointer"
            >
              <div className={`w-full h-full rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-4 border-white ${isFlipped ? "bg-[#1CB0F6] text-white" : "bg-white text-gray-800"}`}>
                <RotateCcw className={`absolute top-6 right-6 ${isFlipped ? "text-white/50" : "text-gray-300"} w-6 h-6`} />
                <span className={`text-sm font-black tracking-widest uppercase mb-4 ${isFlipped ? "text-white/70" : "text-[#1CB0F6]"}`}>
                  {isFlipped ? "Mặt Sau" : "Mặt Trước"}
                </span>
                <h3 className={`text-2xl md:text-3xl font-black leading-snug ${isFlipped ? "text-white" : "text-gray-800"}`}>
                  {isFlipped ? card.back : card.front}
                </h3>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-4 mt-12 transition-opacity duration-300 ${isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(false); }}
            className="flex items-center gap-2 px-8 py-4 bg-white text-[#FF4B4B] border-2 border-[#FF4B4B]/20 rounded-2xl font-black text-lg shadow-[0_4px_0_rgba(255,75,75,0.2)] hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(255,75,75,0.2)] transition-all"
          >
            <X strokeWidth={3} /> Chưa thuộc
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(true); }}
            className="flex items-center gap-2 px-8 py-4 bg-[#58CC02] text-white rounded-2xl font-black text-lg shadow-[0_4px_0_#58A700] hover:-translate-y-1 hover:shadow-[0_6px_0_#58A700] transition-all"
          >
            <Check strokeWidth={3} /> Đã thuộc
          </button>
        </div>
      </div>
    </div>
  );
}
