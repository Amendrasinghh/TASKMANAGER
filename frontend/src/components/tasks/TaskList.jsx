import { format } from 'date-fns';

const statusColors = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  IN_REVIEW: 'bg-yellow-100 text-yellow-700',
  DONE: 'bg-green-100 text-green-700'
};

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700'
};

export default function TaskList({ tasks = [], onDelete, onStatusChange }) {
  const statusLabels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done' };

  if (tasks.length === 0) {
    return <p className="text-center text-gray-400 py-10 text-sm">No tasks found</p>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase bg-gray-50">
          <th className="text-left px-4 py-3">Task</th>
          <th className="text-left px-4 py-3">Project</th>
          <th className="text-left px-4 py-3">Status</th>
          <th className="text-left px-4 py-3">Priority</th>
          <th className="text-left px-4 py-3">Assignee</th>
          <th className="text-left px-4 py-3">Due</th>
          {onDelete && <th className="text-left px-4 py-3">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
            <td className="px-4 py-3">
              <p className="text-sm font-medium text-gray-800">{task.title}</p>
              {task.description && <p className="text-xs text-gray-400 truncate max-w-xs">{task.description}</p>}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.project?.color }} />
                <span className="text-sm text-gray-600">{task.project?.name}</span>
              </div>
            </td>
            <td className="px-4 py-3">
              {onStatusChange ? (
                <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${statusColors[task.status]}`}>
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              ) : (
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>{statusLabels[task.status]}</span>
              )}
            </td>
            <td className="px-4 py-3">
              <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">{task.assignee?.name ?? '—'}</td>
            <td className="px-4 py-3 text-xs text-gray-500">{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '—'}</td>
            {onDelete && (
              <td className="px-4 py-3">
                <button onClick={() => onDelete(task.id)} className="text-xs text-red-500 hover:text-red-700 transition">Delete</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
