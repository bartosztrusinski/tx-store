import { type Cart, type CartItem, Prisma } from '@prisma/client';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { dbClientHttp, dbClientWs } from '@/lib/prisma';

import { getCartCookie } from './cookie';

export async function createGuestCart(sessionId: Cart['sessionId']): Promise<Cart['id']> {
  const { id } = await dbClientHttp.cart.create({
    data: { sessionId },
    select: { id: true },
  });

  return id;
}

export async function createOrGetUserCartWithItems(userId: NonNullable<Cart['userId']>) {
  return await dbClientWs.cart.upsert({
    create: { userId },
    include: {
      items: {
        select: {
          createdAt: true,
          product: { select: { id: true, stock: true } },
          quantity: true,
        },
      },
    },
    update: {},
    where: { userId },
  });
}

export async function createUserCart(userId: Cart['userId']): Promise<Cart['id']> {
  const { id } = await dbClientHttp.cart.create({
    data: { userId },
    select: { id: true },
  });

  return id;
}

export async function deleteCart(cartId: Cart['id']): Promise<void> {
  await dbClientHttp.cart.delete({ where: { id: cartId } });
}

export async function deleteCartItem(
  cartId: CartItem['cartId'],
  productId: CartItem['productId'],
): Promise<void> {
  await dbClientHttp.cartItem.delete({
    where: { cartId_productId: { cartId, productId } },
  });
}

export async function getCartId(): Promise<Cart['id'] | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const sessionId = await getCartCookie();

  if (!userId && !sessionId) {
    return null;
  }

  const cart = await dbClientHttp.cart.findUnique({
    select: { id: true },
    where: userId ? { userId } : { sessionId: sessionId! },
  });

  return cart?.id ?? null;
}

export async function getCartItemQuantity(
  productId: CartItem['productId'],
): Promise<CartItem['quantity'] | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const sessionId = await getCartCookie();

  if (!userId && !sessionId) {
    return null;
  }

  const cartItem = await dbClientHttp.cartItem.findFirst({
    select: { quantity: true },
    where: {
      cart: userId ? { userId } : { sessionId },
      productId,
    },
  });

  return cartItem?.quantity ?? null;
}

export async function getGuestCartWithItems(sessionId: NonNullable<Cart['sessionId']>) {
  return await dbClientHttp.cart.findUnique({
    include: {
      items: {
        select: {
          createdAt: true,
          product: { select: { id: true, stock: true } },
          quantity: true,
        },
      },
    },
    where: { sessionId },
  });
}

export async function upsertCartItem(
  cartId: CartItem['cartId'],
  productId: CartItem['productId'],
  quantity: CartItem['quantity'],
): Promise<void> {
  await dbClientHttp.cartItem.upsert({
    create: { cartId, productId, quantity },
    update: { quantity },
    where: { cartId_productId: { cartId, productId } },
  });
}

export async function upsertCartItems(items: Omit<CartItem, 'id'>[]) {
  return await dbClientHttp.$executeRaw`
      INSERT INTO "CartItem" ("cartId", "createdAt", "productId", "quantity")
      VALUES ${Prisma.join(
        items.map(
          ({ cartId, createdAt, productId, quantity }) =>
            Prisma.sql`(${cartId}, ${createdAt}, ${productId}, ${quantity})`,
        ),
      )}
      ON CONFLICT ("cartId", "productId")
      DO UPDATE SET "quantity" = EXCLUDED."quantity", "createdAt" = EXCLUDED."createdAt";
    `;
}
