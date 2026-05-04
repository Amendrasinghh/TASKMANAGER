import api from './axios.config';

export const getTeamApi = () => api.get('/team');
export const updateRoleApi = (userId, role) => api.patch(`/team/${userId}/role`, { role });
