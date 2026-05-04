import { Link } from 'react-router-dom';
import { ChevronRight, Users } from 'lucide-react';

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-700',
  ON_HOLD: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  ARCHIVED: 'bg-gray-100 text-gray-700'
};

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-200 hover:shadow-md transition group block">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: project.color + '20' }}>
            <div className="w-4 h-4 rounded-md" style={{ backgroundColor: project.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition">{project.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>{project.status}</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition" />
      </div>
      {project.description && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {project.members?.length ?? 0} members</span>
        <span>{project._count?.tasks ?? 0} tasks</span>
      </div>
    </Link>
  );
}
