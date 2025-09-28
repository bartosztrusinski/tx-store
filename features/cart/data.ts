import { type Cart, type CartItem, Prisma } from '@prisma/client';
import { cache } from 'react';

import { db, dbPool } from '@/lib/db';
import { mergeArraysByKey } from '@/lib/utils/merge-arrays-by-key';

export async function createGuestCart(sessionId: Cart['sessionId']): Promise<Cart['id']> {
  const { id } = await db.cart.create({
    data: { sessionId },
    select: { id: true },
  });
  return id;
}

export async function createUserCart(userId: NonNullable<Cart['userId']>): Promise<Cart['id']> {
  const { id } = await db.cart.create({
    data: { userId },
    select: { id: true },
  });
  return id;
}

export async function deleteCartItem(cartId: CartItem['cartId'], productId: CartItem['productId']) {
  await db.cartItem.delete({
    where: { cartId_productId: { cartId, productId } },
  });
}

const createOrGetUserCartWithItems = cache(async (userId: NonNullable<Cart['userId']>) => {
  return await dbPool.cart.upsert({
    create: { userId },
    include: {
      items: {
        select: {
          createdAt: true,
          product: { select: { stock: true } },
          productId: true,
          quantity: true,
        },
      },
    },
    update: {},
    where: { userId },
  });
});

async function deleteCart(cartId: Cart['id']) {
  await db.cart.delete({ where: { id: cartId } });
}

export const getCartId = cache(
  async ({ sessionId, userId }: Pick<Partial<Cart>, 'userId' | 'sessionId'>) => {
    if (!userId && !sessionId) {
      return null;
    }

    const cart = await db.cart.findUnique({
      select: { id: true },
      where: userId ? { userId } : { sessionId: sessionId! },
    });

    return cart?.id ?? null;
  },
);

export const getCartItemQuantity = cache(
  async (
    productId: CartItem['productId'],
    { sessionId, userId }: Pick<Partial<Cart>, 'userId' | 'sessionId'>,
  ) => {
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
  },
);

const getGuestCartWithItems = cache(async (sessionId: NonNullable<Cart['sessionId']>) => {
  return await db.cart.findUnique({
    include: {
      items: {
        select: {
          createdAt: true,
          product: { select: { stock: true } },
          productId: true,
          quantity: true,
        },
      },
    },
    where: { sessionId },
  });
});

export async function mergeUserAndGuestCarts(
  userId: NonNullable<Cart['userId']>,
  sessionId: NonNullable<Cart['sessionId']>,
) {
  const guestCart = await getGuestCartWithItems(sessionId);

  if (!guestCart) {
    return;
  }

  if (guestCart.items.length === 0) {
    await deleteCart(guestCart.id);
    return;
  }

  const userCart = await createOrGetUserCartWithItems(userId);
  const mergedCartItems = mergeArraysByKey(
    userCart.items,
    guestCart.items,
    'productId',
    (userItem, guestItem) => ({
      ...userItem,
      createdAt:
        userItem.createdAt < guestItem.createdAt ? userItem.createdAt : guestItem.createdAt, // keep the earliest createdAt
      quantity: Math.min(userItem.quantity + guestItem.quantity, userItem.product.stock), // limit quantity sum to product stock
    }),
  ).map(({ product: _, ...rest }) => ({ ...rest, cartId: userCart.id }));

  await upsertCartItems(mergedCartItems);
  await deleteCart(guestCart.id);
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

async function upsertCartItems(items: Omit<CartItem, 'id'>[]) {
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
