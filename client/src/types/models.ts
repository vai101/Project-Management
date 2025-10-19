export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface IProject {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
}

export interface ITask {
    _id: string;
    title: string;
    description: string;
    status: TaskStatus;
    project: string;
    createdAt: string;
}

export interface ITaskGroup {
    'To Do': ITask[];
    'In Progress': ITask[];
    'Done': ITask[];
}