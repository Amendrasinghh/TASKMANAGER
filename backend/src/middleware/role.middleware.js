import { PrismaClient } from '@prisma/client';
import { sendError } from '../utils/response.utils.js';

const prisma = new PrismaClient();

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return sendError(res, 403, 'Admin access required');
  }
  next();
};

export const requireProjectAccess = async (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId;

  if (req.user.role === 'ADMIN') return next();

  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId } }
  });

  if (!membership) return sendError(res, 403, 'Not a member of this project');
  req.projectRole = membership.role;
  next();
};
