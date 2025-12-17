// Placeholder for TaskResult component
export default function TaskResult({ result }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <p className="text-sm text-slate-400">Task completed!</p>
      {result && <p className="mt-2">{result}</p>}
    </div>
  );
}
