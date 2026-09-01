import React, { useState } from "react";
import { UserProfile } from "./types";
import { Header } from "./components/Header";
import { LoginScreen } from "./components/LoginScreen";
import { NoodleOnboardingBot } from "./components/NoodleOnboardingBot";

const AUTH_STORAGE_KEY = "mapua_noodle_user_session";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isHandbookOpen, setIsHandbookOpen] = useState(false);

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
    } catch (err) {
      console.error("Failed to save auth state:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear auth state:", err);
    }
  };

  // If user is not authenticated, show the Login Screen
  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-zinc-100/90 text-zinc-900 font-sans flex flex-col antialiased selection:bg-[#800000] selection:text-amber-200">
      
      {/* Top Navigation Header with User Profile, Handbook Button, & Logout */}
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenHandbook={() => setIsHandbookOpen(true)}
      />

      {/* Main Content Body: Noodle Factory AI Copilot (Personalized for Student or Faculty) */}
      <main className="flex-1 pb-10">
        <NoodleOnboardingBot
          user={user}
          isHandbookOpenExternal={isHandbookOpen}
          onCloseHandbookExternal={() => setIsHandbookOpen(false)}
          onOpenHandbookExternal={() => setIsHandbookOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#800000]">Mapúa University</span>
            <span>•</span>
            <span>Noodle Factory AI Platform Integration</span>
          </div>
          <div className="text-zinc-400 font-mono text-[11px] flex items-center gap-2">
            <span>Academic Handbook A.Y. 2026-2027</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
