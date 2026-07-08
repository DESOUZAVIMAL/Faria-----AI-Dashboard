import React from "react";
import { motion } from "motion/react";
import { NotificationItem, Task, MatrixItem } from "../lib/DashboardContext";
import { 
  MessageSquare, 
  Monitor, 
  Mail, 
  Calendar as CalendarIcon, 
  Layers, 
  ListTodo, 
  Sparkles 
} from "lucide-react";

interface MatrixCardProps {
  key?: string | number;
  item: MatrixItem;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export default function MatrixCard({ item, onDragStart }: MatrixCardProps) {
  const isNotif = item.type === "notification";
  const id = isNotif ? item.data.id : item.data.id;
  const title = isNotif ? item.data.title : item.data.title;
  const source = isNotif ? item.data.source : "Task";
  const aiReasoning = isNotif ? item.data.aiReasoning : item.data.aiReasoning;
  const isCompleted = isNotif ? item.data.isRead : item.data.completed;

  const getSourceIcon = (srcName: string) => {
    switch (srcName.toLowerCase()) {
      case "slack":
        return <MessageSquare className="w-4 h-4 text-[#E837AC]" />;
      case "managebac+":
        return <Monitor className="w-4 h-4 text-[#F7D35F]" />;
      case "email":
        return <Mail className="w-4 h-4 text-[#F78B43]" />;
      case "calendar":
        return <CalendarIcon className="w-4 h-4 text-[#F7D35F]" />;
      default:
        return <ListTodo className="w-4 h-4 text-[#F78B43]" />;
    }
  };

  return (
    <motion.div
      layoutId={id}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      className={`group relative flex flex-col bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 hover:-translate-y-0.5 backdrop-blur-xl rounded-2xl transition-all duration-300 shadow-xl cursor-grab active:cursor-grabbing overflow-hidden ${
        isCompleted ? "opacity-50 grayscale bg-white/2" : ""
      }`}
    >
      {/* Visual top border indicator matching type */}
      <div className={`h-[3px] w-full ${isNotif ? "bg-gradient-to-r from-[#E837AC] to-[#F78B43]" : "bg-gradient-to-r from-[#F78B43] to-[#F7D35F]"}`} />
      
      {/* Card Content body */}
      <div className="p-4 flex flex-col gap-3 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Round Glass icon wrap */}
            <div className="p-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">
              {isNotif ? getSourceIcon(source) : <ListTodo className="w-4 h-4 text-[#F78B43]" />}
            </div>
            
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/50 block font-mono">
                {isNotif ? `${source} stream` : "Manual Task"}
              </span>
            </div>
          </div>

          {/* Type Badge */}
          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md font-mono ${
            isNotif 
              ? "bg-[#E837AC]/15 text-[#E837AC] border border-[#E837AC]/20" 
              : "bg-[#F78B43]/15 text-[#F78B43] border border-[#F78B43]/20"
          }`}>
            {isNotif ? "Inbox" : "Task"}
          </span>
        </div>

        {/* Title text */}
        <h5 className={`text-xs sm:text-sm font-bold leading-snug text-white group-hover:text-[#F7D35F] transition-colors text-left ${
          isCompleted ? "line-through text-white/40" : ""
        }`}>
          {title}
        </h5>
      </div>

      {/* Distinct Footer Area with reasoning */}
      <div className="mt-auto px-4 py-2.5 bg-black/30 border-t border-white/5 flex items-start gap-2.5">
        <Sparkles className="w-3.5 h-3.5 text-[#F7D35F] mt-0.5 flex-shrink-0 animate-pulse" />
        <p className="text-[11px] text-left text-white/60 leading-relaxed font-sans font-medium">
          {aiReasoning}
        </p>
      </div>
    </motion.div>
  );
}
