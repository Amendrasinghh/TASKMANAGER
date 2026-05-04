const statusColors = {
  TODO: 'bg-gray-300',
  IN_PROGRESS: 'bg-blue-400',
  IN_REVIEW: 'bg-yellow-400',
  DONE: 'bg-green-400'
};

const statusBadge = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  IN_REVIEW: 'bg-yellow-100 text-yellow-700',
  DONE: 'bg-green-100 text-green-700'
};

export default function ActivityFeed({ tasks = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 6).map(task => (
            <div key={task.id} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{task.title}</p>
                <p className="text-xs text-gray-400">{task.project?.name}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[task.status]}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
