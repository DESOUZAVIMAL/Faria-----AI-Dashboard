import React, { useState } from "react";
import { useDashboard, AICategory, NotificationItem, Task } from "../lib/DashboardContext";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Clock,
  UserCheck,
  Trash2,
  Sparkles,
  MessageSquare,
  Monitor,
  Mail,
  Calendar as CalendarIcon,
  Layers,
  ListTodo,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Zap,
  RotateCcw
} from "lucide-react";

interface QuadrantConfig {
  id: string;
  title: string;
  subtitle: string;
  isUrgent: boolean;
  isImportant: boolean;
  borderColor: string;
  accentBg: string;
  textColor: string;
  pillColor: string;
  glowColor: string;
  icon: React.ReactNode;
}

export default function MatrixView() {
  const { notifications, tasks, updateItemMatrix, markAsRead, toggleTask, archiveNotification, deleteTask } = useDashboard();
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  // Combine notifications and tasks into a unified matrix item representation
  type MatrixItem = 
    | { type: "notification"; data: NotificationItem }
    | { type: "task"; data: Task };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "slack":
        return <MessageSquare className="w-3.5 h-3.5 text-[#E837AC]" />;
      case "managebac+":
        return <Monitor className="w-3.5 h-3.5 text-[#37023c]" />;
      case "email":
        return <Mail className="w-3.5 h-3.5 text-[#F78B43]" />;
      case "calendar":
        return <CalendarIcon className="w-3.5 h-3.5 text-[#F7D35F]" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-[#37023c]/60" />;
    }
  };

  const quadrants: QuadrantConfig[] = [
    {
      id: "q1",
      title: "DO FIRST",
      subtitle: "Urgent & Important",
      isUrgent: true,
      isImportant: true,
      borderColor: "border-[#E837AC]/40 hover:border-[#E837AC]/70",
      accentBg: "bg-[#E837AC]/5",
      textColor: "text-[#E837AC]",
      pillColor: "bg-[#E837AC] text-white",
      glowColor: "shadow-[0_4px_20px_-4px_rgba(232,55,172,0.15)]",
      icon: <Zap className="w-4 h-4 text-[#E837AC] animate-pulse" />
    },
    {
      id: "q2",
      title: "SCHEDULE / PLAN",
      subtitle: "Important, Not Urgent",
      isUrgent: false,
      isImportant: true,
      borderColor: "border-[#F78B43]/40 hover:border-[#F78B43]/70",
      accentBg: "bg-[#F78B43]/5",
      textColor: "text-[#F78B43]",
      pillColor: "bg-[#F78B43] text-white",
      glowColor: "shadow-[0_4px_20px_-4px_rgba(247,136,67,0.15)]",
      icon: <Clock className="w-4 h-4 text-[#F78B43]" />
    },
    {
      id: "q3",
      title: "DELEGATE / RE-ROUTE",
      subtitle: "Urgent, Not Important",
      isUrgent: true,
      isImportant: false,
      borderColor: "border-[#F7D35F]/50 hover:border-[#F7D35F]/80",
      accentBg: "bg-[#F7D35F]/5",
      textColor: "text-[#F7D35F] dark:text-[#F78B43]",
      pillColor: "bg-[#F7D35F] text-[#37023c]",
      glowColor: "shadow-[0_4px_20px_-4px_rgba(247,211,95,0.15)]",
      icon: <UserCheck className="w-4 h-4 text-[#F7D35F]" />
    },
    {
      id: "q4",
      title: "ELIMINATE / ARCHIVE",
      subtitle: "Not Urgent & Not Important",
      isUrgent: false,
      isImportant: false,
      borderColor: "border-[#552859]/30 hover:border-[#552859]/55",
      accentBg: "bg-[#552859]/5",
      textColor: "text-[#552859]",
      pillColor: "bg-[#552859] text-white",
      glowColor: "shadow-none",
      icon: <Trash2 className="w-4 h-4 text-[#552859]" />
    }
  ];

  // Helper to filter items into a specific quadrant
  const getItemsForQuadrant = (isUrgent: boolean, isImportant: boolean): MatrixItem[] => {
    const matchingNotifs = notifications
      .filter((n) => n.isUrgent === isUrgent && n.isImportant === isImportant)
      .map((n) => ({ type: "notification" as const, data: n }));

    const matchingTasks = tasks
      .filter((t) => t.isUrgent === isUrgent && t.isImportant === isImportant)
      .map((t) => ({ type: "task" as const, data: t }));

    return [...matchingNotifs, ...matchingTasks];
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, quadrantId: string) => {
    e.preventDefault();
    setDraggedOver(quadrantId);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, isUrgent: boolean, isImportant: boolean) => {
    e.preventDefault();
    setDraggedOver(null);
    const itemId = e.dataTransfer.getData("text/plain");
    if (itemId) {
      updateItemMatrix(itemId, isUrgent, isImportant);
    }
  };

  return (
    <div id="eisenhower-matrix-root" className="space-y-6">
      {/* Informative Subheader */}
      <div className="bg-[#37023c]/5 border border-[#37023c]/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-3 text-left">
          <div className="p-2 rounded-xl bg-white text-[#E837AC] border border-[#37023c]/10 flex-shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse text-[#E837AC]" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#37023c] font-sans">Ecosystem Prioritisation</h3>
            <p className="text-xs text-[#37023c]/70 mt-0.5 leading-relaxed font-sans font-medium">
              Drag any message, notification, or smart task card between quadrants to dynamically reprogram your priorities.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#E837AC] bg-[#E837AC]/5 border border-[#E837AC]/10 px-2.5 py-1 rounded-full font-mono uppercase tracking-wider">
          <Zap className="w-3 h-3 animate-bounce" />
          <span>Live Workspace Sync</span>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {quadrants.map((quad) => {
          const items = getItemsForQuadrant(quad.isUrgent, quad.isImportant);
          const isOver = draggedOver === quad.id;

          return (
            <div
              key={quad.id}
              onDragOver={(e) => handleDragOver(e, quad.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, quad.isUrgent, quad.isImportant)}
              className={`rounded-2xl border-2 p-5 flex flex-col min-h-[290px] transition-all duration-300 relative ${
                isOver 
                  ? "bg-[#F0EBEB] border-[#E837AC] scale-[1.01] shadow-lg" 
                  : `bg-white ${quad.borderColor} ${quad.glowColor}`
              }`}
            >
              {/* Quadrant Header */}
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#37023c]/5">
                <div className="flex items-center gap-2.5 text-left">
                  <div className={`p-1.5 rounded-lg ${quad.accentBg}`}>
                    {quad.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-wider text-[#37023c] font-sans uppercase">
                      {quad.title}
                    </h4>
                    <p className="text-[10px] text-[#37023c]/60 font-semibold">
                      {quad.subtitle}
                    </p>
                  </div>
                </div>

                {/* Capacity count badge */}
                <span className={`text-[10px] font-black font-mono px-2.5 py-1 rounded-full ${quad.pillColor}`}>
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Items feed within Quadrant */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[280px] pr-1 scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center py-10 border border-dashed border-[#37023c]/10 rounded-xl bg-[#F0EBEB]/10"
                    >
                      <HelpCircle className="w-5 h-5 text-[#37023c]/35 mb-1.5" />
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#37023c]/40 font-mono">
                        Empty Quadrant
                      </p>
                    </motion.div>
                  ) : (
                    items.map((item) => {
                      const isNotif = item.type === "notification";
                      const id = isNotif ? item.data.id : item.data.id;
                      const title = isNotif ? item.data.title : item.data.title;
                      const isReadOrDone = isNotif ? item.data.isRead : item.data.completed;

                      return (
                        <motion.div
                          key={id}
                          layoutId={`matrix-${id}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, id)}
                          className={`group p-3 rounded-xl border border-[#37023c]/5 bg-[#F0EBEB]/20 hover:bg-white hover:shadow-md transition-all duration-300 ease-in-out cursor-grab active:cursor-grabbing relative overflow-hidden flex items-start justify-between gap-2 ${
                            isReadOrDone ? "opacity-50 grayscale bg-[#F0EBEB]/10" : ""
                          }`}
                        >
                          {/* Momentum accent border */}
                          <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${
                            isNotif ? "bg-[#E837AC]" : "bg-[#F78B43]"
                          }`} />

                          {/* Left Column: Icon + Text */}
                          <div className="flex items-start gap-2.5 min-w-0 pl-1">
                            <div className="mt-0.5 p-1 rounded-md bg-white border border-[#37023c]/5 flex-shrink-0">
                              {isNotif ? (
                                getSourceIcon(item.data.source)
                              ) : (
                                <ListTodo className="w-3.5 h-3.5 text-[#F78B43]" />
                              )}
                            </div>
                            <div className="text-left min-w-0">
                              <h5 className={`text-xs font-bold leading-tight truncate text-[#37023c] ${
                                isReadOrDone ? "line-through text-[#37023c]/50" : ""
                              }`}>
                                {title}
                              </h5>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[9px] font-bold font-mono uppercase text-[#37023c]/40 tracking-wider">
                                  {isNotif ? "Inbox" : "Task"}
                                </span>
                                {isNotif && (
                                  <>
                                    <span className="text-[#37023c]/20 text-[9px] font-bold">•</span>
                                    <span className="text-[9px] font-bold text-[#37023c]/55 font-mono">
                                      {item.data.source}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Interaction Action Trigger */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isNotif ? (
                              <button
                                onClick={() => markAsRead(id)}
                                title={isReadOrDone ? "Mark Unread" : "Mark Read"}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[#37023c]/5 text-[#37023c]/50 hover:text-[#E837AC] transition-all duration-300 cursor-pointer"
                              >
                                {isReadOrDone ? (
                                  <RotateCcw className="w-3.5 h-3.5" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleTask(id)}
                                title={isReadOrDone ? "Mark Active" : "Mark Completed"}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[#37023c]/5 text-[#37023c]/50 hover:text-[#E837AC] transition-all duration-300 cursor-pointer"
                              >
                                {isReadOrDone ? (
                                  <RotateCcw className="w-3.5 h-3.5" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
