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

  const guestCart = await prisma.cart.findUnique({
    include: { items: { select: { productId: true, quantity: true } } },
    where: { sessionId },
  });

  if (!guestCart) {
    cookieStore.delete('cartId');
    return { success: true };
  }

  if (guestCart.items.length === 0) {
    await prisma.cart.delete({ where: { id: guestCart.id } });
    cookieStore.delete('cartId');
    return { success: true };
  }

  const userCart = await prisma.cart.upsert({
    create: { userId },
    include: { items: { select: { productId: true, quantity: true } } },
    update: {},
    where: { userId },
  });

  const mergedItems = [...userCart.items, ...guestCart.items].reduce<
    Record<CartItem['productId'], CartItem['quantity']>
  >((items, item) => {
    items[item.productId] = (items[item.productId] ?? 0) + item.quantity;
    return items;
  }, {});

  const productIds = Object.keys(mergedItems).map(Number);
  const products = await prisma.product.findMany({
    select: { id: true, stock: true },
    where: { id: { in: productIds } },
  });

  const productsStock = products.reduce<Record<CartItem['productId'], CartItem['quantity']>>(
    (stock, product) => {
      stock[product.id] = product.stock;
      return stock;
    },
    {},
  );

  const mergedItemsData = Object.entries(mergedItems).map(([productId, quantity]) => {
    const stock = productsStock[Number(productId)] ?? 0;
    const newQuantity = Math.min(quantity, stock);

    return {
      cartId: userCart.id,
      productId: Number(productId),
      quantity: newQuantity,
    };
  });

  // TODO bulk upsert
  if (userCart.items.length > 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } });
  }

  await prisma.cartItem.createMany({ data: mergedItemsData });

  await prisma.cart.delete({ where: { id: guestCart.id } });
  cookieStore.delete('cartId');
  revalidatePath('/');

  return { success: true };
}

export async function setCartItem(productId: number, quantity: number) {
  const cartId: Cart['id'] = (await findCartId()) ?? (await createCart());

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    });

    revalidatePath('/');
    return { success: true };
  }

  const product = await prisma.product.findUnique({
    select: { stock: true },
    where: { id: productId },
  });

  if (!product) {
    return { message: 'Product not found', success: false };
  }

  if (product.stock < quantity) {
    return { message: 'Not enough stock available', success: false };
  }

  await prisma.cartItem.upsert({
    create: { cartId, productId, quantity },
    select: { id: true },
    update: { quantity },
    where: { cartId_productId: { cartId, productId } },
  });

  revalidatePath('/');
  return { success: true };
}

async function createCart(): Promise<Cart['id']> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (userId) {
    return await createUserCart(userId);
  }

  return await createGuestCart();
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

async function findCartId(): Promise<Cart['id'] | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('cartId')?.value;

  if (userId) {
    return await findUserCartId(userId);
  }

  if (sessionId) {
    return await findGuestCartId(sessionId);
  }

  return null;
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
