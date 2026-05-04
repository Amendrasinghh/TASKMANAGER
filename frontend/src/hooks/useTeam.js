import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeamApi, updateRoleApi } from '../api/team.api';
import toast from 'react-hot-toast';

export const useTeam = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: () => getTeamApi().then(r => r.data.data.users)
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => updateRoleApi(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team'] }); toast.success('Role updated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update role')
  });
};
