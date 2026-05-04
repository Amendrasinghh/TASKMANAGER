import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios.config';
import toast from 'react-hot-toast';
import { Filter, CheckSquare } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { format } from 'date-fns';

const statusColors = { TODO: 'bg-gray-100 text-gray-700', IN_PROGRESS: 'bg-blue-100 text-blue-700', IN_REVIEW: 'bg-yellow-100 text-yellow-700', DONE: 'bg-green-100 text-green-700' };
const priorityColors = { LOW: 'bg-gray-100 text-gray-600', MEDIUM: 'bg-blue-100 text-blue-700', HIGH: 'bg-orange-100 text-orange-700', URGENT: 'bg-red-100 text-red-700' };

export default function TasksPage() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => api.get(`/tasks?${params}`).then(r => r.data.data.tasks)
  });

  const updateTask = useMutation({
    mutationFn: ({ id, ...d }) => api.put(`/tasks/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); toast.success('Task updated'); }
  });

  const deleteTask = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); toast.success('Task deleted'); }
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">{tasks?.length ?? 0} tasks</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="text-sm outline-none bg-transparent text-gray-600">
            <option value="">All Status</option>
            {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
            className="text-sm outline-none bg-transparent text-gray-600">
            <option value="">All Priority</option>
            {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {tasks?.length === 0 ? (
          <div className="text-center py-16">
            <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 text-xs text-gray-500 uppercase bg-gray-50">
              <th className="text-left px-4 py-3">Task</th>
              <th className="text-left px-4 py-3">Project</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Priority</th>
              <th className="text-left px-4 py-3">Assignee</th>
              <th className="text-left px-4 py-3">Due Date</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {tasks?.map(task => (
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
                    <select value={task.status} onChange={e => updateTask.mutate({ id: task.id, status: e.target.value })}
                      className={`text-xs px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${statusColors[task.status]}`}>
                      {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{task.assignee?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { if (confirm('Delete this task?')) deleteTask.mutate(task.id); }}
                      className="text-xs text-red-500 hover:text-red-700 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
