"use client";

import { useState } from "react";
import Link from "next/link";

export default function RoadmapPage() {
  const [expandedPhase, setExpandedPhase] = useState(2);
  
  const roadmap = [
    {
      phase: 1, title: "Foundations", duration: "Week 1-2", status: "completed", progress: 100,
      description: "Build a strong foundation with programming basics and fundamentals",
      icon: <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
      items: [{ text: "Setup development environment", done: true }, { text: "Programming language basics (Python/Java/C++)", done: true }, { text: "Time & Space Complexity fundamentals", done: true }, { text: "Basic data structures overview", done: true }],
    },
    {
      phase: 2, title: "Core DSA", duration: "Week 3-6", status: "in-progress", progress: 65,
      description: "Master essential data structures and algorithms for interviews",
      icon: <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
      items: [{ text: "Arrays, Strings, Hash Maps", done: true }, { text: "Linked Lists, Stacks, Queues", done: true }, { text: "Trees & Binary Search Trees", done: false }, { text: "Graphs & Graph Algorithms", done: false }, { text: "Dynamic Programming", done: false }],
    },
    {
      phase: 3, title: "Advanced Topics", duration: "Week 7-8", status: "upcoming", progress: 0,
      description: "Dive deeper into complex patterns and system design concepts",
      icon: <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      items: [{ text: "Advanced DP patterns", done: false }, { text: "Tries & Segment Trees", done: false }, { text: "System Design basics", done: false }, { text: "Object Oriented Design", done: false }],
    },
    {
      phase: 4, title: "Interview Prep", duration: "Week 9-10", status: "upcoming", progress: 0,
      description: "Practice mock interviews and perfect your communication skills",
      icon: <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      items: [{ text: "Mock technical interviews", done: false }, { text: "HR & behavioral questions", done: false }, { text: "Company-specific preparation", done: false }, { text: "Resume & portfolio review", done: false }],
    },
  ];

  const statusConfig = {
    completed: { gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
    "in-progress": { gradient: "from-violet-500 to-purple-500", bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", glow: "shadow-violet-500/20" },
    upcoming: { gradient: "from-slate-500 to-slate-600", bg: "bg-white/[0.02]", border: "border-white/[0.06]", text: "text-slate-400", glow: "" },
  };

  const totalProgress = Math.round(roadmap.reduce((acc, p) => acc + p.progress, 0) / roadmap.length);

  return (
    <div className="container-app py-4 md:py-6 lg:py-8">
      <div className="rounded-xl md:rounded-2xl border border-white/6 bg-linear-to-br from-white/3 to-transparent backdrop-blur-sm overflow-hidden">
        <div className="p-4 md:p-6 lg:p-8 xl:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8 lg:mb-10">
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
                <div className="absolute -inset-1 md:-inset-1.5 bg-linear-to-r from-violet-500 to-purple-500 rounded-lg md:rounded-xl blur opacity-40" />
                <div className="relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg md:rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Your Learning Roadmap</h3>
                <p className="text-xs md:text-sm lg:text-base text-slate-400 font-medium">Personalized 10-week placement journey</p>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="flex items-center gap-3 md:gap-4 lg:gap-6 px-3 md:px-4 lg:px-6 py-2.5 md:py-3 lg:py-4 rounded-lg md:rounded-xl lg:rounded-2xl bg-linear-to-r from-violet-500/10 to-purple-500/5 border border-violet-500/20">
              <div className="text-right">
                <p className="text-[10px] md:text-xs lg:text-sm text-slate-400 font-medium mb-0.5">Overall Progress</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-purple-400">{totalProgress}%</p>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/6" />
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${totalProgress * 2.83} 283`} className="transition-all duration-1000 ease-out" />
                  <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Desktop timeline line */}
            <div className="absolute left-7 lg:left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-emerald-500/50 via-violet-500/50 to-slate-500/20 hidden md:block" />

            <div className="space-y-3 md:space-y-4 lg:space-y-5">
              {roadmap.map((phase) => {
                const config = statusConfig[phase.status];
                const isExpanded = expandedPhase === phase.phase;
                
                return (
                  <div key={phase.phase} className="relative">
                    {/* Timeline dot - desktop only */}
                    <div className={`absolute left-5 lg:left-6 top-6 md:top-7 w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-linear-to-r ${config.gradient} ring-4 ring-[#030712] hidden md:block ${config.glow} shadow-lg z-10`} />

                    <div className={`md:ml-14 lg:ml-16 rounded-xl md:rounded-2xl lg:rounded-3xl border ${config.border} ${config.bg} transition-all duration-300 hover:border-opacity-50 cursor-pointer overflow-hidden active:scale-[0.99]`} onClick={() => setExpandedPhase(isExpanded ? null : phase.phase)}>
                      <div className="p-3.5 md:p-5 lg:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 md:gap-4 min-w-0">
                            <div className={`w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-linear-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg ${config.glow} shrink-0`}>
                              {phase.status === "completed" ? <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> : phase.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                                <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${config.text}`}>Phase {phase.phase}</span>
                                {phase.status === "in-progress" && <span className="px-1.5 md:px-2 py-0.5 rounded-full bg-violet-500/20 text-[9px] md:text-[10px] font-bold text-violet-400 uppercase tracking-wider animate-pulse">Current</span>}
                              </div>
                              <h4 className="text-sm md:text-lg font-bold mt-0.5 truncate">{phase.title}</h4>
                              <p className="text-[10px] md:text-xs text-slate-500 font-medium">{phase.duration}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 md:gap-4 shrink-0">
                            {/* Progress bar - visible on sm+ */}
                            <div className="hidden sm:flex items-center gap-2 md:gap-3">
                              <div className="w-16 md:w-24 h-1.5 md:h-2 rounded-full bg-white/6 overflow-hidden">
                                <div className={`h-full bg-linear-to-r ${config.gradient} rounded-full transition-all duration-700`} style={{ width: `${phase.progress}%` }} />
                              </div>
                              <span className={`text-xs md:text-sm font-bold ${config.text} min-w-10 text-right`}>{phase.progress}%</span>
                            </div>
                            {/* Mobile progress indicator */}
                            <span className={`sm:hidden text-xs font-bold ${config.text}`}>{phase.progress}%</span>
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-md md:rounded-lg bg-white/3 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-3.5 pb-3.5 pt-0 md:px-5 md:pb-5">
                          <div className="border-t border-white/6 pt-3 md:pt-4">
                            {/* Mobile: Description */}
                            <p className="text-xs text-slate-400 mb-3 md:hidden">{phase.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                              {phase.items.map((item) => (
                                <div key={item.text} className={`flex items-center gap-2.5 md:gap-3 p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all ${item.done ? "bg-emerald-500/5 border border-emerald-500/10" : "bg-white/2 border border-white/4"}`}>
                                  <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-linear-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20" : "border-2 border-white/20"}`}>
                                    {item.done && <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                  </div>
                                  <span className={`text-xs md:text-sm ${item.done ? "text-slate-400" : "text-slate-300"}`}>{item.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-6 md:mt-8 text-center text-[10px] md:text-xs text-slate-500 font-medium">This roadmap adapts to your progress. Keep learning! 🚀</p>
        </div>
      </div>
    </div>
  );
}
