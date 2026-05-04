import 'dotenv/config';
console.log('🚀 Starting server.js script...');
import app from './src/app.js';
import { PrismaClient } from '@prisma/client';

console.log('🚀 Initializing PrismaClient...');
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

async function main() {
  console.log('🚀 Connecting to database...');
  await prisma.$connect();
  console.log('✅ Database connected');
  app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
}

main().catch((err) => {
  console.error('❌ Server startup failed:', err);
  process.exit(1);
});
