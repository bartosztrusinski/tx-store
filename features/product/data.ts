import { type Product } from '@prisma/client';
import { cache } from 'react';

import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { db } from '@/lib/db';

export const getLatestProducts = cache(async () => {
  return await db.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: LATEST_PRODUCTS_LIMIT,
  });
});

export const getProductBySlug = cache(async (slug: Product['slug']) => {
  return await db.product.findUnique({
    where: { slug },
  });
});

export const getProductStock = cache(async (productId: Product['id']) => {
  return await db.product.findUnique({
    select: { stock: true },
    where: { id: productId },
  });
});
