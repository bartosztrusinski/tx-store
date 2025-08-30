import { type CartItem, type Product } from '@prisma/client';
import { cookies, headers } from 'next/headers';

import { AddToCartControl } from '@/features/cart/components/add-to-cart-control';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Props = {
  productId: Product['id'];
  productStock: Product['stock'];
};

export async function AddToCartWrapper({ productId, productStock }: Props) {
  const cartItemQuantity = await getCartItemQuantity(productId);

  return (
    <AddToCartControl
      cartQuantity={cartItemQuantity ?? 0}
      productId={productId}
      productStock={productStock}
    />
  );
}

async function getCartItemQuantity(productId: number): Promise<CartItem['quantity'] | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('cartId')?.value;

  if (!userId && !sessionId) {
    return null;
  }

  const cartItem = await prisma.cartItem.findFirst({
    select: { quantity: true },
    where: {
      cart: userId ? { userId } : { sessionId },
      productId,
    },
  });

  return cartItem?.quantity ?? null;
}
