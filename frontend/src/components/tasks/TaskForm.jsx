import { useForm } from 'react-hook-form';

export default function TaskForm({ onSubmit, loading, members = [], defaultValues = {} }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { priority: 'MEDIUM', ...defaultValues }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {members.map(m => <option key={m.user?.id || m.id} value={m.user?.id || m.id}>{m.user?.name || m.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input {...register('dueDate')} type="date" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-70">
        {loading ? 'Saving...' : 'Save Task'}
      </button>
    </form>
  );
}
