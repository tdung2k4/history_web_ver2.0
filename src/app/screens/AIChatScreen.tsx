import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, Crown, Lock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { useApp } from "../store";
import { useIsPremium } from "../hooks/useIsPremium";
import PremiumModal from "../components/PremiumModal";
import { useAppSound } from "../hooks/useAppSound";
import { initChatSession } from "../../services/geminiService";
import { ChatSession } from "@google/generative-ai";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
};

const AI_SUGGESTIONS = [
  "Tại sao Ngô Quyền lại thắng trận Bạch Đằng?",
  "Kể tôi nghe về Hai Bà Trưng",
  "Lý Thường Kiệt là ai?",
  "Vì sao nhà Trần thắng quân Mông Cổ?",
];

const FREE_MESSAGE_LIMIT = 10;

// Demo AI responses removed as we are using Gemini API

export default function AIChatScreen() {
  const { user } = useApp();
  const isPremium = useIsPremium();
  const nav = useNavigate();
  const playClick = useAppSound("click");
  const playModal = useAppSound("modal");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: `Chào ${user.name || "Chiến Binh"}! 👋 Tôi là **Sử Thần AI** — trợ lý học lịch sử thông minh của bạn.\n\nHỏi tôi bất cứ điều gì về lịch sử Việt Nam! ${isPremium ? "Bạn có thể chat không giới hạn với Pro 👑" : `Bạn còn ${FREE_MESSAGE_LIMIT} câu hỏi miễn phí hôm nay.`}`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const remainingMsgs = FREE_MESSAGE_LIMIT - msgCount;
  const isLimitReached = !isPremium && msgCount >= FREE_MESSAGE_LIMIT;

  useEffect(() => {
    setChatSession(initChatSession());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    playClick();
    if (isLimitReached) {
      playModal();
      setShowPremiumModal(true);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setMsgCount((c) => c + 1);

    if (!chatSession) {
      // Fallback khi thiếu API Key
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((m) => [...m, { 
          id: (Date.now() + 1).toString(), 
          role: "ai", 
          content: "⚠️ **Cảnh báo Hệ Thống:** Không tìm thấy Gemini API Key trong môi trường (VITE_GEMINI_API_KEY).\n\nHãy tạo API key miễn phí tại Google AI Studio và lưu vào file `.env.local` ở thư mục gốc của dự án để Sử Thần có thể trò chuyện với bạn.", 
          timestamp: new Date() 
        }]);
      }, 1000);
      return;
    }

    setIsTyping(true); // Hiệu ứng lúc chờ data chunk đầu tiên
    const aiId = (Date.now() + 1).toString();
    setMessages((m) => [...m, { id: aiId, role: "ai", content: "", timestamp: new Date() }]);

    try {
      const result = await chatSession.sendMessageStream(text);
      let isFirstChunk = true;
      
      for await (const chunk of result.stream) {
        if (isFirstChunk) {
          setIsTyping(false);
          isFirstChunk = false;
        }
        const chunkText = chunk.text();
        setMessages((m) => m.map(msg => msg.id === aiId ? { ...msg, content: msg.content + chunkText } : msg));
      }
    } catch (e) {
      setIsTyping(false);
      setMessages((m) => m.map(msg => msg.id === aiId ? { ...msg, content: "Sử thần đang bận thiền định, xin quay lại sau! (Lỗi kết nối API)" } : msg));
    }
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={i} className={i > 0 ? "mt-2" : ""} dangerouslySetInnerHTML={{ __html: bold }} />;
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #fdf8ef 0%, #f7f0e2 100%)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3"
        style={{
          background: "rgba(250,245,232,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(240,180,41,0.2)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <button
          onClick={() => { playClick(); nav(-1); }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(240,180,41,0.1)", color: "#92400e" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center relative"
          style={{ background: "linear-gradient(135deg, #1c0800, #2d1400)", border: "1.5px solid rgba(240,180,41,0.4)" }}
        >
          <span style={{ fontSize: 20 }}>🤖</span>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
            style={{ background: "#22c55e", border: "1.5px solid white" }}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p style={{ color: "#1c1209", fontSize: 14, fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>Sử Thần AI</p>
            {isPremium && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md" style={{ background: "linear-gradient(135deg, #d97706, #f0b429)", fontSize: 8, color: "#1c0800", fontWeight: 800 }}>
                <Crown style={{ width: 8, height: 8 }} />
                PRO
              </span>
            )}
          </div>
          <p style={{ color: "#a8a29e", fontSize: 10, fontFamily: '"Nunito", sans-serif' }}>
            {isPremium ? "Chat không giới hạn" : `Còn ${Math.max(0, remainingMsgs)} câu hỏi hôm nay`}
          </p>
        </div>

        {!isPremium && (
          <button
            onClick={() => { playModal(); setShowPremiumModal(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: "linear-gradient(135deg, #d97706, #f0b429)", color: "#1c0800", fontSize: 11, fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}
          >
            <Crown className="w-3 h-3" />
            Pro
          </button>
        )}
      </div>

      {/* Message limit warning banner */}
      <AnimatePresence>
        {!isPremium && remainingMsgs <= 3 && remainingMsgs > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="px-4 py-2.5 flex items-center justify-between gap-3"
            style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(217,119,6,0.08))", borderBottom: "1px solid rgba(240,180,41,0.2)" }}
          >
            <p style={{ color: "#92400e", fontSize: 11, fontFamily: '"Nunito", sans-serif' }}>
              ⚠️ Còn <strong>{remainingMsgs}</strong> câu hỏi miễn phí hôm nay
            </p>
            <button
              onClick={() => setShowPremiumModal(true)}
              style={{ color: "#d97706", fontSize: 11, fontWeight: 700, fontFamily: '"Nunito", sans-serif', whiteSpace: "nowrap" }}
            >
              Nâng cấp →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-6">
        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="space-y-2 mb-4">
            <p style={{ color: "#a8a29e", fontSize: 11, fontFamily: '"Nunito", sans-serif', textAlign: "center" }}>💡 Gợi ý câu hỏi</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {AI_SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-2 rounded-xl text-left"
                  style={{
                    background: "rgba(255,252,242,0.9)",
                    border: "1px solid rgba(240,180,41,0.25)",
                    color: "#92400e",
                    fontSize: 12,
                    fontFamily: '"Nunito", sans-serif',
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i === messages.length - 1 ? 0 : 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 self-end"
              style={{
                background: msg.role === "ai"
                  ? "linear-gradient(135deg, #1c0800, #2d1400)"
                  : "linear-gradient(135deg, rgba(240,180,41,0.2), #fef3c7)",
                border: msg.role === "ai"
                  ? "1.5px solid rgba(240,180,41,0.35)"
                  : "1.5px solid rgba(240,180,41,0.4)",
              }}
            >
              {msg.role === "ai" ? "🤖" : user.avatar || "🦊"}
            </div>

            {/* Bubble */}
            <div
              className="max-w-[80%] px-4 py-3 rounded-2xl"
              style={{
                background: msg.role === "ai"
                  ? "linear-gradient(145deg, rgba(255,253,242,0.98), rgba(255,249,228,0.95))"
                  : "linear-gradient(135deg, #b85c00, #d97706)",
                border: msg.role === "ai"
                  ? "1px solid rgba(240,180,41,0.2)"
                  : "none",
                color: msg.role === "ai" ? "#1c1209" : "#fffbeb",
                fontSize: 13,
                fontFamily: '"Nunito", sans-serif',
                lineHeight: 1.65,
                boxShadow: msg.role === "ai"
                  ? "0 2px 12px rgba(0,0,0,0.06)"
                  : "0 3px 12px rgba(217,119,6,0.3)",
                borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                borderBottomLeftRadius: msg.role === "ai" ? 4 : 16,
              }}
            >
              {formatContent(msg.content)}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 items-end"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg, #1c0800, #2d1400)", border: "1.5px solid rgba(240,180,41,0.35)" }}>
                🤖
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center" style={{ background: "rgba(255,253,242,0.98)", border: "1px solid rgba(240,180,41,0.2)" }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#d97706" }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Limit reached wall */}
        <AnimatePresence>
          {isLimitReached && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 text-center"
              style={{ background: "linear-gradient(145deg, #1c0d00, #120800)", border: "1.5px solid rgba(240,180,41,0.3)" }}
            >
              <Lock className="w-6 h-6 mx-auto mb-2" style={{ color: "#f0b429" }} />
              <p style={{ color: "#f0c070", fontSize: 13, fontWeight: 700, fontFamily: '"Nunito", sans-serif', marginBottom: 4 }}>
                Đã hết 10 câu hỏi miễn phí
              </p>
              <p style={{ color: "#7a6040", fontSize: 11, fontFamily: '"Nunito", sans-serif', marginBottom: 16 }}>
                Nâng cấp Pro để chat không giới hạn với Sử Thần AI
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { playModal(); setShowPremiumModal(true); }}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #b85c00, #d97706, #f5b830)", color: "#1c0800", fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 13 }}
              >
                <Sparkles className="w-4 h-4" />
                Chat Không Giới Hạn với Pro
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className="sticky bottom-0 px-4 py-3 pb-safe"
        style={{
          background: "rgba(250,245,232,0.96)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(240,180,41,0.2)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
          paddingBottom: "env(safe-area-inset-bottom, 12px)",
        }}
      >
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder={isLimitReached ? "Nâng cấp Pro để tiếp tục..." : "Hỏi về lịch sử Việt Nam..."}
            disabled={isLimitReached}
            className="flex-1 px-4 py-3 rounded-2xl outline-none"
            style={{
              background: "rgba(255,252,242,0.9)",
              border: "1.5px solid rgba(240,180,41,0.25)",
              color: "#1c1209",
              fontSize: 13,
              fontFamily: '"Nunito", sans-serif',
              boxShadow: "0 1px 4px rgba(0,0,0,0.05) inset",
            }}
          />
          <motion.button
            whileHover={!isLimitReached ? { scale: 1.05 } : {}}
            whileTap={!isLimitReached ? { scale: 0.95 } : {}}
            onClick={() => {
              if (isLimitReached) {
                playModal();
                setShowPremiumModal(true);
              } else {
                sendMessage(input);
              }
            }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: isLimitReached
                ? "rgba(240,180,41,0.15)"
                : input.trim()
                  ? "linear-gradient(135deg, #b85c00, #d97706, #f0b429)"
                  : "rgba(240,180,41,0.15)",
              boxShadow: input.trim() && !isLimitReached ? "0 4px 0 #7c2d0a" : "none",
              color: input.trim() && !isLimitReached ? "#1c0800" : "#c4a882",
            }}
          >
            {isLimitReached ? <Lock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {showPremiumModal && (
        <PremiumModal
          trigger="feature"
          onClose={() => setShowPremiumModal(false)}
        />
      )}
    </div>
  );
}
