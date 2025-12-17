// Placeholder for Monaco Editor component
// Install: npm install @monaco-editor/react

"use client";

export default function MonacoEditor({ 
  value, 
  onChange, 
  language = "javascript",
  theme = "vs-dark" 
}) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl border border-white/10 bg-[#1e1e1e] p-4">
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-full bg-transparent text-slate-300 font-mono text-sm resize-none outline-none"
        placeholder="// Write your code here..."
      />
      <p className="mt-2 text-xs text-slate-500">
        Note: Install @monaco-editor/react for full editor functionality
      </p>
    </div>
  );
}
