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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
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
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="container-app py-6 md:py-10 max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Roadmap</h1>
              {roadmapState?.goal && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 text-xs font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full">
                    Goal: {roadmapState.goal}
                  </span>
                </div>
              )}
            </div>
          </div>

          {typeof roadmapState?.confidenceThreshold === 'number' && (
             <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl min-w-70 backdrop-blur-sm self-start">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Confidence</span>
                <span className="text-lg font-bold text-white">
                  {Math.round(roadmapState.confidenceThreshold * 100)}<span className="text-sm text-slate-500">%</span>
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-linear-to-r from-violet-600 via-fuchsia-500 to-indigo-400 shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(roadmapState.confidenceThreshold * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <RoadmapTab roadmapState={roadmapState} />
        </div>
      </div>
    </div>
  );
}
