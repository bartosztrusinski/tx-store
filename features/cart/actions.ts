'use server';

import { type Cart, type CartItem } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { randomUUID } from 'node:crypto';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function mergeCarts(userId: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('cartId')?.value;

  if (!sessionId) {
    return { success: true };
  }

  // query products from both carts
  const cartItems = await prisma.cartItem.findMany({
    where: {
      cart: { OR: [{ userId }, { sessionId }] },
    },
  });

  // merge items
  const mergedCartItems = cartItems.reduce<Record<CartItem['productId'], CartItem>>(
    (items, item) => {
      const existingItem = items[item.productId];

      return {
        ...items,
        [item.productId]: {
          ...existingItem,
          ...item,
          quantity: (existingItem?.quantity ?? 0) + item.quantity,
        },
      };
    },
    {},
  );

  // get users cart id
  const userCartId = (await findUserCartId(userId)) ?? (await createUserCart(userId));

  // create or update cart items in users cart
  await Promise.all(
    Object.values(mergedCartItems).map((item) =>
      prisma.cartItem.upsert({
        create: { cartId: userCartId, productId: item.productId, quantity: item.quantity },
        update: { cartId: userCartId, quantity: item.quantity },
        where: { cartId_productId: { cartId: userCartId, productId: item.productId } },
      }),
    ),
  );

  // remove guest cart
  await prisma.cart.delete({ where: { sessionId } });

  // clear cart cookie
  cookieStore.delete('cartId');

  return { success: true };
}

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
  const cookieStore = await cookies();
  const newCart = await prisma.cart.create({
    data: { sessionId },
  });

  cookieStore.set('cartId', sessionId, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });

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
