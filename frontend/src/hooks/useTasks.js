import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasksApi, getTaskApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../api/task.api';
import toast from 'react-hot-toast';

export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => getTasksApi(filters).then(r => r.data.data.tasks)
  });
};

export const useTask = (id) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskApi(id).then(r => r.data.data.task),
    enabled: !!id
  });
};

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTaskApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); qc.invalidateQueries({ queryKey: ['project'] }); toast.success('Task created'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create task')
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => updateTaskApi(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); qc.invalidateQueries({ queryKey: ['project'] }); toast.success('Task updated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update task')
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); qc.invalidateQueries({ queryKey: ['project'] }); toast.success('Task deleted'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete task')
  });
};
