import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut, X, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden transition-all" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 ring-2 ring-white transform transition duration-300 hover:rotate-12">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TaskFlow</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100/50">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-indigo-50/80 backdrop-blur-sm text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'}`}>
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/team"
              className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-indigo-50/80 backdrop-blur-sm text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'}`}>
              <Users className="w-5 h-5" />
              Team
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100/60 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100/60 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-indigo-600 font-bold text-sm">{user?.name?.slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
              <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium text-[10px] tracking-wide uppercase border border-indigo-100/40">{user?.role}</span>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-red-500 bg-white hover:bg-red-50 border border-red-100/40 rounded-xl transition-all hover:text-red-600 hover:shadow-sm">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

