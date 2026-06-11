# 🎛️ SKILL: history-alive-orchestrator (System Coordination)

## 🎯 Mục tiêu
Định nghĩa quy trình vận hành tự động (Pipeline), luồng thông tin (Data Flow) và cách thức phối hợp giữa 5 Agent (PM, UI/UX, SWE, Security, Analytics) trong dự án History Alive.

---

## 🔄 Quy trình làm việc tự động (Pipeline)

```
[User Request]
       │
       ▼
 ┌──────────┐
 │ PM Agent │ ──► Tạo/Cập nhật SPEC
 └────┬─────┘
      │ Giao task (TASK ASSIGNMENT)
      ▼
┌────────────┐
│ UI/UX Agent│ ──► Thiết kế & Code giao diện (.tsx)
└─────┬──────┘
      │ Báo cáo (HANDOFF REPORT)
      ▼
┌────────────┐
│  PM Agent  │ ──► Kiểm tra & Duyệt (PM REVIEW)
└─────┬──────┘
      │ Giao task (TASK ASSIGNMENT)
      ▼
┌────────────┐
│ SWE Agent  │ ──► Lập trình logic, State, Quiz Engine & Tích hợp
└─────┬──────┘
      │ Báo cáo (HANDOFF REPORT)
      ▼
┌────────────┐
│  PM Agent  │ ──► Kiểm tra & Duyệt (PM REVIEW)
└─────┬──────┘
      │ Yêu cầu Audit (SECURITY AUDIT)
      ▼
┌────────────┐
│Security Agt│ ──► Quét bảo mật, Vá lỗ hổng
└─────┬──────┘
      │ Báo cáo an toàn (SECURITY REPORT)
      ▼
┌────────────┐
│  PM Agent  │ ──► Phê duyệt triển khai (DEPLOY)
└─────┬──────┘
      │ Kích hoạt tracking
      ▼
┌────────────┐
│Analytics Ag│ ──► Theo dõi chỉ số, Tối ưu hóa
└────────────┘
```

---

## ⚠️ Quy tắc tự xử lý lỗi (Auto-Healing Protocol)
Khi một Agent con bị chặn (Blocked) do lỗi mã nguồn hoặc tài nguyên không rõ ràng:
1. Agent con áp dụng quy trình **Self-Healing** (Tự fix tối đa 2 lần).
2. Nếu không sửa được, gửi `HANDOFF REPORT` với trạng thái `❌ BLOCKED` kèm log chi tiết.
3. PM Agent phân tích báo cáo:
   - Nếu lỗi liên quan đến Spec thiết kế: Gửi lại cho **UI/UX Agent**.
   - Nếu lỗi logic hoặc tích hợp: Gửi lại cho **SWE Agent**.
   - Nếu lỗi cấu hình, phân quyền: Gửi lại cho **Security Agent**.
4. Tránh lặp lại vòng lặp vô hạn (Infinite Loop). Nếu sau 2 lần chuyển giao chéo vẫn lỗi, PM Agent sẽ dừng tiến trình và xin chỉ thị từ User.
