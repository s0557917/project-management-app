import { PrismaClient } from '@prisma/client';

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
  console.log("PROD PRISMA", prisma);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    console.log("DEV PRISMA", global.prisma);
  }
  prisma = global.prisma;
}
console.log("---SET PRISMA", prisma);
export default prisma;