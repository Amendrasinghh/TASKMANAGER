import { Shield, User } from 'lucide-react';

export default function MemberCard({ user, onRoleChange }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
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
        {onRoleChange && (
          <select value={user.role} onChange={e => onRoleChange(user.id, e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none bg-white">
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        )}
      </div>
    </div>
  );
}
