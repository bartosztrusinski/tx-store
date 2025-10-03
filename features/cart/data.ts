import 'server-only';
import { type Cart, type CartItem, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { cache } from 'react';

import { getCurrentUser } from '@/lib/auth';
import { db, type DbClient, dbTransaction } from '@/lib/db';
import { mergeArraysByKey } from '@/lib/utils/merge-arrays-by-key';

import { deleteGuestCartCookie, getGuestCartCookie, setGuestCartCookie } from './cookie';

export async function deleteCartItem(
  where: Prisma.CartItemWhereUniqueInput,
  dbClient: DbClient = db,
) {
  return await dbClient.cartItem.delete({
    select: { id: true },
    where,
  });
}

export const getOrCreateCurrentUserCart = cache(async (dbClient: DbClient = db) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const currentUserCart = await getOrCreateUserCart(user.id, { id: true }, dbClient);
  return currentUserCart.id;
});

export const getOrCreateGuestCart = cache(async (dbClient: DbClient = db) => {
  const guestCartSessionId = await getGuestCartCookie();
  const newSessionId = randomUUID();

  if (!guestCartSessionId) {
    const cart = await dbClient.cart.create({
      data: { sessionId: newSessionId },
      select: { id: true },
    });
    await setGuestCartCookie(newSessionId);
    return cart.id;
  }

  const cart = await dbClient.cart.upsert({
    create: { sessionId: newSessionId },
    select: { id: true, sessionId: true },
    update: {},
    where: { sessionId: guestCartSessionId },
  });

  if (cart.sessionId === newSessionId) {
    await setGuestCartCookie(newSessionId);
  }

  return cart.id;
});

const getOrCreateUserCart = cache(
  async <T extends Prisma.CartSelect>(
    userId: NonNullable<Cart['userId']>,
    select: T,
    dbClient: DbClient = db,
  ) => {
    return await dbClient.cart.upsert({
      create: { userId },
      select,
      update: {},
      where: { userId },
    });
  },
);

export const getCurrentCartItem = cache(
  async <T extends Prisma.CartItemSelect>(
    productId: CartItem['productId'],
    select: T,
    dbClient: DbClient = db,
  ) => {
    const guestCartSessionId = await getGuestCartCookie();
    const user = await getCurrentUser();
    const cartIdentifier: Prisma.CartWhereInput | null =
      user ? { userId: user.id }
      : guestCartSessionId ? { sessionId: guestCartSessionId }
      : null;

    if (!cartIdentifier) {
      return null;
    }

    return await dbClient.cartItem.findFirst({
      select,
      where: { cart: cartIdentifier, productId },
    });
  },
);

export async function mergeCurrentUserAndGuestCarts(userId: NonNullable<Cart['userId']>) {
  const itemFields = {
    items: {
      select: {
        createdAt: true,
        product: { select: { stock: true } },
        productId: true,
        quantity: true,
      },
    },
  } satisfies Prisma.CartSelect;

  await dbTransaction(async (tx) => {
    const guestCart = await getGuestCart(itemFields, tx);

    if (!guestCart) {
      return;
    }

    if (guestCart.items.length === 0) {
      await deleteGuestCart(tx);
      return;
    }

    const userCart = await getOrCreateUserCart(userId, { id: true, ...itemFields }, tx);
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
    await deleteGuestCart(tx);
  });
}

export async function upsertCartItem(
  { cartId, productId, ...item }: Prisma.CartItemCreateManyInput,
  dbClient: DbClient = db,
) {
  await dbClient.cartItem.upsert({
    create: { cartId, productId, ...item },
    update: item,
    where: { cartId_productId: { cartId, productId } },
  });
}

async function deleteGuestCart(dbClient: DbClient = db) {
  const guestCartSessionId = await getGuestCartCookie();

  if (!guestCartSessionId) {
    throw new Error('No guest cart session ID found');
  }

  await dbClient.cart.delete({ where: { sessionId: guestCartSessionId } });
  await deleteGuestCartCookie();
}

const getGuestCart = cache(
  async <T extends Prisma.CartSelect>(select: T, dbClient: DbClient = db) => {
    const guestCartSessionId = await getGuestCartCookie();

    if (!guestCartSessionId) {
      return null;
    }

    return await dbClient.cart.findUnique({
      select,
      where: { sessionId: guestCartSessionId },
    });
  },
);

async function upsertCartItems(items: Prisma.CartItemCreateManyInput[], dbClient: DbClient = db) {
  await dbClient.$executeRaw`
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
