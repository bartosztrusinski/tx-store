import { type Product } from '@prisma/client';

import { AddToCartControl } from '@/features/cart/components/add-to-cart-control';
import { getCartItemQuantity } from '@/features/cart/data';

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
