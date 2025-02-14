import { PrismaClient } from '@prisma/client';

import { sampleData } from '@/lib/sample-data';

main();

export async function main() {
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
