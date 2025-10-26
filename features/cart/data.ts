import 'server-only';
import { type Cart, Prisma, type Product } from '@prisma/client';
import { randomUUID } from 'node:crypto';

import { getCurrentUser } from '@/lib/auth';
import { requireAuth } from '@/lib/dal';
import { db, type DbClient, dbPool, dbTransaction } from '@/lib/db';
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

export async function getCartItem<T extends Prisma.CartItemSelect>(
  productSlug: Product['slug'],
  select: T,
  dbClient: DbClient = db,
) {
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
    where: { cart: cartIdentifier, product: { slug: productSlug } },
  });
}

export async function getCartItems<T extends Prisma.CartItemSelect>(
  select: T,
  dbClient: DbClient = db,
) {
  const guestCartSessionId = await getGuestCartCookie();
  const user = await getCurrentUser();
  const cartIdentifier: Prisma.CartWhereInput | null =
    user ? { userId: user.id }
    : guestCartSessionId ? { sessionId: guestCartSessionId }
    : null;

  if (!cartIdentifier) {
    return null;
  }

  return await dbClient.cartItem.findMany({
    orderBy: { createdAt: 'asc' },
    select,
    where: { cart: cartIdentifier },
  });
}

export async function getOrCreateCurrentUserCart(dbClient: DbClient = dbPool) {
  const user = await requireAuth();
  const currentUserCart = await dbClient.cart.upsert({
    create: { userId: user.id },
    select: { id: true },
    update: {},
    where: { userId: user.id },
  });
  return currentUserCart.id;
}

export async function getOrCreateGuestCart(dbClient: DbClient = dbPool) {
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
}

export async function getUserCart<T extends Prisma.CartSelect>(
  userId: NonNullable<Cart['userId']>,
  select: T,
  dbClient: DbClient = db,
) {
  return await dbClient.cart.findUnique({
    select,
    where: { userId },
  });
}

export async function mergeUserAndGuestCarts(userId: NonNullable<Cart['userId']>) {
  const itemFields = {
    select: {
      createdAt: true,
      product: { select: { stock: true } },
      productId: true,
      quantity: true,
    },
  } satisfies Prisma.CartSelect['items'];

  await dbTransaction(async (tx) => {
    const guestCart = await getGuestCart({ items: itemFields }, tx);

    if (!guestCart) {
      return;
    }

    if (guestCart.items.length === 0) {
      await deleteGuestCart(tx);
      return;
    }

    const userCart = await getUserCart(userId, { id: true, items: itemFields }, tx);

    if (!userCart) {
      await assignGuestCartToUser(userId, tx);
      return;
    }

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

async function assignGuestCartToUser(userId: NonNullable<Cart['userId']>, dbClient: DbClient = db) {
  const guestCartSessionId = await getGuestCartCookie();

  if (!guestCartSessionId) {
    throw new Error('No guest cart session ID found');
  }

  await dbClient.cart.update({
    data: { sessionId: null, userId },
    where: { sessionId: guestCartSessionId },
  });
  await deleteGuestCartCookie();
}

async function deleteGuestCart(dbClient: DbClient = db) {
  const guestCartSessionId = await getGuestCartCookie();

  if (!guestCartSessionId) {
    throw new Error('No guest cart session ID found');
  }

  await dbClient.cart.delete({ where: { sessionId: guestCartSessionId } });
  await deleteGuestCartCookie();
}

async function getGuestCart<T extends Prisma.CartSelect>(select: T, dbClient: DbClient = db) {
  const guestCartSessionId = await getGuestCartCookie();

  if (!guestCartSessionId) {
    return null;
  }

  return await dbClient.cart.findUnique({
    select,
    where: { sessionId: guestCartSessionId },
  });
}

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
