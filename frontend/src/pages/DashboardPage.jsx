import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.config';
import { CheckSquare, FolderKanban, AlertTriangle, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import Spinner from '../components/ui/Spinner';

const statusColors = { TODO: 'bg-gray-100 text-gray-600 border-gray-200/60', IN_PROGRESS: 'bg-blue-50 text-blue-600 border-blue-100/60', IN_REVIEW: 'bg-yellow-50 text-yellow-600 border-yellow-100/60', DONE: 'bg-green-50 text-green-600 border-green-100/60' };

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then(r => r.data.data)
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const stats = [
    { label: 'Total Projects', value: data?.stats?.totalProjects ?? 0, icon: FolderKanban, gradient: 'from-indigo-500 to-indigo-600' },
    { label: 'Active Projects', value: data?.stats?.activeProjects ?? 0, icon: TrendingUp, gradient: 'from-emerald-400 to-emerald-600' },
    { label: 'Total Tasks', value: data?.stats?.totalTasks ?? 0, icon: CheckSquare, gradient: 'from-blue-500 to-blue-600' },
    { label: 'Overdue Tasks', value: data?.stats?.overdueCount ?? 0, icon: AlertTriangle, gradient: 'from-rose-500 to-rose-600' }
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            Workspace Dashboard <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
          </h1>
          <p className="text-gray-500 text-sm mt-1">Real-time team analytics, status, and activity overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, gradient }) => (
          <div key={label} className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 tracking-wide">{label}</span>
              <div className={`w-11 h-11 bg-gradient-to-tr ${gradient} rounded-xl flex items-center justify-center shadow-md transform transition duration-300 group-hover:rotate-6`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" /> Overdue Attention Required
            </h2>
            {data?.overdueTasks?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3 text-lg font-bold">✓</div>
                <p className="text-gray-500 font-medium">All clear! No overdue tasks at the moment.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {data?.overdueTasks?.map(task => (
                  <div key={task.id} className="flex items-start justify-between p-4 bg-rose-50/40 border border-rose-100/40 rounded-xl hover:bg-rose-50/60 transition duration-200">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.project?.color || '#6366f1' }} />
                        {task.project?.name}
                      </p>
                    </div>
                    <span className="text-xs text-rose-600 font-bold bg-rose-50/80 px-2.5 py-1 rounded-lg border border-rose-100/60 flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No due'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Latest Workspace Updates</h2>
          {data?.recentTasks?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
              <Clock className="w-10 h-10 stroke-[1.5] mb-2" />
              <p className="text-sm">No recent activity detected.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {data?.recentTasks?.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3.5 bg-gray-50/40 border border-gray-100/40 rounded-xl hover:bg-gray-50/80 transition duration-200">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-bold text-gray-800 truncate">{task.title}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.project?.color || '#cbd5e1' }} />
                      {task.project?.name}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-xl font-bold border border-transparent whitespace-nowrap ${statusColors[task.status]}`}>{task.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

