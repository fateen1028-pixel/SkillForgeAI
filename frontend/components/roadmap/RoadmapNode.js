import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { roadmapService } from "../../services/roadmap.service";
import { taskService } from "../../services/task.service";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, Play, ChevronRight, ChevronDown, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function RoadmapNode({ phase, index, totalPhases, isAnySlotInProgress }) {
  const router = useRouter();
  const [loadingSlotId, setLoadingSlotId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(phase.status === 'ACTIVE');

  // Logic functions (kept from original)
  const handleStartTask = async (e, slotId) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingSlotId) return;
    
    try {
      setLoadingSlotId(slotId);
      const startResult = await roadmapService.startSlot(slotId);
      const instanceId = startResult.task_instance_id || startResult.instance_id; 

      if (!instanceId) {
        alert(`Error: No instance ID returned.`);
        return;
      }

      const taskDetails = await taskService.getTaskExecutionDetails(instanceId);
      const type = taskDetails.question_type?.toLowerCase();
      
      let targetUrl = `/dashboard/task/${instanceId}`;
      if (type === 'mcq') targetUrl += '/mcq';
      else if (type === 'explanation') targetUrl += '/explanation';
      
      const queryParams = new URLSearchParams();
      if (startResult.hint) queryParams.set('hint', startResult.hint);
      queryParams.set('slotId', slotId);
      
      if (queryParams.toString()) targetUrl += `?${queryParams.toString()}`;
      router.push(targetUrl);

    } catch (error) {
       // Error recovery logic
       if (error.response?.status === 409) {
          // ... (existing code for 409)
       }

       if (error.response?.status === 500) {
          const detail = error.response.data?.detail || error.response.data;
          alert(`Configuration Error: ${detail}\n\nThis usually indicates a mismatch between the curriculum YAML and task templates. Contact support if this persists.`);
          return;
       }

       const errorMessage = error.response?.data?.detail || error.message;
       alert(`Failed to start task: ${errorMessage}`);
    } finally {
      setLoadingSlotId(null);
    }
  };

  const isLocked = phase.status === 'LOCKED';
  const isCompleted = phase.status === 'COMPLETED';
  const isActive = phase.status === 'ACTIVE';

  return (
    <div className="relative flex gap-6 pb-12 last:pb-0">
       {/* Connecting Line */}
       {index !== totalPhases - 1 && (
        <div className="absolute left-5.5 top-12 bottom-0 w-0.5 bg-slate-800">
           <div className={`w-full h-full bg-linear-to-b from-violet-500 to-transparent transition-all duration-1000 ${
             isCompleted ? 'opacity-100' : 'opacity-0'
           }`} />
        </div>
      )}

      {/* Node Circle */}
      <div className="relative z-10 shrink-0 mt-1">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-xl",
          isActive ? "bg-violet-600 border-violet-900 shadow-violet-500/30 scale-110" : 
          isCompleted ? "bg-slate-900 border-emerald-500 text-emerald-500" : 
          "bg-slate-900 border-slate-700 text-slate-500"
        )}>
          {isCompleted ? <Check className="w-6 h-6" /> : 
           isActive ? <div className="w-4 h-4 rounded-full bg-white animate-pulse" /> :
           <Lock className="w-5 h-5" />}
        </div>
      </div>

      {/* Content */}
      <div className="grow pt-2">
        <div 
          onClick={() => !isLocked && setIsExpanded(!isExpanded)}
          className={cn(
            "group rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden",
            isLocked ? "cursor-not-allowed bg-slate-900/20 border-slate-800" : "cursor-pointer",
            isActive ? "bg-violet-900/10 border-violet-500/30 hover:bg-violet-900/20" : 
            isCompleted && !isLocked ? "bg-slate-900/30 border-emerald-500/20" : ""
          )}
        >
          {isActive && <div className="absolute inset-0 bg-linear-to-r from-violet-500/5 to-transparent pointer-events-none" />}
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                  isActive ? "bg-violet-500 text-white" :
                  isCompleted ? "bg-emerald-500/10 text-emerald-400" :
                  "bg-slate-800 text-slate-400"
                )}>
                  Phase {index + 1}
                </span>
                {phase.status !== 'LOCKED' && <span className="text-xs text-slate-500">{phase.status}</span>}
              </div>
              <h3 className={cn(
                "text-xl font-bold",
                isLocked ? "text-slate-500" : "text-white"
              )}>{phase.title}</h3>
            </div>
            
            <div className={cn(
              "p-2 rounded-lg transition-colors",
               isLocked ? "text-slate-600" : "text-white bg-white/5 group-hover:bg-white/10"
            )}>
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </div>
          
          {phase.lockedReason && isLocked && (
            <div className="mt-4 flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
               <Lock className="w-4 h-4" />
               {phase.lockedReason}
            </div>
          )}
        </div>

        {/* Expanded Slots */}
        <AnimatePresence>
          {isExpanded && !isLocked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-3 pl-4">
                 {phase.slots.map((slot, i) => {
                    const status = slot.status?.toLowerCase();
                    const isSlotActive = status === 'in_progress';
                    const isSlotCompleted = status === 'completed';
                    const isSlotReady = status === 'available';
                    const isSlotRemedial = status === 'remediation_required';
                    const isSlotLocked = status === 'locked';
                    const isSlotFailed = status === 'failed';
                    
                    const canStart = isSlotActive || isSlotReady || isSlotRemedial;
                    const isGloballyLocked = isAnySlotInProgress && !isSlotActive;

                    return (
                      <div key={slot.id} className="relative flex gap-4 group/slot">
                         {/* Connector to slot */}
                         <div className="absolute -left-5.75 top-6 w-5.75 h-px border-t border-dashed border-slate-700" />
                         
                         <div className={cn(
                           "grow flex items-center justify-between p-4 rounded-xl border transition-all",
                           isSlotActive ? "bg-violet-900/20 border-violet-500/40" :
                           isSlotRemedial ? "bg-amber-900/10 border-amber-500/30" :
                           isSlotCompleted ? "bg-slate-900/40 border-emerald-500/20 opacity-80" :
                           isSlotLocked ? "bg-slate-900/5 border-slate-800/50 opacity-50" :
                           "bg-slate-900/20 border-slate-800"
                         )}>
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2",
                                isSlotActive ? "bg-violet-600 border-violet-400 text-white" :
                                isSlotRemedial ? "bg-amber-600 border-amber-400 text-white" :
                                isSlotCompleted ? "bg-emerald-900/50 border-emerald-500/50 text-emerald-500" :
                                isSlotLocked ? "bg-slate-900 border-slate-800 text-slate-600" :
                                "bg-slate-800 border-slate-700 text-slate-500"
                              )}>
                                 {isSlotCompleted ? <Check className="w-5 h-5" /> : 
                                  isSlotActive ? <Play className="w-4 h-4 fill-current" /> :
                                  isSlotRemedial ? <RotateCcw className="w-4 h-4" /> :
                                  isSlotLocked ? <Lock className="w-4 h-4" /> :
                                  <span className="text-sm font-bold">{i + 1}</span>}
                              </div>
                              
                              <div>
                                <h4 className={cn(
                                  "font-medium",
                                  isSlotCompleted || isSlotActive || isSlotRemedial ? "text-white" : "text-slate-400"
                                )}>{slot.title}</h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500 uppercase font-mono">{slot.type}</span>
                                  {isSlotRemedial && (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase font-bold">Guided Remediation</span>
                                      {slot.remediation_attempts > 0 && (
                                        <span className="text-[10px] text-slate-500 italic">Attempt {slot.remediation_attempts}</span>
                                      )}
                                    </div>
                                  )}
                                  {isSlotFailed && (
                                     <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 uppercase font-bold">Failed</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {canStart && (
                                <button
                                  onClick={(e) => handleStartTask(e, slot.id)}
                                  disabled={loadingSlotId === slot.id || isGloballyLocked}
                                  className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all active:scale-95",
                                    isSlotActive ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25" :
                                    isSlotRemedial ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/25" :
                                    "bg-white/5 hover:bg-white/10 text-white border border-white/10",
                                    isGloballyLocked && "opacity-50 cursor-not-allowed hover:bg-white/5"
                                  )}
                                >
                                  {loadingSlotId === slot.id ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      {isSlotActive ? "Continue" : isSlotRemedial ? "Resume Remediation" : "Start"}
                                      <ChevronRight className="w-4 h-4" />
                                    </>
                                  )}
                                </button>
                              )}
                              
                              {isGloballyLocked && isSlotReady && (
                                <span className="text-[10px] text-slate-500 italic">Another task in progress</span>
                              )}
                              
                              {slot.difficulty && (
                                <span className={cn(
                                  "px-2 py-1 rounded text-[10px] items-center font-bold uppercase border",
                                  slot.difficulty === 'easy' ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                                  slot.difficulty === 'medium' ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
                                  "text-rose-400 border-rose-500/20 bg-rose-500/5"
                                )}>
                                  {slot.difficulty}
                                </span>
                              )}
                            </div>
                         </div>
                      </div>
                    );
                 })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
