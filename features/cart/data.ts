import { type Cart, type CartItem, Prisma } from '@prisma/client';
import { cache } from 'react';

import { db, type DbClient, dbPool } from '@/lib/db';
import { mergeArraysByKey } from '@/lib/utils/merge-arrays-by-key';

export async function createGuestCart(
  sessionId: Cart['sessionId'],
  dbClient: DbClient = db,
): Promise<Cart['id']> {
  const { id } = await dbClient.cart.create({
    data: { sessionId },
    select: { id: true },
  });
  return id;
}

export async function createUserCart(
  userId: NonNullable<Cart['userId']>,
  dbClient: DbClient = db,
): Promise<Cart['id']> {
  const { id } = await dbClient.cart.create({
    data: { userId },
    select: { id: true },
  });
  return id;
}

export async function deleteCartItem(
  cartId: CartItem['cartId'],
  productId: CartItem['productId'],
  dbClient: DbClient = db,
) {
  await dbClient.cartItem.delete({
    where: { cartId_productId: { cartId, productId } },
  });
}

const createOrGetUserCartWithItems = cache(
  async (userId: NonNullable<Cart['userId']>, dbClient: DbClient = dbPool) => {
    return await dbClient.cart.upsert({
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
  },
);

async function deleteCart(cartId: Cart['id'], dbClient: DbClient = db) {
  await dbClient.cart.delete({ where: { id: cartId } });
}

export const getCartId = cache(
  async (
    { sessionId, userId }: Pick<Partial<Cart>, 'userId' | 'sessionId'>,
    dbClient: DbClient = db,
  ) => {
    if (!userId && !sessionId) {
      return null;
    }

    const cart = await dbClient.cart.findUnique({
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
    dbClient: DbClient = db,
  ) => {
    if (!userId && !sessionId) {
      return null;
    }

    const cartItem = await dbClient.cartItem.findFirst({
      select: { quantity: true },
      where: {
        cart: userId ? { userId } : { sessionId },
        productId,
      },
    });

    return cartItem?.quantity ?? null;
  },
);

export async function mergeUserAndGuestCarts(
  userId: NonNullable<Cart['userId']>,
  sessionId: NonNullable<Cart['sessionId']>,
) {
  await dbPool.$transaction(async (tx) => {
    const guestCart = await getGuestCartWithItems(sessionId, tx);

    if (!guestCart) {
      return;
    }

    if (guestCart.items.length === 0) {
      await deleteCart(guestCart.id, tx);
      return;
    }

    const userCart = await createOrGetUserCartWithItems(userId, tx);
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

    await upsertCartItems(mergedCartItems, tx);
    await deleteCart(guestCart.id, tx);
  });
}

export async function upsertCartItem(
  cartId: CartItem['cartId'],
  productId: CartItem['productId'],
  quantity: CartItem['quantity'],
  dbClient: DbClient = db,
) {
  await dbClient.cartItem.upsert({
    create: { cartId, productId, quantity },
    update: { quantity },
    where: { cartId_productId: { cartId, productId } },
  });
}

const getGuestCartWithItems = cache(
  async (sessionId: NonNullable<Cart['sessionId']>, dbClient: DbClient = db) => {
    return await dbClient.cart.findUnique({
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
  },
);

async function upsertCartItems(items: Omit<CartItem, 'id'>[], dbClient: DbClient = db) {
  return await dbClient.$executeRaw`
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
