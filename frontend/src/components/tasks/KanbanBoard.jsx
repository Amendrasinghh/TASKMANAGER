import KanbanColumn from './KanbanColumn';

const statusCols = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export default function KanbanBoard({ tasks = [], onStatusChange }) {
  const tasksByStatus = statusCols.reduce((acc, s) => {
    acc[s] = tasks.filter(t => t.status === s);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {statusCols.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasksByStatus[status]}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
