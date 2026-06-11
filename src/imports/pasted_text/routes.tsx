https://history-alive.vercel.app. dựa vào app có sẵn đã được build tôi muốn bạn Splash

↓

Login

↓

Register

↓

Choose Name

↓

Choose Grade

↓

Home

Sau đó ghi rõ:

LOCKED FLOW



The following screens MUST remain unchanged.



1. Splash Screen

2. Login

3. Register

4. Choose Name

5. Choose Grade



Requirements:



- Keep existing UI structure

- Keep existing validation logic

- Keep existing API contracts

- Keep existing database fields

- Keep existing navigation flow

- Keep existing user onboarding experience



DO NOT redesign these screens.

DO NOT rename fields.

DO NOT change backend contracts. # QUAN TRỌNG



Đây là dự án chuyển đổi (migration project) từ ứng dụng hiện có sang nền tảng web mới.



## Các chức năng hiện tại phải được GIỮ NGUYÊN HOÀN TOÀN



Các màn hình sau đã tồn tại và không được thay đổi:



1. Splash Screen (Màn hình khởi động)

2. Login (Đăng nhập)

3. Register (Đăng ký)

4. Choose Name (Chọn tên người dùng)

5. Choose Grade (Chọn lớp học)



## Yêu cầu bắt buộc



KHÔNG được thiết kế lại các màn hình trên.



KHÔNG được thay đổi:



\* Cấu trúc cơ sở dữ liệu (Database Schema)

\* API hiện có và các API Contract

\* Luồng xác thực người dùng (Authentication Flow)

\* Luồng điều hướng hiện tại (Navigation Flow)

\* Logic xử lý dữ liệu hiện tại



Các chức năng này được xem là "LOCKED FEATURES" và phải được giữ nguyên 100%.



## Phạm vi được phép thiết kế lại



Việc thiết kế lại chỉ bắt đầu sau khi người dùng hoàn thành onboarding và truy cập vào trang Home.



Từ trang Home trở đi, toàn bộ trải nghiệm sản phẩm có thể được xây dựng lại từ đầu.



Được phép thay đổi:



\* Giao diện Home

\* Cấu trúc điều hướng sau Home

\* Dashboard

\* Timeline

\* Lesson System

\* Mission System

\* Achievement System

\* Collection System

\* Learning Journey

\* UI/UX tổng thể của nền tảng web



## Mục tiêu



Chuyển đổi ứng dụng hiện tại thành một nền tảng học lịch sử tương tác trên web với trải nghiệm hiện đại, tối ưu cho desktop và tablet, đồng thời giữ nguyên toàn bộ quy trình onboarding hiện có.

# NHỮNG ĐIỀU TUYỆT ĐỐI KHÔNG ĐƯỢC LÀM



\* Không xóa bất kỳ màn hình onboarding nào.

\* Không thêm bước onboarding mới.

\* Không đổi tên các trường dữ liệu hiện có.

\* Không tạo schema database mới thay thế schema cũ.

\* Không thay đổi API endpoint hiện có.

\* Không thay đổi logic đăng nhập hoặc đăng ký.

\* Không chuyển đổi luồng người dùng hiện tại.



Nếu cần bổ sung tính năng mới, phải mở rộng từ hệ thống hiện có thay vì thay thế hệ thống hiện có.

/Users/dungtuan/Downloads/EXE\_History alive/Create iPhone App Prototype-2/src/app/routes.tsximport { createBrowserRouter } from "react-router";

import WelcomeScreen from "./screens/WelcomeScreen";

import SignUpScreen from "./screens/SignUpScreen";

import LoginScreen from "./screens/LoginScreen";

import AgeSelectionScreen from "./screens/AgeSelectionScreen";

import NameInputScreen from "./screens/NameInputScreen";

import EmailInputScreen from "./screens/EmailInputScreen";

import SubjectSelectionScreen from "./screens/SubjectSelectionScreen";

import GradeSelectionScreen from "./screens/GradeSelectionScreen";

import StudyTimeSelectionScreen from "./screens/StudyTimeSelectionScreen";

import HomeScreen from "./screens/HomeScreen";

import PracticeModesScreen from "./screens/PracticeModesScreen";

import LeaderboardScreen from "./screens/LeaderboardScreen";

import ProfileScreen from "./screens/ProfileScreen";

import PremiumScreen from "./screens/PremiumScreen";

import AIChatScreen from "./screens/AIChatScreen";

import VideoLessonScreen from "./screens/VideoLessonScreen";

import VideoLesson2Screen from "./screens/VideoLesson2Screen";

import WrongAnswerScreen from "./screens/WrongAnswerScreen";

import BattlePage from '../../battle-package/src/BattlePage';

export const router = createBrowserRouter([

  {

    path: "/",

    Component: WelcomeScreen,

  },

  {

    path: "/signup",

    Component: SignUpScreen,

  },

  {

    path: "/login",

    Component: LoginScreen,

  },

  {

    path: "/onboarding/age",

    Component: AgeSelectionScreen,

  },

  {

    path: "/onboarding/name",

    Component: NameInputScreen,

  },

  {

    path: "/onboarding/email",

    Component: EmailInputScreen,

  },

  {

    path: "/onboarding/subject",

    Component: SubjectSelectionScreen,

  },

  {

    path: "/onboarding/grade",

    Component: GradeSelectionScreen,

  },

  {

    path: "/onboarding/study-time",

    Component: StudyTimeSelectionScreen,

  },

  {

    path: "/home",

    Component: HomeScreen,

  },

  {

    path: "/practice",

    Component: PracticeModesScreen,

  },

  {

    path: "/battle",

    Component: BattlePage,

  },

  {

    path: "/leaderboard",

    Component: LeaderboardScreen,

  },

  {

    path: "/profile",

    Component: ProfileScreen,

  },

  {

    path: "/premium",

    Component: PremiumScreen,

  },

  {

    path: "/ai-chat",

    Component: AIChatScreen,

  },

  {

    path: "/video-lesson",

    Component: VideoLessonScreen,

  },

  {

    path: "/video-lesson-2",

    Component: VideoLesson2Screen,

  },

  {

    path: "/wrong-answer",

    Component: WrongAnswerScreen,

  },

]);