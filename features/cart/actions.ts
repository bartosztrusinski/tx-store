'use server';

import { type CartItem, type Product } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { getProductBySlug } from '@/features/product/data';
import { DalError, isUnauthenticated } from '@/lib/dal';
import { dbTransaction } from '@/lib/db';
import { type ActionResponse } from '@/lib/types';
import { splitByKeys } from '@/lib/utils/split-by-keys';
import { tryCatch } from '@/lib/utils/try-catch';

import {
  deleteCartItem,
  getOrCreateCurrentUserCart,
  getOrCreateGuestCart,
  upsertCartItem,
} from './data';
import { setCartItemQuantitySchema } from './schemas';

export async function setCartItemQuantity(
  quantity: CartItem['quantity'],
  productSlug: Product['slug'],
): Promise<ActionResponse<typeof setCartItemQuantitySchema>> {
  const [result, error] = await tryCatch(
    async (): Promise<ActionResponse<typeof setCartItemQuantitySchema>> => {
      const validationResult = setCartItemQuantitySchema.safeParse({ productSlug, quantity });

      if (!validationResult.success) {
        const { fieldErrors } = validationResult.error.flatten();
        const [systemErrors, userErrors] = splitByKeys(fieldErrors, ['productSlug']);
        const isSystemError = Object.values(systemErrors).some((errs) => Array.isArray(errs));

        if (isSystemError) {
          throw new Error(
            `Input validation error: ${Object.values(systemErrors).flat().join(' ')}`,
          );
        }

        return {
          isSuccess: false,
          validationErrors: userErrors,
        };
      }

      const [userCartId, error] = await tryCatch(getOrCreateCurrentUserCart);
      const cartId = userCartId ?? (isUnauthenticated(error) ? await getOrCreateGuestCart() : null);

      if (!cartId) {
        throw new Error('Could not find or create user cart.', { cause: error });
      }

      return await dbTransaction(
        async (tx): Promise<ActionResponse<typeof setCartItemQuantitySchema>> => {
          const product = await getProductBySlug(productSlug, { id: true, stock: true }, tx);

          if (!product) {
            return {
              isSuccess: false,
              message: 'Could not find that product. Please refresh and try again.',
            };
          }

          if (quantity > product.stock) {
            return {
              isSuccess: false,
              message: `Only ${product.stock} left in stock. Please adjust the quantity.`,
            };
          }

          if (quantity === 0) {
            await deleteCartItem({ cartId_productId: { cartId, productId: product.id } }, tx);
          } else {
            await upsertCartItem({ cartId, productId: product.id, quantity }, tx);
          }

          return { isSuccess: true, message: 'Cart updated successfully.' };
        },
      );
    },
  );

  if (error) {
    console.error(error);

    return {
      isSuccess: false,
      message:
        error instanceof DalError ?
          error.message
        : 'Could not update your cart. Please try again in a moment.',
    };
  }

  if (result.isSuccess) {
    revalidatePath(`/products/${productSlug}`);
  }

  return result;
}
