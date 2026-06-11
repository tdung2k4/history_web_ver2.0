import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { useApp, MASCOTS } from "../store";
import { useState, useEffect } from "react";
import { useAppSound } from "../hooks/useAppSound";
import { Sparkles, X } from "lucide-react";

const GREETINGS = [
  "Cần giúp đỡ gì không?",
  "Sử Thần AI luôn sẵn sàng!",
  "Khám phá lịch sử cùng tớ nhé ✌️",
  "Click vào tớ để chat AI nào!",
];

export default function AnimatedMascot() {
  const { user } = useApp();
  const nav = useNavigate();
  const location = useLocation();
  const playClick = useAppSound("click");
  const [showBubble, setShowBubble] = useState(false);
  const [greetingMsg, setGreetingMsg] = useState(GREETINGS[0]);

  // Mascot lookup
  const userMascot = MASCOTS.find(m => m.id === user.mascotId) || MASCOTS[0];

  // Randomize greeting message every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingMsg(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 5000); // Hide after 5s
    }, 15000); // Show every 15s

    return () => clearInterval(interval);
  }, []);

  // Hide mascot if already in AI chat or some specific screens
  if (location.pathname === "/ai-chat" || location.pathname.includes("/lesson/") || location.pathname.includes("/story/")) {
    return null;
  }

  return (
    <div className="fixed bottom-24 lg:bottom-10 right-4 lg:right-10 z-40 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="mb-3 px-4 py-3 rounded-2xl rounded-br-sm shadow-xl pointer-events-auto relative cursor-pointer group"
            style={{ 
              background: "linear-gradient(135deg, #fff, #fdf8ef)",
              border: "2px solid #fde68a"
            }}
            onClick={() => {
              playClick();
              nav("/ai-chat");
            }}
          >
            <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, color: "#92400e", fontSize: 13 }}>
              {greetingMsg}
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border border-amber-200 flex items-center justify-center text-stone-400 opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ 
          scale: 1.15, 
          y: -12,
          rotate: [0, -6, 8, -6, 8, 0],
          transition: { rotate: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }, type: "spring", stiffness: 300 }
        }}
        whileTap={{ scale: 0.9, y: 10 }}
        onClick={() => {
          playClick();
          nav("/ai-chat");
        }}
        className="pointer-events-auto relative group flex items-center justify-center"
      >
        {/* Glow behind mascot */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${userMascot.color}50 0%, transparent 70%)` }}
        />

        {/* Mascot image with breathing animation */}
        <motion.div
          animate={{ 
            y: [0, -6, 0], 
            scaleY: [1, 1.02, 1], // Breathing squash/stretch
            scaleX: [1, 0.98, 1] 
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img 
            src={userMascot.img} 
            alt="Mascot Assistant" 
            className="w-32 h-32 lg:w-40 lg:h-40 object-contain drop-shadow-2xl" 
            style={{
              filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.3))",
              transform: "scale(1.2)"
            }}
          />
        </motion.div>

        {/* Sparkles on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-amber-400 animate-ping" />
          <Sparkles className="absolute top-1/2 -left-3 w-4 h-4 text-amber-500 animate-pulse" />
        </div>
      </motion.button>
    </div>
  );
}
