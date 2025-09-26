import { type Product } from '@prisma/client';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

import { getGuestCartCookie } from '../cookie';
import { getCartItemQuantity } from '../data';
import { AddToCartControl } from './add-to-cart-control';

type Props = {
  productId: Product['id'];
  productStock: Product['stock'];
};

export async function AddToCartWrapper({ productId, productStock }: Props) {
  const guestCartSessionId = await getGuestCartCookie();
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ?? null;
  const cartItemQuantity = await getCartItemQuantity(productId, {
    sessionId: guestCartSessionId,
    userId,
  });

  return (
    <AddToCartControl
      cartQuantity={cartItemQuantity ?? 0}
      productId={productId}
      productStock={productStock}
    />
  );
}
