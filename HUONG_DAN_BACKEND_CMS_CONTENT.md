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

Đây là phần bắt buộc để user đăng nhập lại không phải học từ đầu. Frontend hiện còn có local state/localStorage cho demo, nhưng bản production phải lưu vào backend.

Nên lưu:

- User đã hoàn thành bài nào.
- Trạng thái bài: `not_started`, `in_progress`, `completed`.
- Điểm tốt nhất.
- Tổng số câu, số câu đúng.
- XP đã nhận.
- Tim còn lại nếu bài có tim.
- Số lần làm bài.
- Lần học/làm bài gần nhất.
- Streak cao nhất trong bài.

Khóa unique nên là:

```txt
tenant_id + user_id + lesson_id
```

### `user_learning_state`

Lưu trạng thái tổng hợp theo tài khoản: XP, gems, streak và năng lượng. Policy frontend hiện tại là version 3: tối đa 25 tim, sai mất 1 tim, hồi 1 tim mỗi 5 phút, khi về 0 được nhận 5 tim miễn phí một lần mỗi ngày, tài khoản Pro có tim vô hạn.

Khóa unique: `tenant_id + user_id`. Web admin chỉ đọc để báo cáo; việc cộng/trừ phải qua backend để tránh gian lận.

> Lưu ý tích hợp: FastAPI hiện vẫn có một số mặc định 5 tim. Backend team phải nâng các mặc định đó lên 25 và cho `practice` vào danh sách node hoàn thành trước production; frontend không được tự sửa dữ liệu server để lách kiểm tra.

### `quiz_attempts`

Lưu từng lượt làm bài/luyện thi/Đấu trường.

Bảng này giúp web admin và analytics xem lịch sử học thật, không chỉ trạng thái hoàn thành cuối cùng.

Nên lưu:

- `mode`: `lesson`, `review`, `practice`, `arena`.
- `lesson_id` nếu attempt thuộc một bài.
- `unit_legacy_id`, `lesson_legacy_id` để map nhanh với iframe quiz hiện tại.
- `total_questions`, `correct_answers`, `wrong_answers`.
- `max_streak`.
- `xp_earned`, `gems_earned`.
- `completed`.
- `payload`: dữ liệu thô từ iframe hoặc PvP.

### `pvp_matches`

Lưu kết quả Đấu trường.

Nên lưu:

- User tham gia.
- Đối thủ nếu có.
- Danh sách câu hỏi đã dùng.
- Điểm mỗi bên.
- Kết quả `win`, `draw`, `loss`.

Đấu trường vẫn lấy câu hỏi từ `questions.scopes` có `"arena"`, còn `pvp_matches` chỉ lưu lịch sử trận.

## 3. Luồng đồng bộ bài học, luyện thi và Đấu trường

```txt
CMS/Admin
  -> units
  -> lessons
  -> questions
  -> Frontend contentRepository
      -> HomeScreen
      -> LessonScreen iframe /quiz
      -> FlashcardScreen iframe /quiz
      -> PvPScreen arena questions

User action
  -> QUIZ_FINISHED hoặc PVP_FINISHED
  -> backend API
  -> user_progress
  -> quiz_attempts / pvp_matches
  -> Web Admin reports
```

### Bài học

`LessonScreen` mở:

```txt
/quiz/index.html?unit={unitId}&lesson={lessonNumber}&type={lesson.type}
```

Khi iframe quiz hoàn thành, nó gửi message `QUIZ_FINISHED` về React. Production backend cần bắt event này và gọi API lưu tiến trình.

### Luyện thi

`FlashcardScreen` hiện cũng dùng module `/quiz`. Vì vậy nội dung luyện thi phải được quản lý từ cùng nguồn dữ liệu quiz/question bank, hoặc có pipeline export từ database ra format `public/quiz/data.js`.

Khuyến nghị production:

- Web admin nhập/sửa câu hỏi trong bảng `questions`.
- Backend cung cấp API `/api/quiz/content` trả dữ liệu theo format iframe quiz cần.
- Không bắt team sửa tay `public/quiz/data.js` sau khi đã có CMS.

### Đấu trường

`PvPScreen` gọi `getArenaQuestions` và lọc câu hỏi:

