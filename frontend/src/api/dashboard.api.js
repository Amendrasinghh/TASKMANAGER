import api from './axios.config';

export const getDashboardApi = () => api.get('/dashboard');
