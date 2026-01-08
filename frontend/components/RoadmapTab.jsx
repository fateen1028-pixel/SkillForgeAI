"use client";
import RoadmapNode from "./roadmap/RoadmapNode";

export default function RoadmapTab({ roadmapState }) {
  if (!roadmapState) {
    return (
      <div className="p-12 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
           <span className="text-2xl">🗺️</span>
        </div>
        <p className="text-slate-400">Your roadmap is being generated...</p>
      </div>
    );
  }

  return (
    <div className="relative pl-4 md:pl-8">
       {/* Background line for the whole track - semi visible */}
       <div className="absolute left-7.5 md:left-13.5 top-10 bottom-20 w-px border-l border-dashed border-slate-800" />
       
      <div className="space-y-2">
        {roadmapState.phases?.map((phase, index) => (
          <RoadmapNode 
            key={phase.id} 
            phase={phase}
            index={index}
            totalPhases={roadmapState.phases.length}
            isAnySlotInProgress={roadmapState.isAnySlotInProgress}
          />
        ))}
      </div>
    </div>
  );
}
