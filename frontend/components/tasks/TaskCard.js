import Link from "next/link";
import { ArrowRight, Lock, CheckCircle2, Circle, Code, FileText, LayoutList } from "lucide-react";

export default function TaskCard({ slot }) {
  const isLocked = slot.status === 'locked';
  const isAvailable = slot.status === 'available';
  const isActive = slot.status === 'in_progress';
  const isCompleted = slot.status === 'completed';

  const getStatusColor = () => {
    if (isActive || isAvailable) return "text-emerald-400";
    if (isCompleted) return "text-emerald-500/60";
    if (isLocked) return "text-slate-600";
    return "text-slate-400";
  };

  const getBorderColor = () => {
    if (isActive) return "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]";
    if (isAvailable) return "border-emerald-500/30";
    if (isCompleted) return "border-emerald-500/10";
    return "border-white/5 hover:border-white/10";
  };

  const getBgColor = () => {
    if (isActive) return "bg-gradient-to-br from-emerald-500/10 via-emerald-900/5 to-transparent";
    if (isAvailable) return "bg-emerald-500/5";
    if (isLocked) return "bg-slate-900/20";
    return "bg-slate-800/40 hover:bg-slate-800/60";
  };

  return (
    <div
      className={`group relative flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 ${getBorderColor()} ${getBgColor()}`}
    >
      {/* Glow Effect for Active Card */}
      {isActive && (
        <div className="absolute -inset-px -z-10 rounded-2xl bg-linear-to-r from-emerald-500/20 to-teal-500/20 blur-sm" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-colors ${
            (isActive || isAvailable) ? 'bg-emerald-500/20 text-emerald-300' : 
            isCompleted ? 'bg-emerald-500/10 text-emerald-400/60' :
            'bg-slate-800 text-slate-500'
          }`}>
            {isLocked ? <Lock className="w-5 h-5" /> : 
             isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
             <Circle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className={`font-semibold capitalize tracking-tight ${
              isLocked ? 'text-slate-500' : 'text-slate-200 group-hover:text-white'
            }`}>
              {slot.skill.replace(/_/g, ' ')}
            </h3>
            <span className={`text-xs font-mono uppercase tracking-wider ${getStatusColor()}`}>
              {slot.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all duration-300 ${
            isLocked ? 'opacity-30 grayscale pointer-events-none' : ''
          } ${
            slot.difficulty === 'easy' 
              ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
              : slot.difficulty === 'medium'
              ? 'border-amber-500/20 text-amber-400 bg-amber-500/5'
              : 'border-rose-500/20 text-rose-400 bg-rose-500/5'
          }`}>
            {slot.difficulty}
          </span>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border shadow-sm transition-all duration-300 ${
            isLocked 
              ? 'opacity-30 grayscale border-white/5' 
              : 'border-white/10 group-hover:border-white/20'
          }`}>
            {slot.question_type === 'coding' || slot.type === 'coding' ? (
              <>
                <Code className="w-3 h-3 text-violet-400" />
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Coding</span>
              </>
            ) : slot.question_type === 'explanation' || slot.type === 'explanation' ? (
              <>
                <FileText className="w-3 h-3 text-amber-400" />
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Concept</span>
              </>
            ) : slot.question_type === 'mcq' || slot.type === 'mcq' ? (
              <>
                <LayoutList className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Quiz</span>
              </>
            ) : (
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                {slot.question_type || slot.type || 'Task'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={`h-px w-full ${isActive ? 'bg-emerald-500/20' : 'bg-white/5'}`} />

      {/* Footer / Action */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
           {/* Placeholder for progress/stats */}
           <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
             <div className={`h-full rounded-full ${
               isCompleted ? 'w-full bg-emerald-500/40' : 
               isActive ? 'w-1/2 bg-emerald-500' : 
               isAvailable ? 'w-0 border-r border-emerald-500/30' : 'w-0'
             }`} />
           </div>
        </div>

        {(isActive || isAvailable) ? (
          <Link
            href={`/dashboard/task/${slot.task_id || slot.slot_id}`}
            className="flex items-center gap-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
          >
            {isActive ? 'Continue' : 'Start'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : isCompleted ? (
           <Link
             href={`/dashboard/task/${slot.task_id || slot.slot_id}`}
             className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
           >
             Review
             <ArrowRight className="w-3 h-3" />
           </Link>
        ) : null}
      </div>
    </div>
  );
}
