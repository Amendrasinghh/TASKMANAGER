import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendError } from '../utils/response.utils.js';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return sendError(res, 401, 'No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, avatar: true }
    });

    if (!user) return sendError(res, 401, 'User not found');
    req.user = user;
    next();
  } catch (err) {
    return sendError(res, 401, 'Invalid or expired token');
  }
};