1. Cùng tenant.
2. `status = published`.
3. `scopes` có `"arena"`.
4. Ưu tiên grade của user nếu có.
5. Ưu tiên các bài user đã học để ôn tập.
6. Giới hạn số câu theo trận, hiện là 5.

Vì vậy khi admin thêm câu hỏi mới cho bài học và tick scope `arena`, Đấu trường tự có câu hỏi mới.

## 4. Backend lưu tiến trình user

Mục tiêu: mỗi tài khoản có tiến trình riêng, đăng nhập lại vẫn giữ bài đã học, XP, streak, kết quả luyện thi và lịch sử Đấu trường.

### API cần có

Backend FastAPI hiện có các endpoint dưới `VITE_API_URL` (mặc định kết thúc bằng `/api/v1`):

```txt
GET  /api/v1/me/progress
POST /api/v1/me/quiz-attempts
POST /api/v1/me/pvp-matches
GET  /api/v1/me/leaderboard
```

### Khi user đăng nhập

Frontend cần làm:

1. Xác thực user.
2. Gọi `GET /api/v1/me/progress`.
3. Merge dữ liệu backend vào app state:
   - `completedLessons`.
   - `xp`.
   - `streak`.
   - `gems`.
   - premium/subscription nếu backend quản lý.

Không được chỉ dựa vào `localStorage` cho production, vì đổi máy hoặc đăng nhập lại sẽ mất tiến trình.

### Khi hoàn thành bài học

Khi nhận `QUIZ_FINISHED`, frontend gọi:

```json
{
  "tenantSlug": "ha-tenant",
  "lessonLegacyId": "u1-l1",
  "mode": "lesson",
  "correctAnswers": 5,
  "totalQuestions": 5,
  "maxStreak": 5,
  "xpEarned": 30,
  "completed": true
}
```

Backend xử lý:

1. Insert một dòng vào `quiz_attempts`.
2. Upsert `user_progress` theo `tenant_id + user_id + lesson_id`.
3. Cộng XP/gems/streak vào profile user nếu hợp lệ.
4. Trả progress mới về frontend.

### Khi hoàn thành bài review

Bài `review` có thể có nhiều câu hơn bài thường. Backend vẫn lưu vào `quiz_attempts` với:

```txt
mode = review
```

Nếu đủ điều kiện pass, backend cập nhật `user_progress.status = completed` cho lesson review.

### Khi luyện thi

Lưu vào `quiz_attempts` với:

```txt
mode = practice
```

Luyện thi không nhất thiết mở khóa bài mới, nhưng vẫn nên cộng XP/gems theo rule của sản phẩm và hiển thị trong web admin.

### Khi chơi Đấu trường

Lưu vào:

- `pvp_matches`: lịch sử trận.
- `quiz_attempts` với `mode = arena` nếu team muốn analytics chung theo câu hỏi.

## 5. Kết nối web admin hiện có

Web admin hiện nằm ở app `historyalive-admin` và phải đọc/ghi cùng database/API với frontend. Không copy màn admin vào `frontend`.

### Màn content editor

Admin cần quản lý:

- `tenants`
- `courses`
- `units`
- `lessons`
- `questions`
- `story_blocks` nếu dùng story CMS

Các thao tác tối thiểu:

- Tạo/sửa/xóa nháp chương.
- Tạo/sửa/xóa bài học.
- Gắn 5 câu hỏi cho mỗi bài học thường.
- Tick scope `arena` để câu hỏi đồng bộ sang Đấu trường.
- Tạo bài `review` cuối chương.
- Publish/draft/archive.

### Màn user progress

Admin cần đọc:

- `user_progress`
- `user_learning_state`
- `quiz_attempts`
- `pvp_matches`

Các chỉ số nên hiển thị:

- User đã học tới chương/bài nào.
- Tỷ lệ hoàn thành theo user/lớp/tenant.
- Điểm tốt nhất từng bài.
- Số lần làm lại.
- Lần học gần nhất.
- XP đã nhận.
- Kết quả luyện thi.
- Kết quả Đấu trường.

### Quyền truy cập admin

Admin chỉ được xem/sửa tenant của họ:

```txt
tenant_memberships.user_id = auth.uid()
tenant_memberships.tenant_id = target tenant
role in owner/admin/editor/viewer
```

