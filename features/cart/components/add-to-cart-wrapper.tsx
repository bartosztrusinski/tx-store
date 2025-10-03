import { type Product } from '@prisma/client';

import { getCurrentCartItem } from '../data';
import { AddToCartControl } from './add-to-cart-control';

type Props = {
  productId: Product['id'];
  productStock: Product['stock'];
};

export async function AddToCartWrapper({ productId, productStock }: Props) {
  const cartItem = await getCurrentCartItem(productId, { quantity: true });

  return (
    <AddToCartControl
      cartQuantity={cartItem?.quantity ?? 0}
      productId={productId}
      productStock={productStock}
    />
  );
}
