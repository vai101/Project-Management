import { Router } from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject, getProjectSummary } from '../controllers/projectController.js';
const router = Router();
router.route('/').get(getProjects).post(createProject);
router.route('/:id')
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);
router.get('/:id/summary', getProjectSummary);
export default router;
//# sourceMappingURL=projectRoutes.js.map