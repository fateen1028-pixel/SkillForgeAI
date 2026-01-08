import React from 'react';

export default function SystemStatusBanner({ status = 'NORMAL', message }) {
  const styles = {
    NORMAL: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    DAMPENED: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    SAFE_MODE: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };

  const currentStyle = styles[status] || styles.NORMAL;

  return (
    <div className={`w-full p-3 border-b ${currentStyle} flex items-center justify-between px-4`}>
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-xs uppercase tracking-wider">System Status: {status}</span>
        {message && <span className="text-xs opacity-80 border-l border-current pl-2 ml-2">{message}</span>}
      </div>
    </div>
  );
}
