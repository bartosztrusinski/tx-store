import { type Product } from '@prisma/client';

import { CartItemQuantityStepper } from '@/features/cart/components/cart-item-quantity-stepper';

import { getCartItem } from '../data';

type Props = {
  productSlug: Product['slug'];
  productStock: Product['stock'];
};

export async function AddToCartWrapper({ productSlug, productStock }: Props) {
  const cartItem = await getCartItem(productSlug, { quantity: true });

  return (
    <CartItemQuantityStepper
      productSlug={productSlug}
      quantity={cartItem?.quantity ?? 0}
      stock={productStock}
    />
  );
}
