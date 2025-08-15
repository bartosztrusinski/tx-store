'use client';

import { type Product } from '@prisma/client';
import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useCart } from '../cart-context';

type Props = {
  productId: Product['id'];
  productStock: Product['stock'];
};

export function AddToCartControl({ productId, productStock }: Props) {
  const { cart, dispatch } = useCart();
  const cartItem = cart.get(productId);

  if (!cartItem?.quantity) {
    return (
      <Button
        className='w-full'
        disabled={productStock === 0}
        onClick={() => dispatch({ payload: { id: productId }, type: 'cart/incrementItemQuantity' })}
      >
        Add to Bag
      </Button>
    );
  }

  return (
    <>
      <div className='mt-4 flex items-center gap-2'>
        <Button
          disabled={cartItem.quantity < 1}
          onClick={() =>
            dispatch({ payload: { id: productId }, type: 'cart/decrementItemQuantity' })
          }
        >
          <Minus />
          <span className='sr-only'>Remove one from cart</span>
        </Button>
        <span className='grow text-center text-xl'>{cartItem.quantity}</span>
        <Button
          disabled={cartItem.quantity >= productStock}
          onClick={() =>
            dispatch({ payload: { id: productId }, type: 'cart/incrementItemQuantity' })
          }
        >
          <Plus />
          <span className='sr-only'>Add one more to cart</span>
        </Button>
      </div>
      {cartItem.quantity === productStock && (
        <p className='mt-2 text-sm text-destructive'>No more products available</p>
      )}
    </>
  );
}
