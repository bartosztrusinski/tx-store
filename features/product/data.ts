import 'server-only';

import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { db, type DbClient } from '@/lib/db';
import { type Prisma, type Product } from '@/lib/generated/prisma/client';

type Select = Prisma.ProductSelect;

export async function getLatestProducts<T extends Select>(select: T, dbClient: DbClient = db) {
  return await dbClient.product.findMany({
    orderBy: { createdAt: 'desc' },
    select,
    take: LATEST_PRODUCTS_LIMIT,
  });
}

export async function getProductBySlug<T extends Select>(
  slug: Product['slug'],
  select: T,
  dbClient: DbClient = db,
) {
  return await dbClient.product.findUnique({
    select,
    where: { slug },
  });
}
