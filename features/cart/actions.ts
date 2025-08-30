'use server';

import { type Cart } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { randomUUID } from 'node:crypto';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function setCartItem(productId: number, quantity: number) {
  const cartId = await getCartId();

  if (!cartId) {
    return {
      message: 'Cart not found',
      success: false,
    };
  }

  revalidatePath('/');

  if (quantity === 0) {
    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    });

    return { success: true };
  }

  await prisma.cartItem.upsert({
    create: { cartId, productId, quantity },
    update: { quantity },
    where: { cartId_productId: { cartId, productId } },
  });

  return { success: true };
}

async function createGuestCart(): Promise<Cart['id']> {
  const sessionId = randomUUID();
  const newCart = await prisma.cart.create({
    data: { sessionId },
  });

  cookieStore.set('cartId', sessionId);

  return newCart.id;
}

async function createUserCart(userId: Cart['userId']): Promise<Cart['id']> {
  const newCart = await prisma.cart.create({
    data: { userId },
  });

  return newCart.id;
}

async function findGuestCartId(sessionId: string): Promise<Cart['id'] | null> {
  const cart = await prisma.cart.findUnique({
    select: { id: true },
    where: { sessionId },
  });

  return cart?.id ?? null;
}

async function findUserCartId(userId: string): Promise<Cart['id'] | null> {
  const cart = await prisma.cart.findUnique({
    select: { id: true },
    where: { userId },
  });

  return cart?.id ?? null;
}

async function getCartId(): Promise<Cart['id'] | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('cartId')?.value;

  if (userId) {
    const cartId = await findUserCartId(userId);
    return cartId ?? (await createUserCart(userId));
  }

  if (sessionId) {
    const cartId = await findGuestCartId(sessionId);
    return cartId ?? (await createGuestCart());
  }

  return null;
}
