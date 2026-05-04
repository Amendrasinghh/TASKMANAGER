import TaskCard from './TaskCard';

const statusLabels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done' };
const statusColors = { TODO: 'bg-gray-100', IN_PROGRESS: 'bg-blue-100', IN_REVIEW: 'bg-yellow-100', DONE: 'bg-green-100' };

export default function KanbanColumn({ status, tasks = [], onStatusChange }) {
  return (
    <div className="min-w-[240px]">
      <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-3 ${statusColors[status]}`}>
        <span className="text-sm font-medium text-gray-700">{statusLabels[status]}</span>
        <span className="text-xs text-gray-500 bg-white/70 px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
        ))}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
