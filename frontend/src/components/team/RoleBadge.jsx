import { Shield, User } from 'lucide-react';

export default function RoleBadge({ role }) {
  const isAdmin = role === 'ADMIN';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
      {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
      {role}
    </span>
  );
}
