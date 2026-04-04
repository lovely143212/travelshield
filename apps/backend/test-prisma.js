const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  try {
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    await prisma.$connect();
    console.log('Connected successfully!');
    await prisma.$disconnect();
  } catch (e) {
    console.error('Connection failed:', e);
  }
}

main();
