import axios from 'axios';
import { IProject, ITask, TaskStatus } from '../types/models';

const API = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

export const getProjects = () => API.get<IProject[]>('/projects');

export const createProject = (project: { name: string, description: string }) => 
    API.post<IProject>('/projects', project);

export const updateProject = (id: string, project: Partial<IProject>) => 
    API.put<IProject>(`/projects/${id}`, project);

export const deleteProject = (id: string) => API.delete(`/projects/${id}`);

export const getProjectSummary = (id: string) => 
    API.get<{ summary: string }>(`/projects/${id}/summary`);

export const getTasksByProject = (projectId: string) => 
    API.get<ITask[]>(`/tasks/project/${projectId}`);

export const createTask = (task: Omit<ITask, '_id' | 'createdAt'>) => 
    API.post<ITask>('/tasks', task);

export const updateTask = (id: string, task: Partial<ITask>) => 
    API.put<ITask>(`/tasks/${id}`, task);

export const updateTaskStatus = (id: string, status: TaskStatus) => 
    API.put<ITask>(`/tasks/${id}/status`, { status });

export const deleteTask = (id: string) => API.delete(`/tasks/${id}`);

export const askAi = (question: string, contextId: string, contextType: 'task' | 'project') =>
    API.post<{ answer: string }>('/tasks/ask', { question, taskId: contextId, contextType });