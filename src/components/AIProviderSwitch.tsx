import React, { useState, useEffect } from "react";
import { AIProvider, AIStatusResponse } from "../types";
import { Sparkles, Terminal, CheckCircle2, AlertCircle, RefreshCw, ChevronDown, Cpu, Globe, Settings2, X } from "lucide-react";

interface AIProviderSwitchProps {
  currentProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  ollamaModel: string;
  onOllamaModelChange: (model: string) => void;
  ollamaHost: string;
  onOllamaHostChange: (host: string) => void;
}

export const AIProviderSwitch: React.FC<AIProviderSwitchProps> = ({
  currentProvider,
  onProviderChange,
  ollamaModel,
  onOllamaModelChange,
  ollamaHost,
  onOllamaHostChange,
}) => {
  const [status, setStatus] = useState<AIStatusResponse | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [tempHost, setTempHost] = useState<string>(ollamaHost);
  const [tempModel, setTempModel] = useState<string>(ollamaModel);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(`/api/ai-status?host=${encodeURIComponent(ollamaHost)}`);
      if (res.ok) {
        const data: AIStatusResponse = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.warn("Could not retrieve AI status:", err);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [ollamaHost]);

  const isGemini = currentProvider === "gemini";

  return (
    <>
      {/* Selector Container */}
      <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs p-1 rounded-xl border border-white/20 shadow-inner">
        {/* Toggle Pills */}
        <div className="flex items-center bg-black/25 rounded-lg p-0.5 border border-white/10">
          {/* Gemini Option */}
          <button
            id="switch-provider-gemini-btn"
            type="button"
            onClick={() => onProviderChange("gemini")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              isGemini
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 shadow-sm font-bold"
                : "text-amber-100/75 hover:text-white hover:bg-white/10"
            }`}
            title="Switch to Gemini Cloud API (Fast, Multimodal, Academic Handbook Grounded)"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGemini ? "text-zinc-950" : "text-amber-300"}`} />
            <span>Gemini API</span>
            <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${isGemini ? "bg-black/20 text-zinc-950 font-bold" : "bg-white/10 text-amber-200"}`}>
              Cloud
            </span>
          </button>

          {/* Ollama Option */}
          <button
            id="switch-provider-ollama-btn"
            type="button"
            onClick={() => onProviderChange("ollama")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              !isGemini
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm font-bold"
                : "text-amber-100/75 hover:text-white hover:bg-white/10"
            }`}
            title="Switch to Ollama Local AI API (Offline, Private, Local Llama/Mistral/Gemma)"
          >
            <Terminal className={`w-3.5 h-3.5 ${!isGemini ? "text-white" : "text-indigo-300"}`} />
            <span>Ollama API</span>
            <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${!isGemini ? "bg-black/20 text-white font-bold" : "bg-white/10 text-indigo-200"}`}>
              Local
            </span>
          </button>
        </div>

        {/* Status Indicator / Quick Configure Button */}
        <button
          id="open-ai-config-modal-btn"
          type="button"
          onClick={() => {
            setTempHost(ollamaHost);
            setTempModel(ollamaModel);
            setShowConfigModal(true);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 text-[11px] font-mono transition border border-transparent hover:border-white/20 cursor-pointer"
          title="Configure AI Models & Hosts"
        >
          {isGemini ? (
            <span className="flex items-center gap-1 text-emerald-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">3.6-Flash</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status?.ollamaReachable ? "bg-emerald-400" : "bg-amber-400"
                }`}
              ></span>
              <span className="hidden sm:inline truncate max-w-[80px] text-zinc-200">
                {ollamaModel}
              </span>
            </span>
          )}
          <Settings2 className="w-3.5 h-3.5 ml-0.5 text-amber-200/80" />
        </button>
      </div>

      {/* AI Provider Details & Configuration Modal */}
      {showConfigModal && (
        <div
          id="ai-provider-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfigModal(false);
          }}
        >
          <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#E0D8C8] rounded-2xl shadow-2xl p-6 text-[#2C2723]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD3]">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF2DE] border border-[#E8D4A8] flex items-center justify-center text-[#800000]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2C2723]">AI Engine Configuration</h3>
                  <p className="text-xs text-[#6E6558]">Switch & fine-tune Gemini Cloud or Local Ollama</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 rounded-lg text-[#6E6558] hover:text-[#2C2723] hover:bg-[#EFECE3] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Provider Selection Cards */}
            <div className="mt-4 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6E6558]">
                Select Active Model Engine
              </label>

              {/* Gemini Option Card */}
              <div
                onClick={() => onProviderChange("gemini")}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isGemini
                    ? "bg-[#FFFFFF] border-[#800000] shadow-sm ring-1 ring-[#800000]/20"
                    : "bg-[#FFFFFF] border-[#E0D8C8] hover:bg-[#F5F2EB]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#800000] text-[#FFFDF9] flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2C2723] flex items-center gap-2">
                        Google Gemini API
                        <span className="text-[10px] bg-[#FAF2DE] text-[#875507] border border-[#E8D4A8] px-2 py-0.5 rounded-full font-mono font-medium">
                          Cloud
                        </span>
                      </h4>
                      <p className="text-xs text-[#6E6558] mt-0.5">
                        High accuracy, real-time citations & Mapúa Academic Handbook grounded
                      </p>
                    </div>
                  </div>
                  {isGemini && <CheckCircle2 className="w-5 h-5 text-[#800000] shrink-0" />}
                </div>
              </div>

              {/* Ollama Option Card */}
              <div
                onClick={() => onProviderChange("ollama")}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  !isGemini
                    ? "bg-[#FFFFFF] border-[#4338CA] shadow-sm ring-1 ring-[#4338CA]/20"
                    : "bg-[#FFFFFF] border-[#E0D8C8] hover:bg-[#F5F2EB]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#4338CA] text-white flex items-center justify-center font-bold">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2C2723] flex items-center gap-2">
                        Ollama Local AI
                        <span className="text-[10px] bg-[#EEF2FF] text-[#3730A3] border border-[#C7D2FE] px-2 py-0.5 rounded-full font-mono font-medium">
                          Local Daemon
                        </span>
                      </h4>
                      <p className="text-xs text-[#6E6558] mt-0.5">
                        100% private, runs offline on your machine (Llama 3.2, Mistral, Gemma 2)
                      </p>
                    </div>
                  </div>
                  {!isGemini && <CheckCircle2 className="w-5 h-5 text-[#4338CA] shrink-0" />}
                </div>
              </div>
            </div>

            {/* Ollama Advanced Settings Form */}
            <div className="mt-5 p-3.5 bg-[#FFFFFF] rounded-xl border border-[#E0D8C8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2C2723] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#4338CA]" />
                  Ollama Connection Settings
                </span>
                <button
                  type="button"
                  onClick={checkStatus}
                  disabled={isChecking}
                  className="flex items-center gap-1 text-[11px] text-[#6E6558] hover:text-[#2C2723] transition disabled:opacity-50 cursor-pointer"
                  title="Refresh Connection Check"
                >
                  <RefreshCw className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`} />
                  Test Status
                </button>
              </div>

              {/* Status banner */}
              <div
                className={`p-2.5 rounded-lg text-xs flex items-start space-x-2 ${
                  status?.ollamaReachable
                    ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                    : "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                }`}
              >
                {status?.ollamaReachable ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669] mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#D97706] mt-0.5" />
                )}
                <div className="text-[11px] leading-relaxed">
                  {status?.details || "Checking Ollama daemon..."}
                </div>
              </div>

              {/* Host URL Input */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6E6558] mb-1">
                  Ollama Host Endpoint
                </label>
                <input
                  type="text"
                  value={tempHost}
                  onChange={(e) => setTempHost(e.target.value)}
                  placeholder="http://127.0.0.1:11434"
                  className="w-full bg-[#FAF8F5] border border-[#DDD5C5] rounded-lg px-3 py-1.5 text-xs text-[#2C2723] placeholder:text-[#9E9484] font-mono focus:outline-hidden focus:ring-1 focus:ring-[#800000]"
                />
              </div>

              {/* Model Name Input / Suggestions */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6E6558] mb-1">
                  Model Name (e.g. llama3.2, mistral, gemma2)
                </label>
                <input
                  type="text"
                  value={tempModel}
                  onChange={(e) => setTempModel(e.target.value)}
                  placeholder="llama3.2"
                  className="w-full bg-[#FAF8F5] border border-[#DDD5C5] rounded-lg px-3 py-1.5 text-xs text-[#2C2723] placeholder:text-[#9E9484] font-mono focus:outline-hidden focus:ring-1 focus:ring-[#800000]"
                />
                
                {status?.installedModels && status.installedModels.length > 0 && (
                  <div className="mt-2">
                    <span className="text-[10px] text-[#6E6558] block mb-1">Installed local models:</span>
                    <div className="flex flex-wrap gap-1">
                      {status.installedModels.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setTempModel(m)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border transition cursor-pointer ${
                            tempModel === m
                              ? "bg-[#4338CA] text-white border-[#3730A3]"
                              : "bg-[#FAF8F5] text-[#4A4237] border-[#DDD5C5] hover:bg-[#EFECE3]"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-[#EFECE3] hover:bg-[#E5DFD3] text-xs font-semibold text-[#4A4237] transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onOllamaHostChange(tempHost.trim() || "http://127.0.0.1:11434");
                  onOllamaModelChange(tempModel.trim() || "llama3.2");
                  setShowConfigModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#800000] hover:bg-[#6b0000] text-[#FFFDF9] text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
