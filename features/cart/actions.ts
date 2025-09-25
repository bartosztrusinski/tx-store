'use server';

import { type Cart, type CartItem } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { getProductStock } from '@/features/product/data';
import { type ActionResponse } from '@/lib/types';

import { createCart, deleteCartItem, getCartId, upsertCartItem } from './data';

export async function setCartItem(
  productId: CartItem['productId'],
  quantity: CartItem['quantity'],
): Promise<ActionResponse> {
  const cartId: Cart['id'] = (await getCartId()) ?? (await createCart());

  if (quantity <= 0) {
    await deleteCartItem(cartId, productId);
    revalidatePath('/');
    return { isSuccess: true };
  }

  const product = await getProductStock(productId);

  if (!product) {
    return { isSuccess: false, message: 'Product not found' };
  }

  if (product.stock < quantity) {
    return { isSuccess: false, message: 'Not enough stock available' };
  }

  await upsertCartItem(cartId, productId, quantity);
  revalidatePath('/');
  return { isSuccess: true };
}
