import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios.config';
import toast from 'react-hot-toast';
import { Plus, FolderKanban, ChevronRight, Users, Sparkles } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';

const statusColors = { ACTIVE: 'bg-green-50 text-green-600 border-green-100/60', ON_HOLD: 'bg-yellow-50 text-yellow-600 border-yellow-100/60', COMPLETED: 'bg-blue-50 text-blue-600 border-blue-100/60', ARCHIVED: 'bg-gray-100 text-gray-700 border-gray-200/60' };

export default function ProjectsPage() {
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { color: '#6366f1' } });

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data.data.projects)
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/projects', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project created'); setShowCreate(false); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed')
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            Team Projects <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
          </h1>
          <p className="text-gray-500 text-sm mt-1">{data?.length ?? 0} active & archived projects</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-tr from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-md shadow-indigo-100 transition duration-300 hover:scale-[1.02] transform">
          <Plus className="w-4 h-4 stroke-[2.5]" /> Create Project
        </button>
      </div>

      {data?.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl">
          <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-[1.5]" />
          <p className="text-gray-500 font-medium text-sm">No projects started yet. Create one to begin!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data?.map(project => (
            <Link key={project.id} to={`/projects/${project.id}`}
              className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-200/80 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 relative flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/20 shadow-sm" style={{ backgroundColor: project.color + '20' }}>
                      <div className="w-4 h-4 rounded-md shadow-sm" style={{ backgroundColor: project.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-base tracking-tight">{project.name}</h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase border border-transparent mt-1 inline-block ${statusColors[project.status]}`}>{project.status}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition duration-300" />
                </div>
                {project.description && <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-2 border-t border-gray-50 pt-3">
                <span className="flex items-center gap-1.5 font-medium"><Users className="w-3.5 h-3.5" /> {project.members?.length ?? 0} members</span>
                <span className="font-medium bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100/50">{project._count?.tasks ?? 0} tasks</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Project">
        <form onSubmit={handleSubmit(d => createMutation.mutate(d))} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Project Title *</label>
            <input {...register('name', { required: true })} placeholder="e.g. Website Redesign"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition duration-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Brief Description</label>
            <textarea {...register('description')} rows={3} placeholder="Provide a summary of the goals..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none resize-none transition duration-200" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Launch Date</label>
              <input {...register('dueDate')} type="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 outline-none transition duration-200" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Label Color</label>
              <input {...register('color')} type="color" className="w-16 h-12 p-1 border border-gray-200 bg-white rounded-xl cursor-pointer" />
            </div>
          </div>
          <div className="flex gap-4 pt-3">
            <button type="button" onClick={() => setShowCreate(false)}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition duration-200">Cancel</button>
            <button type="submit" disabled={createMutation.isPending}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition disabled:opacity-70">
              {createMutation.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

