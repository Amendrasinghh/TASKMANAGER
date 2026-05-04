import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('Admin@123', 12);
  const memberPass = await bcrypt.hash('Member@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskmanager.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@taskmanager.com', password: adminPass, role: 'ADMIN' }
  });

  const member = await prisma.user.upsert({
    where: { email: 'member@taskmanager.com' },
    update: {},
    create: { name: 'Jane Member', email: 'member@taskmanager.com', password: memberPass, role: 'MEMBER' }
  });

  const project = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Redesign the company website with modern UI',
      color: '#6366f1',
      ownerId: admin.id,
      members: {
        create: [
          { userId: admin.id, role: 'ADMIN' },
          { userId: member.id, role: 'MEMBER' }
        ]
      }
    }
  });

  await prisma.task.createMany({
    data: [
      { title: 'Design wireframes', status: 'DONE', priority: 'HIGH', projectId: project.id, creatorId: admin.id, assigneeId: member.id },
      { title: 'Implement homepage', status: 'IN_PROGRESS', priority: 'HIGH', projectId: project.id, creatorId: admin.id, assigneeId: member.id },
      { title: 'SEO optimization', status: 'TODO', priority: 'MEDIUM', projectId: project.id, creatorId: admin.id },
      { title: 'Performance audit', status: 'TODO', priority: 'LOW', projectId: project.id, creatorId: admin.id, dueDate: new Date(Date.now() - 86400000) }
    ]
  });

  console.log('✅ Seed completed');
}

main().catch(console.error).finally(() => prisma.$disconnect());
