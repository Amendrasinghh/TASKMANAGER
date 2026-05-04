import { PrismaClient } from '@prisma/client';
import { sendSuccess } from '../utils/response.utils.js';

const prisma = new PrismaClient();

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const projectWhere = isAdmin ? {} : { members: { some: { userId } } };
    const taskWhere = isAdmin ? {} : { project: { members: { some: { userId } } } };

    const [
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      myTasks,
      recentTasks
    ] = await Promise.all([
      prisma.project.count({ where: projectWhere }),
      prisma.project.count({ where: { ...projectWhere, status: 'ACTIVE' } }),
      prisma.task.count({ where: taskWhere }),
      prisma.task.count({ where: { ...taskWhere, status: 'DONE' } }),
      prisma.task.findMany({
        where: {
          ...taskWhere,
          dueDate: { lt: new Date() },
          status: { not: 'DONE' }
        },
        include: {
          assignee: { select: { id: true, name: true, avatar: true } },
          project: { select: { id: true, name: true, color: true } }
        },
        orderBy: { dueDate: 'asc' },
        take: 5
      }),
      prisma.task.findMany({
        where: { ...taskWhere, assigneeId: userId, status: { not: 'DONE' } },
        include: { project: { select: { id: true, name: true, color: true } } },
        orderBy: { dueDate: 'asc' },
        take: 5
      }),
      prisma.task.findMany({
        where: taskWhere,
        include: {
          assignee: { select: { id: true, name: true, avatar: true } },
          project: { select: { id: true, name: true, color: true } },
          creator: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      where: taskWhere,
      _count: { status: true }
    });

    sendSuccess(res, 200, 'Dashboard data', {
      stats: { totalProjects, activeProjects, totalTasks, completedTasks, overdueCount: overdueTasks.length },
      overdueTasks,
      myTasks,
      recentTasks,
      tasksByStatus
    });
  } catch (err) { next(err); }
};
