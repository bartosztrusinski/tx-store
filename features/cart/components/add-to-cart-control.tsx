'use client';

import { type CartItem, type Product } from '@prisma/client';
import { Minus, Plus } from 'lucide-react';
import { startTransition, useOptimistic } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInputStepper } from '@/lib/hooks/use-input-stepper';

import { setCartItemQuantity } from '../actions';

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
  const { decrementButtonProps, incrementButtonProps, inputProps } = useInputStepper({
    max: stock,
    onChange: handleCartUpdate,
    value: optimisticQuantity,
  });

  async function handleCartUpdate(quantity: number) {
    startTransition(async () => {
      setOptimisticQuantity(quantity);
      await setCartItemQuantity(quantity, productSlug);
    });
  }

  if (optimisticQuantity === 0) {
    return (
      <Button
        className='w-full'
        disabled={stock === 0}
        onClick={() => handleCartUpdate(optimisticQuantity + 1)}
      >
        {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    );
  }

  return (
    <div className='flex-center gap-2'>
      <Button {...decrementButtonProps}>
        <Minus />
        <span className='sr-only'>Decrease quantity by one</span>
      </Button>
      <Input aria-label='Quantity' className='text-center' {...inputProps} />
      <Button {...incrementButtonProps}>
        <Plus />
        <span className='sr-only'>Increase quantity by one</span>
      </Button>
    </div>
  );
}
