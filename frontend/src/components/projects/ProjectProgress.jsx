export default function ProjectProgress({ tasks = [] }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'DONE').length;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-500">Progress</span>
        <span className="text-xs text-gray-400">{done}/{total} tasks</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-right text-xs text-gray-400 mt-1">{percentage}% complete</p>
    </div>
  );
}
