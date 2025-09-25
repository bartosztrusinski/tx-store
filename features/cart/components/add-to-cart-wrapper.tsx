import { type Product } from '@prisma/client';

import { getCartItemQuantity } from '../data';
import { AddToCartControl } from './add-to-cart-control';

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
