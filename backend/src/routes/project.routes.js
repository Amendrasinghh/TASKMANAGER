import { Router } from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject, addMember, removeMember } from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:projectId', getProject);
router.put('/:projectId', updateProject);
router.delete('/:projectId', requireAdmin, deleteProject);
router.post('/:projectId/members', addMember);
router.delete('/:projectId/members/:userId', removeMember);
export default router;
