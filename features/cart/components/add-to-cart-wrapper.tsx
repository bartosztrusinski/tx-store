import { type Product } from '@prisma/client';
import { headers } from 'next/headers';

import { AddToCartControl } from '@/features/cart/components/add-to-cart-control';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Props = {
  productId: Product['id'];
  productStock: Product['stock'];
};

export async function AddToCartWrapper({ productId, productStock }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { userId_productId: { productId: productId, userId: session?.user.id } },
  });

  return (
    <AddToCartControl
      cartQuantity={cartItem?.quantity ?? 0}
      productId={productId}
      productStock={productStock}
    />
  );
}
