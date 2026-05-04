import { X } from 'lucide-react';

export default function ProjectMembers({ members = [], onRemove }) {
  return (
    <div className="space-y-2">
      {members.map(member => (
        <div key={member.id || member.user?.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-700 font-medium text-xs">{member.user?.name?.slice(0, 1)}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{member.user?.name}</p>
              <p className="text-xs text-gray-400">{member.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${member.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
              {member.role}
            </span>
            {onRemove && (
              <button onClick={() => onRemove(member.user?.id)} className="p-1 hover:bg-gray-200 rounded">
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
