import { type Cart, type CartItem, Prisma } from '@prisma/client';
import { headers } from 'next/headers';
import { randomUUID } from 'node:crypto';

import { auth } from '@/lib/auth';
import { db, dbPool } from '@/lib/db';

import { deleteCartCookie, getCartCookie, setCartCookie } from './cookie';

export async function createCart(): Promise<Cart['id']> {
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

export async function createOrGetUserCartWithItems(userId: NonNullable<Cart['userId']>) {
  return await dbPool.cart.upsert({
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

export async function deleteCart(cartId: Cart['id']) {
  await db.cart.delete({ where: { id: cartId } });
}

export async function deleteCartItem(cartId: CartItem['cartId'], productId: CartItem['productId']) {
  await db.cartItem.delete({
    where: { cartId_productId: { cartId, productId } },
  });
}

export async function getCartId() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const sessionId = await getCartCookie();

  if (!userId && !sessionId) {
    return null;
  }

  const cart = await db.cart.findUnique({
    select: { id: true },
    where: userId ? { userId } : { sessionId: sessionId! },
  });

  return cart?.id ?? null;
}

export async function getCartItemQuantity(productId: CartItem['productId']) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const sessionId = await getCartCookie();

  if (!userId && !sessionId) {
    return null;
  }

  const cartItem = await db.cartItem.findFirst({
    select: { quantity: true },
    where: {
      cart: userId ? { userId } : { sessionId },
      productId,
    },
  });

  return cartItem?.quantity ?? null;
}

export async function getGuestCartWithItems(sessionId: NonNullable<Cart['sessionId']>) {
  return await db.cart.findUnique({
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

export async function mergeUserAndGuestCarts(userId: NonNullable<Cart['userId']>) {
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

  return { isSuccess: true };
}

export async function upsertCartItem(
  cartId: CartItem['cartId'],
  productId: CartItem['productId'],
  quantity: CartItem['quantity'],
) {
  await db.cartItem.upsert({
    create: { cartId, productId, quantity },
    update: { quantity },
    where: { cartId_productId: { cartId, productId } },
  });
}

export async function upsertCartItems(items: Omit<CartItem, 'id'>[]) {
  return await db.$executeRaw`
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

async function createGuestCart(sessionId: Cart['sessionId']): Promise<Cart['id']> {
  const { id } = await db.cart.create({
    data: { sessionId },
    select: { id: true },
  });

  return id;
}

async function createUserCart(userId: Cart['userId']): Promise<Cart['id']> {
  const { id } = await db.cart.create({
    data: { userId },
    select: { id: true },
  });

  return id;
}
