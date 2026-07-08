import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { motion } from "motion/react";
import { Mail, Lock, Sparkles, ShieldCheck, Compass, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("vimal.desouza@fariaedu.com");
  const [password, setPassword] = useState("••••••••");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Mock API delay for a high-fidelity user experience
    setTimeout(() => {
      login();
      setIsLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 relative">
      {/* Dynamic 3D ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#E837AC]/20 via-[#F78B43]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-[#37023c]/45 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Interactive Pseudo-3D Spline Sphere inside Login */}
        <div className="absolute -top-12 -right-12 w-32 h-32 pointer-events-none opacity-40">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full rounded-full bg-gradient-to-tr from-[#F78B43] via-[#E837AC] to-[#F7D35F] opacity-50 blur-sm"
          />
        </div>

        {/* Faria Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#F7D35F] mb-4">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Academic Governance Portal</span>
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#391e38] flex items-center justify-center shadow-2xl border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
              <span className="text-4xl font-black italic select-none text-transparent bg-clip-text bg-gradient-to-tr from-[#F78B43] via-[#E837AC] to-[#F7D35F] transform -translate-y-[2px]">
                f
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white font-sans">
            Faria <span className="text-[#E837AC] font-light">Security</span>
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto leading-relaxed">
            Please authenticate using your Faria Staff credentials to access your administrative streams and compliance tools.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 text-left">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-white/60 block font-mono pl-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@fariaedu.com"
                className="w-full bg-[#391e38]/40 border border-white/10 focus:border-[#E837AC] focus:ring-2 focus:ring-[#E837AC]/20 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none transition-all font-sans text-left"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between pl-1">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-white/60 block font-mono">
                Password
              </label>
              <span className="text-[10px] text-[#F78B43] hover:underline cursor-pointer font-bold font-sans">
                Forgot Credentials?
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#391e38]/40 border border-white/10 focus:border-[#E837AC] focus:ring-2 focus:ring-[#E837AC]/20 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none transition-all font-sans text-left"
              />
            </div>
          </div>

          {/* Compliance Disclaimer */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-black/25 border border-white/5 text-left">
            <ShieldCheck className="w-4 h-4 text-[#F7D35F] flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/50 leading-relaxed font-sans">
              Authorized access only. Actions on this platform are encrypted, compiled, and recorded in compliance with GDPR academic privacy regulations.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-black/20 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-80 bg-gradient-to-r from-[#F78B43] via-[#E837AC] to-[#F7D35F]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Authorizing Stream...</span>
              </div>
            ) : (
              <>
                <span>Secure Authentication</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-white/40 hover:text-white transition-colors hover:underline"
          >
            &larr; Return to Landing View
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
