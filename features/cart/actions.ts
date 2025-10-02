'use server';

import { type CartItem } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { getProductById } from '@/features/product/data';
import { getCurrentUser } from '@/lib/auth';
import { dbPool } from '@/lib/db';
import { type ActionResponse } from '@/lib/types';

import {
  deleteCartItem,
  getOrCreateCurrentUserCart,
  getOrCreateGuestCart,
  upsertCartItem,
} from './data';

export async function setCartItem(
  productId: CartItem['productId'],
  quantity: CartItem['quantity'],
  path: string,
): Promise<ActionResponse> {
  return await dbPool.$transaction(async (tx) => {
    const currentUser = await getCurrentUser();
    const cartId =
      currentUser ? await getOrCreateCurrentUserCart(tx) : await getOrCreateGuestCart(tx);

    if (quantity <= 0) {
      await deleteCartItem({ cartId_productId: { cartId, productId } }, tx);
      revalidatePath(path);
      return { isSuccess: true };
    }

    const product = await getProductById(productId, { stock: true }, tx);

    if (!product) {
      return { isSuccess: false, message: 'Product not found' };
    }

    if (product.stock < quantity) {
      return { isSuccess: false, message: 'Not enough stock available' };
    }

    await upsertCartItem({ cartId, productId, quantity }, tx);
    revalidatePath(path);
    return { isSuccess: true };
  });
}
