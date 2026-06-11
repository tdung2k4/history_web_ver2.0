# ⚙️ SKILL: history-alive-swe (Software Engineering Guide)

## 🎯 Mục tiêu
Định nghĩa kiến trúc lập trình React, TypeScript, Vite, quản lý trạng thái (State Management), cơ chế routing và logic vận hành hệ thống phần thưởng (progression) cho History Alive.

---

## 💻 React + Vite + TypeScript Standard

### 1. File Structure & Imports
- Viết code bằng Functional Components sử dụng TypeScript định nghĩa kiểu dữ liệu rõ ràng.
- Bắt buộc khai báo interface/type cho tất cả props.
- Sử dụng import dạng absolute path hoặc alias đã được cấu hình trong `vite.config.ts`.

### 2. State Management (`store.ts`)
- Mọi logic liên quan đến game state (XP, Hearts, Gems, Streak, Lesson Progress) phải được tập trung tại [store.ts](file:///Users/dungtuan/Downloads/EXE_History%20alive/Onboarding%20Flow%20Preservation/src/app/store.ts).
- Cập nhật store phải đi kèm với đồng bộ hóa dữ liệu xuống `localStorage` để tránh mất dữ liệu khi F5.

---

## ⚙️ Game Logic & Systems

### 1. Quiz Engine
Hỗ trợ xử lý kết quả và trạng thái của 6 loại câu hỏi:
1. **Drag-drop Timeline:** Sắp xếp các sự kiện lịch sử theo đúng thứ tự thời gian.
2. **Character Matching:** Ghép nhân vật lịch sử với chiến công/phát biểu tương ứng.
3. **Sequential Ordering:** Sắp xếp các bước trong một chiến dịch lịch sử.
4. **Predictive Decision:** Đưa ra dự đoán về hệ quả trước một quyết định lớn.
5. **Cause-Effect Connect:** Nối nguyên nhân với kết quả lịch sử tương ứng.
6. **Strategic Choice:** Lựa chọn kế sách công thủ trong trận chiến (ví dụ: trận Bạch Đằng).

### 2. Progression System
- **Hearts (Trái tim):** Bắt đầu với 5 tim. Trả lời sai Quiz trừ 1 tim. 0 tim = game over (yêu cầu hồi tim hoặc dùng Gems mua).
- **Streak:** Tăng lên 1 sau mỗi ngày hoàn thành ít nhất 1 bài học. Nếu quá 24h không học, reset streak (trừ khi dùng Gems để bảo vệ).
- **XP (Kinh nghiệm):** Cộng XP dựa trên độ khó bài học và chuỗi trả lời đúng liên tiếp.

---

## 🧪 Quy trình tự khắc phục lỗi (Self-Healing)
Khi gặp lỗi biên dịch hoặc lỗi logic runtime:
1. **Dừng lại:** Không tiếp tục viết thêm code mới đè lên code lỗi.
2. **Chẩn đoán:** Kiểm tra console log, terminal output để xác định file và dòng gây lỗi.
3. **Đọc Spec:** So sánh mã nguồn hiện tại với đặc tả yêu cầu xem có thiết lập sai không.
4. **Sửa đổi nhỏ (Minimal Fix):** Thực hiện sửa đổi nhỏ nhất có thể để khắc phục lỗi.
5. **Escalate:** Nếu thử sửa quá 2 lần vẫn fail, báo cáo PM kèm log lỗi chi tiết để điều phối SWE khác hoặc hỏi ý kiến User.
