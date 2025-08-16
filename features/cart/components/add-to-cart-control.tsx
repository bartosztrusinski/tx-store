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
    <QuantityStepper
      max={productStock}
      onChange={(value) =>
        dispatch({ payload: { id: productId, quantity: value }, type: 'cart/setItemQuantity' })
      }
      onDecrement={() =>
        dispatch({ payload: { id: productId }, type: 'cart/decrementItemQuantity' })
      }
      onIncrement={() =>
        dispatch({ payload: { id: productId }, type: 'cart/incrementItemQuantity' })
      }
      quantity={cartItem.quantity}
    />
  );
}
