import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

type Props = {
  currentValue: number;
  maxValue: number;
  minValue: number;
  onDecrement: () => void;
  onIncrement: () => void;
};

export function QuantityStepper({
  currentValue,
  maxValue,
  minValue,
  onDecrement,
  onIncrement,
}: Props) {
  return (
    <div className='flex items-center gap-2'>
      <Button disabled={currentValue < minValue} onClick={onDecrement}>
        <Minus />
        <span className='sr-only'>Decrement value</span>
      </Button>
      <span className='grow text-center text-xl'>{currentValue}</span>
      <Button disabled={currentValue >= maxValue} onClick={onIncrement}>
        <Plus />
        <span className='sr-only'>Increment value</span>
      </Button>
    </div>
  );
}
