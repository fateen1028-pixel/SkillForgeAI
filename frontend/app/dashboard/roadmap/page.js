"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RoadmapTab from "@/components/RoadmapTab";
import ErrorState from "@/components/common/ErrorState";
import { roadmapService } from "@/services/roadmap.service";
import { useAuth } from "@/hooks/useAuth";

export default function RoadmapPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const [roadmapState, setRoadmapState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth check to complete
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    async function fetchRoadmap() {
      try {
        setLoading(true);
        setError(null);
        const data = await roadmapService.getRoadmap();
        
        let isAnySlotInProgress = false;

        // Transform backend data to match UI component structure
        const transformedState = {
          goal: data.goal,
          confidenceThreshold: data.confidence_threshold,
          phases: data.phases?.map(phase => ({
            id: phase.phase_id,
            title: phase.name,
            status: phase.phase_status?.toUpperCase() || "LOCKED",
            slots: phase.slots?.map(slot => {
              const status = slot.status?.toLowerCase() || "locked";
              if (status === "in_progress") isAnySlotInProgress = true;
              
              return {
                id: slot.slot_id,
                title: slot.skill ? slot.skill.replace(/_/g, ' ') : slot.slot_id,
                status: status.toUpperCase(),
                type: slot.active_task_instance_id ? "in_progress" : "practice",
                difficulty: slot.difficulty,
                remediation_attempts: slot.remediation_attempts || 0,
                // Add raw slot object if needed by RoadmapNode
                raw: slot 
              };
            }),
            lockedReason: phase.locked_reason
          })) || []
        };
        
        setRoadmapState({ ...transformedState, isAnySlotInProgress });
      } catch (error) {
        console.error("Failed to load roadmap:", error);
        if (error.response?.status === 401) {
            router.push("/auth/login");
        } else if (error.response?.status === 500) {
            const detail = error.response.data?.detail || error.response.data;
            const msg = typeof detail === 'string' && detail.includes("templates") 
              ? `Curriculum Mismatch: ${detail}`
              : "Backend Configuration Error: No roadmap available.";
            setError(msg);
        } else {
            setError("Failed to load your roadmap. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmap();
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
     return (
        <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6">
           <ErrorState 
              title="Roadmap Load Error"
              description={error}
              onRetry={() => window.location.reload()}
           />
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-emerald-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-emerald-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-150 h-150 bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Skill Roadmap
              </span>
            </h1>
            <p className="text-slate-400 max-w-lg text-lg">
              A structured path to master {roadmapState?.goal || 'your skills'} with precision.
            </p>
          </div>
          
          <div className="flex gap-4">
             {typeof roadmapState?.confidenceThreshold === 'number' && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col gap-1 min-w-35">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Threshold</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {Math.round(roadmapState.confidenceThreshold * 100)}%
                  </span>
                </div>
             )}
             <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col gap-1 min-w-35">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Phases</span>
                <span className="text-2xl font-bold font-mono">{roadmapState?.phases?.length || 0}</span>
             </div>
          </div>
        </div>

        <RoadmapTab roadmapState={roadmapState} />
      </div>
    </div>
  );
}
