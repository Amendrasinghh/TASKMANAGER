import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-gray-100/80 px-6 py-4 flex items-center justify-between shadow-sm">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-100 transition duration-200">
        <Menu className="w-5 h-5 text-indigo-600" />
      </button>
      <div className="flex items-center gap-4 ml-auto">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-800">Hello, {user?.name?.split(' ')[0]}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role?.toLowerCase()}</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 border border-white/20 transform transition hover:scale-105 cursor-pointer">
          <span className="text-white font-bold text-sm tracking-wider">{user?.name?.slice(0, 2).toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
}

