import api from './axios.config';

export const getProjectsApi = () => api.get('/projects');
export const getProjectApi = (id) => api.get(`/projects/${id}`);
export const createProjectApi = (data) => api.post('/projects', data);
export const updateProjectApi = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProjectApi = (id) => api.delete(`/projects/${id}`);
export const addProjectMemberApi = (id, data) => api.post(`/projects/${id}/members`, data);
export const removeProjectMemberApi = (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`);
