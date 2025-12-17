// Placeholder for TaskHeader component
export default function TaskHeader({ completedCount, totalCount }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold">Today&apos;s Tasks</h2>
      <span className="text-slate-400">
        {completedCount} of {totalCount} completed
      </span>
    </div>
  );
}
