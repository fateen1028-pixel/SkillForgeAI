// Placeholder for TaskCard component
export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
      <button 
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-lg border-2 ${
          task.completed 
            ? 'bg-emerald-500 border-transparent' 
            : 'border-white/20'
        }`}
      />
      <span className={task.completed ? 'line-through text-slate-500' : ''}>
        {task.text}
      </span>
    </div>
  );
}
