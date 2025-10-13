import { type Product } from '@prisma/client';

import { getCurrentCartItem } from '../data';
import { AddToCartControl } from './add-to-cart-control';

type Props = {
  productSlug: Product['slug'];
  productStock: Product['stock'];
};

export async function AddToCartWrapper({ productSlug, productStock }: Props) {
  const cartItem = await getCurrentCartItem(productSlug, { quantity: true });

  return (
    <AddToCartControl
      initialQuantity={cartItem?.quantity ?? 0}
      productSlug={productSlug}
      stock={productStock}
    />
  );
}
