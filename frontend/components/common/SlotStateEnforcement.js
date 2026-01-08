import React from 'react';
import { cn } from '@/lib/utils';

export default function SlotStateEnforcement({ activeSlot, lockedReason, onStart, onContinue }) {
  if (!activeSlot && !lockedReason) {
    return (
      <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-center">
        <h3 className="text-lg font-semibold text-slate-300">No Active Slot</h3>
        <p className="text-sm text-slate-500 mt-2">Select a roadmap phase to begin.</p>
      </div>
    );
  }

  if (activeSlot) {
    return (
      <div className="p-6 rounded-xl border border-violet-500/20 bg-linear-to-br from-violet-500/10 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-violet-400">Active Slot Context</h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
            activeSlot.status === 'in_progress' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : activeSlot.status === 'remediation_required'
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            {activeSlot.status === 'in_progress' ? 'In Progress' 
              : activeSlot.status === 'remediation_required' ? 'Remediation Required' 
              : 'Available'}
          </span>
        </div>

        {activeSlot.status === 'remediation_required' && (
          <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
             <div className="mt-0.5">
               <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <div className="text-sm text-amber-200">
               <p className="font-semibold mb-1">Guided Remediation Active</p>
               <p>{activeSlot.user_message || "The AI evaluator has requested a remediation step to solidify your understanding."}</p>
             </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skill & Difficulty */}
          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Skill Focus</span>
              <p className="text-white text-lg font-medium mt-1">{activeSlot.skill || 'Unknown Skill'}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Difficulty</span>
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div 
                    key={lvl}
                    className={`h-1.5 w-6 rounded-full ${
                      // Simple mapping if difficulty is a string "Easy", "Medium" etc or number
                      lvl <= (activeSlot.difficulty?.toLowerCase() === 'easy' ? 1 
                        : activeSlot.difficulty?.toLowerCase() === 'medium' ? 3 
                        : activeSlot.difficulty?.toLowerCase() === 'hard' ? 5 : 2) 
                        ? 'bg-violet-500' 
                        : 'bg-white/10'
                    }`}
                  />
                ))}
                <span className="text-sm text-slate-400 ml-2">{activeSlot.difficulty}</span>
              </div>
            </div>
            
            {activeSlot.status === 'remediation_required' && (
              <div className="pt-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Remediation Progress</span>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex -space-x-1">
                    {[...Array(Math.max(1, activeSlot.remediation_attempts || 0))].map((_, idx) => (
                      <div key={idx} className="w-3 h-3 rounded-full bg-amber-500 border border-slate-900 shadow-sm" />
                    ))}
                  </div>
                  <span className="text-xs text-amber-400 font-mono font-bold">
                    Attempt #{activeSlot.remediation_attempts || 1}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Technical Details */}
          <div className="space-y-4 p-4 rounded-lg bg-black/20 border border-white/5 font-mono text-sm">
             <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Locked Reason</span>
                <span className={activeSlot.locked_reason ? "text-rose-400" : "text-emerald-400"}>
                  {activeSlot.locked_reason ? activeSlot.locked_reason : "None"}
                </span>
             </div>

             <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Slot ID</span>
                <span className="text-slate-300 break-all">
                  {activeSlot.slot_id || "None"}
                </span>
             </div>
             
             <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Active Task Instance ID</span>
                <span className="text-slate-300 break-all">
                  {activeSlot.active_task_instance_id || "None"}
                </span>
             </div>
          </div>
        </div>

        {activeSlot.hint && (
          <div className="mt-6 p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
            <span className="text-xs text-violet-400 font-bold uppercase tracking-wider">AI Hint</span>
            <p className="text-sm text-slate-300 mt-2 italic leading-relaxed">&quot;{activeSlot.hint}&quot;</p>
          </div>
        )}

        {(activeSlot.status === 'available' || activeSlot.status === 'remediation_required') && !activeSlot.locked_reason && (
           <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
              <button 
                onClick={() => onStart && onStart(activeSlot.slot_id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors active:scale-95",
                  activeSlot.status === 'remediation_required' 
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                    : "bg-violet-600 hover:bg-violet-500 text-white"
                )}>
                {activeSlot.status === 'remediation_required' ? 'Retry / Remediate' : 'Start Task'}
              </button>
           </div>
        )}

        {activeSlot.status === 'in_progress' && activeSlot.active_task_instance_id && (
           <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
              <button 
                onClick={() => onContinue && onContinue(activeSlot.active_task_instance_id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <span>Continue Task</span>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
           </div>
        )}
      </div>
    );
  }

  return null;
}
