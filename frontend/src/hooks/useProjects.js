import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectsApi, getProjectApi, createProjectApi, updateProjectApi, deleteProjectApi } from '../api/project.api';
import toast from 'react-hot-toast';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjectsApi().then(r => r.data.data.projects)
  });
};

export const useProject = (id) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectApi(id).then(r => r.data.data.project),
    enabled: !!id
  });
};

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project created'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create project')
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => updateProjectApi(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project updated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update project')
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project deleted'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete project')
  });
};
