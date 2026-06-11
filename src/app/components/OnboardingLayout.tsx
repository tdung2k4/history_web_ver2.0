import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft } from "lucide-react";

interface OnboardingLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export default function OnboardingLayout({
  step,
  totalSteps,
  title,
  subtitle,
  onBack,
  footer,
  children,
}: OnboardingLayoutProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #faf5e8 0%, #f5eedc 50%, #f0e8ce 100%)" }}>
      {/* ── Top progress bar with glow ── */}
      <div className="relative h-1 w-full overflow-hidden" style={{ background: "rgba(240,180,41,0.1)" }}>
        <motion.div
          className="h-full absolute left-0 top-0"
          style={{
            background: "linear-gradient(to right, #d97706, #f0b429, #fbbf24)",
            boxShadow: "0 0 12px rgba(240,180,41,0.6)",
          }}
          initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* ── Header ── */}
      <div className="px-4 pt-5 pb-3 max-w-2xl mx-auto w-full">
        <div className="flex items-center">
          {/* Back button */}
          {onBack ? (
            <motion.button
              whileHover={{ x: -2, scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              onClick={onBack}
              className="p-2.5 rounded-xl transition mr-2"
              style={{
                color: "#78716c",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(240,180,41,0.25)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <ChevronLeft className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
            </motion.button>
          ) : (
            <div className="w-10 mr-2" />
          )}

          {/* Step dots */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i + 1 === step ? 24 : 7,
                  background: i + 1 < step ? "#d97706" : i + 1 === step ? "#f0b429" : "rgba(240,180,41,0.2)",
                }}
                className="rounded-full"
                style={{ height: 7 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>

          {/* Step counter */}
          <div className="w-10 text-right">
            <span style={{
              color: "#a8a29e",
              fontSize: 11,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
            }}>
              {step}/{totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* ── Title area ── */}
      <div className="px-6 pt-2 pb-3 max-w-2xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative line above */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to left, rgba(240,180,41,0.4), transparent)" }} />
            <span style={{ color: "#d97706", fontSize: 16 }}>✦</span>
            <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to right, rgba(240,180,41,0.4), transparent)" }} />
          </div>

          <h1
            style={{
              fontFamily: '"Nunito", sans-serif',
              color: "#1c1209",
              fontWeight: 900,
              fontSize: 22,
              lineHeight: 1.3,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{ color: "#78716c", fontSize: 13, marginTop: 8, lineHeight: 1.6, fontWeight: 400 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 max-w-2xl mx-auto w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      {footer && (
        <div
          className="px-4 pt-4 pb-8 max-w-2xl mx-auto w-full"
          style={{
            borderTop: "1px solid rgba(240,180,41,0.2)",
            background: "rgba(250,245,232,0.9)",
            backdropFilter: "blur(12px)",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
