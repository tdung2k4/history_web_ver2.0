import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, X, ChevronRight } from "lucide-react";
import { useApp } from "../store";

const MOCK_USER = {
  username: "hocsinh",
  email: "test@email.com",
  name: "Lịch Sử",
  grade: "grade8",
  xp: 175,
  streak: 7,
  gems: 120,
  hearts: 5,
  completedLessons: ["u1-l1", "u1-l2", "u1-l3"],
  achievements: ["a1", "a2"],
};

type Screen = { label: string; path: string; emoji: string; needsUser?: boolean };

const GROUPS: { group: string; color: string; items: Screen[] }[] = [
  {
    group: "Onboarding",
    color: "#f59e0b",
    items: [
      { label: "Splash", path: "/", emoji: "🏛️" },
      { label: "Đăng nhập", path: "/login", emoji: "🔑" },
      { label: "Đăng ký", path: "/register", emoji: "📝" },
      { label: "Chọn tên", path: "/onboarding/name", emoji: "✏️" },
      { label: "Chọn lớp", path: "/onboarding/grade", emoji: "🎓" },
    ],
  },
  {
    group: "Học tập",
    color: "#10b981",
    items: [
      { label: "Trang chủ", path: "/home", emoji: "🏠", needsUser: true },
      { label: "Bài học thường", path: "/lesson/u1-l1", emoji: "📖", needsUser: true },
      { label: "Bài câu chuyện", path: "/lesson/u1-l2", emoji: "📜", needsUser: true },
      { label: "Bài Boss", path: "/lesson/u1-l5", emoji: "👑", needsUser: true },
    ],
  },
  {
    group: "Màn hình chính",
    color: "#3b82f6",
    items: [
      { label: "Nhiệm vụ", path: "/missions", emoji: "🎯", needsUser: true },
      { label: "Thành tựu", path: "/achievements", emoji: "🏆", needsUser: true },
      { label: "Bảng xếp hạng", path: "/leaderboard", emoji: "📊", needsUser: true },
      { label: "Bộ sưu tập", path: "/collection", emoji: "📚", needsUser: true },
      { label: "Hồ sơ", path: "/profile", emoji: "👤", needsUser: true },
    ],
  },
];

export default function DevNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useApp();

  const goTo = (screen: Screen) => {
    if (screen.needsUser) setUser(MOCK_USER);
    navigate(screen.path);
    setOpen(false);
  };

  return (
    <>
      {/* Toggle button */}
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 9999 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(15,23,42,0.88)",
            backdropFilter: "blur(6px)",
            color: "white",
            fontSize: 12,
            padding: "6px 12px",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.12)",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <LayoutGrid style={{ width: 13, height: 13, color: "#fbbf24" }} />
          <span style={{ color: "#cbd5e1" }}>Màn hình</span>
        </motion.button>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9997,
                background: "rgba(0,0,0,0.45)",
              }}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 9998,
                width: 272,
                background: "#0f172a",
                borderLeft: "1px solid #1e293b",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderBottom: "1px solid #1e293b",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <LayoutGrid style={{ width: 15, height: 15, color: "#fbbf24" }} />
                  <span style={{ color: "white", fontSize: 14 }}>Dev Navigator</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                    color: "#64748b",
                  }}
                >
                  <X style={{ width: 15, height: 15 }} />
                </button>
              </div>

              {/* List */}
              <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                {GROUPS.map(({ group, color, items }) => (
                  <div key={group} style={{ padding: "8px 12px" }}>
                    <p
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color,
                        marginBottom: 6,
                        paddingLeft: 8,
                      }}
                    >
                      {group}
                    </p>
                    {items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <motion.button
                          key={item.path}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => goTo(item)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "9px 10px",
                            borderRadius: 10,
                            cursor: "pointer",
                            border: "none",
                            marginBottom: 2,
                            background: isActive ? "rgba(245,158,11,0.15)" : "transparent",
                            textAlign: "left",
                          }}
                        >
                          <span style={{ fontSize: 18, width: 24, textAlign: "center", flexShrink: 0 }}>
                            {item.emoji}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13,
                                color: isActive ? "#fbbf24" : "#e2e8f0",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.label}
                            </div>
                            <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginTop: 1 }}>
                              {item.path}
                            </div>
                          </div>
                          {isActive ? (
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#fbbf24",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <ChevronRight style={{ width: 13, height: 13, color: "#334155", flexShrink: 0 }} />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "10px 16px",
                  borderTop: "1px solid #1e293b",
                  flexShrink: 0,
                }}
              >
                <p style={{ fontSize: 10, color: "#334155", lineHeight: 1.5 }}>
                  Màn hình có người dùng sẽ tự điền dữ liệu mẫu.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
