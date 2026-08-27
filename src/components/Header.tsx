import React from "react";
import { UserProfile, AIProvider } from "../types";
import { Bot, LogOut, BookOpen } from "lucide-react";
import { AIProviderSwitch } from "./AIProviderSwitch";

interface HeaderProps {
  user: UserProfile;
  onLogout: () => void;
  onOpenHandbook?: () => void;
  currentProvider?: AIProvider;
  onProviderChange?: (provider: AIProvider) => void;
  ollamaModel?: string;
  onOllamaModelChange?: (model: string) => void;
  ollamaHost?: string;
  onOllamaHostChange?: (host: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onOpenHandbook,
  currentProvider = "gemini",
  onProviderChange,
  ollamaModel = "llama3.2",
  onOllamaModelChange,
  ollamaHost = "http://127.0.0.1:11434",
  onOllamaHostChange,
}) => {
  const isStudent = user.role === "student";

  return (
    <header className="bg-gradient-to-r from-[#800000] via-[#900000] to-[#6d0000] text-white shadow-xl border-b border-amber-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#800000] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  MAPÚA UNIVERSITY
                  <span className="text-amber-400 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 font-mono">
                    {isStudent ? "Student Copilot" : "Faculty Copilot"}
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-amber-200/90 flex items-center gap-1.5 mt-0.5">
                <span>Noodle Factory</span>
                <span className="inline-block w-1 h-1 rounded-full bg-amber-400"></span>
                <span className="text-amber-300 font-mono font-medium">Handbook A.Y. 2026-2027</span>
              </p>
            </div>
          </div>

          {/* Center / Right: Dual AI API Switcher & Actions */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            
            {/* AI API Switcher Button Widget */}
            {onProviderChange && (
              <div className="shrink-0">
                <AIProviderSwitch
                  currentProvider={currentProvider}
                  onProviderChange={onProviderChange}
                  ollamaModel={ollamaModel}
                  onOllamaModelChange={onOllamaModelChange || (() => {})}
                  ollamaHost={ollamaHost}
                  onOllamaHostChange={onOllamaHostChange || (() => {})}
                />
              </div>
            )}

            {/* Handbook Quick Button */}
            {onOpenHandbook && (
              <button
                id="header-handbook-btn"
                onClick={onOpenHandbook}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 hover:text-white text-xs font-semibold transition cursor-pointer shadow-xs shrink-0"
                title="View Mapúa Academic Handbook A.Y. 2026-2027"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden lg:inline">Academic Handbook</span>
                <span className="lg:hidden">Handbook</span>
              </button>
            )}

            {/* User Details Chip */}
            <div className="flex items-center gap-2 bg-[#FAF8F5]/15 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/25 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                {user.avatarText || (isStudent ? "ST" : "FC")}
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate max-w-[110px] sm:max-w-[150px]">
                    {user.name}
                  </span>
                  <span
                    className={`text-[8px] font-mono font-bold uppercase px-1 py-0.2 rounded ${
                      isStudent
                        ? "bg-amber-400/20 text-amber-200 border border-amber-400/40"
                        : "bg-emerald-400/20 text-emerald-200 border border-emerald-400/40"
                    }`}
                  >
                    {isStudent ? "ST" : "FC"}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout / Switch Account Button */}
            <button
              id="header-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-amber-200 hover:text-white text-xs font-semibold transition cursor-pointer shrink-0"
              title="Sign out or switch accounts"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