Editor được sửa content, viewer chỉ xem báo cáo.

## 6. Cách đổi nội dung nhanh trong frontend mock

Khi chưa nối Supabase thật, sửa nội dung tại:

```txt
src/app/content/mockContent.ts
public/quiz/data.js
```

### Thêm chương mới

Thêm object vào `CONTENT_UNITS`:

```ts
{
  id: "u7",
  title: "Tên chương mới",
  era: "Mốc thời gian",
  color: "from-slate-900 to-zinc-950",
  accent: "#f59e0b",
  accentGlow: "#fbbf24",
  artEmoji: "📜",
  bgFrom: "#1f2937",
  bgTo: "#111827",
  description: "Mô tả chương",
  lessons: [
    { id: "u7-l1", title: "Bài 1", xp: 30, type: "lesson" },
    { id: "u7-l2", title: "Ôn tập chương", xp: 80, type: "review" },
  ],
}
```

### Thêm 5 câu hỏi cho bài học

Thêm 5 object vào `QUESTION_BANK`. Muốn câu hỏi xuất hiện trong Đấu trường thì thêm `"arena"` vào `scopes`.

```ts
{
  id: "q-u7-l1-01",
  tenantId: DEFAULT_TENANT_ID,
  unitId: "u7",
  lessonId: "u7-l1",
  grade: "11",
  prompt: "Nội dung câu hỏi?",
  options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
  correctOptionIndex: 0,
  explanation: "Giải thích đáp án đúng.",
  difficulty: "easy",
  tags: ["chu-de-moi"],
  scopes: ["lesson", "arena"],
  status: "published",
}
```

### Thêm nội dung luyện thi

Hiện module luyện thi đọc từ:

```txt
public/quiz/data.js
```

Nếu chưa có backend, thêm chủ đề/câu hỏi trực tiếp trong file này theo format đang có. Nếu đã có backend, không sửa tay file này nữa; backend/admin phải xuất dữ liệu cùng format hoặc iframe gọi API để lấy data.

## 7. Cách bật Supabase thật

Tạo file `.env.local` trong `frontend`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_GOOGLE_CLIENT_ID=your-public-google-oauth-client-id
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_HISTORY_ALIVE_TENANT_SLUG=ha-tenant
```

Nếu thiếu các biến này, app tự dùng mock content nên vẫn chạy demo được.

## 8. Cách đưa nội dung hiện tại lên Supabase

1. Tạo project Supabase.
2. Chạy lần lượt `supabase/migrations/001_content_schema.sql` và `002_practice_energy_interactions.sql`.
3. Chạy `supabase/seed.sql` để tạo 6 chương, 48 node và 130 câu hỏi hiện tại.
4. Điền `.env.local`.
5. Chạy:

```bash
npm run dev
```

## 9. Quy tắc sửa nội dung cho bên thứ 3

- Không sửa UI nếu chỉ thay bài học/câu hỏi/luyện thi/story.
- Sửa hoặc thêm dữ liệu ở CMS/Supabase/web admin.
- Mỗi bài học thường cần 5 câu hỏi.
- Câu hỏi muốn vào Đấu trường phải có `scopes` chứa `arena`.
- Node luyện tập dùng `type = practice`; tổng ôn dùng `boss`; ôn tập ngẫu nhiên dùng `review`.
- Nội dung chưa muốn public để `status = draft`.
- Nội dung muốn app hiển thị để `status = published`.
- Không dùng chung tenant giữa các khách hàng B2B nếu dữ liệu cần tách riêng.

## 10. Lưu ý bảo mật

- Không đưa service-role key vào frontend.
- Không đưa Gemini/OpenAI secret vào biến `VITE_*`; gọi AI qua FastAPI `/chat` vì mọi biến Vite đều được bundle ra trình duyệt.
- Frontend chỉ dùng anon key.
- Editor/customer chỉ được sửa tenant của họ.
- User chỉ được đọc/ghi tiến trình của chính họ.
- Web admin được xem báo cáo user theo tenant membership.
- Trước deploy cần kiểm tra RLS bằng user anon, user thường, editor và admin.

## 11. Tự động hóa nhập liệu (Data Pipeline Automation)

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
