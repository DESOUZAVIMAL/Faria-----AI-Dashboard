import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, RotateCcw, LayoutGrid } from "lucide-react";
import { useDashboard } from "../lib/DashboardContext";

export default function TopBar() {
  const location = useLocation();
  const isDashboardActive = location.pathname.startsWith("/dashboard");
  const isMatrixActive = location.pathname.startsWith("/matrix");
  const { resetDemo } = useDashboard();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/5 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Section: Brand Logo (Faria favicon CSS representation) */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-xl bg-[#391638] flex items-center justify-center shadow-lg shadow-black/20 border border-white/10 relative overflow-hidden group">
            {/* Soft gradient accent line on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <span className="text-2xl font-black italic select-none text-transparent bg-clip-text bg-gradient-to-tr from-[#F78843] via-[#E837AC] to-[#F7D35F] transform -translate-y-[1px] font-sans">
              f
            </span>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white font-sans">
            Faria <span className="text-[#E837AC] font-medium">Dashboard</span>
          </span>
        </div>

        {/* Center Section: Navigation Links */}
        <nav className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              isDashboardActive
                ? "bg-white/10 text-white border-white/20 shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            to="/matrix"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              isMatrixActive
                ? "bg-white/10 text-white border-white/20 shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Compliance Matrix</span>
          </Link>
        </nav>

        {/* Right Section: Presentation Tools & Placeholder Avatar */}
        <div className="flex items-center gap-4">
          {/* Subtle Reset Demo Presentation Button */}
          <button
            onClick={resetDemo}
            title="Reset Demo State"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-white/70 hover:text-white hover:bg-white/10 border border-white/10 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#E837AC]" />
            <span className="hidden md:inline font-sans">Reset Demo</span>
          </button>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white">Vimal De Souza</span>
            <span className="text-[10px] text-white/50 font-mono font-medium">Faria Staff Account</span>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F78843] via-[#E837AC] to-[#F7D35F] p-[2px] transition-transform duration-300 hover:scale-105 shadow-md shadow-[#E837AC]/15">
              <div className="w-full h-full bg-[#391638] rounded-[10px] flex items-center justify-center overflow-hidden">
                <span className="text-xs font-extrabold text-white">
                  VS
                </span>
              </div>
            </div>
            {/* Status dot in brand Pink */}
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#E837AC] rounded-full border-2 border-[#391638]" />
          </div>
        </div>
      </div>
    </header>
  );
}
