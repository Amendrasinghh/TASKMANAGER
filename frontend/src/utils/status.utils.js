export const statusConfig = {
  TODO: { label: 'To Do', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
  IN_REVIEW: { label: 'In Review', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  DONE: { label: 'Done', color: 'bg-green-100 text-green-700', dot: 'bg-green-400' }
};

export const projectStatusConfig = {
  ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700' },
  ON_HOLD: { label: 'On Hold', color: 'bg-yellow-100 text-yellow-700' },
  COMPLETED: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-700' }
};

export const getStatusLabel = (status) => statusConfig[status]?.label || status;
export const getStatusColor = (status) => statusConfig[status]?.color || 'bg-gray-100 text-gray-700';
