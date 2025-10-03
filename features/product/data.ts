import 'server-only';
import { type Prisma, type Product } from '@prisma/client';
import { cache } from 'react';

import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { db, type DbClient } from '@/lib/db';

type Select = Prisma.ProductSelect;

export const getLatestProducts = cache(
  async <T extends Select>(select: T, dbClient: DbClient = db) =>
    await dbClient.product.findMany({
      orderBy: { createdAt: 'desc' },
      select,
      take: LATEST_PRODUCTS_LIMIT,
    }),
);

export const getProductBySlug = cache(
  async <T extends Select>(slug: Product['slug'], select: T, dbClient: DbClient = db) =>
    await dbClient.product.findUnique({
      select,
      where: { slug },
    }),
);

export const getProductById = cache(
  async <T extends Select>(id: Product['id'], select: T, dbClient: DbClient = db) =>
    await dbClient.product.findUnique({
      select,
      where: { id },
    }),
);
