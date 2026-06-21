
---

# Hướng Dẫn Backend/CMS Content Cho History Alive

File này là tài liệu chuẩn cho team khi thay nội dung bài học, nối backend/CMS, và kết nối web admin. Mục tiêu là giữ nguyên UI/gameplay hiện có, còn nội dung, câu hỏi, luyện thi, Đấu trường và tiến trình học được quản lý qua database.

> Cập nhật theo bản Onboarding Flow Preservation đã scan lúc 01:04 ngày 20/06/2026 (+07).

## 1. Trạng thái cấu trúc hiện tại

### Content layer trong React

Các file chính:

- `src/app/content/content.types.ts`: định nghĩa kiểu dữ liệu cho chương, bài học, câu hỏi, story.
- `src/app/content/mockContent.ts`: dữ liệu content hiện tại của app.
- `src/app/content/contentProvider.ts`: cổng provider để đổi nguồn dữ liệu.
- `src/app/content/contentRepository.ts`: API nội bộ cho UI gọi.
- `src/app/content/supabaseContentProvider.ts`: provider đọc dữ liệu thật từ Supabase/PostgREST.

Các màn đã nối vào content/repository:

- `HomeScreen`: đọc chương/bài học để vẽ bản đồ học tập.
- `LessonScreen`: mở bài học qua iframe `/quiz/index.html`.
- `FlashcardScreen`: mở phần luyện thi qua iframe `/quiz/index.html`.
- `PvPScreen`: lấy câu hỏi Đấu trường từ question bank chung.
- `CollectionScreen`: dùng tiến trình/chương để hiển thị bộ sưu tập.

### Cấu trúc chương/bài hiện tại

Tenant mặc định trong frontend mock là:

```ts
DEFAULT_TENANT_ID = "ha-tenant"
```

Hiện app có 6 chương chính:

1. Cách mạng tư sản & Sự phát triển của CNTB.
2. Chủ nghĩa xã hội từ năm 1917 đến nay.
3. Quá trình giành độc lập của các quốc gia Đông Nam Á.
4. Chiến tranh bảo vệ Tổ quốc & Giải phóng dân tộc (trước 1945).
5. Một số cuộc cải cách lớn trong lịch sử Việt Nam.
6. Lịch sử bảo vệ chủ quyền Biển Đông.

`LessonKind` hiện tại gồm:

```ts
"lesson" | "story" | "practice" | "boss" | "review"
```

Quy tắc nội dung đang dùng:

- Mỗi chương có 8 node: 4 bài học, 2 luyện tập, 1 tổng ôn `boss` và 1 ôn tập ngẫu nhiên `review`.
- Mỗi bài học thường có đúng 5 câu hỏi.
- Node `practice` tái sử dụng câu hỏi của hai bài liền trước, không tạo ngân hàng trùng.
- Các bài `review` là bài ôn tập/kiểm tra cuối chương, chạy qua module quiz.
- Nội dung luyện thi nằm ở `public/quiz/index.html`, `public/quiz/app.js`, `public/quiz/data.js`, `public/quiz/style.css`.
- Đấu trường không có bộ câu hỏi riêng; nó tự đồng bộ từ `QUESTION_BANK` qua `scopes` có `"arena"`.

## 2. Database làm những gì?

Database biến History Alive từ app hardcode thành nền tảng B2B/white-label. Bên mua web có thể thay chương, bài học, câu hỏi, luyện thi và theme mà không sửa UI React.

### `tenants`

Lưu từng khách hàng/trường/đơn vị sử dụng app.

Ví dụ:

- History Alive bản chính.
- Một trường dùng app để dạy Lịch sử.
- Một trung tâm dùng cùng UI nhưng thay nội dung thành Tiếng Anh hoặc Toán.

Mỗi tenant có `slug`, `domain`, `theme_config`, `logo_url`. Khi bán B2B, mỗi khách hàng nên có một tenant riêng.

### `tenant_memberships`

Lưu quyền quản trị theo tenant.

Vai trò:

- `owner`: chủ sở hữu.
- `admin`: quản trị.
- `editor`: người nhập/sửa bài học.
- `viewer`: chỉ xem.

Web admin phải dùng bảng này để chặn editor của tenant A sửa nội dung tenant B.

### `courses`

Lưu khóa học hoặc môn học.

Ví dụ:

- Lịch sử 11.
- Tiếng Anh lớp 6.
- Đào tạo nội bộ doanh nghiệp.

Một tenant có thể có nhiều course.

### `units`

