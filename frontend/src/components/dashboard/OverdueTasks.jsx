import { AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function OverdueTasks({ tasks = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" /> Overdue Tasks
      </h2>
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">No overdue tasks! 🎉</p>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                <p className="text-xs text-gray-500">{task.project?.name}</p>
              </div>
              <span className="text-xs text-red-600 font-medium whitespace-nowrap flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
