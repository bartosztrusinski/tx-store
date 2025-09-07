import { type Cart, type CartItem } from '@prisma/client';
import { cookies, headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { dbClientHttp } from '@/lib/prisma';

export async function getCartId(): Promise<Cart['id'] | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('cartId')?.value;

  if (!userId && !sessionId) {
    return null;
  }

  const cart = await dbClientHttp.cart.findUnique({
    select: { id: true },
    where: userId ? { userId } : { sessionId },
  });

  return cart?.id ?? null;
}

export async function getCartItemQuantity(
  productId: CartItem['productId'],
): Promise<CartItem['quantity'] | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('cartId')?.value;

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