Lưu chương/chủ đề lớn hiển thị trên bản đồ học tập.

Trường quan trọng:

- `legacy_id`: id frontend như `u1`, `u2`.
- `title`, `era`, `description`.
- `theme`: màu sắc, icon, background.
- `order_index`: thứ tự chương.
- `status`: `draft`, `published`, `archived`.

### `lessons`

Lưu từng bài học trong một chương.

Trường quan trọng:

- `legacy_id`: id frontend như `u1-l1`.
- `type`: `lesson`, `story`, `practice`, `boss`, `review`.
- `xp`: số XP nhận khi hoàn thành.
- `order_index`: thứ tự bài trong chương.
- `status`: trạng thái publish.

Web admin dùng `practice` cho node luyện tập, `boss` cho tổng ôn chương và `review` cho ôn tập ngẫu nhiên.

### `questions`

Lưu ngân hàng câu hỏi dùng chung cho bài học và Đấu trường.

Trường quan trọng:

- `unit_id`, `lesson_id`: câu hỏi thuộc chương/bài nào.
- `legacy_id`: id ổn định để import/export.
- `prompt`: nội dung câu hỏi.
- `question_type`: `multiple_choice`, `fill_blank` hoặc `matching`.
- `options`: mảng đáp án/khối từ.
- `correct_option_index`: đáp án đúng cho trắc nghiệm.
- `answer` và `interaction_payload`: đáp án/cấu hình cho điền khuyết hoặc nối cặp.
- `explanation`: giải thích.
- `difficulty`: `easy`, `medium`, `hard`.
- `tags`: nhóm kiến thức.
- `scopes`: nơi câu hỏi được dùng.
- `status`: trạng thái publish.

Quy tắc bắt buộc:

- Bài học thường cần 5 câu hỏi có `scopes` chứa `"lesson"`.
- Câu hỏi muốn xuất hiện ở Đấu trường phải thêm `"arena"` vào `scopes`.
- Câu hỏi chưa muốn public để `status = draft`.
- Không tạo question bank riêng cho Đấu trường, vì như vậy sẽ mất cơ chế tự đồng bộ.

Ví dụ:

```ts
{
  legacy_id: "q-u1-l1-01",
  lesson_legacy_id: "u1-l1",
  prompt: "Câu hỏi...",
  options: ["A", "B", "C", "D"],
  correct_option_index: 0,
  explanation: "Giải thích...",
  difficulty: "easy",
  scopes: ["lesson", "arena"],
  status: "published"
}
```

### `story_blocks`

Lưu story/visual novel nếu sau này team muốn đưa nội dung hội thoại vào CMS.

Lưu ý theo bản hiện tại: `STORY_CONTENT` trong mock đang trống, còn bài học/luyện thi đang ưu tiên chạy qua iframe quiz. Vì vậy `story_blocks` là bảng optional, giữ để mở rộng mà không phá UI.

### `user_progress`

Lưu tiến trình học riêng của từng tài khoản.

Đây là phần bắt buộc để user đăng nhập lại không phải học từ đầu. Frontend hiện còn có l



### `Tự động hóa nhập liệu (Data Pipeline Automation)`

Thực tế, team nội dung **không cần phải nhập tay 100% các câu hỏi** vào CMS nếu đã có sẵn dữ liệu dưới dạng file Word (`.docx`) hoặc Text (`.txt`).
Hệ thống hiện đã hỗ trợ công cụ tự động hóa thông qua Python Script (đặt tại `scripts/generate_data_10.py` - bản mẫu cho lớp 10).

**Quy trình (Ví dụ cho nội dung Lớp 12 mới):**
1. Đặt file Word chứa trắc nghiệm và file Text chứa lý thuyết vào thư mục quy định.
2. Chạy lệnh: `python3 scripts/generate_data_10.py` (hoặc script tương ứng của lớp 12).
3. Script sẽ tự động:
   - Bóc tách câu hỏi, đáp án, và các từ mồi nhử.
   - Quét file lý thuyết, đối chiếu đáp án đúng để **tự động sinh ra trường giải thích AI (`explanation`)**.
   - Trích xuất toàn bộ ra một file JSON chuẩn xác định (VD: `data_12.json`).
4. Tại Web Admin, bạn chỉ cần Import file JSON này thẳng vào bảng `questions` trong database là xong. 

Cách làm này giúp tiết kiệm 95% thời gian tạo khóa học mới mà vẫn giữ nguyên vẹn các tính năng tương tác của ứng dụng!
