import { type Product } from '@prisma/client';

import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { db } from '@/lib/db';

export async function getLatestProducts(): Promise<Product[]> {
  return db.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: LATEST_PRODUCTS_LIMIT,
  });
}

export async function getProductBySlug(slug: Product['slug']): Promise<Product | null> {
  return db.product.findUnique({
    where: { slug },
  });
}

export async function getProductStock(productId: Product['id']) {
  return await db.product.findUnique({
    select: { stock: true },
    where: { id: productId },
  });
}
