import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.deleteMany({});
  console.log('Deleted all existing users.');

  const users = [
    {
      name: 'Prateek S',
      email: 'Prateek.s@connectinfosys.com',
      role: 'Superadmin',
      passwordHash: 'A!RConnect@#$12131',
      employeeNum: 'EMP-001',
      department: 'IT',
      location: 'HQ'
    },
    {
      name: 'Vikram S',
      email: 'Vikram.s@connectinfosys.com',
      role: 'Admin',
      passwordHash: 'V!kr@m@123',
      employeeNum: 'EMP-002',
      department: 'IT',
      location: 'HQ'
    },
    {
      name: 'Shiva',
      email: 'jogijishiva1999@gmail.com',
      role: 'Inventory Manager',
      passwordHash: 'Invent.y@1',
      employeeNum: 'EMP-003',
      department: 'Inventory',
      location: 'HQ'
    },
    {
      name: 'Purchase',
      email: 'purchase@connectinfosys.com',
      role: 'Inventory Manager',
      passwordHash: 'Invent.y@0',
      employeeNum: 'EMP-004',
      department: 'Inventory',
      location: 'HQ'
    }
  ];

  for (const u of users) {
    await prisma.user.create({
      data: u
    });
  }
  console.log('Inserted new users.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
