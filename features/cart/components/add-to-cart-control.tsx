'use client';

import { Minus, Plus } from 'lucide-react';
import { Product } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useCart } from '../cart-context';

type Props = {
  productId: Product['id'];
  productStock: Product['stock'];
};

export function AddToCartControl({ productId, productStock }: Props) {
  const { cartItems, incrementItemQuantity, decrementItemQuantity } = useCart();
  const cartItem = cartItems.get(productId);

  if (!cartItem?.quantity) {
    return (
      <Button
        size='lg'
        className='mt-4 w-full'
        disabled={productStock === 0}
        onClick={() => incrementItemQuantity(productId)}
      >
        Add to Bag
      </Button>
    );
  }

  return (
    <>
      <div className='mt-4 flex items-center gap-2'>
        <Button
          className='size-11'
          disabled={cartItem.quantity < 1}
          onClick={() => decrementItemQuantity(productId)}
        >
          <Minus />
          <span className='sr-only'>Remove one from cart</span>
        </Button>
        <span className='grow text-center text-xl'>{cartItem.quantity}</span>
        <Button
          className='size-11'
          disabled={cartItem.quantity >= productStock}
          onClick={() => incrementItemQuantity(productId)}
        >
          <Plus />
          <span className='sr-only'>Add one more to cart</span>
        </Button>
      </div>
      {cartItem.quantity === productStock && (
        <p className='mt-2 text-center text-sm text-destructive'>No more available</p>
      )}
    </>
  );
}
