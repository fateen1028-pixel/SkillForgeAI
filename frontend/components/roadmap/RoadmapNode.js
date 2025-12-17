// Placeholder for RoadmapNode component
export default function RoadmapNode({ phase, isActive, isCompleted, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isCompleted 
          ? 'border-emerald-500/30 bg-emerald-500/10' 
          : isActive 
          ? 'border-violet-500/30 bg-violet-500/10' 
          : 'border-white/10 bg-white/5'
      }`}
    >
      <h3 className="font-semibold">{phase.title}</h3>
      <p className="text-sm text-slate-400">{phase.duration}</p>
    </div>
  );
}
