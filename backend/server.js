import 'dotenv/config';
import app from './src/app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

async function main() {
  await prisma.$connect();
  console.log('✅ Database connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

main().catch((err) => {
  console.error('❌ Server startup failed:', err);
  process.exit(1);
});
