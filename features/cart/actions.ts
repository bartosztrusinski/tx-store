'use server';

import { type Cart, type CartItem } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';

import { getProductStock } from '@/features/product/data';
import { getCurrentUser } from '@/lib/auth';
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
  const cartId =
    (await getCartId({ sessionId: guestCartSessionId, userId: user?.id })) ??
    (await createCart(user?.id));

  if (quantity <= 0) {
    await deleteCartItem(cartId, productId);
    revalidatePath(path);
    return { isSuccess: true };
  }

  const product = await getProductStock(productId);

  if (!product) {
    return { isSuccess: false, message: 'Product not found' };
  }

  if (product.stock < quantity) {
    return { isSuccess: false, message: 'Not enough stock available' };
  }

  await upsertCartItem(cartId, productId, quantity);
  revalidatePath(path);
  return { isSuccess: true };
}

async function createCart(userId: Cart['userId'] | undefined): Promise<Cart['id']> {
  if (userId) {
    const cartId = await createUserCart(userId);
    return cartId;
  }

  const newSessionId = randomUUID();
  const cartId = await createGuestCart(newSessionId);
  await setGuestCartCookie(newSessionId);
  return cartId;
}
