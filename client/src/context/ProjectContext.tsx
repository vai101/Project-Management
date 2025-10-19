import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as api from '../api/projectApi';
import { IProject, ITask, ITaskGroup, TaskStatus } from '../types/models';

interface ProjectContextType {
    projects: IProject[];
    selectedProject: IProject | null;
    currentTasks: ITaskGroup;
    isLoading: boolean;
    error: string | null;
    selectProject: (projectId: string) => void;
    addProject: (name: string, description: string) => Promise<void>;
    deleteProject: (projectId: string) => Promise<void>;
    addTask: (title: string, description: string) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    handleDragEnd: (source: { droppableId: TaskStatus; index: number }, destination: { droppableId: TaskStatus; index: number } | null, draggableId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjectContext must be used within a ProjectProvider');
    }
    return context;
};

const groupTasks = (tasks: ITask[]): ITaskGroup => {
    return tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
            acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
    }, {} as ITaskGroup);
};

interface ProjectProviderProps {
    children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
    const [currentTasks, setCurrentTasks] = useState<ITaskGroup>({ 'To Do': [], 'In Progress': [], 'Done': [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            const response = await api.getProjects();
            setProjects(response.data);
        } catch (err: any) {
            console.warn('Backend not available, using demo data:', err.message);
            // Use demo data when backend is not available
            setProjects([
                {
                    _id: 'demo-1',
                    name: 'Demo Project',
                    description: 'This is a demo project to show how the application works.',
                    createdAt: new Date().toISOString()
                }
            ]);
            // Ensure currentTasks is properly initialized
            setCurrentTasks({ 'To Do': [], 'In Progress': [], 'Done': [] });
        } finally {
            setIsLoading(false);
        }
    };

    const selectProject = (projectId: string) => {
        const project = projects.find(p => p._id === projectId);
        if (project) {
            setSelectedProject(project);
        }
    };

    const addProject = async (name: string, description: string) => {
        try {
            const response = await api.createProject({ name, description });
            setProjects(prev => [...prev, response.data]);
            setSelectedProject(response.data);
        } catch (err: any) {
            console.warn('Backend not available, creating local project:', err.message);
            // Create project locally when backend is not available
            const newProject = {
                _id: `local-${Date.now()}`,
                name,
                description,
                createdAt: new Date().toISOString()
            };
            setProjects(prev => [...prev, newProject]);
            setSelectedProject(newProject);
        }
    };

    const deleteProject = async (projectId: string) => {
        try {
            await api.deleteProject(projectId);
            setProjects(prev => prev.filter(p => p._id !== projectId));
            if (selectedProject?._id === projectId) {
                setSelectedProject(null);
                setCurrentTasks({ 'To Do': [], 'In Progress': [], 'Done': [] });
            }
        } catch (err: any) {
            console.warn('Backend not available, deleting project locally:', err.message);
            // Delete project locally when backend is not available
            setProjects(prev => prev.filter(p => p._id !== projectId));
            if (selectedProject?._id === projectId) {
                setSelectedProject(null);
                setCurrentTasks({ 'To Do': [], 'In Progress': [], 'Done': [] });
            }
        }
    };

    const fetchTasks = useCallback(async (projectId: string) => {
        setIsLoading(true);
        try {
            const response = await api.getTasksByProject(projectId);
            setCurrentTasks(groupTasks(response.data));
        } catch (err) {
            console.warn('Backend not available, using empty tasks:', err);
            // Use empty tasks when backend is not available
            setCurrentTasks({ 'To Do': [], 'In Progress': [], 'Done': [] });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchTasks(selectedProject._id);
        } else {
            setCurrentTasks({ 'To Do': [], 'In Progress': [], 'Done': [] });
        }
    }, [selectedProject, fetchTasks]);

    const addTask = async (title: string, description: string) => {
        if (!selectedProject) return;
        try {
            const response = await api.createTask({
                title,
                description,
                project: selectedProject._id,
                status: 'To Do'
            });
            setCurrentTasks(prev => ({
                ...prev,
                'To Do': [...(prev['To Do'] || []), response.data]
            }));
        } catch (err: any) {
            console.warn('Backend not available, creating task locally:', err.message);
            // Create task locally when backend is not available
            const newTask = {
                _id: `task-${Date.now()}`,
                title,
                description,
                project: selectedProject._id,
                status: 'To Do' as TaskStatus,
                createdAt: new Date().toISOString()
            };
            setCurrentTasks(prev => ({
                ...prev,
                'To Do': [...(prev['To Do'] || []), newTask]
            }));
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            await api.deleteTask(taskId);
            setCurrentTasks(prev => {
                const newTasks = { ...prev };
                Object.keys(newTasks).forEach(status => {
                    newTasks[status as TaskStatus] = (newTasks[status as TaskStatus] || []).filter(task => task._id !== taskId);
                });
                return newTasks;
            });
        } catch (err: any) {
            console.warn('Backend not available, deleting task locally:', err.message);
            // Delete task locally when backend is not available
            setCurrentTasks(prev => {
                const newTasks = { ...prev };
                Object.keys(newTasks).forEach(status => {
                    newTasks[status as TaskStatus] = (newTasks[status as TaskStatus] || []).filter(task => task._id !== taskId);
                });
                return newTasks;
            });
        }
    };

    const handleDragEnd = async (source: { droppableId: TaskStatus; index: number }, destination: { droppableId: TaskStatus; index: number } | null, draggableId: string) => {
        if (!destination) return;

        // Ensure source and destination arrays exist
        const sourceTasks = [...(currentTasks[source.droppableId] || [])];
        const destTasks = [...(currentTasks[destination.droppableId] || [])];
        
        if (sourceTasks.length === 0 || source.index >= sourceTasks.length) return;
        
        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            const reorderedTasks = [...sourceTasks];
            reorderedTasks.splice(destination.index, 0, movedTask);
            
            setCurrentTasks(prev => ({
                ...prev,
                [source.droppableId]: reorderedTasks
            }));
        } else {
            destTasks.splice(destination.index, 0, { ...movedTask, status: destination.droppableId });

            setCurrentTasks(prev => ({
                ...prev,
                [source.droppableId]: sourceTasks,
                [destination.droppableId]: destTasks
            }));

            try {
                await api.updateTaskStatus(draggableId, destination.droppableId);
            } catch (err) {
                console.warn('Backend not available, task status updated locally:', err);
            }
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const value: ProjectContextType = {
        projects,
        selectedProject,
        currentTasks,
        isLoading,
        error,
        selectProject,
        addProject,
        deleteProject,
        addTask,
        deleteTask,
        handleDragEnd,
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};