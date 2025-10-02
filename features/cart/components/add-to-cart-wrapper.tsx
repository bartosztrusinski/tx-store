import { type Product } from '@prisma/client';

import { getCurrentCartItemQuantity } from '../data';
import { AddToCartControl } from './add-to-cart-control';

type Props = {
  productId: Product['id'];
  productStock: Product['stock'];
};

export async function AddToCartWrapper({ productId, productStock }: Props) {
  const cartItemQuantity = await getCurrentCartItemQuantity(productId);

  return (
    <AddToCartControl
      cartQuantity={cartItemQuantity ?? 0}
      productId={productId}
      productStock={productStock}
    />
  );
}
