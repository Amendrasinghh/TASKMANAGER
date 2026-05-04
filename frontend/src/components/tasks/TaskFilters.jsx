import { Filter } from 'lucide-react';

export default function TaskFilters({ filters, onChange }) {
  return (
    <div className="flex gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <select value={filters.status || ''} onChange={e => onChange({ ...filters, status: e.target.value })}
          className="text-sm outline-none bg-transparent text-gray-600">
          <option value="">All Status</option>
          {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
        <select value={filters.priority || ''} onChange={e => onChange({ ...filters, priority: e.target.value })}
          className="text-sm outline-none bg-transparent text-gray-600">
          <option value="">All Priority</option>
          {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
