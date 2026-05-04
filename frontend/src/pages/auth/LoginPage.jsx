import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../../api/axios.config';
import { useAuth } from '../../contexts/AuthContext';
import { CheckSquare, Mail, Lock, Loader2 } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required')
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.data.user, res.data.data.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
          <p className="text-gray-500 mt-2">Sign in to your workspace</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('email')} type="email" placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('password')} type="password" placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm" />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-3">
            <p className="text-xs font-medium text-gray-500">Demo credentials:</p>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                <span className="truncate">Admin Email: admin@taskmanager.com</span>
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText('admin@taskmanager.com'); toast.success('Admin email copied'); }}
                  className="text-indigo-600 font-medium hover:underline ml-2 flex-shrink-0"
                >
                  Copy
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                <span className="truncate">Admin Password: Admin@123</span>
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText('Admin@123'); toast.success('Admin password copied'); }}
                  className="text-indigo-600 font-medium hover:underline ml-2 flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                <span className="truncate">Member Email: member@taskmanager.com</span>
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText('member@taskmanager.com'); toast.success('Member email copied'); }}
                  className="text-indigo-600 font-medium hover:underline ml-2 flex-shrink-0"
                >
                  Copy
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                <span className="truncate">Member Password: Member@123</span>
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText('Member@123'); toast.success('Member password copied'); }}
                  className="text-indigo-600 font-medium hover:underline ml-2 flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account? <Link to="/signup" className="text-indigo-600 font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
