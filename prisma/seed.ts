import { PrismaNeon } from '@prisma/adapter-neon';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { users } from '@/features/auth/seed';
import { products } from '@/features/product/seed';
import { PrismaClient } from '@/lib/generated/prisma/client';

const adapter = new PrismaNeon({ connectionString: process.env.DB_URL });
const db = new PrismaClient({ adapter });

const auth = betterAuth({
  database: prismaAdapter(db, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
});

await seed();

async function resetDatabase() {
  await db.user.deleteMany();
  await db.account.deleteMany();
  await db.session.deleteMany();
  await db.verification.deleteMany();
  await db.product.deleteMany();
  await db.cart.deleteMany();
  await db.cartItem.deleteMany();
}

async function seed() {
  try {
    await resetDatabase();
    await db.product.createMany({ data: products });
    await Promise.all(users.map((user) => auth.api.signUpEmail({ body: user })));
  } catch (error) {
    console.error(error);
  } finally {
    await db.$disconnect();
  }
}
