import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`SELECT setval('"Asset_id_seq"', (SELECT MAX(id) FROM "Asset"))`);
  console.log("Sequence updated.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
