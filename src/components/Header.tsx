import React from "react";
import { UserProfile } from "../types";
import { Briefcase, GraduationCap, Bot, LogOut, ShieldCheck, User } from "lucide-react";

interface HeaderProps {
  user: UserProfile;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const isStudent = user.role === "student";

  return (
    <header className="bg-gradient-to-r from-[#800000] via-[#900000] to-[#6d0000] text-white shadow-xl border-b border-amber-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#800000] rounded-[10px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  MAPÚA UNIVERSITY
                  <span className="text-amber-400 font-bold text-xs uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 font-mono">
                    {isStudent ? "Student Learning Copilot" : "Faculty Enablement Copilot"}
                  </span>
                </h1>
              </div>
              <p className="text-xs text-amber-200/90 flex items-center gap-1.5 mt-0.5">
                <span>Noodle Factory Platform Enablement</span>
                <span className="inline-block w-1 h-1 rounded-full bg-amber-400"></span>
                <span className="text-amber-300 font-mono font-medium">Gemini 3.6 Flash Server API</span>
              </p>
            </div>
          </div>

          {/* User Profile & Logout Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            
            {/* User Details Chip */}
            <div className="flex items-center gap-2.5 bg-black/35 px-3 py-1.5 rounded-2xl border border-white/15">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                {user.avatarText || (isStudent ? "ST" : "FC")}
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[180px]">
                    {user.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                      isStudent
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                        : "bg-emerald-400/20 text-emerald-300 border border-emerald-400/40"
                    }`}
                  >
                    {isStudent ? "Student" : "Faculty"}
                  </span>
                </div>
                <span className="text-[10px] text-amber-200/80 font-mono truncate max-w-[140px] sm:max-w-[200px]">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Logout / Switch Account Button */}
            <button
              id="header-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-amber-200 hover:text-white text-xs font-semibold transition cursor-pointer"
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
