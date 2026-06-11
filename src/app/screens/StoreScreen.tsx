import { useApp } from "../store";
import { motion } from "motion/react";
import { Gem, Shield, Zap, ShoppingBag, Shirt } from "lucide-react";
import { useSound } from "../hooks/useSound";
import { useNavigate } from "react-router";

export default function StoreScreen() {
  const { user, setUser } = useApp();
  const { playPop, playSuccess } = useSound();
  const nav = useNavigate();

  const handleBuy = (cost: number, item: string) => {
    playPop();
    if (user.gems >= cost) {
      setTimeout(() => {
        playSuccess();
        setUser(u => ({ ...u, gems: u.gems - cost }));
        alert(`Mua thành công: ${item}!`);
      }, 300);
    } else {
      alert("Không đủ Kim Cương! Hãy học bài để kiếm thêm nhé.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9E6] font-['Nunito',sans-serif] pt-24 pb-32 selection:bg-[#FFC800]/30">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Cửa Hàng</h1>
          <p className="text-lg text-gray-500 font-bold mt-2">Dùng Kim Cương để trang bị vật phẩm!</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-5 py-4 rounded-3xl border-2 border-gray-100 shadow-sm shrink-0">
          <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center">
            <ShoppingBag size={24} strokeWidth={3} fill="currentColor" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#1CB0F6] leading-none flex items-center gap-2">
              {user.gems} <Gem size={20} className="text-[#1CB0F6]" fill="currentColor" />
            </div>
            <div className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">Số dư</div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-4xl mx-auto mt-4 flex flex-col gap-8">
        
        {/* Boosters Section */}
        <div>
          <h2 className="text-2xl font-black text-gray-800 mb-4">Vật phẩm hỗ trợ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Streak Freeze */}
            <motion.div whileHover={{ y: -2 }} className="bg-white rounded-[2rem] border-2 border-gray-100 p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                <Shield size={32} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-xl text-gray-800">Khiên bảo vệ</h3>
                <p className="text-sm text-gray-500 font-bold leading-tight mt-1">Giữ nguyên chuỗi học nếu bạn lỡ quên học 1 ngày.</p>
              </div>
              <button 
                onClick={() => handleBuy(200, "Khiên bảo vệ chuỗi ngày")}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#1CB0F6] rounded-xl font-black border-2 border-blue-100 transition-colors shrink-0"
              >
                200 <Gem size={16} fill="currentColor" />
              </button>
            </motion.div>

            {/* XP Boost */}
            <motion.div whileHover={{ y: -2 }} className="bg-white rounded-[2rem] border-2 border-gray-100 p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-500 flex items-center justify-center shrink-0">
                <Zap size={32} strokeWidth={2.5} fill="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-xl text-gray-800">X2 Kinh nghiệm</h3>
                <p className="text-sm text-gray-500 font-bold leading-tight mt-1">Nhân đôi XP nhận được trong 15 phút tới.</p>
              </div>
              <button 
                onClick={() => handleBuy(150, "X2 Kinh nghiệm")}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#1CB0F6] rounded-xl font-black border-2 border-blue-100 transition-colors shrink-0"
              >
                150 <Gem size={16} fill="currentColor" />
              </button>
            </motion.div>

          </div>
        </div>

        {/* Mascot Skins Section */}
        <div>
          <h2 className="text-2xl font-black text-gray-800 mb-4">Trang phục Mascot</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Skin 1 */}
            <motion.div whileHover={{ y: -2 }} className="bg-white rounded-[2rem] border-2 border-gray-100 p-6 flex flex-col items-center text-center gap-3">
              <div className="text-6xl mb-2">🕶️</div>
              <h3 className="font-black text-xl text-gray-800">Kính Ngầu</h3>
              <p className="text-sm text-gray-500 font-bold">Mascot cực ngầu.</p>
              <button 
                onClick={() => handleBuy(500, "Kính Ngầu")}
                className="flex items-center justify-center gap-1.5 w-full mt-2 py-3 bg-blue-50 hover:bg-blue-100 text-[#1CB0F6] rounded-xl font-black border-2 border-blue-100 transition-colors"
              >
                500 <Gem size={16} fill="currentColor" />
              </button>
            </motion.div>

            {/* Skin 2 */}
            <motion.div whileHover={{ y: -2 }} className="bg-white rounded-[2rem] border-2 border-gray-100 p-6 flex flex-col items-center text-center gap-3">
              <div className="text-6xl mb-2">🎓</div>
              <h3 className="font-black text-xl text-gray-800">Mũ Cử Nhân</h3>
              <p className="text-sm text-gray-500 font-bold">Thông thái như học giả.</p>
              <button 
                onClick={() => handleBuy(800, "Mũ Cử Nhân")}
                className="flex items-center justify-center gap-1.5 w-full mt-2 py-3 bg-blue-50 hover:bg-blue-100 text-[#1CB0F6] rounded-xl font-black border-2 border-blue-100 transition-colors"
              >
                800 <Gem size={16} fill="currentColor" />
              </button>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}
