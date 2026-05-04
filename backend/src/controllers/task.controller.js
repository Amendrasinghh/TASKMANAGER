import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response.utils.js';

const prisma = new PrismaClient();

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, assigneeId, projectId, dueDate } = req.body;
    const task = await prisma.task.create({
      data: {
        title, description, priority,
        assigneeId: assigneeId || null,
        projectId,
        creatorId: req.user.id,
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        creator: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, color: true } }
      }
    });
    sendSuccess(res, 201, 'Task created', { task });
  } catch (err) { next(err); }
};

export const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority, assigneeId } = req.query;
    const where = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;

    if (req.user.role !== 'ADMIN') {
      where.project = { members: { some: { userId: req.user.id } } };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        creator: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, color: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    sendSuccess(res, 200, 'Tasks fetched', { tasks });
  } catch (err) { next(err); }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        creator: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, color: true } },
        tags: true
      }
    });
    if (!task) return sendError(res, 404, 'Task not found');
    sendSuccess(res, 200, 'Task fetched', { task });
  } catch (err) { next(err); }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assigneeId, dueDate } = req.body;
    const data = { title, description, status, priority, assigneeId, dueDate: dueDate ? new Date(dueDate) : undefined };
    if (status === 'DONE') data.completedAt = new Date();
    else if (status && status !== 'DONE') data.completedAt = null;

    const task = await prisma.task.update({
      where: { id: req.params.taskId },
      data,
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        creator: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, color: true } }
      }
    });
    sendSuccess(res, 200, 'Task updated', { task });
  } catch (err) { next(err); }
};

export const deleteTask = async (req, res, next) => {
  try {
    await prisma.task.delete({ where: { id: req.params.taskId } });
    sendSuccess(res, 200, 'Task deleted');
  } catch (err) { next(err); }
};
