import { useQuery } from '@tanstack/react-query';
import { getDashboardApi } from '../api/dashboard.api';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboardApi().then(r => r.data.data)
  });
};
