import { type Product } from '@prisma/client';

import { getCurrentUser } from '@/lib/auth';

import { getGuestCartCookie } from '../cookie';
import { getCartItemQuantity } from '../data';
import { AddToCartControl } from './add-to-cart-control';

type Props = {
  productId: Product['id'];
  productStock: Product['stock'];
};

export async function AddToCartWrapper({ productId, productStock }: Props) {
  const guestCartSessionId = await getGuestCartCookie();
  const user = await getCurrentUser();
  const cartItemQuantity = await getCartItemQuantity(productId, {
    sessionId: guestCartSessionId,
    userId: user?.id,
  });

  return (
    <AddToCartControl
      cartQuantity={cartItemQuantity ?? 0}
      productId={productId}
      productStock={productStock}
    />
  );
}
