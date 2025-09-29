import { type Product } from '@prisma/client';
import { cache } from 'react';

import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { db, type DbClient } from '@/lib/db';

export const getLatestProducts = cache(async (dbClient: DbClient = db) => {
  return await dbClient.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: LATEST_PRODUCTS_LIMIT,
  });
});

export const getProductBySlug = cache(async (slug: Product['slug'], dbClient: DbClient = db) => {
  return await dbClient.product.findUnique({
    where: { slug },
  });
});

export const getProductStock = cache(async (productId: Product['id'], dbClient: DbClient = db) => {
  return await dbClient.product.findUnique({
    select: { stock: true },
    where: { id: productId },
  });
});
