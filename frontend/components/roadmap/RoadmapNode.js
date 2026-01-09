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
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="relative flex gap-8 pb-16 last:pb-0 group">
       {/* Connecting Line */}
       {index !== totalPhases - 1 && (
        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-slate-800/50">
           <div className={`w-full h-full bg-linear-to-b from-emerald-500 to-transparent transition-all duration-1000 ${
             isCompleted ? 'opacity-100' : 'opacity-0'
           }`} />
        </div>
      )}

      {/* Node Circle */}
      <div className="relative z-10 shrink-0 mt-1">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-xl",
          isActive ? "bg-emerald-600 border-emerald-400 shadow-emerald-500/20 scale-110" : 
          isCompleted ? "bg-slate-900 border-emerald-500 text-emerald-500" : 
          "bg-slate-900 border-slate-700 text-slate-500"
        )}>
          {isCompleted ? <Check className="w-6 h-6 stroke-3" /> : 
           isActive ? <Play className="w-5 h-5 fill-current animate-pulse" /> :
           <Lock className="w-5 h-5" />}
        </div>
      </div>

      {/* Content */}
      <div className="grow pt-1">
        <div 
          onClick={() => !isLocked && setIsExpanded(!isExpanded)}
          className={cn(
            "group rounded-2xl border p-6 transition-all duration-300 relative overflow-hidden",
            isLocked ? "cursor-not-allowed bg-slate-900/20 border-slate-800" : "cursor-pointer",
            isActive ? "bg-linear-to-br from-emerald-500/10 via-emerald-900/5 to-transparent border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]" : 
            isCompleted && !isLocked ? "bg-slate-900/40 border-emerald-500/10 opacity-75" : "bg-white/2 border-white/5 opacity-50"
          )}
        >
          {isActive && <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 to-transparent pointer-events-none" />}
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={cn(
                  "text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider",
                  isActive ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" :
                  isCompleted ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  "bg-slate-800 text-slate-400 border border-slate-700"
                )}>
                  Phase {index + 1}
                </span>
                {phase.status !== 'LOCKED' && (
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    isActive ? "text-emerald-400" : "text-slate-500"
                  )}>
                    {phase.status}
                  </span>
                )}
              </div>
              <h3 className={cn(
                "text-2xl font-bold tracking-tight",
                isLocked ? "text-slate-500" : "text-white"
              )}>{phase.title}</h3>
            </div>
            
            <div className={cn(
              "p-2.5 rounded-xl transition-all duration-300",
               isLocked ? "text-slate-600" : "text-slate-400 bg-white/5 group-hover:bg-white/10 group-hover:text-white"
            )}>
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </div>
          
          {phase.lockedReason && isLocked && (
            <div className="mt-4 flex items-center gap-2 text-sm text-pink-400/80 bg-pink-500/5 p-3 rounded-lg border border-pink-500/10">
               <Lock className="w-3.5 h-3.5" />
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
              <div className="pt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 pl-4">
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
                      <div key={slot.id} className="relative flex flex-col group/slot">
                         <div className={cn(
                           "flex flex-col h-full p-5 rounded-2xl border transition-all duration-300",
                           isSlotActive ? "bg-linear-to-br from-emerald-500/15 via-emerald-900/5 to-transparent border-emerald-500/40 shadow-lg shadow-emerald-500/5" :
                           isSlotRemedial ? "bg-amber-900/10 border-amber-500/30" :
                           isSlotCompleted ? "bg-slate-900/40 border-emerald-500/10 opacity-75" :
                           isSlotLocked ? "bg-slate-900/5 border-slate-800/50 opacity-40" :
                           "bg-white/2 border-white/5"
                         )}>
                            <div className="flex items-start justify-between mb-4">
                              <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center border transition-colors",
                                isSlotActive ? "bg-emerald-600 border-white/20 text-white shadow-lg shadow-emerald-500/20" :
                                isSlotRemedial ? "bg-amber-600 border-amber-400 text-white" :
                                isSlotCompleted ? "bg-emerald-900/30 border-emerald-500/30 text-emerald-400" :
                                isSlotLocked ? "bg-slate-900 border-slate-800 text-slate-600" :
                                "bg-slate-800/50 border-white/5 text-slate-500"
                              )}>
                                 {isSlotCompleted ? <Check className="w-5 h-5" /> : 
                                  isSlotActive ? <Play className="w-4 h-4 fill-current" /> :
                                  isSlotRemedial ? <RotateCcw className="w-4 h-4" /> :
                                  isSlotLocked ? <Lock className="w-4 h-4" /> :
                                  <span className="text-xs font-bold">{i + 1}</span>}
                              </div>
                              
                              <div className="flex flex-col items-end gap-1.5">
                                 {slot.difficulty && (
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                                    slot.difficulty === 'easy' ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                                    slot.difficulty === 'medium' ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
                                    "text-rose-400 border-rose-500/20 bg-rose-500/5"
                                  )}>
                                    {slot.difficulty}
                                  </span>
                                )}
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">{slot.type}</span>
                              </div>
                            </div>
                            
                            <h4 className={cn(
                              "font-bold text-sm mb-2 leading-tight",
                              isSlotCompleted || isSlotActive || isSlotRemedial ? "text-white" : "text-slate-400"
                            )}>{slot.title}</h4>

                            <div className="mt-auto pt-4 flex flex-col gap-3">
                              {isSlotRemedial && (
                                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                                  <span className="text-[10px] text-amber-300 uppercase font-bold tracking-widest leading-none">Remediation Needed</span>
                                </div>
                              )}
                              
                              {canStart && (
                                <button
                                  onClick={(e) => handleStartTask(e, slot.id)}
                                  disabled={loadingSlotId === slot.id || isGloballyLocked}
                                  className={cn(
                                    "w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                                    isSlotActive ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 -translate-y-px" :
                                    isSlotRemedial ? "bg-amber-600 hover:bg-amber-500 text-white shadow-xl shadow-amber-500/20" :
                                    "bg-white/5 hover:bg-white/10 text-white border border-white/10",
                                    isGloballyLocked && "opacity-50 cursor-not-allowed hover:bg-white/5"
                                  )}
                                >
                                  {loadingSlotId === slot.id ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      {isSlotActive ? "Continue Session" : isSlotRemedial ? "Solve Now" : "Launch"}
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </>
                                  )}
                                </button>
                              )}

                              {isSlotCompleted && (
                                <div className="flex items-center justify-center gap-1.5 py-2 text-emerald-500/60 font-medium text-[10px] uppercase tracking-widest">
                                   <Check className="w-3.5 h-3.5" /> Completed
                                </div>
                              )}
                              
                              {isGloballyLocked && isSlotReady && (
                                <span className="text-[9px] text-slate-600 italic text-center">Session in progress elsewhere</span>
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
