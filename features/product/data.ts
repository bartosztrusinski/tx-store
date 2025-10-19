import 'server-only';
import { type Prisma, type Product } from '@prisma/client';

import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { db, type DbClient } from '@/lib/db';

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
