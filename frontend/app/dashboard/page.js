"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import SlotStateEnforcement from "@/components/common/SlotStateEnforcement";
import { roadmapService } from "@/services/roadmap.service";
import { taskService } from "@/services/task.service";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, refreshUser } = useAuth();
  const [roadmapData, setRoadmapData] = useState(null);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';
      fetch(`${APP_URL}/api/general_profile`, { credentials: "include" })
        .then(res => res.json())
        .then(data => setUserProfile(data))
        .catch(err => console.error("Error fetching profile:", err));
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user && !user.is_setup_completed) {
        router.push("/setup");
      } else if (user && user.is_setup_completed) {
        // Authenticated and setup completed, fetch roadmap
        roadmapService.getRoadmap()
          .then(data => {
            setRoadmapData(data);
            setIsRoadmapLoading(false);
          })
          .catch(async (err) => {
            console.error("Failed to fetch roadmap:", err);
            if (err.response && err.response.status === 401) {
              // Token might be expired, try to refresh user session
              if (refreshUser) {
                await refreshUser();
              }
            }
            setIsRoadmapLoading(false);
          });
      }
    }
  }, [user, isAuthenticated, loading, router, refreshUser]);

  // Helper to extract the active slot based on business rules
  const getActiveSlot = () => {
    if (!roadmapData || !roadmapData.phases) return null;

    // 1. Find active phase (assuming there's a status field, or we pick the first one if all else fails)
    // The requirement says "read only the active phase"
    const activePhase = roadmapData.phases.find(p => p.status === 'active' || p.status === 'in_progress') || roadmapData.phases[0];

    if (!activePhase || !activePhase.slots) return null;

    // 2. Find first slot whose status is relevant for action
    const targetSlot = activePhase.slots.find(slot => 
      ['available', 'in_progress', 'remediation_required'].includes(slot.status)
    );

    if (!targetSlot) return null;

    // 3. Render slot's truth
    return {
      ...targetSlot,
      active_task_instance_id: targetSlot.active_task_instance_id
    };
  };

  const activeSlotData = getActiveSlot();

  const redirectBasedOnTaskType = async (instanceId, slotId, hint) => {
    if (!instanceId) return;
    try {
      const taskDetails = await taskService.getTaskExecutionDetails(instanceId);
      const type = taskDetails.question_type?.toLowerCase();
      
      let targetUrl = `/dashboard/task/${instanceId}`;
      if (type === 'mcq') {
        targetUrl = `/dashboard/task/${instanceId}/mcq`;
      } else if (type === 'explanation') {
        targetUrl = `/dashboard/task/${instanceId}/explanation`;
      }

      const params = new URLSearchParams();
      if (slotId) params.set('slotId', slotId);
      if (hint) params.set('hint', hint);
      
      if (params.toString()) {
        targetUrl += `?${params.toString()}`;
      }

      router.push(targetUrl);
    } catch (error) {
      console.error("Failed to determine task type:", error);
      // Fallback
      let finalUrl = `/dashboard/task/${instanceId}`;
      if (slotId) finalUrl += `?slotId=${slotId}`;
      router.push(finalUrl);
    }
  };

  const handleStartSlot = async (slotId) => {
    try {
      setIsRoadmapLoading(true);
      const result = await roadmapService.startSlot(slotId);
      
      const instanceId = result.task_instance_id || result.instance_id;
      if (instanceId) {
        await redirectBasedOnTaskType(instanceId, slotId, result.hint);
      }
    } catch (err) {
      console.error("Failed to start slot:", err);
      
      // Recovery for already in-progress slot
      if (err.response?.status === 409) {
        const data = err.response.data || {};
        const instanceId = data.instance_id || data.task_instance_id || data.active_task_instance_id;
        if (instanceId) {
          await redirectBasedOnTaskType(instanceId, slotId, data.hint);
          return;
        }
      }

      const errorMessage = err.response?.data?.detail || err.message;
      alert(`Failed to start task: ${errorMessage}`);
      setIsRoadmapLoading(false);
    } 
  };

  const handleContinueSlot = async (instanceId) => {
    if (!instanceId) return;
    setIsRoadmapLoading(true);
    // Use the slot_id from the activeSlotData context
    const slotId = activeSlotData?.slot_id;
    await redirectBasedOnTaskType(instanceId, slotId, activeSlotData?.hint); // activeSlotData might not have hint
    setIsRoadmapLoading(false);
  };


  // Show loading while checking auth or fetching roadmap
  if (loading || !isAuthenticated || (user && !user.is_setup_completed) || isRoadmapLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
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

      <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-10 space-y-12 transition-all duration-500">
        {/* Header Section */}
        <div className="flex flex-col gap-2 border-b border-white/5 pb-8">
          <p className="text-emerald-400 font-mono text-xs uppercase tracking-[0.3em] font-bold">Commander Center</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Welcome, {userProfile?.name || userProfile?.username || user?.username || user?.name || 'Explorer'}
            </span>
          </h1>
          <p className="text-slate-400 max-w-lg text-lg">
            Your journey through {roadmapData?.goal || 'strategic skills'} continues here.
          </p>
        </div>

        {/* Main Content Area - Slot State */}
        <div className="grid gap-8">
          <section className="relative group">
            {/* Context Header */}
            <div className="flex items-center gap-3 mb-6">
               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
               <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Active Mission</h2>
            </div>
            
            <div className="bg-linear-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-1 overflow-hidden shadow-2xl">
              <SlotStateEnforcement 
                activeSlot={activeSlotData} 
                lockedReason={null}
                onStart={handleStartSlot}
                onContinue={handleContinueSlot}
              />
            </div>
          </section>

          {/* Stats/Quick Actions Placeholder */}
          <div className="grid md:grid-cols-4 gap-6">
             <div className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all group">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-xl font-bold text-emerald-400 capitalize">{activeSlotData?.status?.replace(/_/g, ' ') || 'Standby'}</p>
                </div>
             </div>
             
             <div className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all group">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Skill</p>
                <p className="text-xl font-bold text-slate-200 capitalize">{activeSlotData?.skill?.replace(/_/g, ' ') || 'None'}</p>
             </div>

             <div className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all group">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Difficulty</p>
                <span className={`text-xl font-bold capitalize ${
                  activeSlotData?.difficulty === 'easy' ? 'text-emerald-400' :
                  activeSlotData?.difficulty === 'medium' ? 'text-amber-400' :
                  'text-rose-400'
                }`}>
                  {activeSlotData?.difficulty || 'N/A'}
                </span>
             </div>

             <div className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all group">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Quest Type</p>
                <p className="text-xl font-bold text-purple-400 capitalize">
                  {activeSlotData?.question_type || activeSlotData?.type || 'Standard'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
