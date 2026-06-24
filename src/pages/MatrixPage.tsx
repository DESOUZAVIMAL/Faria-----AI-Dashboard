import React, { useState } from "react";
import { useDashboard, NotificationItem, Task, MatrixItem } from "../lib/DashboardContext";
import { motion, AnimatePresence } from "motion/react";
import MatrixCard from "../components/MatrixCard";
import { 
  Zap, 
  Clock, 
  UserCheck, 
  Trash2, 
  HelpCircle, 
  Sparkles, 
  AlertTriangle,
  Compass,
  ArrowRight
} from "lucide-react";

interface QuadrantConfig {
  id: string;
  title: string;
  subtitle: string;
  isUrgent: boolean;
  isImportant: boolean;
  borderColor: string;
  accentBg: string;
  glowClass: string;
  themeColor: string;
  gradientFrom: string;
  icon: React.ReactNode;
}

export default function MatrixPage() {
  const { notifications, tasks, updateItemMatrix } = useDashboard();
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  const quadrants: QuadrantConfig[] = [
    {
      id: "q1",
      title: "Quadrant I: DO FIRST",
      subtitle: "Urgent & Important (Immediate Action)",
      isUrgent: true,
      isImportant: true,
      borderColor: "border-[#E837AC]/30 focus-within:border-[#E837AC] hover:border-[#E837AC]/50",
      accentBg: "bg-[#E837AC]/10",
      glowClass: "shadow-[inset_0_0_24px_rgba(232,55,172,0.15)]",
      themeColor: "#E837AC",
      gradientFrom: "from-[#E837AC]",
      icon: <Zap className="w-5 h-5 text-[#E837AC]" />
    },
    {
      id: "q2",
      title: "Quadrant II: PLAN & SCHEDULE",
      subtitle: "Important, Not Urgent (Build Momentum)",
      isUrgent: false,
      isImportant: true,
      borderColor: "border-[#F78843]/30 focus-within:border-[#F78843] hover:border-[#F78843]/50",
      accentBg: "bg-[#F78843]/10",
      glowClass: "shadow-[inset_0_0_24px_rgba(247,136,67,0.15)]",
      themeColor: "#F78843",
      gradientFrom: "from-[#F78843]",
      icon: <Clock className="w-5 h-5 text-[#F78843]" />
    },
    {
      id: "q3",
      title: "Quadrant III: DELEGATE / RE-ROUTE",
      subtitle: "Urgent, Not Important (Streamline Delivery)",
      isUrgent: true,
      isImportant: false,
      borderColor: "border-[#F7D35F]/30 focus-within:border-[#F7D35F] hover:border-[#F7D35F]/50",
      accentBg: "bg-[#F7D35F]/10",
      glowClass: "shadow-[inset_0_0_24px_rgba(247,211,95,0.15)]",
      themeColor: "#F7D35F",
      gradientFrom: "from-[#F7D35F]",
      icon: <UserCheck className="w-5 h-5 text-[#F7D35F]" />
    },
    {
      id: "q4",
      title: "Quadrant IV: ELIMINATE / ARCHIVE",
      subtitle: "Not Urgent & Not Important (Declutter Space)",
      isUrgent: false,
      isImportant: false,
      borderColor: "border-[#552859]/40 focus-within:border-[#552859] hover:border-[#552859]/60",
      accentBg: "bg-[#552859]/15",
      glowClass: "shadow-[inset_0_0_24px_rgba(85,40,89,0.15)]",
      themeColor: "#552859",
      gradientFrom: "from-[#552859]",
      icon: <Trash2 className="w-5 h-5 text-[#552859]" />
    }
  ];

  const getItemsForQuadrant = (isUrgent: boolean, isImportant: boolean): MatrixItem[] => {
    const matchingNotifs = notifications
      .filter((n) => n.isUrgent === isUrgent && n.isImportant === isImportant)
      .map((n) => ({ type: "notification" as const, data: n }));

    const matchingTasks = tasks
      .filter((t) => t.isUrgent === isUrgent && t.isImportant === isImportant)
      .map((t) => ({ type: "task" as const, data: t }));

    return [...matchingNotifs, ...matchingTasks];
  };

  // Drag & drop standard handlers
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 min-h-[calc(100vh-140px)] text-white">
      {/* Title & Concept Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#F7D35F] mb-3">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Interactive Governance Framework</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
            Faria Compliance Matrix
          </h1>
          <p className="text-sm text-white/60 mt-1 max-w-2xl leading-relaxed font-sans font-medium">
            A dynamic, high-fidelity model based on the Eisenhower Matrix. Balance your operations, prioritize critical student SSO streams, and streamline academic audits.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">Cognitive Capacity</p>
            <p className="text-xs font-black text-[#F7D35F]">Active Load Monitoring Enabled</p>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#E837AC]/10 border border-[#E837AC]/20 text-[#E837AC] shadow-lg">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Eisenhower Matrix 4-Quadrant Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-[600px]">
        {quadrants.map((quad) => {
          const items = getItemsForQuadrant(quad.isUrgent, quad.isImportant);
          const isOver = draggedOver === quad.id;
          
          // Capacity limit properties (exceeding 5 is overload)
          const isOverloaded = items.length > 5;
          const capacityPercentage = Math.min((items.length / 5) * 100, 100);

          return (
            <div
              key={quad.id}
              onDragOver={(e) => handleDragOver(e, quad.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, quad.isUrgent, quad.isImportant)}
              className={`rounded-3xl border border-white/10 p-6 flex flex-col min-h-[380px] transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
                isOver 
                  ? "bg-white/10 border-[#E837AC] scale-[1.005] shadow-[0_0_32px_rgba(232,55,172,0.1)]" 
                  : `bg-white/5 ${quad.borderColor} ${quad.glowClass}`
              }`}
            >
              {/* Load Capacity Progress Header Block */}
              <div className="flex flex-col gap-3.5 mb-5 border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white/10 border border-white/10`}>
                      {quad.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black uppercase tracking-wider text-white">
                        {quad.title}
                      </h3>
                      <p className="text-[11px] text-white/50 font-sans font-medium">
                        {quad.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Absolute item pill indicator */}
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-black font-mono px-3 py-1 rounded-full ${
                      isOverloaded 
                        ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                        : "bg-white/10 text-[#F7D35F] border border-white/5"
                    }`}>
                      {items.length} / 5 Cap
                    </span>
                  </div>
                </div>

                {/* Intelligent load capacity indicator bar */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-[10px] font-bold text-white/40">
                    <span>Quadrant Load Factor</span>
                    <span className={isOverloaded ? "text-red-400 font-black animate-pulse" : "text-white/60"}>
                      {isOverloaded ? "OVERLOADED" : `${Math.round(capacityPercentage)}%`}
                    </span>
                  </div>
                  
                  {/* Progress track */}
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${capacityPercentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isOverloaded
                          ? "bg-gradient-to-r from-red-600 to-red-400 animate-pulse"
                          : `bg-gradient-to-r ${quad.gradientFrom} to-[#F7D35F]`
                      }`}
                    />
                  </div>

                  {/* Overload alert disclaimer */}
                  {isOverloaded && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 animate-bounce mt-1">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      <span>Capacity warning: Exceeds maximum 5-item operational safety recommendation.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quadrant scrollable area */}
              <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[380px] pr-1.5 scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      className="h-full min-h-[160px] flex flex-col items-center justify-center text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/1"
                    >
                      <HelpCircle className="w-6 h-6 text-white/30 mb-2.5" />
                      <p className="text-xs font-extrabold uppercase tracking-widest text-white/30 font-mono">
                        No Items Active
                      </p>
                      <p className="text-[11px] text-white/40 max-w-[240px] leading-relaxed mt-1">
                        Drag & drop outstanding streams or compliance alerts into this quadrant to organize.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {items.map((item) => (
                        <MatrixCard
                          key={item.type === "notification" ? item.data.id : item.data.id}
                          item={item}
                          onDragStart={handleDragStart}
                        />
                      ))}
                    </div>
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
