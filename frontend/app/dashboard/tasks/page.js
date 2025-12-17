"use client";

import { useState } from "react";
import Link from "next/link";

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Solve 2 medium-level array problems", completed: true, priority: "high", category: "DSA", xp: 30, dueTime: "10:00 AM" },
    { id: 2, text: "Review hash map concepts", completed: true, priority: "medium", category: "Theory", xp: 15, dueTime: "11:30 AM" },
    { id: 3, text: "Practice binary tree traversals", completed: false, priority: "high", category: "DSA", xp: 25, dueTime: "2:00 PM" },
    { id: 4, text: "Revise OS scheduling algorithms", completed: false, priority: "medium", category: "OS", xp: 20, dueTime: "4:00 PM" },
    { id: 5, text: "Complete mock HR interview", completed: false, priority: "low", category: "Interview", xp: 40, dueTime: "6:00 PM" },
  ]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedXP, setEarnedXP] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now(), text: input, completed: false, priority: "medium", category: "General", xp: 15, dueTime: "Later" }]);
    setInput("");
  };

  const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      setEarnedXP(task.xp);
      setShowConfetti(true);
      setTimeout(() => { setEarnedXP(null); setShowConfetti(false); }, 2000);
    }
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const removeTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const filteredTasks = filter === "all" ? tasks : filter === "active" ? tasks.filter(t => !t.completed) : tasks.filter(t => t.completed);

  const priorityConfig = {
    high: { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400", dot: "bg-rose-500" },
    medium: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-500" },
    low: { bg: "bg-slate-500/10", border: "border-slate-500/20", text: "text-slate-400", dot: "bg-slate-500" },
  };

  return (
    <div className="container-app py-4 md:py-6 lg:py-8">
      <div className="rounded-xl md:rounded-2xl border border-white/6 bg-linear-to-br from-white/3 to-transparent backdrop-blur-sm overflow-hidden">
        <div className="p-4 md:p-6 lg:p-8 relative">
          {/* XP Earned Notification */}
          {earnedXP && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
              <div className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 shadow-2xl shadow-emerald-500/30">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-2xl md:text-3xl">⭐</span>
                  <div>
                    <p className="text-white font-bold text-lg md:text-xl">+{earnedXP} XP</p>
                    <p className="text-emerald-100 text-xs md:text-sm">Task completed!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col gap-4 mb-5 md:mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/3 border border-white/6 text-slate-400 hover:text-white hover:bg-white/6 hover:border-white/12 transition-all group"
                  title="Back to Dashboard"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg md:rounded-xl blur opacity-40" />
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Today&apos;s Tasks</h3>
                  <p className="text-xs md:text-sm text-slate-400 font-medium">
                    {completedCount}/{tasks.length} completed • <span className="text-emerald-400">+{tasks.filter(t => t.completed).reduce((acc, t) => acc + t.xp, 0)} XP</span>
                  </p>
                </div>
              </div>
              
              {/* Progress bar - responsive width */}
              <div className="w-full sm:w-48 md:w-64 lg:w-72">
                <div className="flex items-center justify-between text-[10px] md:text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">Progress</span>
                  <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 md:h-2.5 rounded-full bg-white/6 overflow-hidden">
                  <div className="h-full bg-linear-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 ease-out relative" style={{ width: `${progress}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleAdd} className="flex gap-2 md:gap-3 mb-4 md:mb-6">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a new task..." className="flex-1 rounded-lg md:rounded-xl border border-white/8 bg-white/3 px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white/5" />
            <button type="submit" className="group relative px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm overflow-hidden transition-all active:scale-95">
              <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-600" />
              <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-1.5 md:gap-2 text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span className="hidden sm:inline">Add</span>
              </span>
            </button>
          </form>

          {/* Filter Tabs - Scrollable on mobile */}
          <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-1 scrollbar-hide">
            {[{ id: "all", label: "All", count: tasks.length }, { id: "active", label: "Active", count: tasks.filter(t => !t.completed).length }, { id: "completed", label: "Done", count: completedCount }].map((tab) => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} className={`shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all ${filter === tab.id ? "bg-linear-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 text-cyan-400" : "bg-white/2 border border-white/6 text-slate-400 hover:text-white hover:bg-white/4"}`}>
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-2 md:space-y-3">
            {filteredTasks.map((task) => (
              <div key={task.id} className={`group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 ${task.completed ? "border-white/4 bg-white/1 opacity-70" : "border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/12"}`}>
                {/* Checkbox and content row */}
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  <button onClick={() => toggleComplete(task.id)} className={`relative w-5 h-5 md:w-6 md:h-6 rounded-md md:rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 ${task.completed ? "bg-linear-to-r from-emerald-500 to-teal-500 border-transparent shadow-lg shadow-emerald-500/20" : "border-white/20 hover:border-cyan-500/50"}`}>
                    {task.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </button>

                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium block transition-all ${task.completed ? "line-through text-slate-500" : "text-white"}`}>{task.text}</span>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                      <span className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">{task.category}</span>
                      <span className="text-slate-700 hidden md:inline">•</span>
                      <span className="text-[10px] md:text-xs text-slate-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {task.dueTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 ml-8 sm:ml-0">
                  {/* XP Badge */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md md:rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                    <span className="text-[10px] md:text-xs font-bold text-amber-400">+{task.xp}</span>
                  </div>

                  {/* Priority Badge */}
                  <div className={`flex items-center gap-1 md:gap-1.5 px-2 py-1 rounded-md md:rounded-lg ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].border} border`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[task.priority].dot}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${priorityConfig[task.priority].text}`}>{task.priority}</span>
                  </div>

                  {/* Delete button */}
                  <button onClick={() => removeTask(task.id)} className="p-1.5 md:p-2 rounded-md md:rounded-lg text-slate-500 sm:opacity-0 sm:group-hover:opacity-100 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-12 md:py-16 lg:py-20">
                <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl lg:rounded-3xl bg-linear-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-slate-400 font-medium text-sm md:text-base">{filter === "completed" ? "No completed tasks yet" : filter === "active" ? "All tasks completed! 🎉" : "No tasks yet. Add one above!"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
