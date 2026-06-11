import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useApp } from "../store";
import { motion } from "motion/react";
import { Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";

import explorerImg from "../../imports/explorer.jpg";

const FLOATS = ["🏛️", "🗺️", "🎖️", "👑", "📯"];

export default function RegisterScreen() {
  const nav = useNavigate();
  const { user, setUser } = useApp();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return setErr("Vui lòng nhập đầy đủ thông tin");
    if (!email.includes("@")) return setErr("Email không hợp lệ");
    if (password.length < 4) return setErr("Mật khẩu tối thiểu 4 ký tự");
    if (!agreed) return setErr("Vui lòng đồng ý điều khoản sử dụng");
    setUser({ ...user, username, email, isNewUser: true });
    nav("/onboarding/name");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8" style={{ background: "#f8f4e0" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(217,119,6,0.04) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl flex rounded-3xl shadow-2xl overflow-hidden relative z-10"
        style={{ border: "1.5px solid rgba(217,119,6,0.2)" }}
      >
        {/* ── Left cinematic panel (desktop) ── */}
        <div
          className="hidden lg:flex flex-col justify-between w-80 shrink-0 relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1c0a00 0%, #2d1400 40%, #1a0c00 100%)" }}
        >
          {/* Gold ambient glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(240,180,41,0.1) 0%, transparent 65%)" }} />

          {/* Floating symbols */}
          {FLOATS.map((sym, i) => (
            <motion.span
              key={i}
              className="absolute pointer-events-none"
              animate={{ opacity: [0, 0.13, 0.06], y: [0, -14, 0] }}
              transition={{ duration: 4.5 + i * 0.4, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }}
              style={{ fontSize: 18, left: `${8 + (i % 3) * 28}%`, top: `${12 + Math.floor(i / 3) * 40}%`, filter: "blur(0.5px)" }}
            >
              {sym}
            </motion.span>
          ))}

          <div className="p-8 relative z-10">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(240,180,41,0.4), transparent)" }} />

            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(240,180,41,0.18)", "0 0 40px rgba(240,180,41,0.32)", "0 0 20px rgba(240,180,41,0.18)"] }}
              transition={{ duration: 3.2, repeat: Infinity }}
              className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-5"
              style={{ background: "radial-gradient(circle at 38% 32%, rgba(240,180,41,0.22) 0%, rgba(20,10,0,0.9) 65%)", border: "1.5px solid rgba(240,180,41,0.45)" }}
            >
              ✨
            </motion.div>

            <p className="mb-1 uppercase" style={{ color: "rgba(196,168,130,0.55)", fontSize: 9, letterSpacing: "0.3em" }}>
              HISTORY ALIVE
            </p>
            <h2 className="mb-3" style={{ color: "#f0c070", fontSize: 24, fontWeight: 900, lineHeight: 1.2 }}>
              Bắt Đầu<br />Hành Trình!
            </h2>
            <p style={{ color: "#c4a882", fontSize: 13, lineHeight: 1.6 }}>
              Tạo tài khoản để khám phá lịch sử Việt Nam ngay hôm nay
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

          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(240,180,41,0.3), transparent)" }} />
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 p-8 lg:p-10" style={{ background: "#fffbeb" }}>
          <div className="max-w-sm mx-auto">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
                style={{ background: "radial-gradient(circle, rgba(217,119,6,0.15), rgba(255,251,235,0.8))", border: "2px solid rgba(217,119,6,0.3)" }}
              >
                ✨
              </div>
              <p style={{ fontFamily: '"Cinzel", serif', color: "#92400e", fontSize: 13, letterSpacing: "0.16em" }}>HISTORY ALIVE</p>
            </div>

            <h1 className="mb-1" style={{ color: "#1c1917", fontSize: 28, fontWeight: 900, fontFamily: '"Nunito", sans-serif' }}>
              Tạo tài khoản
            </h1>
            <p className="mb-7" style={{ color: "#a8a29e", fontSize: 14, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>Miễn phí · Dễ dàng · Vui nhộn!</p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block mb-1.5" style={{ color: "#78716c", fontSize: 13, fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
                  Tên đăng nhập
                </label>
                <input
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErr(""); }}
                  className="w-full px-4 py-3 rounded-2xl outline-none transition-all"
                  style={{ background: "#fff", border: "2px solid #fde68a", fontSize: 15, fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: "#1c1917" }}
                  onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                  onBlur={(e) => (e.target.style.borderColor = "#fde68a")}
                  placeholder="Ví dụ: QuangTrung123..."
                />
              </div>

              <div>
                <label className="block mb-1.5 mt-4" style={{ color: "#78716c", fontSize: 13, fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
                  Email của bạn
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  className="w-full px-4 py-3 rounded-2xl outline-none transition-all"
                  style={{ background: "#fff", border: "2px solid #fde68a", fontSize: 15, fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: "#1c1917" }}
                  onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                  onBlur={(e) => (e.target.style.borderColor = "#fde68a")}
                  placeholder="email@vidu.com"
                />
              </div>

              <div>
                <label className="block mb-1.5 mt-4" style={{ color: "#78716c", fontSize: 13, fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
                  Mật khẩu bí mật
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErr(""); }}
                    className="w-full px-4 py-3 pr-12 rounded-2xl outline-none transition-all"
                    style={{ background: "#fff", border: "2px solid #fde68a", fontSize: 15, fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: "#1c1917" }}
                    onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                    onBlur={(e) => (e.target.style.borderColor = "#fde68a")}
                    placeholder="Tối thiểu 4 ký tự nha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition hover:bg-amber-50"
                    style={{ color: "#a8a29e" }}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <button
                type="button"
                onClick={() => setAgreed((v) => !v)}
                className="flex items-start gap-2.5 text-left w-full"
              >
                {agreed
                  ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#d97706" }} />
                  : <Circle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#d1cdc7" }} />}
                <span style={{ fontSize: 13, color: "#78716c", lineHeight: 1.5, fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
                  Mình đồng ý với{" "}
                  <span style={{ color: "#d97706", fontWeight: 800 }}>Điều khoản</span>{" "}
                  và{" "}
                  <span style={{ color: "#d97706", fontWeight: 800 }}>Bảo mật</span>
                </span>
              </button>

              {err && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-2.5 rounded-xl"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                >
                  <p style={{ color: "#dc2626", fontSize: 12 }}>{err}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ y: -2, boxShadow: "0 6px 0 #047857" }}
                whileTap={{ y: 4, boxShadow: "0 0px 0 #047857" }}
                className="w-full py-3.5 rounded-2xl tracking-wide transition-all mt-4"
                style={{
                  fontSize: 16,
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #34d399, #10b981)",
                  boxShadow: "0 4px 0 #047857",
                  color: "#fff",
                  border: "none",
                }}
              >
                Bắt đầu ngay! 🚀
              </motion.button>
            </form>

            <p className="text-center mt-6" style={{ color: "#a8a29e", fontSize: 13 }}>
              Đã có tài khoản?{" "}
              <Link to="/login" style={{ color: "#d97706", fontWeight: 600 }}>
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
