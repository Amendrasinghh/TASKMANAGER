import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios.config';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';
import { Users, Shield, User } from 'lucide-react';

export default function TeamPage() {
  const qc = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: () => api.get('/team').then(r => r.data.data.users)
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }) => api.patch(`/team/${id}/role`, { role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team'] }); toast.success('Role updated'); }
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <p className="text-gray-500 text-sm mt-1">{users?.length ?? 0} members</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map(user => (
          <div key={user.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-700 font-semibold">{user.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded-xl">
                <p className="text-lg font-bold text-gray-900">{user._count?.assignedTasks ?? 0}</p>
                <p className="text-xs text-gray-500">Tasks</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-xl">
                <p className="text-lg font-bold text-gray-900">{user._count?.ownedProjects ?? 0}</p>
                <p className="text-xs text-gray-500">Projects</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {user.role}
              </div>
              <select value={user.role} onChange={e => updateRole.mutate({ id: user.id, role: e.target.value })}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none bg-white">
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
