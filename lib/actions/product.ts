'use server';

import type { Product } from '@prisma/client';

import prisma from '@/lib/prisma';
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';

export async function getLatestProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });
}
