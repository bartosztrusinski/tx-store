'use client';

import { type CartItem, type Product } from '@prisma/client';
import { startTransition, useOptimistic } from 'react';

import { Button } from '@/components/ui/button';

import { setCartItemQuantity } from '../actions';
import { QuantityStepper } from './quantity-stepper';

type Props = {
  initialQuantity: CartItem['quantity'];
  productSlug: Product['slug'];
  stock: Product['stock'];
};

export function AddToCartControl({ initialQuantity, productSlug, stock }: Props) {
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic<number, number>(
    initialQuantity,
    (_, newQuantity) => newQuantity,
  );

  const handleCartUpdate = async (quantity: number) => {
    startTransition(async () => {
      setOptimisticQuantity(quantity);
      await setCartItemQuantity(quantity, productSlug);
    });
  };

  if (optimisticQuantity === 0) {
    return (
      <Button className='w-full' disabled={stock === 0} onClick={() => handleCartUpdate(1)}>
        {stock === 0 ? 'Out of Stock' : 'Add to Bag'}
      </Button>
    );
  }

  return (
    <QuantityStepper
      max={stock}
      onChange={(value) => handleCartUpdate(value)}
      onDecrement={() => handleCartUpdate(optimisticQuantity - 1)}
      onIncrement={() => handleCartUpdate(optimisticQuantity + 1)}
      quantity={optimisticQuantity}
    />
  );
}
