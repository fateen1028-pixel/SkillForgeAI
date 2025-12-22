"use client";


import { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function RoadmapPage() {
  // Simulated data for demo
  const [expandedPhase, setExpandedPhase] = useState(2);
  const currentTask = {
    slot: "Linked Lists – Foundations",
    task: "Implement Singly Linked List",
    reason: "Required before Trees",
    why: "Unlocked due to strong array performance",
    estimated: "25 min",
    readiness: "Intermediate",
    hiringBar: 42,
    weakAreas: ["Trees", "DP"],
  };
  const roadmapSlots = [
    { slot: 1, name: "Linear Structures", status: "completed", why: "Unlocked due to strong array performance" },
    { slot: 2, name: "Pointer-based Structures", status: "in-progress", why: "Current: mastering linked lists" },
    { slot: 3, name: "Non-linear Structures", status: "locked", why: "Locked because Linked List traversal accuracy < 70%" },
  ];
  const nextUp = [
    { slot: 3, name: "Non-linear Structures", why: "Next after mastering pointers" },
  ];
  const locked = [
    { slot: 4, name: "Advanced DSA", why: "Locked: Core DSA not complete" },
  ];



  return (
    <div className="container-app py-6 md:py-10 lg:py-14">
      <div className="rounded-xl md:rounded-2xl border border-white/6 bg-linear-to-br from-white/3 to-transparent backdrop-blur-sm overflow-hidden">
        <div className="p-4 md:p-6 lg:p-8 xl:p-10">
          {/* Roadmap Header */}
          <div className="mb-6 md:mb-8 lg:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-3 md:gap-5 lg:gap-7">
          <Link href="/dashboard" className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/3 border border-white/6 text-slate-400 hover:text-white hover:bg-white/6 hover:border-white/12 transition-all group" title="Back to Dashboard">
            <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Your Learning Roadmap</h3>
            <p className="text-xs md:text-sm lg:text-base text-slate-400 font-medium">Personalized 10-week placement journey</p>
          </div>
        </div>
        {/* Readiness Indicator */}
        <div className="flex items-center gap-3 md:gap-4 px-3 md:px-4 lg:px-6 py-2.5 md:py-3 lg:py-4 rounded-lg md:rounded-xl lg:rounded-2xl bg-linear-to-r from-violet-500/10 to-purple-500/5 border border-violet-500/20">
          <div className="text-right">
            <p className="text-[10px] md:text-xs lg:text-sm text-slate-400 font-medium mb-0.5">Overall Progress</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-purple-400">{currentTask.readiness}</p>
          </div>
        </div>
      </div>

      {/* Current Task Card */}
      <Card className="mb-8" gradient="violet" padding="lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12">
          <div className="flex-1">
            <div className="text-xs text-slate-400 font-bold mb-1 tracking-wider flex items-center gap-1">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l2 2" /></svg>
              CURRENT TASK
            </div>
            <div className="text-lg md:text-xl font-extrabold mb-1 text-white">Slot: {currentTask.slot}</div>
            <div className="text-base md:text-lg font-semibold mb-1 text-slate-200">Task: {currentTask.task}</div>
            <div className="text-xs text-slate-300 mb-1">Reason: <span className="font-medium text-white">{currentTask.reason}</span></div>
            <div className="text-xs text-slate-300 mb-2">Estimated Time: <span className="font-medium text-white">{currentTask.estimated}</span></div>
            <div className="text-xs text-slate-400 italic">Why: {currentTask.why}</div>
          </div>
          <div className="flex items-center justify-end">
            <Button size="lg" variant="primary">Resume Task</Button>
          </div>
        </div>
      </Card>

      {/* Roadmap Slots */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {roadmapSlots.map((slot) => (
          <Card key={slot.slot} className={`flex flex-col gap-2 border-2 shadow-lg ${slot.status === "completed" ? "border-emerald-500/40 bg-emerald-900/10" : slot.status === "in-progress" ? "border-violet-500/30 bg-violet-900/6" : "border-slate-600/40 bg-slate-900/10"}`} gradient={slot.status === "completed" ? "emerald" : slot.status === "in-progress" ? "violet" : undefined}>
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold ${slot.status === "completed" ? "bg-emerald-500/20 text-emerald-500" : slot.status === "in-progress" ? "bg-violet-500/20 text-violet-500" : "bg-slate-500/20 text-slate-400"}`}>
                {slot.status === "completed" ? "✓" : slot.status === "in-progress" ? "⏳" : "🔒"}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-white">Slot {slot.slot}: {slot.name}</span>
                <span className="text-xs text-slate-400 mt-0.5">{slot.status === "locked" ? "Locked (requires previous mastery)" : slot.status === "completed" ? "Completed" : "In Progress"}</span>
              </div>
            </div>
            <div className="text-xs text-slate-300 font-medium">{slot.why}</div>
          </Card>
        ))}
      </div>

      {/* Next Up Section */}
      <div className="mb-10">
        <div className="font-bold mb-4 text-xl flex items-center gap-2 text-slate-300">
          <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" /></svg>
          Next Up
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nextUp.slice(0,2).map((item) => (
            <Card key={item.slot} className="flex flex-col gap-2 border-2 border-violet-500/30 bg-violet-900/6 shadow-lg">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-500/10 text-violet-400 font-bold text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base text-white">Slot {item.slot}: {item.name}</span>
                  <span className="text-xs text-slate-300 mt-0.5">Why it’s next:</span>
                  <span className="text-xs text-violet-200 font-medium">{item.why}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Locked Section (Collapsed) */}
      <div className="mb-10">
        <div className="font-bold mb-4 text-xl flex items-center gap-2 text-slate-400">
          <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
          Locked
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locked.map((item) => (
            <Card key={item.slot} className="flex flex-col gap-2 border-2 border-slate-600/40 bg-slate-900/20 shadow-md opacity-60">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-500/20 text-slate-500 font-bold text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base text-slate-300">Slot {item.slot}: {item.name}</span>
                  <span className="text-xs text-slate-400 mt-0.5">{item.why}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SkillVector Snapshot */}
      <div className="mb-10">
        <div className="font-bold mb-4 text-xl flex items-center gap-2 text-emerald-400">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
          SkillVector Snapshot
        </div>
        <Card className="bg-emerald-900/10 border-2 border-emerald-500/30 shadow-lg">
          <div className="flex flex-col gap-2 md:flex-row md:gap-8">
            <span className="text-xs md:text-sm text-emerald-400 font-bold flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Strong: Arrays, Hash Maps</span>
            <span className="text-xs md:text-sm text-rose-400 font-bold flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6L6 18" /></svg>Weak: Trees, DP</span>
          </div>
        </Card>
      </div>

      <p className="mt-10 md:mt-14 text-center text-xs md:text-base text-violet-300 font-medium tracking-wide">This roadmap adapts to your progress. Keep learning! 🚀</p>
        </div>
      </div>
    </div>
  );
}
