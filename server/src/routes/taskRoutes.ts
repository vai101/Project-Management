import { Router } from 'express';

import { 
    getTasksByProject, 
    getTaskById, 
    createTask, 
    updateTask, 
    deleteTask,
    updateTaskStatus,
    askAi
} from '../controllers/taskController.js';

const router = Router();

router.route('/project/:projectId').get(getTasksByProject);
router.route('/').post(createTask);
router.post('/ask', askAi);    

router.route('/:id')
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

router.put('/:id/status', updateTaskStatus); 

export default router;