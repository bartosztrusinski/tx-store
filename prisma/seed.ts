import { PrismaClient } from '@prisma/client';

import { users } from '@/features/auth/seed';
import { products } from '@/features/product/seed';
import { auth } from '@/lib/auth';

seed();

async function clearDatabase(prisma: PrismaClient) {
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.cartItem.deleteMany();
}

async function seed() {
  const prisma = new PrismaClient();

  try {
    await clearDatabase(prisma);
    await prisma.product.createMany({ data: products });
    await Promise.all(users.map((user) => auth.api.signUpEmail({ body: user })));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
