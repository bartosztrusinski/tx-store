'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function setCartItem(productId: number, quantity: number) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      message: 'User not authenticated',
      success: false,
    };
  }

  revalidatePath('/products');

  if (quantity === 0) {
    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          productId,
          userId: session.user.id,
        },
      },
    });

    return {
      success: true,
    };
  }

  await prisma.cartItem.upsert({
    create: {
      productId,
      quantity,
      userId: session.user.id,
    },
    update: {
      quantity,
    },
    where: {
      userId_productId: {
        productId,
        userId: session.user.id,
      },
    },
  });

  return {
    success: true,
  };
}
