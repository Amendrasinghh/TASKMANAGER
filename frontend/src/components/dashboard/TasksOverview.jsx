const statusColors = {
  TODO: 'bg-gray-400',
  IN_PROGRESS: 'bg-blue-400',
  IN_REVIEW: 'bg-yellow-400',
  DONE: 'bg-green-400'
};

const statusLabels = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done'
};

export default function TasksOverview({ tasksByStatus = [], totalTasks = 0 }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Tasks by Status</h2>
      {totalTasks === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">No tasks yet</p>
      ) : (
        <div className="space-y-3">
          {tasksByStatus.map(item => {
            const percentage = totalTasks > 0 ? Math.round((item._count.status / totalTasks) * 100) : 0;
            return (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{statusLabels[item.status] || item.status}</span>
                  <span className="text-xs text-gray-400">{item._count.status} ({percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${statusColors[item.status]} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
