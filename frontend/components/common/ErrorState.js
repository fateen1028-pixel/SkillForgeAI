export default function ErrorState({ 
  title = "Something went wrong", 
  description = "Please try again later",
  onRetry 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-white/10 text-sm font-medium hover:bg-white/20 transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
