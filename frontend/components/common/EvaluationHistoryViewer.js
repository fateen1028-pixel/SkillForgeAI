import React from 'react';

export default function EvaluationHistoryViewer({ history = [] }) {
  if (!history.length) {
    return (
      <div className="text-center py-4 text-xs text-slate-500">
        No evaluation history available.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evaluation History</h4>
      <div className="space-y-1">
        {history.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/5 text-xs">
            <span className="text-slate-400">{entry.date}</span>
            <span className={`font-mono ${
              entry.score >= 80 ? 'text-emerald-400' : 
              entry.score >= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {entry.score}/100
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
