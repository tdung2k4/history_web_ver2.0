import { createBrowserRouter, Navigate, Outlet } from "react-router";
import AppLayout from "./components/AppLayout";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ChooseNameScreen from "./screens/ChooseNameScreen";
import ChooseGradeScreen from "./screens/ChooseGradeScreen";
import ChooseStudyTimeScreen from "./screens/ChooseStudyTimeScreen";
import HomeScreen from "./screens/HomeScreen";
import LessonScreen from "./screens/LessonScreen";
import MissionsScreen from "./screens/MissionsScreen";
import AchievementsScreen from "./screens/AchievementsScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import CollectionScreen from "./screens/CollectionScreen";
import ProfileScreen from "./screens/ProfileScreen";
import StoryScreen from "./screens/StoryScreen";
import PricingScreen from "./screens/PricingScreen";
import AIChatScreen from "./screens/AIChatScreen";
import StoreScreen from "./screens/StoreScreen";
import PvPScreen from "./screens/PvPScreen";
import FlashcardScreen from "./screens/FlashcardScreen";

function Root() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: "/", element: <SplashScreen /> },
      { path: "/login", element: <LoginScreen /> },
      { path: "/register", element: <RegisterScreen /> },
      { path: "/onboarding/name", element: <ChooseNameScreen /> },
      { path: "/onboarding/grade", element: <ChooseGradeScreen /> },
      { path: "/onboarding/time", element: <ChooseStudyTimeScreen /> },
      { path: "/lesson/:id", element: <LessonScreen /> },
      { path: "/story/:id", element: <StoryScreen /> },
      { path: "/premium", element: <PricingScreen /> },
      { path: "/ai-chat", element: <AIChatScreen /> },
      {
        element: <AppLayout />,
        children: [
          { path: "/home", element: <HomeScreen /> },
          { path: "/missions", element: <MissionsScreen /> },
          { path: "/achievements", element: <AchievementsScreen /> },
          { path: "/leaderboard", element: <LeaderboardScreen /> },
          { path: "/collection", element: <CollectionScreen /> },
          { path: "/profile", element: <ProfileScreen /> },
          { path: "/store", element: <StoreScreen /> },
          { path: "/pvp", element: <PvPScreen /> },
          { path: "/flashcard", element: <FlashcardScreen /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
