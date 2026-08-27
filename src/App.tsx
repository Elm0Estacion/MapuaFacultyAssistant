import React, { useState, useEffect } from "react";
import { UserProfile, AIProvider } from "./types";
import { Header } from "./components/Header";
import { LoginScreen } from "./components/LoginScreen";
import { NoodleOnboardingBot } from "./components/NoodleOnboardingBot";

const AUTH_STORAGE_KEY = "mapua_noodle_user_session";
const AI_PROVIDER_STORAGE_KEY = "mapua_ai_provider_pref";
const OLLAMA_MODEL_STORAGE_KEY = "mapua_ollama_model_pref";
const OLLAMA_HOST_STORAGE_KEY = "mapua_ollama_host_pref";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [aiProvider, setAiProvider] = useState<AIProvider>(() => {
    try {
      const saved = localStorage.getItem(AI_PROVIDER_STORAGE_KEY) as AIProvider;
      return saved === "ollama" ? "ollama" : "gemini";
    } catch {
      return "gemini";
    }
  });

  const [ollamaModel, setOllamaModel] = useState<string>(() => {
    try {
      return localStorage.getItem(OLLAMA_MODEL_STORAGE_KEY) || "llama3.2";
    } catch {
      return "llama3.2";
    }
  });

  const [ollamaHost, setOllamaHost] = useState<string>(() => {
    try {
      return localStorage.getItem(OLLAMA_HOST_STORAGE_KEY) || "http://127.0.0.1:11434";
    } catch {
      return "http://127.0.0.1:11434";
    }
  });

  const [isHandbookOpen, setIsHandbookOpen] = useState(false);

  const handleProviderChange = (provider: AIProvider) => {
    setAiProvider(provider);
    try {
      localStorage.setItem(AI_PROVIDER_STORAGE_KEY, provider);
    } catch (e) {
      console.warn("Could not save AI provider preference:", e);
    }
  };

  const handleOllamaModelChange = (model: string) => {
    setOllamaModel(model);
    try {
      localStorage.setItem(OLLAMA_MODEL_STORAGE_KEY, model);
    } catch (e) {
      console.warn("Could not save Ollama model preference:", e);
    }
  };

  const handleOllamaHostChange = (host: string) => {
    setOllamaHost(host);
    try {
      localStorage.setItem(OLLAMA_HOST_STORAGE_KEY, host);
    } catch (e) {
      console.warn("Could not save Ollama host preference:", e);
    }
  };

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
      
      {/* Top Navigation Header with User Profile, AI Provider Switch, Handbook Button, & Logout */}
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenHandbook={() => setIsHandbookOpen(true)}
        currentProvider={aiProvider}
        onProviderChange={handleProviderChange}
        ollamaModel={ollamaModel}
        onOllamaModelChange={handleOllamaModelChange}
        ollamaHost={ollamaHost}
        onOllamaHostChange={handleOllamaHostChange}
      />

      {/* Main Content Body: Noodle Factory AI Copilot (Personalized for Student or Faculty) */}
      <main className="flex-1 pb-10">
        <NoodleOnboardingBot
          user={user}
          isHandbookOpenExternal={isHandbookOpen}
          onCloseHandbookExternal={() => setIsHandbookOpen(false)}
          onOpenHandbookExternal={() => setIsHandbookOpen(true)}
          aiProvider={aiProvider}
          onProviderChange={handleProviderChange}
          ollamaModel={ollamaModel}
          onOllamaModelChange={handleOllamaModelChange}
          ollamaHost={ollamaHost}
          onOllamaHostChange={handleOllamaHostChange}
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
            <span>•</span>
            <span className="text-zinc-500 font-bold">
              Active API: {aiProvider === "gemini" ? "Google Gemini Cloud" : `Ollama Local (${ollamaModel})`}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
