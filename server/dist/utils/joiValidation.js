import Joi from 'joi';
export const projectSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required().messages({
        'string.empty': 'Project name is required.',
        'string.min': 'Project name must be at least 3 characters long.',
    }),
    description: Joi.string().trim().min(10).max(500).required().messages({
        'string.empty': 'Project description is required.',
        'string.min': 'Project description must be at least 10 characters long.',
    }),
});
export const taskSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().max(500).allow(''),
    project: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid Project ID format.',
        'string.length': 'Invalid Project ID format.',
        'any.required': 'Project ID is required for a task.',
    }),
    status: Joi.string().valid('To Do', 'In Progress', 'Done').optional(),
});
export const statusUpdateSchema = Joi.object({
    status: Joi.string().valid('To Do', 'In Progress', 'Done').required(),
});
//# sourceMappingURL=joiValidation.js.map