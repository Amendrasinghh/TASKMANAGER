import { z } from 'zod';

export const inviteMemberSchema = z.object({
  email: z.string().email('Valid email required'),
  role: z.enum(['ADMIN', 'MEMBER']).optional()
});

export const updateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER'])
});
