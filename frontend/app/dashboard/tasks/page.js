"use client";

import { useEffect, useState } from "react";
import { roadmapService } from "@/services/roadmap.service";
import TaskCard from "@/components/tasks/TaskCard";
import { Sparkles } from "lucide-react";

export default function TasksPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const data = await roadmapService.getRoadmap();
        setRoadmap(data);
      } catch (error) {
        console.error("Failed to load roadmap tasks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-violet-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-violet-900/20 via-[#030712] to-[#030712]">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full"></div>
            <div className="relative w-full h-full rounded-2xl bg-linear-to-tr from-violet-500/10 to-transparent border border-white/5 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-violet-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2 bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              No Roadmap Found
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              We couldn&apos;t find an active roadmap for you. Please contact support or start a new journey.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-violet-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-150 h-150 bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Your Journey
              </span>
            </h1>
            <p className="text-slate-400 max-w-lg text-lg">
              Track your progress and master new skills one step at a time.
            </p>
          </div>
          
          <div className="flex gap-3">
             <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col gap-1 min-w-35">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Phases</span>
                <span className="text-2xl font-bold font-mono">{roadmap.phases.length}</span>
             </div>
          </div>
        </div>

        {/* Phases Grid */}
        <div className="space-y-12">
          {roadmap.phases.map((phase, index) => (
            <div 
              key={phase.phase_id} 
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold font-mono">
                  {index + 1}
                </div>
                <div>
                   <h2 className="text-2xl font-semibold flex items-center gap-3">
                    {phase.name}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${
                        phase.phase_status === 'active' 
                        ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' 
                        : 'bg-slate-800/50 text-slate-400 border-slate-700'
                    }`}>
                        {phase.phase_status}
                    </span>
                   </h2>
                   {phase.locked_reason && (
                    <p className="text-sm text-rose-400 mt-1 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                         {phase.locked_reason}
                    </p>
                   )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {phase.slots.map((slot) => (
                    <TaskCard key={slot.slot_id} slot={slot} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
