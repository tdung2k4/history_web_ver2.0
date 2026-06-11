# 🔒 SKILL: history-alive-security (Security Review Guide)

## 🎯 Mục tiêu
Cung cấp bộ quy tắc và công cụ kiểm tra bảo mật bắt buộc đối với tất cả mã nguồn trước khi tích hợp và triển khai dự án History Alive.

---

## 🛡️ Hướng dẫn Kiểm tra Bảo mật (Security Review)

### 1. Form Validation & XSS Prevention
- Bắt buộc kiểm tra tất cả các trường input người dùng nhập vào (đặc biệt là màn hình `ChooseNameScreen`).
- Sử dụng các thư viện validation hoặc hàm tự viết để loại bỏ ký tự HTML đặc biệt nhằm tránh XSS (Cross-Site Scripting).
- Ví dụ hàm lọc ký tự:
  ```typescript
  export const sanitizeInput = (val: string): string => {
    return val.replace(/[&<>"']/g, (match) => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return map[match];
    });
  };
  ```

### 2. Quản lý Secrets & Biến Môi Trường
- Kiểm tra toàn bộ mã nguồn để đảm bảo không có API key, passphrases, hoặc credential nào bị hardcode.
- Tất cả các biến môi trường nhạy cảm phải bắt đầu bằng `VITE_` và được khai báo trong file `.env` (thêm `.env` vào `.gitignore`).

### 3. Route Guard & Auth State
- Kiểm tra luồng `React Router` (file `routes.tsx`).
- Đảm bảo các route con bên trong màn hình học tập (`/home`, `/lesson`, `/story`) không thể truy cập trực tiếp nếu biến `onboarded` hoặc trạng thái đăng nhập trong `store.ts` chưa được xác thực.
- Nếu cố tình truy cập trực tiếp bằng URL, hệ thống phải tự động redirect về màn hình `/` (Splash hoặc Login).
