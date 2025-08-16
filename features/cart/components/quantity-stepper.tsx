'use client';

import { Minus, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  max: number;
  min?: number;
  onChange: (quantity: number) => void;
  onDecrement: () => void;
  onIncrement: () => void;
  quantity: number;
};

export function QuantityStepper({
  max,
  min = 0,
  onChange,
  onDecrement,
  onIncrement,
  quantity,
}: Props) {
  const [inputValue, setInputValue] = useState<string>(quantity.toString());
  const clamp = (value: number) => Math.min(Math.max(value, min), max);
  const isCancelling = useRef(false);

  useEffect(() => {
    if (quantity.toString() !== inputValue) {
      setInputValue(quantity.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity]);

  function commitValue() {
    if (inputValue === '') {
      setInputValue(quantity.toString());
      return;
    }

    const updatedValue = clamp(parseInt(inputValue, 10));

    if (updatedValue !== quantity) {
      onChange(updatedValue);
    }

    setInputValue(updatedValue.toString());
  }

  return (
    <div className='flex items-center gap-2'>
      <Button disabled={quantity <= min} onClick={onDecrement}>
        <Minus />
        <span className='sr-only'>Decrease value by one</span>
      </Button>
      <Input
        aria-label='Quantity'
        className='text-center'
        inputMode='numeric'
        onBlur={() => {
          if (isCancelling.current) {
            isCancelling.current = false;
            return;
          }

          commitValue();
        }}
        onChange={(event) => setInputValue(event.target.value.replace(/[^0-9]/g, ''))}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commitValue();
            event.currentTarget.blur();
          }

          if (event.key === 'Escape') {
            isCancelling.current = true;
            setInputValue(quantity.toString());
            event.currentTarget.blur();
          }
        }}
        value={inputValue}
      />
      <Button disabled={quantity >= max} onClick={onIncrement}>
        <Plus />
        <span className='sr-only'>Increase value by one</span>
      </Button>
    </div>
  );
}
