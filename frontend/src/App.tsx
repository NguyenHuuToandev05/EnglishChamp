import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudyPage from "./pages/StudyPage";
import DecksPage from "./pages/DecksPage";
import ArenaPage from "./pages/ArenaPage";
import LeaderboardPage from "./pages/LeaderboardPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/study/:deckId" element={<StudyPage />} />
            <Route path="/decks" element={<DecksPage />} />
            <Route path="/arena" element={<ArenaPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;