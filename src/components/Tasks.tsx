import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ListTodo, CheckCircle2, Circle, Plus, Trash2, TrendingUp } from "lucide-react";
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
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div id="faria-tasks-container" className="bg-white border border-[#37023c]/10 rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col h-full">
      {/* Decorative Brand Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F78843]/5 via-[#E837AC]/5 to-transparent rounded-full blur-xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#37023c]/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#37023c]/5 text-[#37023c] border border-[#37023c]/10">
            <ListTodo className="w-5 h-5 text-[#E837AC]" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-extrabold text-[#37023c] tracking-tight font-sans">Smart Tasks</h2>
            <p className="text-xs text-[#37023c]/60">Manage your active focus stack</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-extrabold text-[#E837AC] font-mono">
            {completedCount}/{tasks.length}
          </span>
          <p className="text-[10px] text-[#37023c]/50 font-mono font-medium">Completed</p>
        </div>
      </div>

      {/* Progress tracker */}
      <div id="tasks-progress-wrapper" className="mb-6 bg-[#F0EBEB]/50 p-4 rounded-xl border border-[#37023c]/5">
        <div className="flex justify-between items-center text-xs mb-1.5 font-sans">
          <span className="text-[#37023c]/70 font-semibold text-left">Today's Progress</span>
          <span className="text-[#E837AC] font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#F0EBEB] rounded-full overflow-hidden">
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
              className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-[#37023c]/20 rounded-2xl bg-gradient-to-b from-[#F0EBEB]/10 to-[#F0EBEB]/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F78843]/5 via-[#E837AC]/5 to-[#F7D35F]/5 pointer-events-none" />
              
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#F78843]/10 via-[#E837AC]/10 to-[#F7D35F]/10 border border-[#E837AC]/20 text-[#E837AC] mb-3 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-[#E837AC]" />
              </div>
              
              <h3 className="text-sm font-black tracking-tight leading-none mb-1.5 font-sans text-transparent bg-clip-text bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F]">
                All Tasks Complete
              </h3>
              <p className="text-xs font-bold text-[#37023c]/85 leading-normal max-w-[200px]">
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
                      ? "bg-[#F0EBEB]/20 border-transparent text-[#37023c]/40 opacity-60"
                      : "bg-[#F0EBEB]/40 hover:bg-[#F0EBEB]/60 border-[#37023c]/5 text-[#37023c]"
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
                      className="text-[#37023c]/40 hover:text-[#E837AC] transition-all duration-300 ease-in-out focus:outline-none cursor-pointer flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#E837AC]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#37023c]/30 hover:text-[#E837AC]" />
                      )}
                    </button>

                    <span
                      className={`text-sm font-semibold leading-snug truncate transition-all duration-300 ease-in-out text-left ${
                        task.completed ? "line-through text-[#37023c]/40" : "text-[#37023c]"
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
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-[#37023c]/5 text-[#37023c]/40 hover:text-[#E837AC] transition-all duration-300 ease-in-out focus:opacity-100 cursor-pointer"
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-auto pt-3 border-t border-[#37023c]/5">
        <div className="relative">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-[#F0EBEB]/40 border border-[#37023c]/10 focus:border-[#E837AC] rounded-xl px-4 py-3 pr-12 text-sm text-[#37023c] placeholder-[#37023c]/45 focus:outline-none focus:ring-2 focus:ring-[#E837AC]/20 transition-all font-sans"
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
          <span className="text-[10px] text-[#37023c]/50 font-bold uppercase tracking-wider font-sans text-left">Priority:</span>
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
                      : "bg-transparent text-[#37023c]/60 border-[#37023c]/10 hover:text-[#37023c]"
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
