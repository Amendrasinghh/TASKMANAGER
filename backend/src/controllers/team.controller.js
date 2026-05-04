import { PrismaClient } from '@prisma/client';
import { sendSuccess } from '../utils/response.utils.js';

const prisma = new PrismaClient();

export const getTeam = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true, avatar: true, createdAt: true,
        _count: { select: { assignedTasks: true, ownedProjects: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
    sendSuccess(res, 200, 'Team fetched', { users });
  } catch (err) { next(err); }
};

export const updateRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    sendSuccess(res, 200, 'Role updated', { user });
  } catch (err) { next(err); }
};
