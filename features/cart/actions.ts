'use server';

import { type Cart, type CartItem } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';

import { getProductStock } from '@/features/product/data';
import { getCurrentUser } from '@/lib/auth';
import { type DbClient, dbPool } from '@/lib/db';
import { type ActionResponse } from '@/lib/types';

import { getGuestCartCookie, setGuestCartCookie } from './cookie';
import { createGuestCart, createUserCart, deleteCartItem, getCartId, upsertCartItem } from './data';

export async function setCartItem(
  productId: CartItem['productId'],
  quantity: CartItem['quantity'],
  path: string,
): Promise<ActionResponse> {
  const guestCartSessionId = await getGuestCartCookie();
  const user = await getCurrentUser();

  return await dbPool.$transaction(async (tx) => {
    const cartId =
      (await getCartId({ sessionId: guestCartSessionId, userId: user?.id }, tx)) ??
      (await createCart(user?.id, tx));

    if (quantity <= 0) {
      await deleteCartItem(cartId, productId, tx);
      revalidatePath(path);
      return { isSuccess: true };
    }

    const product = await getProductStock(productId, tx);

    if (!product) {
      return { isSuccess: false, message: 'Product not found' };
    }

    if (product.stock < quantity) {
      return { isSuccess: false, message: 'Not enough stock available' };
    }

    await upsertCartItem(cartId, productId, quantity, tx);
    revalidatePath(path);
    return { isSuccess: true };
  });
}

async function createCart(
  userId: Cart['userId'] | undefined,
  dbClient: DbClient,
): Promise<Cart['id']> {
  if (userId) {
    const cartId = await createUserCart(userId, dbClient);
    return cartId;
  }

  const newSessionId = randomUUID();
  const cartId = await createGuestCart(newSessionId, dbClient);
  await setGuestCartCookie(newSessionId);
  return cartId;
}
