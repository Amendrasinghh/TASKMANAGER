import { format } from 'date-fns';

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700'
};

export default function TaskCard({ task, onStatusChange }) {
  const statusCols = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  const statusLabels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done' };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition">
      <p className="text-sm font-medium text-gray-800 mb-2">{task.title}</p>
      {task.description && <p className="text-xs text-gray-400 mb-2 line-clamp-2">{task.description}</p>}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span>
        {task.assignee && (
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">
            {task.assignee.name?.slice(0, 1)}
          </div>
        )}
      </div>
      {task.dueDate && (
        <p className="text-xs text-gray-400 mb-2">Due: {format(new Date(task.dueDate), 'MMM d')}</p>
      )}
      {onStatusChange && (
        <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)}
          className="w-full text-xs border border-gray-100 rounded-lg px-2 py-1 bg-gray-50 outline-none cursor-pointer">
          {statusCols.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
      )}
    </div>
  );
}
