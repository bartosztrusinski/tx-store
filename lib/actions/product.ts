'use server';

import { type Product } from '@prisma/client';

import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

export async function getLatestProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: LATEST_PRODUCTS_LIMIT,
  });
}

export async function getProductBySlug(slug: Product['slug']): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { slug },
  });
}
