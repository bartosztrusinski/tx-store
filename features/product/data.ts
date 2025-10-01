import { type Prisma, type Product } from '@prisma/client';
import { cache } from 'react';

import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { db, type DbClient } from '@/lib/db';

export const getLatestProducts = cache(
  async <T extends Prisma.ProductSelect>(
    select: T,
    dbClient: DbClient = db,
  ): Promise<Prisma.ProductGetPayload<{ select: T }>[]> =>
    await dbClient.product.findMany({
      orderBy: { createdAt: 'desc' },
      select,
      take: LATEST_PRODUCTS_LIMIT,
    }),
);

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
