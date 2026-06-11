import { createContext, useContext } from "react";

import mieuImg from '../assets/mascots/mieu.png';
import hungImg from '../assets/mascots/hung.png';
import vangImg from '../assets/mascots/vang.png';
import baoImg from '../assets/mascots/bao.png';
import haiImg from '../assets/mascots/hai.png';
import ngocImg from '../assets/mascots/ngoc.png';

export const MASCOTS = [
  { id: 'mieu', name: 'Miêu', desc: 'Cô Nông Dân', img: mieuImg, color: '#f59e0b', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
  { id: 'hung', name: 'Hùng', desc: 'Nhà Nho', img: hungImg, color: '#92400e', bg: 'linear-gradient(135deg, #fef9e7, #f5e6c8)' },
  { id: 'vang', name: 'Vàng', desc: 'Tiểu Đồng', img: vangImg, color: '#d97706', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
  { id: 'bao',  name: 'Bảo',  desc: 'Chiến Binh', img: baoImg,  color: '#2563eb', bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)' },
  { id: 'hai',  name: 'Hải',  desc: 'Quan Đại Thần', img: haiImg, color: '#1e3a5f', bg: 'linear-gradient(135deg, #f0f4ff, #dde4f5)' },
  { id: 'ngoc', name: 'Ngọc', desc: 'Tiên Nữ', img: ngocImg, color: '#db2777', bg: 'linear-gradient(135deg, #fff0f6, #fce7f3)' },
];

export type User = {
  username: string;
  email: string;
  name: string;
  dob: string;
  phone: string;
  avatar: string;
  mascotId: string;
  grade: string;
  studyMinutes: number;
  xp: number;
  streak: number;
  gems: number;
  hearts: number;
  completedLessons: string[];
  achievements: string[];
  isPremium: boolean;
  planType: "free" | "premium" | "trial";
  trialEndDate: string | null;
  isNewUser: boolean;
  lastHeartUpdate: number;
};

export const defaultUser: User = {
  username: "",
  email: "",
  name: "",
  dob: "",
  phone: "",
  avatar: "mieu",
  mascotId: "mieu",
  grade: "",
  studyMinutes: 15,
  xp: 0,
  streak: 1,
  gems: 50,
  hearts: 5,
  completedLessons: [],
  achievements: [],
  isPremium: false,
  planType: "free",
  trialEndDate: null,
  isNewUser: false,
  lastHeartUpdate: Date.now(),
};

export type AppCtx = {
  user: User;
  setUser: (u: User) => void;
  updateProfile: (data: Partial<User>) => void;
  completeLesson: (id: string, xp: number) => void;
  upgradeToPremium: () => void;
  startTrial: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  soundVolume: number;
};

export const AppContext = createContext<AppCtx>({
  user: defaultUser,
  setUser: () => {},
  updateProfile: () => {},
  completeLesson: () => {},
  upgradeToPremium: () => {},
  startTrial: () => {},
  isSoundEnabled: true,
  toggleSound: () => {},
  soundVolume: 0.8,
});

export const useApp = () => useContext(AppContext);

export const UNITS = [
  {
    id: "u1",
    title: "Văn Lang · Âu Lạc",
    era: "2879 TCN — 179 TCN",
    color: "from-amber-700 to-orange-800",
    accent: "#d97706",
    accentGlow: "#f59e0b",
    artEmoji: "🏯",
    bgFrom: "#2d1400",
    bgTo: "#1a0c00",
    description: "Thời kỳ dựng nước đầu tiên của dân tộc Việt Nam",
    lessons: [
      { id: "u1-l1", title: "Vua Hùng dựng nước", xp: 15, type: "lesson" },
      { id: "u1-l2", title: "Sơn Tinh · Thủy Tinh", xp: 15, type: "story" },
      { id: "u1-l2b", title: "Sự tích Bánh Chưng", xp: 15, type: "lesson" },
      { id: "u1-l3", title: "Thánh Gióng", xp: 20, type: "lesson" },
      { id: "u1-l4a", title: "Sự tích Trầu Cau", xp: 20, type: "story" },
      { id: "u1-l4", title: "An Dương Vương", xp: 25, type: "lesson" },
      { id: "u1-l5", title: "Mỵ Châu · Trọng Thủy", xp: 30, type: "boss" },
    ],
  },
  {
    id: "u2",
    title: "Ngàn Năm Bắc Thuộc",
    era: "179 TCN — 938",
    color: "from-red-900 to-rose-950",
    accent: "#9b1c1c",
    accentGlow: "#ef4444",
    artEmoji: "⚔️",
    bgFrom: "#2d0808",
    bgTo: "#1a0404",
    description: "Một nghìn năm kháng cự và những cuộc khởi nghĩa anh hùng",
    lessons: [
      { id: "u2-l1", title: "Hai Bà Trưng", xp: 20, type: "lesson" },
      { id: "u2-l2", title: "Bà Triệu", xp: 20, type: "lesson" },
      { id: "u2-l3", title: "Lý Bí · Vạn Xuân", xp: 25, type: "lesson" },
      { id: "u2-l4", title: "Mai Thúc Loan & Phùng Hưng", xp: 25, type: "story" },
      { id: "u2-l5", title: "Ngô Quyền · Bạch Đằng 938", xp: 40, type: "boss" },
    ],
  },
  {
    id: "u3",
    title: "Lý · Trần · Hồ",
    era: "1009 — 1407",
    color: "from-emerald-900 to-teal-950",
    accent: "#065f46",
    accentGlow: "#10b981",
    artEmoji: "🛡️",
    bgFrom: "#0d2d1a",
    bgTo: "#041a0d",
    description: "Thời kỳ độc lập tự chủ và những chiến công lừng lẫy",
    lessons: [
      { id: "u3-l1", title: "Lý Thái Tổ dời đô", xp: 25, type: "lesson" },
      { id: "u3-l2", title: "Lý Thường Kiệt phá Tống", xp: 30, type: "lesson" },
      { id: "u3-l3", title: "Trần Hưng Đạo & Bạch Đằng 1288", xp: 35, type: "story" },
      { id: "u3-l4", title: "Ba lần kháng chiến Mông Nguyên", xp: 40, type: "boss" },
    ],
  },
  {
    id: "u4",
    title: "Lam Sơn · Hậu Lê",
    era: "1418 — 1789",
    color: "from-indigo-900 to-blue-950",
    accent: "#1e3a8a",
    accentGlow: "#3b82f6",
    artEmoji: "📜",
    bgFrom: "#0d1040",
    bgTo: "#04081a",
    description: "Khởi nghĩa Lam Sơn và đỉnh cao triều đại Lê",
    lessons: [
      { id: "u4-l1", title: "Lê Lợi khởi nghĩa", xp: 30, type: "lesson" },
      { id: "u4-l2", title: "Nguyễn Trãi · Bình Ngô đại cáo", xp: 35, type: "lesson" },
      { id: "u4-l3", title: "Quang Trung đại phá quân Thanh", xp: 45, type: "boss" },
    ],
  },
];

export const MISSIONS = [
  { id: "m1", title: "Hoàn thành 1 bài học hôm nay", target: 1, reward: 10, icon: "⚔️", desc: "Chinh phục một trận chiến lịch sử" },
  { id: "m2", title: "Kiếm 50 XP trong ngày", target: 50, reward: 20, icon: "⚡", desc: "Tích lũy kinh nghiệm chiến trường" },
  { id: "m3", title: "Duy trì chuỗi 3 ngày", target: 3, reward: 30, icon: "🔥", desc: "Giữ ngọn lửa không bao giờ tắt" },
];

export const ACHIEVEMENTS = [
  { id: "a1", title: "Khai Sơn Phá Thạch", desc: "Hoàn thành bài học đầu tiên", icon: "⚔️", rarity: "common" },
  { id: "a2", title: "Học Giả Bách Chiến", desc: "Đạt 100 XP", icon: "📚", rarity: "common" },
  { id: "a3", title: "Chiến Binh Lịch Sử", desc: "Đánh bại 1 thử thách cuối chương", icon: "🛡️", rarity: "rare" },
  { id: "a4", title: "Người Kể Sử Thi", desc: "Hoàn thành 5 câu chuyện", icon: "📜", rarity: "rare" },
  { id: "a5", title: "Bậc Thầy Thời Đại", desc: "Hoàn thành 1 chương lịch sử", icon: "👑", rarity: "epic" },
  { id: "a6", title: "Ngọn Lửa Vĩnh Cửu", desc: "Chuỗi 7 ngày liên tiếp", icon: "🔥", rarity: "legendary" },
];
