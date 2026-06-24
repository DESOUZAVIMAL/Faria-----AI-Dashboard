import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Inbox as InboxIcon,
  Sparkles,
  Mail,
  MessageSquare,
  Monitor,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Archive,
  RefreshCw,
  Clock,
  AlertTriangle,
  Info,
  Layers,
  Loader2,
  LayoutGrid,
  List
} from "lucide-react";
import { useDashboard, AICategory } from "../lib/DashboardContext";
import MatrixView from "./MatrixView";

export default function Inbox() {
  const {
    notifications,
    isSorting,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    autoSortInbox,
    resetStream,
  } = useDashboard();

  const [activeFilter, setActiveFilter] = useState<"All" | "Urgent" | "Action" | "FYI">("All");
  const [viewMode, setViewMode] = useState<"list" | "matrix">("list");


  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "slack":
        return <MessageSquare className="w-4 h-4 text-[#E837AC]" />;
      case "managebac+":
        return <Monitor className="w-4 h-4 text-[#37023c]" />;
      case "email":
        return <Mail className="w-4 h-4 text-[#F78843]" />;
      case "calendar":
        return <CalendarIcon className="w-4 h-4 text-[#F7D35F]" />;
      default:
        return <Layers className="w-4 h-4 text-[#37023c]/60" />;
    }
  };

  const getCategoryStyles = (category: AICategory) => {
    switch (category) {
      case AICategory.Urgent:
        return {
          border: "border-[#E837AC]/30 hover:border-[#E837AC]/60",
          accentBg: "bg-[#E837AC]/5",
          text: "text-[#E837AC]",
          glow: "shadow-[0_4px_20px_-4px_rgba(232,55,172,0.12)]",
          barColor: "bg-[#E837AC]",
          badgeBg: "bg-[#E837AC]/10 text-[#E837AC] border-[#E837AC]/20",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-[#E837AC]" />
        };
      case AICategory.ActionRequired:
        return {
          border: "border-[#F78843]/30 hover:border-[#F78843]/60",
          accentBg: "bg-[#F78843]/5",
          text: "text-[#F78843]",
          glow: "shadow-[0_4px_20px_-4px_rgba(247,136,67,0.12)]",
          barColor: "bg-[#F78843]",
          badgeBg: "bg-[#F78843]/10 text-[#F78843] border-[#F78843]/20",
          icon: <Clock className="w-3.5 h-3.5 text-[#F78843]" />
        };
      case AICategory.FYI:
        return {
          border: "border-[#552859]/30 hover:border-[#552859]/50",
          accentBg: "bg-[#552859]/5",
          text: "text-[#552859]",
          glow: "shadow-none",
          barColor: "bg-[#552859]",
          badgeBg: "bg-[#552859]/10 text-[#552859] border-[#552859]/20",
          icon: <Info className="w-3.5 h-3.5 text-[#552859]" />
        };
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Urgent") return n.aiCategory === AICategory.Urgent;
    if (activeFilter === "Action") return n.aiCategory === AICategory.ActionRequired;
    if (activeFilter === "FYI") return n.aiCategory === AICategory.FYI;
    return true;
  });

  const urgentCount = notifications.filter((n) => n.aiCategory === AICategory.Urgent && !n.isRead).length;

  return (
    <div className="bg-white border border-[#37023c]/10 rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Decorative gradient Faria brand tracks in background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F78843]/5 via-[#E837AC]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#37023c]/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#37023c]/5 text-[#E837AC] border border-[#37023c]/10 shadow-sm">
            <InboxIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-[#37023c] tracking-tight text-left">AI Inbox Sorter</h2>
              {urgentCount > 0 && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E837AC] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E837AC]"></span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#37023c]/60 text-left">Intelligent curation stream based on priority</p>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* High Polish View Mode Toggle */}
          <div className="inline-flex rounded-xl p-1 bg-[#F0EBEB]/60 border border-[#37023c]/10 mr-1 shadow-inner">
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-[#37023c] shadow-sm"
                  : "text-[#37023c]/60 hover:text-[#37023c]"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("matrix")}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer ${
                viewMode === "matrix"
                  ? "bg-white text-[#37023c] shadow-sm"
                  : "text-[#37023c]/60 hover:text-[#37023c]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Matrix</span>
            </button>
          </div>

          {/* AI Auto-Sort Button */}
          <button
            onClick={autoSortInbox}
            disabled={isSorting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-extrabold text-xs tracking-wide transition-all shadow-md cursor-pointer disabled:opacity-85 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F]"
          >
            {isSorting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>AI Auto-Sort</span>
              </>
            )}
          </button>

          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#37023c]/70 hover:text-[#37023c] hover:bg-[#F0EBEB]/60 transition-all cursor-pointer border border-[#37023c]/5"
            >
              Mark all as read
            </button>
          )}

          {notifications.length < 8 && (
            <button
              onClick={resetStream}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#37023c]/5 hover:bg-[#37023c]/10 text-xs font-bold text-[#37023c] transition-all cursor-pointer border border-[#37023c]/10 font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Stream</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === "matrix" ? (
        <MatrixView />
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-6 p-1 rounded-xl bg-[#F0EBEB]/60 border border-[#37023c]/5 self-start">
            <button
              onClick={() => setActiveFilter("All")}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all duration-300 ease-in-out cursor-pointer ${
                activeFilter === "All"
                  ? "bg-white text-[#37023c] shadow-sm border border-[#37023c]/5"
                  : "text-[#37023c]/60 hover:text-[#37023c] hover:bg-white/40"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter("Urgent")}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all duration-300 ease-in-out cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "Urgent"
                  ? "bg-[#E837AC]/10 text-[#E837AC] border border-[#E837AC]/20"
                  : "text-[#37023c]/60 hover:text-[#E837AC] hover:bg-[#E837AC]/5"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E837AC]" />
              Urgent ({notifications.filter((n) => n.aiCategory === AICategory.Urgent).length})
            </button>
            <button
              onClick={() => setActiveFilter("Action")}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all duration-300 ease-in-out cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "Action"
                  ? "bg-[#F78843]/10 text-[#F78843] border border-[#F78843]/20"
                  : "text-[#37023c]/60 hover:text-[#F78843] hover:bg-[#F78843]/5"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F78843]" />
              Action ({notifications.filter((n) => n.aiCategory === AICategory.ActionRequired).length})
            </button>
            <button
              onClick={() => setActiveFilter("FYI")}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all duration-300 ease-in-out cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "FYI"
                  ? "bg-[#552859]/10 text-[#552859] border border-[#552859]/20"
                  : "text-[#37023c]/60 hover:text-[#552859] hover:bg-[#552859]/5"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#552859]" />
              FYI ({notifications.filter((n) => n.aiCategory === AICategory.FYI).length})
            </button>
          </div>

          {/* Feed Area */}
          <div className="flex-1 space-y-4 relative">
            {/* Pulsing Backdrop when AI is thinking/sorting */}
            <AnimatePresence>
              {isSorting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#37023c] rounded-2xl z-20 flex flex-col items-center justify-center text-white backdrop-blur-[2px]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-[#F7D35F]" />
                    <span className="font-extrabold tracking-widest text-xs uppercase font-mono animate-pulse">
                      AI Prioritising Feed...
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center text-center py-24 px-6 border border-dashed border-[#37023c]/20 rounded-2xl bg-gradient-to-b from-[#F0EBEB]/10 to-[#F0EBEB]/30 shadow-inner relative overflow-hidden"
                >
                  {/* Background gradient blur */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#F78843]/5 via-[#E837AC]/5 to-[#F7D35F]/5 pointer-events-none" />
                  
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F78843]/10 via-[#E837AC]/10 to-[#F7D35F]/10 border border-[#E837AC]/20 text-[#E837AC] mb-5 shadow-sm">
                    <Sparkles className="w-8 h-8 text-[#E837AC] animate-pulse" />
                  </div>
                  
                  <h3 className="text-lg font-black tracking-tight leading-none mb-2 font-sans text-transparent bg-clip-text bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F]">
                    Inbox Zero
                  </h3>
                  <p className="text-sm font-bold text-[#37023c] mb-1">
                    Great job staying on top of things.
                  </p>
                  <p className="text-xs text-[#37023c]/60 max-w-xs leading-relaxed font-sans font-medium">
                    All intelligence streams and academic compliance alerts have been successfully resolved.
                  </p>
                </motion.div>
              ) : filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center text-center py-20 px-4 border border-dashed border-[#37023c]/15 rounded-2xl bg-[#F0EBEB]/30"
                >
                  <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#F0EBEB]/60 border border-[#37023c]/10 text-[#37023c]/50 mb-4 shadow-inner">
                    <CheckCircle2 className="w-7 h-7 text-[#E837AC]" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#37023c]">No notifications to sort</h3>
                  <p className="text-xs text-[#37023c]/60 mt-1 max-w-sm leading-relaxed">
                    Your intelligence feed is clear of matching notification streams. Excellent work staying organised!
                  </p>
                </motion.div>
              ) : (
                filteredNotifications.map((notif) => {
                  const style = getCategoryStyles(notif.aiCategory);
                  return (
                    <motion.div
                      key={notif.id}
                      layoutId={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                      className={`group relative bg-[#F0EBEB]/20 hover:bg-[#F0EBEB]/45 border ${style.border} ${style.glow} rounded-2xl p-5 transition-all duration-300`}
                    >
                      {/* Left-side brand accent track for forward momentum */}
                      <div className={`absolute left-0 top-0 bottom-0 w-[4px] rounded-l-2xl ${style.barColor}`} />

                      <div className="flex flex-col gap-3.5">
                        {/* Top metadata line */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Source icon context container */}
                            <div className="p-1.5 rounded-lg bg-white border border-[#37023c]/10 flex items-center justify-center shadow-sm">
                              {getSourceIcon(notif.source)}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-[#37023c] block sm:inline">
                                {notif.source}
                              </span>
                              <span className="hidden sm:inline text-[#37023c]/30 mx-2">•</span>
                              <span className="text-[11px] text-[#37023c]/50 font-mono font-medium">
                                {notif.time}
                              </span>
                            </div>
                          </div>

                          {/* Right-side status indicators */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider font-mono ${style.badgeBg}`}>
                              {style.icon}
                              <span>{notif.aiCategory}</span>
                            </span>

                            {/* Read state toggle */}
                            <button
                              onClick={() => markAsRead(notif.id)}
                              title={notif.isRead ? "Mark as unread" : "Mark as read"}
                              className="p-1 rounded-lg hover:bg-white transition-colors cursor-pointer"
                            >
                              {notif.isRead ? (
                                <Circle className="w-3.5 h-3.5 text-[#37023c]/30 fill-[#37023c]/10" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full bg-[#E837AC] ring-4 ring-[#E837AC]/15" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Notification Title */}
                        <div className="pl-1 text-left">
                          <h3 className={`text-sm font-extrabold tracking-tight leading-snug transition-colors duration-200 text-left ${
                            notif.isRead ? "text-[#37023c]/50 group-hover:text-[#37023c]/75" : "text-[#37023c] group-hover:text-[#E837AC]"
                          }`}>
                            {notif.title}
                          </h3>
                        </div>

                        {/* AI Summarisation block */}
                        <div className="pl-1 bg-white border border-[#37023c]/5 rounded-xl p-3.5 flex items-start gap-2.5 text-xs leading-relaxed transition-all shadow-sm">
                          <Sparkles className="w-4 h-4 text-[#E837AC] flex-shrink-0 mt-0.5 animate-pulse" />
                          <div className="text-[#37023c]/80 font-sans text-left">
                            <span className="font-extrabold text-[#37023c]/60 font-mono text-[10px] uppercase tracking-wider mr-1.5">
                              AI Summary:
                            </span>
                            {notif.summary}
                          </div>
                        </div>

                        {/* Workflow Actions */}
                        <div className="flex items-center justify-between border-t border-[#37023c]/5 pt-3 pl-1">
                          <div className="text-[10px] font-mono text-[#37023c]/40 font-bold uppercase tracking-wider">
                            Workflow Actions
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => archiveNotification(notif.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#37023c]/60 hover:text-[#E837AC] hover:bg-white transition-all cursor-pointer border border-transparent hover:border-[#37023c]/10"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              <span>Archive</span>
                            </button>
                            <button
                              onClick={() => archiveNotification(notif.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#37023c]/5 hover:bg-[#E837AC] hover:text-white text-[#37023c] font-bold text-xs transition-all cursor-pointer border border-[#37023c]/10 hover:border-[#E837AC] shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Resolve</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
