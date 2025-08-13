import { PrismaClient } from '@prisma/client';

import { auth } from '@/lib/auth';
import { sampleData } from '@/lib/sample-data';

seed();

async function seed() {
  const prisma = new PrismaClient();
  const { products, users } = sampleData;

  try {
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verification.deleteMany();

    await prisma.product.createMany({ data: products });
    await Promise.all(users.map((user) => auth.api.signUpEmail({ body: user })));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
