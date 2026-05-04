import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios.config';
import toast from 'react-hot-toast';
import { Plus, LayoutGrid, List, Users, UserPlus } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

const statusCols = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
const statusLabels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done' };
const statusColors = { TODO: 'bg-gray-100', IN_PROGRESS: 'bg-blue-100', IN_REVIEW: 'bg-yellow-100', DONE: 'bg-green-100' };
const priorityColors = { LOW: 'bg-gray-100 text-gray-600', MEDIUM: 'bg-blue-100 text-blue-700', HIGH: 'bg-orange-100 text-orange-700', URGENT: 'bg-red-100 text-red-700' };

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const qc = useQueryClient();
  const [view, setView] = useState('kanban');
  const [showTask, setShowTask] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { priority: 'MEDIUM' } });
  const { register: invReg, handleSubmit: invSubmit, reset: invReset } = useForm();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.get(`/projects/${projectId}`).then(r => r.data.data.project)
  });

  const createTask = useMutation({
    mutationFn: (d) => api.post('/tasks', { ...d, projectId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['project', projectId] }); toast.success('Task created'); setShowTask(false); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed')
  });

  const updateTask = useMutation({
    mutationFn: ({ id, ...d }) => api.put(`/tasks/${id}`, d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['project', projectId] })
  });

  const addMember = useMutation({
    mutationFn: (d) => api.post(`/projects/${projectId}/members`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['project', projectId] }); toast.success('Member added'); setShowInvite(false); invReset(); },
    onError: (e) => toast.error(e.response?.data?.message || 'User not found')
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const tasksByStatus = statusCols.reduce((acc, s) => {
    acc[s] = project?.tasks?.filter(t => t.status === s) ?? [];
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: project?.color }} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
            {project?.description && <p className="text-gray-500 text-sm">{project.description}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <UserPlus className="w-4 h-4" /> Invite
          </button>
          <button onClick={() => setShowTask(true)}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setView('kanban')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${view === 'kanban' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}>
          <LayoutGrid className="w-4 h-4" /> Kanban
        </button>
        <button onClick={() => setView('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${view === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}>
          <List className="w-4 h-4" /> List
        </button>
        <div className="ml-auto flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{project?.members?.length} members</span>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto">
          {statusCols.map(status => (
            <div key={status} className="min-w-[240px]">
              <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-3 ${statusColors[status]}`}>
                <span className="text-sm font-medium text-gray-700">{statusLabels[status]}</span>
                <span className="text-xs text-gray-500 bg-white/70 px-2 py-0.5 rounded-full">{tasksByStatus[status].length}</span>
              </div>
              <div className="space-y-2">
                {tasksByStatus[status].map(task => (
                  <div key={task.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                    <p className="text-sm font-medium text-gray-800 mb-2">{task.title}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span>
                      {task.assignee && (
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">
                          {task.assignee.name?.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <select value={task.status} onChange={e => updateTask.mutate({ id: task.id, status: e.target.value })}
                      className="mt-2 w-full text-xs border border-gray-100 rounded-lg px-2 py-1 bg-gray-50 outline-none">
                      {statusCols.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                    </select>
                  </div>
                ))}
                {tasksByStatus[status].length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
              <th className="text-left px-4 py-3">Task</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Priority</th>
              <th className="text-left px-4 py-3">Assignee</th>
              <th className="text-left px-4 py-3">Due</th>
            </tr></thead>
            <tbody>
              {project?.tasks?.map(task => (
                <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{task.title}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]} text-gray-700`}>{statusLabels[task.status]}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{task.assignee?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{task.dueDate ? format(new Date(task.dueDate), 'MMM d') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {project?.tasks?.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No tasks yet</p>}
        </div>
      )}

      <Modal open={showTask} onClose={() => setShowTask(false)} title="Add Task">
        <form onSubmit={handleSubmit(d => createTask.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input {...register('title', { required: true })} placeholder="Task title"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={2} placeholder="Task details..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select {...register('priority')} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white">
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <select {...register('assigneeId')} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white">
                <option value="">Unassigned</option>
                {project?.members?.map(m => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input {...register('dueDate')} type="date" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowTask(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={createTask.isPending} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-70">
              {createTask.isPending ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Member">
        <form onSubmit={invSubmit(d => addMember.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input {...invReg('email', { required: true })} type="email" placeholder="member@company.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select {...invReg('role')} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white">
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowInvite(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={addMember.isPending} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-70">
              {addMember.isPending ? 'Inviting...' : 'Invite'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
