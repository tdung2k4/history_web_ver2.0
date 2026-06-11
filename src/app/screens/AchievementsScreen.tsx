import { ACHIEVEMENTS, useApp } from "../store";
import { motion } from "motion/react";
import { Lock, Crown } from "lucide-react";
import { useIsPremium } from "../hooks/useIsPremium";
import { useNavigate } from "react-router";
import { useSound } from "../hooks/useSound";

const RARITY_CFG = {
  common:    { label: "Phổ Thông",   bg: "#FFF5CD", border: "#FFE366", color: "#B8860B" },
  rare:      { label: "Hiếm",        bg: "#E8F0FE", border: "#AECBFA", color: "#1967D2" },
  epic:      { label: "Sử Thi",      bg: "#F3E8FD", border: "#D7B5FD", color: "#8430CE" },
  legendary: { label: "Huyền Thoại", bg: "#FDEAE8", border: "#F9A298", color: "#C5221F" },
} as const;

export default function AchievementsScreen() {
  const { user } = useApp();
  const isPremium = useIsPremium();
  const nav = useNavigate();
  const { playPop } = useSound();

  const earned = (id: string) => {
    if (id === "a1") return user.completedLessons.length >= 1;
    if (id === "a2") return user.xp >= 100;
    if (id === "a3") return user.completedLessons.some((l) => l.endsWith("-l5") || l.endsWith("-l4"));
    if (id === "a4") return user.completedLessons.length >= 5;
    if (id === "a5") return user.completedLessons.length >= 5;
    if (id === "a6") return user.streak >= 7;
    return false;
  };

  const earnedCount = ACHIEVEMENTS.filter((a) => earned(a.id)).length;

  return (
    <div className="min-h-screen bg-[#FFF9E6] font-['Nunito',sans-serif] pt-24 pb-24 selection:bg-[#58CC02]/30">
      
      {/* ── Header ── */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Thành Tựu
          </h1>
          <p className="text-lg text-gray-500 font-bold mt-2">
            Thu thập huy hiệu chiến binh lịch sử
          </p>
        </div>
        
        {/* Counter Badge */}
        <div className="flex items-center gap-4 bg-white px-5 py-4 rounded-3xl border-2 border-gray-100 shadow-[0_4px_0_rgba(0,0,0,0.02)] shrink-0">
          <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center">
            <Crown size={24} strokeWidth={3} fill="currentColor" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-800 leading-none">
              {earnedCount} <span className="text-gray-400 text-lg">/ {ACHIEVEMENTS.length}</span>
            </div>
            <div className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">
              Đã thu thập
            </div>
          </div>
        </div>
      </div>

      {/* ── Achievement grid ── */}
      <div className="px-4 md:px-8 max-w-4xl mx-auto mt-4">
        
        {/* Empty State Banner */}
        {earnedCount === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-blue-50 border-2 border-blue-100 rounded-3xl p-6 flex items-center gap-6"
          >
            <motion.div 
              animate={{ rotate: [-10, 10, -10] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl origin-bottom"
            >
              👋
            </motion.div>
            <div>
              <h3 className="text-xl font-black text-gray-800">Chưa có huy hiệu nào!</h3>
              <p className="text-gray-600 font-bold mt-1">Hãy bắt đầu bài học đầu tiên để mở khóa huy hiệu đầu đời nhé!</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((a, i) => {
            const has = earned(a.id);
            const cfg = RARITY_CFG[a.rarity as keyof typeof RARITY_CFG];
            
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.85, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 22 }}
                whileHover={has ? { y: -4, scale: 1.02 } : {}}
                onClick={() => playPop()}
                className={`rounded-[2rem] p-6 text-center relative overflow-hidden transition-all duration-300 ${has ? "bg-white cursor-pointer" : "bg-gray-100/50 cursor-pointer"}`}
                style={{
                  border: has ? `3px solid ${cfg.border}` : "3px solid #E5E7EB",
                  boxShadow: has ? `0 8px 0 0 ${cfg.border}40` : "none",
                }}
              >
                {/* Rarity badge */}
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-xl shadow-sm"
                  style={{ 
                    backgroundColor: has ? cfg.border : "#D1D5DB", 
                  }}
                >
                  <span className={`text-[10px] font-black tracking-wider uppercase ${has ? "text-white" : "text-gray-500"}`}>
                    {cfg.label}
                  </span>
                </div>

                {/* Background soft blob for earned */}
                {has && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" 
                    style={{ backgroundColor: cfg.bg }}
                  />
                )}

                {/* Icon */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 mt-6 mb-4">
                  {has ? (
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0] 
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                      className="text-6xl drop-shadow-xl z-10"
                    >
                      {a.icon}
                    </motion.div>
                  ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <span className="text-6xl grayscale opacity-20 contrast-0 blur-[1px]">
                        {a.icon}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-10 h-10 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
                          <Lock className="w-5 h-5 text-gray-400" strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <h3 className={`font-black text-lg mb-1 z-10 relative ${has ? "text-gray-900" : "text-gray-400"}`}>
                  {has ? a.title : "Chưa mở khóa"}
                </h3>
                <p className={`font-bold text-sm z-10 relative ${has ? "text-gray-500" : "text-gray-400"}`}>
                  {a.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Premium Exclusive Badges ── */}
        <div className="mt-16 pt-8 border-t-4 border-gray-100 border-dashed">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFF4E5] rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#FF9600]" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Huy Hiệu Độc Quyền Pro</h2>
            </div>
            
            {!isPremium && (
              <button
                onClick={() => nav("/premium")}
                className="flex items-center gap-2 bg-[#FFC800] hover:bg-[#FFB400] text-white px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-wider transition-transform active:scale-95 shadow-[0_4px_0_#D89E00]"
              >
                <Crown className="w-4 h-4" strokeWidth={3} />
                Mở khóa
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🛡️", title: "Chiến Thần", desc: "Hoàn thành 100%", current: Math.min(100, Math.floor((user.completedLessons.length / 10) * 100)), max: 100, suffix: "%" },
              { icon: "📜", title: "Sử Gia", desc: "Nắm vững 4 thời kỳ", current: Math.min(4, Math.floor(user.completedLessons.length / 3)), max: 4, suffix: "" },
              { icon: "🌟", title: "Bậc Thầy", desc: "Streak 30 ngày", current: Math.min(30, user.streak), max: 30, suffix: "" },
              { icon: "👑", title: "Đế Vương", desc: "Top 1 Leaderboard", current: user.xp >= 1000 ? 1 : 0, max: 1, suffix: "" },
            ].map((badge, i) => {
              const achieved = badge.current >= badge.max;
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-3xl p-5 text-center relative overflow-hidden border-2 shadow-sm transition-all flex flex-col items-center ${isPremium && achieved ? "bg-white border-[#FFC800] shadow-[0_4px_12px_rgba(255,200,0,0.15)]" : "bg-gray-50 border-gray-100"}`}
              >
                {!isPremium && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] z-20">
                    <div className="bg-[#FFC800] text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                      Pro
                    </div>
                  </div>
                )}
                
                <div className={`text-5xl mb-3 mt-2 ${isPremium && achieved ? "drop-shadow-lg" : "grayscale opacity-40 blur-[1px]"}`}>
                  {badge.icon}
                </div>
                
                <h4 className={`font-black text-base mb-1 ${isPremium && achieved ? "text-gray-900" : "text-gray-400"}`}>
                  {badge.title}
                </h4>
                <p className={`font-bold text-xs mb-4 ${isPremium && achieved ? "text-gray-500" : "text-gray-400"}`}>
                  {badge.desc}
                </p>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-auto overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(badge.current / badge.max) * 100}%`,
                      background: achieved ? "#58CC02" : "#FFC800"
                    }}
                  />
                </div>
                <div className="text-[10px] font-bold mt-1.5 tracking-wider uppercase" style={{ color: achieved ? "#58CC02" : "#9CA3AF" }}>
                  {badge.current}{badge.suffix} / {badge.max}{badge.suffix}
                </div>
              </motion.div>
            )})}
          </div>

          {!isPremium && (
            <div className="text-center mt-6">
              <p className="text-gray-400 font-bold text-sm tracking-wide">
                Hãy nâng cấp tài khoản Pro để mở khóa 4 huy hiệu lấp lánh này nhé!
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
