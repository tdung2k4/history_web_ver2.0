# 📊 SKILL: history-alive-analytics (Data & Analytics Guide)

## 🎯 Mục tiêu
Định nghĩa cấu trúc schema bắt sự kiện tương tác của người học, quy chuẩn lưu trữ và lập báo cáo dữ liệu định kỳ cho dự án History Alive.

---

## 📈 Event Tracking Schema

Mỗi khi người dùng thực hiện một hành động quan trọng, hệ thống sẽ trigger hàm tracking để lưu trữ cục bộ (hoặc gửi lên server phân tích).

### 1. Sự kiện Bài học (Lesson Events)
- **`lesson_start`**: Kích hoạt khi người học bấm nút bắt đầu bài học.
  - Payload: `{ lessonId: string, timestamp: number }`
- **`lesson_complete`**: Kích hoạt khi học xong bước 9 của bài học.
  - Payload: `{ lessonId: string, durationSeconds: number, finalScore: number, xpEarned: number }`

### 2. Sự kiện Kiểm tra (Quiz Events)
- **`quiz_answer`**: Kích hoạt sau mỗi câu hỏi trắc nghiệm/tương tác.
  - Payload: `{ quizId: string, questionType: string, isCorrect: boolean, heartsLeft: number }`

### 3. Sự kiện Tiến trình (Progression Events)
- **`streak_update`**: Kích hoạt khi streak tăng/giảm hoặc reset.
  - Payload: `{ currentStreak: number, changeType: 'increment' | 'reset' }`
- **`achievement_unlocked`**: Kích hoạt khi đạt thành tựu mới.
  - Payload: `{ achievementId: string, gemReward: number }`

---

## 📄 Định dạng báo cáo định kỳ (Report Template)
Mỗi báo cáo phân tích gửi PM phải tuân theo cấu trúc sau:
```markdown
# 📊 BÁO CÁO PHÂN TÍCH HỆ THỐNG — [Ngày lập]
## 1. Tổng quan chỉ số (KPIs)
- **DAU:** [Số lượng người dùng hoạt động trong ngày]
- **Tỷ lệ hoàn thành bài học (Completion Rate):** [%]
- **Streak trung bình:** [Số ngày]

## 2. Điểm nóng & Phát hiện (Insights)
- [Nội dung phát hiện, ví dụ: Bài học X có tỷ lệ rớt ở bước 4 rất cao do câu hỏi chiến thuật quá khó...]

## 3. Khuyến nghị cải tiến (Recommendations)
- [Đề xuất điều chỉnh độ khó, phần thưởng...]
```
