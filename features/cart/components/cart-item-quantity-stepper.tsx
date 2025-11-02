'use client';

import { type CartItem, type Product } from '@prisma/client';
import { Minus, Plus } from 'lucide-react';
import { startTransition, useOptimistic } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setCartItemQuantity } from '@/features/cart/actions';
import { useInputStepper } from '@/lib/hooks/use-input-stepper';
import { cn } from '@/lib/utils/cn';

type Props = {
  buttonClassName?: string;
  inputClassName?: string;
  productSlug: Product['slug'];
  quantity: CartItem['quantity'];
  showInitialCta?: boolean;
  stock: Product['stock'];
  wrapperClassName?: string;
};

export function CartItemQuantityStepper({
  buttonClassName,
  inputClassName,
  productSlug,
  quantity: initialQuantity,
  showInitialCta = true,
  stock,
  wrapperClassName,
}: Props) {
  const [quantity, setQuantity] = useOptimistic<number, number>(
    initialQuantity,
    (_, newQuantity) => newQuantity,
  );
  const { decrementButtonProps, incrementButtonProps, inputProps } = useInputStepper({
    max: stock,
    onChange: handleCartUpdate,
    value: quantity,
  });

  async function handleCartUpdate(quantity: number) {
    startTransition(async () => {
      setQuantity(quantity);
      await setCartItemQuantity(quantity, productSlug);
    });
  }

  // Item not in cart yet, show CTA button
  if (quantity === 0 && showInitialCta) {
    return (
      <Button className='w-full' {...incrementButtonProps}>
        {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    );
  }

  return (
    <div className={cn('flex gap-2', wrapperClassName)}>
      <Button {...decrementButtonProps} className={buttonClassName}>
        <Minus />
        <span className='sr-only'>Decrease quantity by one</span>
      </Button>
      <Input aria-label='Quantity' className={cn('text-center', inputClassName)} {...inputProps} />
      <Button {...incrementButtonProps} className={buttonClassName}>
        <Plus />
        <span className='sr-only'>Increase quantity by one</span>
      </Button>
    </div>
  );
}
