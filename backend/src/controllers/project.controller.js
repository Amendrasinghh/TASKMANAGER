import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response.utils.js';

const prisma = new PrismaClient();

export const createProject = async (req, res, next) => {
  try {
    const { name, description, color, dueDate } = req.body;
    const project = await prisma.project.create({
      data: {
        name, description, color, dueDate: dueDate ? new Date(dueDate) : null,
        ownerId: req.user.id,
        members: { create: { userId: req.user.id, role: 'ADMIN' } }
      },
      include: { owner: { select: { id: true, name: true, email: true } }, members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } } }
    });
    sendSuccess(res, 201, 'Project created', { project });
  } catch (err) { next(err); }
};

export const getProjects = async (req, res, next) => {
  try {
    const where = req.user.role === 'ADMIN'
      ? {}
      : { members: { some: { userId: req.user.id } } };

    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        _count: { select: { tasks: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    sendSuccess(res, 200, 'Projects fetched', { projects });
  } catch (err) { next(err); }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.projectId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, avatar: true } },
            creator: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!project) return sendError(res, 404, 'Project not found');
    sendSuccess(res, 200, 'Project fetched', { project });
  } catch (err) { next(err); }
};

export const updateProject = async (req, res, next) => {
  try {
    const { name, description, status, color, dueDate } = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.projectId },
      data: { name, description, status, color, dueDate: dueDate ? new Date(dueDate) : undefined }
    });
    sendSuccess(res, 200, 'Project updated', { project });
  } catch (err) { next(err); }
};

export const deleteProject = async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: req.params.projectId } });
    sendSuccess(res, 200, 'Project deleted');
  } catch (err) { next(err); }
};

export const addMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) return sendError(res, 404, 'User not found');

    const member = await prisma.projectMember.create({
      data: { userId: userToAdd.id, projectId: req.params.projectId, role: role || 'MEMBER' },
      include: { user: { select: { id: true, name: true, email: true } } }
    });
    sendSuccess(res, 201, 'Member added', { member });
  } catch (err) { next(err); }
};

export const removeMember = async (req, res, next) => {
  try {
    await prisma.projectMember.delete({
      where: { userId_projectId: { userId: req.params.userId, projectId: req.params.projectId } }
    });
    sendSuccess(res, 200, 'Member removed');
  } catch (err) { next(err); }
};
