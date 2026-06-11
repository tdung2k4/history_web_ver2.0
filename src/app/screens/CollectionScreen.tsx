import { UNITS, useApp } from "../store";
import { motion } from "motion/react";
import { Lock, BookOpen } from "lucide-react";
import { useSound } from "../hooks/useSound";

const CARDS = [
  { id: "c1", title: "Trống Đồng Đông Sơn", era: "Văn Lang · ~500 TCN", icon: "🥁", unitId: "u1", desc: "Biểu tượng văn minh Đông Sơn huyền thoại" },
  { id: "c2", title: "Thành Cổ Loa", era: "Âu Lạc · 257 TCN", icon: "🏯", unitId: "u1", desc: "Kinh đô xoắn ốc đầu tiên của người Việt" },
  { id: "c3", title: "Voi của Bà Triệu", era: "Bắc thuộc · 248", icon: "🐘", unitId: "u2", desc: "Nữ tướng phi ngựa trắng, mặc giáp vàng" },
  { id: "c4", title: "Cọc Bạch Đằng", era: "938 SCN", icon: "⚓", unitId: "u2", desc: "Bẫy gỗ lim nhấn chìm hạm đội Nam Hán" },
  { id: "c5", title: "Chiếu Dời Đô", era: "Nhà Lý · 1010", icon: "📜", unitId: "u3", desc: "Tờ chiếu mở ra ngàn năm Thăng Long" },
  { id: "c6", title: "Hịch Tướng Sĩ", era: "Nhà Trần · 1285", icon: "📃", unitId: "u3", desc: "Lời hiệu triệu sục sôi máu chiến binh" },
  { id: "c7", title: "Bình Ngô Đại Cáo", era: "Nhà Lê · 1428", icon: "📖", unitId: "u4", desc: "Tuyên ngôn độc lập đầu tiên của dân tộc" },
  { id: "c8", title: "Voi Chiến", era: "Tây Sơn · 1789", icon: "🐘", unitId: "u4", desc: "Trận Đống Đa – phá tan 20 vạn quân Thanh" },
];

export default function CollectionScreen() {
  const { user } = useApp();
  const { playPop } = useSound();

  const unlocked = (unitId: string) => {
    const unit = UNITS.find((u) => u.id === unitId);
    return unit?.lessons.some((l) => user.completedLessons.includes(l.id));
  };

  const unlockedCount = CARDS.filter((c) => unlocked(c.unitId)).length;

  return (
    <div className="min-h-screen bg-[#FFF9E6] font-['Nunito',sans-serif] pt-24 pb-24 selection:bg-[#58CC02]/30">
      
      {/* ── Header ── */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Bộ Sưu Tập
          </h1>
          <p className="text-lg text-gray-500 font-bold mt-2">
            Khám phá kho tàng lịch sử khổng lồ!
          </p>
        </div>
        
        {/* Counter Badge */}
        <div className="flex items-center gap-4 bg-white px-5 py-4 rounded-3xl border-2 border-gray-100 shadow-[0_4px_0_rgba(0,0,0,0.02)] shrink-0">
          <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center">
            <BookOpen size={24} strokeWidth={3} fill="currentColor" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-800 leading-none">
              {unlockedCount} <span className="text-gray-400 text-lg">/ {CARDS.length}</span>
            </div>
            <div className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">
              Đã thu thập
            </div>
          </div>
        </div>
      </div>

      {/* ── Collection Grid (Sticker Book Style) ── */}
      <div className="px-4 md:px-8 max-w-4xl mx-auto mt-4">

        {/* Empty State Banner */}
        {unlockedCount === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-[#FFF5C2] border-2 border-[#FFC800]/30 rounded-3xl p-6 flex items-center gap-6"
          >
            <motion.div 
              animate={{ rotate: [-10, 10, -10] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl origin-bottom"
            >
              🦊
            </motion.div>
            <div>
              <h3 className="text-xl font-black text-[#FF9600]">Bộ sưu tập đang trống!</h3>
              <p className="text-gray-600 font-bold mt-1">Cáo nhỏ đang đợi bạn hoàn thành bài học để thu thập bảo vật lịch sử đấy!</p>
            </div>
          </motion.div>
        )}
        
        {/* The Binder Spine Design */}
        <div className="bg-white rounded-[2rem] p-6 md:p-10 border-2 border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative">
          
          {/* Decorative Binder Rings */}
          <div className="hidden md:flex flex-col gap-12 absolute -left-4 top-1/2 -translate-y-1/2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-8 h-4 bg-gray-200 rounded-full border-2 border-gray-300 shadow-inner" />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {CARDS.map((c, i) => {
              const has = unlocked(c.unitId);
              
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 22 }}
                  whileHover={has ? { y: -4, scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 } : {}}
                  onClick={() => {
                    playPop();
                    if (!has) {
                      alert("Hãy hoàn thành bài học trước để mở khóa bảo vật này!");
                    }
                  }}
                  className={`flex flex-col items-center p-4 rounded-3xl transition-transform ${has ? "cursor-pointer" : "cursor-pointer"}`}
                >
                  {/* Sticker Area */}
                  <div 
                    className={`w-28 h-28 md:w-32 md:h-32 rounded-[2rem] flex items-center justify-center relative mb-4 ${has ? "bg-blue-50 shadow-sm border-2 border-blue-100" : "bg-gray-100 border-2 border-dashed border-gray-200"}`}
                  >
                    {has ? (
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                        className="text-6xl drop-shadow-xl"
                      >
                        {c.icon}
                      </motion.div>
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <span className="text-5xl brightness-0 opacity-30 drop-shadow-md">
                          {c.icon}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-gray-300" strokeWidth={3} />
                        </div>
                      </div>
                    )}

                    {/* Peel effect for unlocked stickers */}
                    {has && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-tl from-gray-200 to-transparent rounded-bl-lg transform rotate-45 opacity-50" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center w-full">
                    <h3 className={`font-black text-sm md:text-base leading-tight mb-1 ${has ? "text-gray-800" : "text-gray-400 blur-[3px] select-none"}`}>
                      {c.title}
                    </h3>
                    <p className={`font-bold text-xs uppercase tracking-wide mb-2 ${has ? "text-blue-500" : "text-gray-300"}`}>
                      {has ? c.era : "Khóa"}
                    </p>
                    {has ? (
                      <p className="text-gray-500 font-bold text-xs leading-snug">
                        {c.desc}
                      </p>
                    ) : (
                      <p className="text-gray-300 font-bold text-xs leading-snug">
                        Học để mở
                      </p>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
