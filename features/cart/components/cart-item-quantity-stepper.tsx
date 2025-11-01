'use client';

import { type CartItem, type Product } from '@prisma/client';
import { Minus, Plus } from 'lucide-react';
import { startTransition, useOptimistic } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setCartItemQuantity } from '@/features/cart/actions';
import { useInputStepper } from '@/lib/hooks/use-input-stepper';

type Props = {
  buttonClassName?: string;
  inputClassName?: string;
  productSlug: Product['slug'];
  quantity: CartItem['quantity'];
  stock: Product['stock'];
};

export function CartItemQuantityStepper({
  buttonClassName,
  inputClassName,
  productSlug,
  quantity,
  stock,
}: Props) {
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic<number, number>(
    quantity,
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

  return (
    <>
      <Button {...decrementButtonProps} className={buttonClassName} size='icon'>
        <Minus />
        <span className='sr-only'>Decrease quantity by one</span>
      </Button>
      <Input aria-label='Quantity' className={inputClassName} {...inputProps} />
      <Button {...incrementButtonProps} className={buttonClassName} size='icon'>
        <Plus />
        <span className='sr-only'>Increase quantity by one</span>
      </Button>
    </>
  );
}
