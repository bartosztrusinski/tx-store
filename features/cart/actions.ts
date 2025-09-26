'use server';

import { type Cart, type CartItem } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { randomUUID } from 'node:crypto';

import { getProductStock } from '@/features/product/data';
import { auth } from '@/lib/auth';
import { type ActionResponse } from '@/lib/types';

import { getCartCookie, setCartCookie } from './cookie';
import { createGuestCart, createUserCart, deleteCartItem, getCartId, upsertCartItem } from './data';

export async function setCartItem(
  productId: CartItem['productId'],
  quantity: CartItem['quantity'],
): Promise<ActionResponse> {
  const sessionId = await getCartCookie();
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ?? null;
  const cartId = (await getCartId({ sessionId, userId })) ?? (await createCart(userId));

  if (quantity <= 0) {
    await deleteCartItem(cartId, productId);
    revalidatePath('/');
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
  revalidatePath('/');
  return { isSuccess: true };
}

async function createCart(userId: Cart['userId']): Promise<Cart['id']> {
  if (userId) {
    const cartId = await createUserCart(userId);
    return cartId;
  }

  const newSessionId = randomUUID();
  const cartId = await createGuestCart(newSessionId);
  await setCartCookie(newSessionId);
  return cartId;
}
