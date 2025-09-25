'use server';

import { type Cart, type CartItem } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { randomUUID } from 'node:crypto';

import { getProductStock } from '@/features/product/data';
import { auth } from '@/lib/auth';
import { type ActionResponse } from '@/lib/types';

import { deleteCartCookie, getCartCookie, setCartCookie } from './cookie';
import {
  createGuestCart,
  createOrGetUserCartWithItems,
  createUserCart,
  deleteCart,
  deleteCartItem,
  getCartId,
  getGuestCartWithItems,
  upsertCartItem,
  upsertCartItems,
} from './data';

export async function mergeCarts(userId: string): Promise<ActionResponse> {
  const sessionId = await getCartCookie();

  if (!sessionId) {
    return { isSuccess: true };
  }

  const guestCart = await getGuestCartWithItems(sessionId);

  if (!guestCart) {
    await deleteCartCookie();
    return { isSuccess: true };
  }

  if (guestCart.items.length === 0) {
    await deleteCart(guestCart.id);
    await deleteCartCookie();
    return { isSuccess: true };
  }

  const userCart = await createOrGetUserCartWithItems(userId);
  const mergedCartItems = Object.values(
    [...userCart.items, ...guestCart.items].reduce<
      Record<CartItem['productId'], Omit<CartItem, 'id'>>
    >((items, item) => {
      const existingItem = items[item.product.id];
      const clampedQuantity = Math.min(
        item.quantity + (existingItem?.quantity ?? 0),
        item.product.stock,
      );
      const earliestCreatedAt =
        existingItem && existingItem.createdAt < item.createdAt ?
          existingItem.createdAt
        : item.createdAt;

      return {
        ...items,
        [item.product.id]: {
          cartId: userCart.id,
          createdAt: earliestCreatedAt,
          productId: item.product.id,
          quantity: clampedQuantity,
        },
      };
    }, {}),
  );

  await upsertCartItems(mergedCartItems);
  await deleteCart(guestCart.id);
  await deleteCartCookie();
  revalidatePath('/');

  return { isSuccess: true };
}

export async function setCartItem(productId: number, quantity: number): Promise<ActionResponse> {
  const cartId: Cart['id'] = (await getCartId()) ?? (await createCart());

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

async function createCart(): Promise<Cart['id']> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (userId) {
    const cartId = await createUserCart(userId);
    return cartId;
  }

  const sessionId = randomUUID();
  const cartId = await createGuestCart(sessionId);
  await setCartCookie(sessionId);

  return cartId;
}
