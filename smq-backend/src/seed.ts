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
        name: process.env.ADMIN,
        password: await bcrypt.hash(process.env.PASS, 10),
        email: process.env.ADMIN,
        isvirified: true,
        roleId: (await prisma.role.findUnique({where:{name: 'admin'}})).id
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
  