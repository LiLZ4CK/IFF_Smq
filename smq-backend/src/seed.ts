import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient();
async function main() {
  await prisma.role.createMany({
    data: [
      {
        name: 'admin',
        permissions: ['CONSULT', 'EDIT', 'DOWNLOAD'],
      },
      {
        name: 'user',
        permissions: ['CONSULT', 'DOWNLOAD'],
      },
      {
        name: 'guest',
        permissions: ['DOWNLOAD'],
      },
    ],
  });

  await prisma.user.create({
    data:{
        name: process.env.NAME,
        password: await bcrypt.hash(process.env.PASS, 10),
        email: process.env.ADMIN,
        isvirified: true,
        roleName: (await prisma.role.findUnique({where:{name: 'admin'}})).name
    }
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  