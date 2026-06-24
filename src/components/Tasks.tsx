import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ListTodo, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { useDashboard } from "../lib/DashboardContext";

export default function Tasks() {
  const { tasks, toggleTask, addTask, deleteTask } = useDashboard();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask(newTaskTitle.trim(), newPriority);
    setNewTaskTitle("");
  };

  const getPriorityColor = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return "#E837AC"; // Pink
      case "Medium":
        return "#F78843"; // Orange
      case "Low":
        return "#F7D35F"; // Yellow
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div id="faria-tasks-container" className="bg-[#37023c]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-full text-white">
      {/* Decorative Brand Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F78843]/10 via-[#E837AC]/10 to-transparent rounded-full blur-xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
            <ListTodo className="w-5 h-5 text-[#E837AC]" />
          </div>
          <div className="text-left flex items-center gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight font-sans">Smart Tasks</h2>
              <p className="text-xs text-white/60">Manage your active focus stack</p>
            </div>

            {/* Localized 3D interactive indicator placeholder */}
            <div className={`w-8 h-8 relative flex items-center justify-center placeholder-spline-target ${
              activeCount > 3 ? "animate-pulse" : ""
            }`}>
              {/* Micro 3D glass-sphere representing active load indicator */}
              <div className={`absolute w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-[#F78843] via-[#E837AC] to-[#F7D35F] shadow-lg shadow-[#F78843]/40 ${
                activeCount > 3 ? "scale-110" : "scale-100"
              }`}>
                <div className="absolute inset-0.5 rounded-full bg-white/20 blur-[0.5px]" />
              </div>
              {/* Outer halo */}
              <div className={`absolute inset-0 rounded-full border border-[#F78843]/40 ${
                activeCount > 3 ? "animate-ping opacity-60" : "opacity-0"
              }`} />
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-extrabold text-[#E837AC] font-mono">
            {completedCount}/{tasks.length}
          </span>
          <p className="text-[10px] text-white/50 font-mono font-medium">Completed</p>
        </div>
      </div>

      {/* Progress tracker */}
      <div id="tasks-progress-wrapper" className="mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
        <div className="flex justify-between items-center text-xs mb-1.5 font-sans">
          <span className="text-white/70 font-semibold text-left">Today's Progress</span>
          <span className="text-[#E837AC] font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Task List container - flexible and overflowable */}
      <div id="tasks-scroll-area" className="flex-1 overflow-y-auto space-y-2.5 min-h-[220px] max-h-[300px] pr-1 scrollbar-thin mb-6">
        <AnimatePresence initial={false}>
          {tasks.length === 0 || tasks.every((t) => t.completed) ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-white/10 rounded-2xl bg-white/2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F78843]/5 via-[#E837AC]/5 to-[#F7D35F]/5 pointer-events-none" />
              
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#F78843]/10 via-[#E837AC]/10 to-[#F7D35F]/10 border border-white/10 text-[#E837AC] mb-3 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-[#E837AC]" />
              </div>
              
              <h3 className="text-sm font-black tracking-tight leading-none mb-1.5 font-sans text-transparent bg-clip-text bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F]">
                All Tasks Complete
              </h3>
              <p className="text-xs font-bold text-white/80 leading-normal max-w-[200px]">
                Take a well-deserved break.
              </p>
            </motion.div>
          ) : (
            tasks.map((task) => {
              const priorityColor = getPriorityColor(task.priority);
              return (
                <motion.div
                  key={task.id}
                  layoutId={`task-${task.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ease-in-out relative overflow-hidden ${
                    task.completed
                      ? "bg-white/5 border-transparent text-white/40 opacity-60"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                  }`}
                  style={{
                    borderLeftWidth: "4px",
                    borderLeftColor: priorityColor
                  }}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {/* Custom Styled Checkbox using CheckCircle2 and Circle */}
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="text-white/40 hover:text-[#E837AC] transition-all duration-300 ease-in-out focus:outline-none cursor-pointer flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#E837AC]" />
                      ) : (
                        <Circle className="w-5 h-5 text-white/30 hover:text-[#E837AC]" />
                      )}
                    </button>

                    <span
                      className={`text-sm font-semibold leading-snug truncate transition-all duration-300 ease-in-out text-left ${
                        task.completed ? "line-through text-white/40" : "text-white"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* Right badges & delete option */}
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {!task.completed && (
                      <span
                        className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-sans text-white transition-all duration-300 ease-in-out"
                        style={{ backgroundColor: priorityColor }}
                      >
                        {task.priority}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-[#E837AC] transition-all duration-300 ease-in-out focus:opacity-100 cursor-pointer"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Form - Simple text input at the bottom */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-auto pt-3 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-white/5 border border-white/10 focus:border-[#E837AC] rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E837AC]/20 transition-all font-sans text-left"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 p-2 rounded-lg bg-[#E837AC] hover:bg-[#E837AC]/90 text-white transition-colors duration-200 cursor-pointer shadow-sm shadow-[#E837AC]/20"
            title="Add Task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Priority selectors */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider font-sans text-left">Priority:</span>
          <div className="flex gap-1.5">
            {(["High", "Medium", "Low"] as const).map((p) => {
              const pColor = getPriorityColor(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPriority(p)}
                  className={`text-[10px] px-3 py-1 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    newPriority === p
                      ? "text-white border-transparent"
                      : "bg-transparent text-white/60 border-white/10 hover:text-white"
                  }`}
                  style={{
                    backgroundColor: newPriority === p ? pColor : undefined
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
