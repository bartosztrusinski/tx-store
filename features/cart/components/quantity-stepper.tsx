'use client';

import { Minus, Plus } from 'lucide-react';
import { useRef, useState } from 'react';

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
  const [draftValue, setDraftValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const shouldCommitOnBlur = useRef(false);
  const displayValue = isEditing ? draftValue : quantity;
  const clamp = (quantity: number) => Math.min(Math.max(quantity, min), max);

  function commitDraft() {
    const updatedQuantity = clamp(parseInt(draftValue, 10));

    if (draftValue !== '' && updatedQuantity !== quantity) {
      onChange(updatedQuantity);
    }

    cancelEditing();
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function startEditing() {
    setIsEditing(true);
    setDraftValue(quantity.toString());
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        disabled={quantity <= min}
        onClick={() => {
          if (isEditing) cancelEditing();
          onDecrement();
        }}
      >
        <Minus />
        <span className='sr-only'>Decrease quantity by one</span>
      </Button>
      <Input
        aria-label='Quantity'
        className='text-center'
        inputMode='numeric'
        onBlur={() => shouldCommitOnBlur.current && commitDraft()}
        onChange={(event) => setDraftValue(event.target.value.replace(/[^0-9]/g, ''))}
        onFocus={() => {
          startEditing();
          shouldCommitOnBlur.current = true;
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commitDraft();
            shouldCommitOnBlur.current = false;
            event.currentTarget.blur();
          }

          if (event.key === 'Escape') {
            cancelEditing();
            shouldCommitOnBlur.current = false;
            event.currentTarget.blur();
          }
        }}
        value={displayValue}
      />
      <Button
        disabled={quantity >= max}
        onClick={() => {
          if (isEditing) cancelEditing();
          onIncrement();
        }}
      >
        <Plus />
        <span className='sr-only'>Increase quantity by one</span>
      </Button>
    </div>
  );
}
