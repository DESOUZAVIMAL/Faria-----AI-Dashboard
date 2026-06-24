import React from "react";
import { Sparkles, Calendar, AlertTriangle, ListTodo, TrendingUp } from "lucide-react";
import { useDashboard, AICategory } from "../lib/DashboardContext";

export default function Brief() {
  const { userName, notifications, tasks } = useDashboard();

  // Format current date in British English style (e.g. 23 June 2026)
  const formattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate dynamic counts
  const unreadUrgentCount = notifications.filter(
    (n) => n.aiCategory === AICategory.Urgent && !n.isRead
  ).length;

  const incompleteTasksCount = tasks.filter((t) => !t.completed).length;

  // Render a responsive dynamic summary sentence
  const urgentSentence = unreadUrgentCount === 1
    ? "1 urgent item requiring immediate attention"
    : `${unreadUrgentCount} urgent items requiring immediate attention`;

  return (
    <div id="faria-daily-brief" className="relative overflow-hidden rounded-2xl bg-[#37023c] text-white p-6 md:p-8 shadow-lg border border-[#552859]/30">
      {/* Brand Track Graphic representing forward momentum */}
      <div className="absolute right-0 top-0 h-full w-32 md:w-64 opacity-25 pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
          <path
            d="M-20 20 Q 50 50 120 80"
            stroke="url(#brief-track)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="brief-track" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F78843" />
              <stop offset="50%" stopColor="#E837AC" />
              <stop offset="100%" stopColor="#F7D35F" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand gradient accent track (Top thick track) */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F]" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 text-left">
          {/* Top Date Badge */}
          <div id="brief-date-badge" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#552859]/60 border border-white/10 text-xs font-semibold text-[#F7D35F] mb-4 font-sans">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>

          {/* Heading with Brand Tone */}
          <h1 id="brief-title" className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 leading-tight font-sans">
            Good morning, {userName}. Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F]">make education better</span> today.
          </h1>
          
          <p id="brief-summary" className="text-white/85 text-sm md:text-base max-w-2xl leading-relaxed font-sans font-medium">
            You have <span className="text-[#E837AC] font-extrabold">{urgentSentence}</span>. Your core priority is finalising the Q3 curriculum alignment framework and verifying the regional SSO integration certificates.
          </p>

          {/* Metrics section using Light Plum background */}
          <div id="brief-metrics-list" className="flex flex-wrap gap-2.5 mt-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#552859] border border-[#552859]/40 text-xs font-bold font-sans">
              <AlertTriangle className="w-4 h-4 text-[#E837AC]" />
              <span>{unreadUrgentCount} Urgent Unread</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#552859] border border-[#552859]/40 text-xs font-bold font-sans">
              <ListTodo className="w-4 h-4 text-[#F78843]" />
              <span>{incompleteTasksCount} Active Tasks</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#552859] border border-[#552859]/40 text-xs font-bold font-sans">
              <Sparkles className="w-4 h-4 text-[#F7D35F]" />
              <span>AI Fully Synchronised</span>
            </div>
          </div>
        </div>

        {/* Brand visual callout / AI focus pill */}
        <div id="brief-status-pill" className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl min-w-[240px] shadow-lg self-start md:self-auto">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-[#F78843]/20 via-[#E837AC]/20 to-[#F7D35F]/20 border border-[#E837AC]/30 text-white">
            <Sparkles className="w-5 h-5 text-[#E837AC] animate-pulse" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono">Performance Sorter</div>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#F78843]" />
              <span>94% Daily Efficacy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
