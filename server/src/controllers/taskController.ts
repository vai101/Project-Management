import type { Request, Response } from 'express';
import TaskModel from '../models/Task.js';
import type { TaskStatus } from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';
import { taskSchema, statusUpdateSchema } from '../utils/joiValidation.js';
import { getTaskAnswer } from '../services/aiService.js';

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskModel.findOne({ _id: req.params.id, deletedAt: null });

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
});

export const getTasksByProject = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    
    const tasks = await TaskModel.find({ 
        project: projectId, 
        deletedAt: null 
    }).sort({ createdAt: -1 });

    res.json(tasks);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0]?.message ?? 'Validation failed.';
        return res.status(400).json({ message: errorMessage });
    }

    const { title, description, project } = value;

    const task = new TaskModel({ title, description, project });
    const savedTask = await task.save();

    res.status(201).json(savedTask);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0]?.message ?? 'Validation failed.';
        return res.status(400).json({ message: errorMessage });
    }

    const { title, description, project } = value;

    const task = await TaskModel.findOneAndUpdate(
        { _id: req.params.id, deletedAt: null },
        { title, description, project },
        { new: true, runValidators: true }
    );

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
});

export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = statusUpdateSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0]?.message ?? 'Validation failed.';
        return res.status(400).json({ message: errorMessage });
    }

    const { status } = value;

    const task = await TaskModel.findOneAndUpdate(
        { _id: req.params.id, deletedAt: null },
        { status },
        { new: true, runValidators: true }
    );

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskModel.findOne({ _id: req.params.id, deletedAt: null });

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    await TaskModel.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });

    res.json({ message: 'Task deleted successfully' });
});

export const askAi = asyncHandler(async (req: Request, res: Response) => {
    const { question, taskId, contextType } = req.body;

    if (!question || !taskId || !contextType) {
        return res.status(400).json({ message: 'Question, taskId, and contextType are required' });
    }

    const task = await TaskModel.findOne({ _id: taskId, deletedAt: null });
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const answer = await getTaskAnswer(question, task, contextType);
    
    res.json({ answer });
});