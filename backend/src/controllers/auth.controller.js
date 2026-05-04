import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt.utils.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

const prisma = new PrismaClient();

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return sendError(res, 409, 'Email already registered');

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role === 'ADMIN' ? 'ADMIN' : 'MEMBER' },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    const token = generateToken(user.id);
    sendSuccess(res, 201, 'Account created', { user, token });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return sendError(res, 401, 'Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return sendError(res, 401, 'Invalid credentials');

    const { password: _, ...safeUser } = user;
    const token = generateToken(user.id);
    sendSuccess(res, 200, 'Login successful', { user: safeUser, token });
  } catch (err) { next(err); }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true }
    });
    sendSuccess(res, 200, 'Profile fetched', { user });
  } catch (err) { next(err); }
};
