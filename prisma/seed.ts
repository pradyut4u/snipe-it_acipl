import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PREDEFINED_ACCOUNTS } from '../src/data/authAccounts';


const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Users...');
  for (const account of PREDEFINED_ACCOUNTS) {
    await prisma.user.create({
      data: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        employeeNum: account.employeeNum,
        department: account.department,
        location: account.location,
        avatarUrl: account.avatarUrl,
        passwordHash: account.passwordHash,
      },
    });
  }



  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
