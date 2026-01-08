import React from 'react';

export default function DecisionExplanationPanel({ decision }) {
  if (!decision) return null;

  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
      <h4 className="text-sm font-semibold text-slate-300 mb-2">System Decision</h4>
      <div className="space-y-2 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>Outcome:</span>
          <span className="font-mono text-white">{decision.outcome}</span>
        </div>
        <div className="flex justify-between">
          <span>Confidence:</span>
          <span className="font-mono text-white">{decision.confidence}%</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700">
          <p className="italic">&quot;{decision.reason}&quot;</p>
        </div>
      </div>
    </div>
  );
}
