import { useForm } from 'react-hook-form';
import { UserPlus } from 'lucide-react';

export default function InviteMember({ onSubmit, loading }) {
  const { register, handleSubmit, reset } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input {...register('email', { required: true })} type="email" placeholder="member@company.com"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select {...register('role')} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white">
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-70">
        <UserPlus className="w-4 h-4" />
        {loading ? 'Inviting...' : 'Invite Member'}
      </button>
    </form>
  );
}
