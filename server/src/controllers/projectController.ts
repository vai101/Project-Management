import type { Request, Response, NextFunction } from 'express';
import ProjectModel from '../models/Project.js';
import TaskModel from '../models/Task.js';
import { getProjectSummary as generateProjectSummary } from '../services/aiService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { projectSchema } from '../utils/joiValidation.js';

export const createProject = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0]?.message ?? 'Validation failed.';
        return res.status(400).json({ message: errorMessage });
    }

    const { name, description } = value;

    const project = new ProjectModel({ name, description });
    const savedProject = await project.save();

    res.status(201).json(savedProject);
});

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    res.json(projects);
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
    const project = await ProjectModel.findById(req.params.id);
    
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0]?.message ?? 'Validation failed.';
        return res.status(400).json({ message: errorMessage });
    }

    const { name, description } = value;

    const project = await ProjectModel.findByIdAndUpdate(
        req.params.id,
        { name, description },
        { new: true, runValidators: true }
    );

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
    const project = await ProjectModel.findById(req.params.id);
    
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    await TaskModel.deleteMany({ project: req.params.id });
    await ProjectModel.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project and all associated tasks deleted successfully' });
});

export const getProjectSummary = asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;
    
    const project = await ProjectModel.findById(projectId);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await TaskModel.find({ project: projectId, deletedAt: null });
    
    const summary = await generateProjectSummary(project, tasks);
    
    res.json({ summary });
});