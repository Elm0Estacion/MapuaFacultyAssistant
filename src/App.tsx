import React from "react";
import { Header } from "./components/Header";
import { NoodleOnboardingBot } from "./components/NoodleOnboardingBot";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-100/90 text-zinc-900 font-sans flex flex-col antialiased selection:bg-[#800000] selection:text-amber-200">
      
      {/* Top Navigation Header */}
      <Header />

      {/* Main Content Body: Dedicated Noodle Factory AI Faculty Enablement & Guidance Agent */}
      <main className="flex-1 pb-10">
        <NoodleOnboardingBot />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#800000]">Mapúa University</span>
            <span>•</span>
            <span>Noodle Factory AI Faculty Pedagogy & Platform Enablement</span>
          </div>
          <div className="text-zinc-400 font-mono text-[11px]">
            Mapúa Outcome-Based Education (OBE) • Blackboard Sync • Gemini 3.6 Flash Server API
          </div>
        </div>
      </footer>

    </div>
  );
}
