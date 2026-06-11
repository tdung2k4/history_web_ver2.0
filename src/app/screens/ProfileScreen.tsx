import { useMemo, useState, useEffect } from "react";
import { useApp, MASCOTS } from "../store";
import { Edit2, Hourglass, Utensils, Leaf, Check, Settings, X, Volume2, VolumeX, LogOut, Bell, Monitor, Key, Shield, Flame, Star, Trophy, Medal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSound } from "../hooks/useSound";

// --- Components ---

// 1. Pill Input Component
const PillInput = ({ label, name, value, type = "text", placeholder = "", isEditing = false, onChange }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-gray-400 text-sm font-bold ml-4 tracking-wide">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={!isEditing}
      className={`w-full px-6 py-4 rounded-full font-bold text-lg transition-all focus:outline-none 
        ${isEditing 
          ? "bg-white border-2 border-gray-200 text-gray-800 placeholder-gray-300 focus:border-[#58CC02] focus:ring-4 focus:ring-[#58CC02]/20 shadow-inner" 
          : "bg-gray-50/80 border-2 border-transparent text-gray-600 cursor-default"}`}
    />
  </div>
);

// 2. Activity Chart SVG Component (Real Time)
const ActivityChart = ({ userXp = 50 }: { userXp?: number }) => {
  // Generate last 7 days including today
  const chartData = useMemo(() => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const today = new Date();
    
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      // Fake some historical data, but use real data for today if we wanted
      // Here we just make some nice looking curve, ending with a relative XP value
      let xp = 20 + Math.random() * 60; 
      if (i === 0) xp = Math.min(100, userXp); // Today's actual XP (capped at 100 for chart scaling)
      
      result.push({
        label: i === 0 ? "Hôm nay" : days[d.getDay()],
        xp: xp
      });
    }
    return result;
  }, [userXp]);

  const points = useMemo(() => {
    const max = 100;
    return chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * 100;
      const y = 100 - (d.xp / max) * 100;
      return `${x},${y}`;
    }).join(' ');
  }, [chartData]);

  return (
    <div className="w-full">
      <div className="relative w-full h-44 mt-4">
        <svg viewBox="0 -10 100 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#58CC02" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#58CC02" stopOpacity="0" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="8" stdDeviation="4" floodColor="#58CC02" floodOpacity="0.3"/>
            </filter>
          </defs>
          <polygon fill="url(#lineGradient)" points={`0,100 ${points} 100,100`} />
          <polyline 
            fill="none" 
            stroke="#58CC02" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points} 
            vectorEffect="non-scaling-stroke"
            filter="url(#shadow)"
          />
        </svg>
        <div className="flex justify-between text-gray-400 text-xs font-bold mt-3 px-1 uppercase tracking-widest">
          {chartData.map((d, i) => (
            <span key={i} className={i === 6 ? "text-[#58CC02]" : ""}>{d.label}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-6 ml-2">
        <div className="w-4 h-4 rounded-full bg-[#58CC02]"></div>
        <span className="text-gray-400 font-bold text-sm tracking-wide">Điểm kinh nghiệm (XP) 7 ngày qua</span>
      </div>
    </div>
  );
};

// 3. Last Lesson Card Component
const LastLessonCard = ({ icon: Icon, title, part, bgColor, iconColor, onClick }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex items-center gap-5 p-4 rounded-3xl cursor-pointer transition-colors"
    style={{ backgroundColor: bgColor }}
  >
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm" style={{ color: iconColor }}>
      <Icon strokeWidth={2.5} size={30} />
    </div>
    <div className="flex flex-col">
      <h4 className="text-gray-800 font-bold text-xl">{title}</h4>
      <span className="text-gray-400 font-bold text-sm uppercase tracking-wide mt-0.5">{part}</span>
    </div>
  </motion.div>
);

// 4. Settings Modal Component
const SettingsModal = ({ isOpen, onClose, user, isSoundEnabled, toggleSound, playPop }: any) => {
  if (!isOpen) return null;
  
  const handleToggleSound = () => {
    if (!isSoundEnabled) playPop();
    toggleSound();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => { playPop(); onClose(); }}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 md:p-8 border-b-2 border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center">
              <Settings size={26} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cài Đặt</h2>
          </div>
          <button 
            onClick={() => { playPop(); onClose(); }}
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex flex-col gap-8">
          
          {/* Trải nghiệm */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">Trải Nghiệm</h3>
            <div className="bg-gray-50 rounded-3xl border-2 border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b-2 border-gray-100">
                <div className="flex items-center gap-4">
                  <Monitor className="text-[#1CB0F6]" size={24} strokeWidth={2.5} />
                  <span className="font-bold text-gray-700 text-lg">Hiệu ứng hình ảnh</span>
                </div>
                <div className="w-14 h-8 bg-[#58CC02] rounded-full p-1 cursor-pointer">
                  <div className="w-6 h-6 bg-white rounded-full translate-x-6 shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  {isSoundEnabled ? <Volume2 className="text-[#58CC02]" size={24} strokeWidth={2.5} /> : <VolumeX className="text-gray-400" size={24} strokeWidth={2.5} />}
                  <span className="font-bold text-gray-700 text-lg">Hiệu ứng âm thanh</span>
                </div>
                <div 
                  onClick={handleToggleSound}
                  className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${isSoundEnabled ? "bg-[#58CC02]" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${isSoundEnabled ? "translate-x-6" : "translate-x-0"}`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Dữ liệu & Sao lưu */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">Bảo Vệ Dữ Liệu</h3>
            <div className="bg-gray-50 rounded-3xl border-2 border-gray-100 overflow-hidden">
              <div 
                className="flex flex-col gap-2 p-5 border-b-2 border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  playPop();
                  const data = localStorage.getItem("ha_user");
                  if (data) {
                    prompt("Hãy COPY mã dưới đây và cất vào nơi an toàn để không mất nick nhé:", btoa(data));
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <Shield className="text-[#CE82FF]" size={24} strokeWidth={2.5} />
                  <span className="font-bold text-gray-700 text-lg">Tạo mã Sao lưu (Backup)</span>
                </div>
                <p className="text-sm text-gray-500 font-bold ml-10">Phòng ngừa mất tiến trình học</p>
              </div>

              <div 
                className="flex flex-col gap-2 p-5 border-b-2 border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  playPop();
                  const code = prompt("Nhập mã khôi phục (Backup Code) của bạn:");
                  if (code) {
                    try {
                      const data = atob(code);
                      JSON.parse(data);
                      localStorage.setItem("ha_user", data);
                      alert("Khôi phục thành công! Trang web sẽ tải lại.");
                      window.location.reload();
                    } catch (e) {
                      alert("Mã khôi phục sai hoặc bị hỏng!");
                    }
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <Key className="text-[#FF9600]" size={24} strokeWidth={2.5} />
                  <span className="font-bold text-gray-700 text-lg">Khôi phục dữ liệu</span>
                </div>
                <p className="text-sm text-gray-500 font-bold ml-10">Nhập mã Backup để lấy lại tài khoản</p>
              </div>
            </div>
          </div>

          {/* Tài khoản */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">Tài Khoản</h3>
            <div className="bg-gray-50 rounded-3xl border-2 border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b-2 border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors" onClick={playPop}>
                <div className="flex items-center gap-4">
                  <Key className="text-[#FF9600]" size={24} strokeWidth={2.5} />
                  <span className="font-bold text-gray-700 text-lg">Đổi mật khẩu</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-5 border-b-2 border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors" onClick={playPop}>
                <div className="flex items-center gap-4">
                  <Shield className="text-[#CE82FF]" size={24} strokeWidth={2.5} />
                  <span className="font-bold text-gray-700 text-lg">Quyền riêng tư</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-red-50 transition-colors" onClick={playPop}>
                <div className="flex items-center gap-4">
                  <LogOut className="text-[#FF4B4B]" size={24} strokeWidth={2.5} />
                  <span className="font-bold text-[#FF4B4B] text-lg">Đăng xuất</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};


// 5. Stats Grid Component (Thống kê)
const StatsGrid = ({ user }: { user: any }) => {
  return (
    <div className="flex flex-col gap-5 w-full mb-2">
      <div className="flex items-center justify-center gap-1.5 text-gray-500 font-bold text-[17px]">
        Tham gia từ: 2023 <span className="mx-1.5 text-gray-300">•</span> <span className="text-[#facc15] font-black drop-shadow-sm">Hạng Vàng</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Streak Card */}
        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-gray-100 shadow-[0_4px_0_rgba(0,0,0,0.05)] flex flex-col gap-3 hover:-translate-y-1 transition-transform cursor-default">
          <div className="w-14 h-14 rounded-full bg-[#ffedd5] text-[#f97316] flex items-center justify-center">
            <Flame size={28} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-[0.15em]">Streak</span>
            <span className="text-gray-900 font-black text-2xl mt-0.5 tracking-tight">{user.streak} ngày</span>
          </div>
        </div>

        {/* EXP Card */}
        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-gray-100 shadow-[0_4px_0_rgba(0,0,0,0.05)] flex flex-col gap-3 hover:-translate-y-1 transition-transform cursor-default">
          <div className="w-14 h-14 rounded-full bg-[#fef9c3] text-[#eab308] flex items-center justify-center">
            <Star size={28} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-[0.15em]">Tổng EXP</span>
            <span className="text-gray-900 font-black text-2xl mt-0.5 tracking-tight">{user.xp.toLocaleString()}</span>
          </div>
        </div>

        {/* League Card */}
        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-gray-100 shadow-[0_4px_0_rgba(0,0,0,0.05)] flex flex-col gap-3 hover:-translate-y-1 transition-transform cursor-default">
          <div className="w-14 h-14 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
            <Trophy size={28} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-[0.15em]">Giải đấu</span>
            <span className="text-gray-900 font-black text-2xl mt-0.5 tracking-tight">Vàng</span>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-gray-100 shadow-[0_4px_0_rgba(0,0,0,0.05)] flex flex-col gap-3 hover:-translate-y-1 transition-transform cursor-default">
          <div className="w-14 h-14 rounded-full bg-[#dbeafe] text-[#3b82f6] flex items-center justify-center">
            <Medal size={28} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-[0.15em]">Thành tích</span>
            <span className="text-gray-900 font-black text-[22px] mt-0.5 tracking-tight leading-tight">{user.achievements?.length || 0} huân<br/>chương</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main Screen ---
export default function ProfileScreen() {
  const { user, updateProfile, isSoundEnabled, toggleSound } = useApp();
  const { playPop, playSuccess } = useSound();
  const userMascot = MASCOTS.find(m => m.id === user.mascotId) || MASCOTS[0];

  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    dob: user.dob || "",
    email: user.email || user.username ? `${user.username}@kidmail.com` : "",
    phone: user.phone || ""
  });

  // Sync state if user changes externally
  useEffect(() => {
    setFormData({
      name: user.name || "",
      dob: user.dob || "",
      email: user.email || user.username ? `${user.username}@kidmail.com` : "",
      phone: user.phone || ""
    });
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleEdit = () => {
    playPop();
    
    if (isEditing) {
      // Save changes
      updateProfile({
        name: formData.name,
        dob: formData.dob,
        email: formData.email,
        phone: formData.phone
      });
      playSuccess();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    setIsEditing(!isEditing);
  };

  const handleLessonTap = () => {
    playPop();
  };

  return (
    <div className="min-h-screen bg-[#FFF9E6] font-['Nunito',sans-serif] pt-32 pb-24 selection:bg-[#58CC02]/30 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-50 flex items-center gap-3 bg-[#58CC02] text-white px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgba(88,204,2,0.3)] border-b-4 border-[#46A302]"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Check strokeWidth={3} size={18} />
            </div>
            <span className="font-black text-lg tracking-wide">Đã lưu hồ sơ thành công!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            user={user}
            isSoundEnabled={isSoundEnabled}
            toggleSound={toggleSound}
            playPop={playPop}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Column: Dashboard & Profile Edit */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">Hồ Sơ</h1>
              <p className="text-2xl text-gray-500 font-semibold mt-3">Xin chào, {user.name || "Chiến Binh"}!</p>
            </div>
            
            {/* Settings Button */}
            <motion.button 
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playPop(); setIsSettingsOpen(true); }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white text-gray-400 hover:text-[#1CB0F6] shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-gray-100 transition-colors"
            >
              <Settings strokeWidth={2.5} size={28} />
            </motion.button>
          </div>

          {/* Avatar & Edit Button */}
          <div className="flex items-center gap-6 mt-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white overflow-hidden flex items-center justify-center p-2 shadow-[0_4px_0_#f3f4f6] border-2 border-gray-100">
                <img src={userMascot.img} alt="Mascot" className="w-full h-full object-contain scale-125" />
              </div>
              {user.isPremium && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFC800] to-[#FF9600] px-3 py-0.5 rounded-full text-white font-black text-xs tracking-widest shadow-md border-2 border-white">
                  PRO
                </div>
              )}
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleEdit}
              className={`flex items-center gap-3 px-6 py-4 rounded-full font-extrabold text-lg transition-colors shadow-[0_4px_0_rgba(0,0,0,0.1)] 
                ${isEditing 
                  ? "bg-[#FFC800] hover:bg-[#FFB400] text-white shadow-[0_4px_0_#D89E00]" 
                  : "bg-[#a5ed6e] hover:bg-[#8ee04e] text-[#2b7301] shadow-[0_4px_0_#75c834]"}`}
            >
              {isEditing ? (
                <>
                  <Check size={22} strokeWidth={3} />
                  Lưu thay đổi
                </>
              ) : (
                <>
                  <Edit2 size={22} strokeWidth={3} />
                  Chỉnh sửa hồ sơ
                </>
              )}
            </motion.button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mt-4">
            <PillInput label="Tên hiển thị :" name="name" value={formData.name} isEditing={isEditing} onChange={handleInputChange} placeholder="Nhập tên của bạn..." />
            <PillInput label="Ngày sinh :" name="dob" value={formData.dob} isEditing={isEditing} onChange={handleInputChange} placeholder="DD/MM/YYYY" />
            <PillInput label="Email :" name="email" value={formData.email} isEditing={isEditing} onChange={handleInputChange} placeholder="Email của bạn..." />
            <PillInput label="Số điện thoại :" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleInputChange} placeholder="Số điện thoại phụ huynh..." />
            <PillInput label="Mật khẩu :" name="password" value="********" type="password" isEditing={false} onChange={()=>{}} />
            <PillInput label="Ngôn ngữ :" name="language" value="Tiếng Việt (VN)" isEditing={false} onChange={()=>{}} />
          </div>

        </div>

        {/* Right Column: Activity & Last Lessons */}
        <div className="lg:col-span-5 flex flex-col gap-10 mt-12 lg:mt-0">
          
          {/* Lưới Thống kê (Stats Grid) */}
          <StatsGrid user={user} />

          {/* Activity Chart */}
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-black text-gray-900">Hoạt động :</h2>
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-2 border-gray-50">
              <ActivityChart userXp={user.xp} />
            </div>
          </div>

          {/* Last Lesson */}
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-black text-gray-900">Bài học gần nhất :</h2>
            <div className="flex flex-col gap-4">
              <LastLessonCard 
                icon={Hourglass} 
                title="Lịch sử Cổ đại" 
                part="Phần 3" 
                bgColor="#F0EDFA" 
                iconColor="#9B8EEB" 
                onClick={handleLessonTap}
              />
              <LastLessonCard 
                icon={Utensils} 
                title="Văn hóa Ẩm thực" 
                part="Phần 5" 
                bgColor="#EBF5FA" 
                iconColor="#5DA0DE"
                onClick={handleLessonTap} 
              />
              <LastLessonCard 
                icon={Leaf} 
                title="Sự tích Trống Đồng" 
                part="Phần 5" 
                bgColor="#FFF9E5" 
                iconColor="#F0C341" 
                onClick={handleLessonTap}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
