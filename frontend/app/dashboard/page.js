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
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      
      <div className="container-app py-6 md:py-10 max-w-5xl mx-auto px-4 grow">
        <h1 className="text-2xl font-bold mb-6">Active Context</h1>
        
        <div className="space-y-6">
          {/* Main Content Area - Slot State */}
          <div className="space-y-6">
            <section>
              <SlotStateEnforcement 
                activeSlot={activeSlotData} 
                lockedReason={null}
                onStart={handleStartSlot}
                onContinue={handleContinueSlot}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
