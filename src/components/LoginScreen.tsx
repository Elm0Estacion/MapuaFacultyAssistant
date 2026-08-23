import React, { useState } from "react";
import { UserRole, UserProfile } from "../types";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Bot,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const LOCAL_ACCOUNTS = [
  {
    email: "ejdestacion@mymail.mapua.edu.ph",
    password: "Student123",
    role: "student" as UserRole,
    name: "EJ Destacion",
    department: "School of Information Technology",
    studentIdOrFacultyId: "2022104592",
    avatarText: "ED",
  },
  {
    email: "jptcruz@mapua.edu.ph",
    password: "Faculty123",
    role: "faculty" as UserRole,
    name: "Prof. JP T. Cruz",
    department: "Department of Computer Science & Engineering",
    studentIdOrFacultyId: "FAC-88190",
    avatarText: "JC",
  },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Authentication failed. Please check your credentials."
        );
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      // Fallback local validation
      const normalizedEmail = email.trim().toLowerCase();
      const matched = LOCAL_ACCOUNTS.find(
        (acc) =>
          acc.email.toLowerCase() === normalizedEmail &&
          acc.password === password.trim()
      );

      if (matched) {
        onLoginSuccess(matched);
      } else {
        setErrorMessage(
          err.message ||
            "Invalid email or password. Please verify your Mapúa account credentials."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden selection:bg-amber-400 selection:text-zinc-950">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#800000]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-zinc-950/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#800000] to-[#b30000] border-2 border-amber-400/50 shadow-lg text-amber-300 mb-1">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              Mapúa University
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1.5">
              Noodle Factory AI
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Sign in with your Mapúa account to access your AI Copilot
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Unified Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Mapúa Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
              <input
                id="login-password-input"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="login-submit-btn"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#800000] via-[#990000] to-[#b30000] hover:from-[#6d0000] hover:to-[#800000] text-amber-300 font-bold text-xs sm:text-sm rounded-xl shadow-lg border border-amber-500/30 flex items-center justify-center gap-2 transition transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Notice */}
        <div className="pt-2 border-t border-zinc-900 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured for Mapúa Outcome-Based Education (OBE)</span>
        </div>

      </div>

    </div>
  );
};
