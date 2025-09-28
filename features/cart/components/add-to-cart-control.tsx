'use client';

import { type Product } from '@prisma/client';
import { usePathname } from 'next/navigation';
import { startTransition, useOptimistic } from 'react';

import { Button } from '@/components/ui/button';

import { setCartItem } from '../actions';
import { QuantityStepper } from './quantity-stepper';

type Props = {
  cartQuantity: number;
  productId: Product['id'];
  productStock: Product['stock'];
};

export function AddToCartControl({ cartQuantity, productId, productStock }: Props) {
  const pathname = usePathname();
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic<number, number>(
    cartQuantity,
    (_, newQuantity) => newQuantity,
  );

  const handleCartUpdate = async (quantity: number) => {
    startTransition(async () => {
      setOptimisticQuantity(quantity);
      await setCartItem(productId, quantity, pathname);
    });
  };

  if (optimisticQuantity === 0) {
    return (
      <Button className='w-full' disabled={productStock === 0} onClick={() => handleCartUpdate(1)}>
        {productStock === 0 ? 'Out of Stock' : 'Add to Bag'}
      </Button>
    );
  }

  return (
    <QuantityStepper
      max={productStock}
      onChange={(value) => handleCartUpdate(value)}
      onDecrement={() => handleCartUpdate(optimisticQuantity - 1)}
      onIncrement={() => handleCartUpdate(optimisticQuantity + 1)}
      quantity={optimisticQuantity}
    />
  );
}
