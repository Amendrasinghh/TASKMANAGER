import { useForm } from 'react-hook-form';

export default function ProjectForm({ onSubmit, loading, defaultValues = {} }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { color: '#6366f1', ...defaultValues }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input {...register('name', { required: true })} placeholder="Project name"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea {...register('description')} rows={3} placeholder="What is this project about?"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none" />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input {...register('dueDate')} type="date"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input {...register('color')} type="color" className="w-16 h-10 border border-gray-200 rounded-xl cursor-pointer" />
        </div>
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-70">
        {loading ? 'Saving...' : 'Save Project'}
      </button>
    </form>
  );
}
