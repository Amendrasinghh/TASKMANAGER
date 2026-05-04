export const priorityConfig = {
  LOW: { label: 'Low', color: 'bg-gray-100 text-gray-600', icon: '○' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-600', icon: '◐' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-600', icon: '●' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-600', icon: '⬤' }
};

export const getPriorityLabel = (priority) => priorityConfig[priority]?.label || priority;
export const getPriorityColor = (priority) => priorityConfig[priority]?.color || 'bg-gray-100 text-gray-600';
export const priorityOrder = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
