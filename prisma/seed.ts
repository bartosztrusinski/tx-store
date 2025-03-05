import { PrismaClient } from '@prisma/client';
import { sampleData } from '@/lib/sample-data';

seed();

async function seed() {
  const prisma = new PrismaClient();
  const { products } = sampleData;

  try {
    await prisma.product.deleteMany();
    await prisma.product.createMany({
      data: products,
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
