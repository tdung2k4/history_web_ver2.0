import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useApp } from "../store";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import explorerImg from "../../imports/explorer.jpg";

const FLOATS = [
  { sym: "📜", x: 12, y: 18 },
  { sym: "⚔️", x: 78, y: 12 },
  { sym: "🛡️", x: 22, y: 72 },
  { sym: "🎖️", x: 68, y: 75 },
  { sym: "🏛️", x: 45, y: 8 },
];

export default function LoginScreen() {
  const nav = useNavigate();
  const { user, setUser } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [focused, setFocused] = useState<"user" | "pw" | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setErr("Vui lòng nhập đầy đủ thông tin");
    if (password.length < 4) return setErr("Mật khẩu tối thiểu 4 ký tự");
    setUser({ ...user, username });
    nav("/home"); // Đăng nhập luôn về home — không hỏi lại onboarding
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 lg:p-8"
      style={{ background: "linear-gradient(145deg, #faf5e8 0%, #f5eedc 50%, #f0e8ce 100%)" }}
    >
      {/* Background subtle textures */}
      <div className="fixed inset-0 pointer-events-none">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(217,119,6,0.04) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 40% 40% at 15% 80%, rgba(120,53,15,0.04) 0%, transparent 55%)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl flex rounded-3xl overflow-hidden relative z-10"
        style={{
          border: "1px solid rgba(240,180,41,0.25)",
          boxShadow: "0 4px 0 rgba(140,90,30,0.12), 0 8px 48px rgba(0,0,0,0.14), 0 1px 0 rgba(255,255,255,0.8) inset",
        }}
      >
        {/* ── Left cinematic panel (desktop) ── */}
        <div
          className="hidden lg:flex flex-col justify-between w-80 shrink-0 relative overflow-hidden"
          style={{ background: "linear-gradient(155deg, #281200 0%, #160900 45%, #0a0600 100%)" }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 75% 55% at 50% 42%, rgba(240,180,41,0.11) 0%, transparent 65%)" }} />
          <div className="grid-overlay" />

          {/* Floating symbols */}
          {FLOATS.map((f, i) => (
            <motion.span
              key={i}
              className="absolute pointer-events-none"
              animate={{ opacity: [0, 0.12, 0.06], y: [0, -12, 0] }}
              transition={{ duration: 4.5 + i * 0.5, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }}
              style={{ fontSize: 16, left: `${f.x}%`, top: `${f.y}%`, filter: "blur(0.5px)" }}
            >
              {f.sym}
            </motion.span>
          ))}

          {/* Top section */}
          <div className="p-8 relative z-10">
            <div className="absolute top-0 left-0 right-0 h-px gold-line" />

            {/* Logo medallion */}
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(240,180,41,0.2)", "0 0 40px rgba(240,180,41,0.38)", "0 0 20px rgba(240,180,41,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-5"
              style={{
                background: "radial-gradient(circle at 38% 32%, rgba(240,180,41,0.28) 0%, rgba(18,8,0,0.95) 65%)",
                border: "1.5px solid rgba(240,180,41,0.5)",
              }}
            >
              🏛️
            </motion.div>

            <div className="mb-1 flex items-center gap-2">
              <div style={{ width: 20, height: 1, background: "rgba(240,180,41,0.4)" }} />
              <p style={{ color: "rgba(196,168,130,0.55)", fontSize: 9, letterSpacing: "0.3em" }}>
                HISTORY ALIVE
              </p>
            </div>
            <h2
              className="mb-3"
              style={{ color: "#f0c070", fontSize: 24, fontWeight: 900, lineHeight: 1.2 }}
            >
              Chào Mừng<br />Trở Lại!
            </h2>
            <p style={{ color: "#c4a882", fontSize: 13, lineHeight: 1.6 }}>
              Tiếp tục hành trình chinh phục lịch sử của bạn
            </p>
          </div>

          {/* Explorer image container */}
          <div className="relative w-full flex-1 min-h-[300px] overflow-hidden">
            <img 
              src={explorerImg} 
              alt="Explorer with dinosaur"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                maskImage: "linear-gradient(to top, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 100%)",
              }}
            />
          </div>

          {/* Bottom gold line */}
          <div className="absolute bottom-0 left-0 right-0 h-px gold-line-subtle" />
        </div>

        {/* ── Right form panel ── */}
        <div
          className="flex-1 p-8 lg:p-12"
          style={{
            background: "linear-gradient(160deg, #fdfaf2 0%, #f9f4e3 100%)",
          }}
        >
          <div className="max-w-sm mx-auto">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
                style={{
                  background: "radial-gradient(circle, rgba(217,119,6,0.12), rgba(255,251,235,0.9))",
                  border: "2px solid rgba(217,119,6,0.3)",
                  boxShadow: "0 4px 16px rgba(217,119,6,0.15)",
                }}
              >
                🏛️
              </div>
              <p style={{ fontFamily: '"Cinzel", serif', color: "#92400e", fontSize: 12, letterSpacing: "0.18em" }}>
                HISTORY ALIVE
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div style={{ width: 16, height: 2, background: "#d97706", borderRadius: 2 }} />
                <p style={{ color: "#d97706", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Xác thực
                </p>
              </div>
              <h1 style={{ color: "#1c1209", fontSize: 28, fontWeight: 900, fontFamily: '"Nunito", sans-serif', lineHeight: 1.2, marginBottom: 6 }}>
                Đăng nhập
              </h1>
              <p style={{ color: "#9a8060", fontSize: 14, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
                Mừng bạn đã quay lại! 🎉
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {/* Username field */}
              <div>
                <label className="block mb-2" style={{ color: "#78716c", fontSize: 13, fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <input
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setErr(""); }}
                    onFocus={() => setFocused("user")}
                    onBlur={() => setFocused(null)}
                    className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all"
                    style={{
                      background: focused === "user" ? "#fff" : "rgba(255,255,255,0.7)",
                      border: focused === "user" ? "1.5px solid #d97706" : "1.5px solid rgba(240,180,41,0.25)",
                      fontSize: 15,
                      fontFamily: '"Nunito", sans-serif',
                      fontWeight: 600,
                      color: "#1c1209",
                      boxShadow: focused === "user" ? "0 0 0 3px rgba(217,119,6,0.1), 0 2px 8px rgba(0,0,0,0.06)" : "0 1px 4px rgba(0,0,0,0.05)",
                      transition: "all 0.2s ease",
                    }}
                    placeholder="Tên bạn là gì nhỉ?"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block mb-2 mt-4" style={{ color: "#78716c", fontSize: 13, fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
                  Mật khẩu bí mật
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErr(""); }}
                    onFocus={() => setFocused("pw")}
                    onBlur={() => setFocused(null)}
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl outline-none transition-all"
                    style={{
                      background: focused === "pw" ? "#fff" : "rgba(255,255,255,0.7)",
                      border: focused === "pw" ? "1.5px solid #d97706" : "1.5px solid rgba(240,180,41,0.25)",
                      fontSize: 15,
                      fontFamily: '"Nunito", sans-serif',
                      fontWeight: 600,
                      color: "#1c1209",
                      boxShadow: focused === "pw" ? "0 0 0 3px rgba(217,119,6,0.1), 0 2px 8px rgba(0,0,0,0.06)" : "0 1px 4px rgba(0,0,0,0.05)",
                      transition: "all 0.2s ease",
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition"
                    style={{ color: "#a8a29e" }}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {err && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="px-4 py-3 rounded-xl flex items-center gap-2.5"
                    style={{ background: "#fff0f0", border: "1px solid rgba(220,38,38,0.2)" }}
                  >
                    <span style={{ fontSize: 14 }}>⚠️</span>
                    <p style={{ color: "#dc2626", fontSize: 12 }}>{err}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={{ y: -2, boxShadow: "0 6px 0 #b45309" }}
                whileTap={{ y: 4, boxShadow: "0 0px 0 #b45309" }}
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4"
                style={{
                  fontSize: 16,
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  boxShadow: "0 4px 0 #b45309",
                  color: "#fff",
                  border: "none",
                }}
              >
                Vào Lớp Thôi
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "rgba(240,180,41,0.25)" }} />
              <span style={{ color: "#c4b89e", fontSize: 11, fontFamily: '"Inter", sans-serif' }}>hoặc</span>
              <div className="flex-1 h-px" style={{ background: "rgba(240,180,41,0.25)" }} />
            </div>

            {/* Google button */}
            <motion.button
              whileHover={{ y: -1, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setUser({ ...user, username: "google_user" });
                nav("/home"); // Google login luôn về home
              }}
              className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition-all"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1.5px solid rgba(240,180,41,0.2)",
                color: "#57534e",
                fontSize: 13,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <span style={{ fontSize: 16 }}>🌐</span>
              <span>Tiếp tục với Google</span>
            </motion.button>

            <p className="text-center mt-6" style={{ color: "#9a8060", fontSize: 13, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
              Chưa có tài khoản?{" "}
              <Link to="/register" style={{ color: "#d97706", fontWeight: 800 }}>
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
