# 🎨 SKILL: history-alive-design (UI/UX Guide)

## 🎯 Mục tiêu
Cung cấp hướng dẫn chi tiết về phong cách thiết kế, design tokens, các component pattern tiêu chuẩn và quy tắc diễn hoạt (animation) để xây dựng giao diện "Netflix × Duolingo × Game AAA" cho History Alive.

---

## 🎨 Design Tokens & Colors

### 1. Bảng màu điện ảnh (HSL & Hex)
Tránh sử dụng màu phẳng thông thường. Sử dụng bảng màu sâu thẳm kết hợp ánh sáng tương phản rực rỡ:
- **Charcoal/Deep Navy (Nền chủ đạo):** `#0B0C10` hoặc `oklch(0.145 0 0)` - Đại diện cho lịch sử huyền bí và trang trọng.
- **Gold/Bronze (Điểm nhấn/Tương tác):** `#C5A059` hoặc `#D4AF37` - Ánh hoàng kim đại diện cho triều đại, vua chúa và sự huy hoàng.
- **Crimson/Ruby (Chiến trận/Cảnh báo):** `#8C1D40` - Màu của sử thi hào hùng.
- **Sandstone/Parchment (Chữ/Chi tiết cổ):** `#E7E3D4` - Màu sắc của trang sách cổ, tre nứa và đất đá lịch sử.

### 2. Hệ thống Grid & Spacing
- Áp dụng nghiêm ngặt **8pt Grid System** (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`) cho padding, margin và layout spacing.
- Đảm bảo responsive hoàn hảo từ điện thoại màn hình dọc (`375px`) cho đến desktop (`1440px`).

---

## 🏗️ UI Component Patterns

### 1. HeroJourney Card
Card lớn dạng banner nằm ở đầu trang Home hiển thị nhiệm vụ/bài học hiện tại của người dùng.
- **Layout:** Background ảnh hoặc tranh minh họa lịch sử chất lượng cao, phủ gradient đen mờ (`linear-gradient(to top, rgba(0,0,0,0.9), transparent)`).
- **Typography:** Tên chương học lớn dạng Serif hoặc Display sang trọng.
- **Interactive:** Nút "TIẾP TỤC HÀNH TRÌNH" lớn, có viền gold sáng rực rỡ khi hover.

### 2. QuestNode (Bản đồ hành trình)
Các nút tròn hoặc icon đại diện cho từng bài học được bố trí theo dạng đường đi ziczac (như Duolingo nhưng trên nền cổ trang).
- **Active Node:** Nhấp nháy nhẹ (pulse effect) với viền gold.
- **Locked Node:** Màu xám mờ, có khóa cổ bằng đồng.
- **Completed Node:** Phát sáng xanh ngọc bích nhạt hoặc vàng gold sáng.

### 3. Dialogue Panel (Màn hội thoại)
Bảng hội thoại phong cách Visual Novel / RPG Game:
- **Vị trí:** Nằm ở 1/3 dưới màn hình.
- **Aesthetic:** Khung mờ đục (backdrop-filter: blur(12px)), viền mỏng vàng đồng cổ. Tên nhân vật viết hoa nổi bật.

---

## ✨ Animation Specs
Tất cả các chuyển động phải đạt mức 60fps mượt mà, sử dụng `framer-motion` hoặc transition CSS được tối ưu:
- **Timeline Zoom:** Hiệu ứng phóng to/thu nhỏ nhẹ nhàng khi di chuyển dọc theo dòng thời gian lịch sử.
- **Character Reveal:** Nhân vật lịch sử xuất hiện từ hai bên màn hình với chuyển động slide-in và fade-in mượt (duration: `0.5s`, easing: `easeOutQuad`).
- **Achievement Unlock:** Pop-up mở khóa thành tựu nhảy lên từ tâm màn hình với hiệu ứng spring (nảy nhẹ), theo sau là hiệu ứng hạt lấp lánh (sparkles).
