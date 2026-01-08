import Link from "next/link";
import { ArrowRight, Lock, CheckCircle2, Circle } from "lucide-react";

export default function TaskCard({ slot }) {
  const isLocked = slot.status === 'locked';
  const isActive = slot.status === 'in_progress';
  const isCompleted = slot.status === 'completed';

  const getStatusColor = () => {
    if (isActive) return "text-violet-400";
    if (isCompleted) return "text-emerald-400";
    if (isLocked) return "text-slate-600";
    return "text-slate-400";
  };

  const getBorderColor = () => {
    if (isActive) return "border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]";
    if (isCompleted) return "border-emerald-500/20";
    return "border-white/5 hover:border-white/10";
  };

  const getBgColor = () => {
    if (isActive) return "bg-gradient-to-br from-violet-500/10 via-violet-900/5 to-transparent";
    if (isLocked) return "bg-slate-900/20";
    return "bg-slate-800/40 hover:bg-slate-800/60";
  };

  return (
    <div
      className={`group relative flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 ${getBorderColor()} ${getBgColor()}`}
    >
      {/* Glow Effect for Active Card */}
      {isActive && (
        <div className="absolute -inset-px -z-10 rounded-2xl bg-linear-to-r from-violet-500/20 to-fuchsia-500/20 blur-sm" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-colors ${
            isActive ? 'bg-violet-500/20 text-violet-300' : 
            isCompleted ? 'bg-emerald-500/10 text-emerald-400' :
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

        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
          slot.difficulty === 'easy' 
            ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
            : slot.difficulty === 'medium'
            ? 'border-amber-500/20 text-amber-400 bg-amber-500/5'
            : 'border-rose-500/20 text-rose-400 bg-rose-500/5'
        }`}>
          {slot.difficulty}
        </span>
      </div>

      {/* Divider */}
      <div className={`h-px w-full ${isActive ? 'bg-violet-500/20' : 'bg-white/5'}`} />

      {/* Footer / Action */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
           {/* Placeholder for progress/stats */}
           <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
             <div className={`h-full rounded-full ${
               isCompleted ? 'w-full bg-emerald-500' : 
               isActive ? 'w-1/2 bg-violet-500' : 'w-0'
             }`} />
           </div>
        </div>

        {isActive ? (
          <Link
            href={`/dashboard/task/${slot.task_id || slot.slot_id}`}
            className="flex items-center gap-2 text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5"
          >
            Continue
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
