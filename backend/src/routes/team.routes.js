import { Router } from 'express';
import { getTeam, updateRole } from '../controllers/team.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/', getTeam);
router.patch('/:userId/role', requireAdmin, updateRole);
export default router;
