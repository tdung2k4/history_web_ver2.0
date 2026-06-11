import { MISSIONS, useApp } from "../store";
import { motion } from "motion/react";
import { CheckCircle2, Clock, Star } from "lucide-react";
import { useSound } from "../hooks/useSound";

export default function MissionsScreen() {
  const { user } = useApp();
  const { playPop } = useSound();

  const getProgress = (id: string) => {
    if (id === "m1") return Math.min(user.completedLessons.length, 1);
    if (id === "m2") return Math.min(user.xp, 50);
    if (id === "m3") return Math.min(user.streak, 3);
    return 0;
  };

  const completedCount = MISSIONS.filter((m) => getProgress(m.id) >= m.target).length;

  return (
    <div className="min-h-screen bg-[#FFF9E6] font-['Nunito',sans-serif] pt-24 pb-24 selection:bg-[#58CC02]/30">
      
      {/* ── Header ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Nhiệm Vụ
          </h1>
          <p className="text-lg text-gray-500 font-bold mt-2">
            Hoàn thành mục tiêu mỗi ngày để nhận thưởng!
          </p>
        </div>
        
        {/* Progress Counter Badge */}
        <div className="flex items-center gap-4 bg-white px-5 py-4 rounded-3xl border-2 border-gray-100 shadow-[0_4px_0_rgba(0,0,0,0.02)] shrink-0">
          <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center">
            <Star size={24} strokeWidth={3} fill="currentColor" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-800 leading-none">
              {completedCount} <span className="text-gray-400 text-lg">/ {MISSIONS.length}</span>
            </div>
            <div className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">
              Đã xong
            </div>
          </div>
        </div>
      </div>

      {/* ── Missions list ── */}
      <div className="px-4 md:px-8 max-w-3xl mx-auto flex flex-col gap-5 mt-4">
        {MISSIONS.map((m, i) => {
          const p = getProgress(m.id);
          const pct = Math.min(100, (p / m.target) * 100);
          const done = p >= m.target;

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 }}
              className="relative w-full rounded-[2rem] bg-white border-2 border-gray-100 transition-transform"
              style={{
                boxShadow: done 
                  ? "0 6px 0 0 #58CC02" 
                  : "0 6px 0 0 #E5E5E5",
              }}
              whileHover={{ y: -2 }}
              whileTap={{ y: 2, boxShadow: done ? "0 2px 0 0 #58CC02" : "0 2px 0 0 #E5E5E5" }}
              onClick={() => playPop()}
            >
              <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                
                {/* Icon */}
                <div
                  className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center shrink-0 text-4xl relative overflow-hidden"
                  style={{
                    backgroundColor: done ? "#58CC02" : "#FFF4E5",
                    boxShadow: done ? "none" : "0 4px 0 #FFE0B2",
                  }}
                >
                  <span className={done ? "text-white drop-shadow-md" : "text-gray-800"}>
                    {done ? "✔️" : m.icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className={`font-black text-xl md:text-2xl tracking-wide ${done ? "text-[#58CC02]" : "text-gray-800"}`}>
                      {m.title}
                    </p>
                    {!done && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC800]/10 rounded-xl border-2 border-[#FFC800]/20 shrink-0">
                        <span className="text-[#FF9600] text-sm font-black">+{m.reward}</span>
                        <span className="text-sm drop-shadow-sm">💎</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-500 font-bold text-sm md:text-base mb-5">
                    {m.desc}
                  </p>

                  {/* Fat Progress bar */}
                  <div className="flex flex-col gap-2">
                    <div className="h-5 w-full bg-gray-100 rounded-full overflow-hidden relative border border-gray-200 inset-shadow-sm">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full relative overflow-hidden"
                        style={{
                          backgroundColor: done ? "#58CC02" : "#FFC800",
                        }}
                      >
                        {/* Glossy shine effect */}
                        <div className="absolute top-1 left-2 right-2 h-1.5 bg-white/30 rounded-full" />
                      </motion.div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <span className={`text-sm font-black ${done ? "text-[#58CC02]" : "text-gray-400"}`}>
                        {p} / {m.target}
                      </span>
                      {done && (
                        <span className="text-[#58CC02] text-sm font-black uppercase tracking-wider">
                          Đã Hoàn Thành!
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Daily reset notice */}
        <div className="flex items-center justify-center gap-2 mt-8 opacity-60">
          <Clock className="w-5 h-5 text-gray-500" strokeWidth={3} />
          <p className="text-gray-500 font-bold tracking-wide uppercase text-sm">
            Nhiệm vụ sẽ làm mới vào ngày mai
          </p>
        </div>
      </div>
    </div>
  );
}
