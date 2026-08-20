import React from "react";
import { Briefcase, Bot, Sparkles, CheckCircle2 } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-[#800000] via-[#900000] to-[#6d0000] text-white shadow-xl border-b border-amber-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#800000] rounded-[10px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  MAPÚA UNIVERSITY
                  <span className="text-amber-400 font-bold text-xs uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 font-mono">
                    Faculty Enablement Copilot
                  </span>
                </h1>
              </div>
              <p className="text-xs text-amber-200/90 flex items-center gap-1.5 mt-0.5">
                <span>Noodle Factory AI Platform Onboarding & Pedagogy Guide</span>
                <span className="inline-block w-1 h-1 rounded-full bg-amber-400"></span>
                <span className="text-amber-300 font-mono font-medium">Gemini 3.6 Flash Server API</span>
              </p>
            </div>
          </div>

          {/* Right Status Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/30 border border-white/15 text-amber-200 text-xs font-medium">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Faculty Mode</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Server API
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};


