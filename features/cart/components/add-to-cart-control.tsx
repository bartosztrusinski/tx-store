'use client';

import { type Product } from '@prisma/client';

import { Button } from '@/components/ui/button';

import { useCart } from '../cart-context';
import { QuantityStepper } from './quantity-stepper';

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
      <QuantityStepper
        currentValue={cartItem.quantity}
        maxValue={productStock}
        minValue={1}
        onDecrement={() =>
          dispatch({ payload: { id: productId }, type: 'cart/decrementItemQuantity' })
        }
        onIncrement={() =>
          dispatch({ payload: { id: productId }, type: 'cart/incrementItemQuantity' })
        }
      />
      {cartItem.quantity === productStock && (
        <p className='mt-2 text-sm text-destructive'>No more available</p>
      )}
    </>
  );
}
