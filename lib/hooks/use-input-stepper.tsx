import { type ButtonHTMLAttributes, type InputHTMLAttributes, useRef, useState } from 'react';

export function useInputStepper({
  max = Infinity,
  min = 0,
  onChange,
  value: externalValue,
}: {
  max?: number;
  min?: number;
  onChange?: (newValue: number) => void;
  value?: number;
} = {}) {
  const [internalValue, setInternalValue] = useState(externalValue ?? min);
  const [draftValue, setDraftValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const shouldCommitOnBlur = useRef(false);

  if (externalValue && !onChange) {
    throw new Error('You must provide an onChange handler when using a controlled InputStepper.');
  }

  const value = externalValue ?? internalValue;
  const handleChange = onChange ?? setInternalValue;
  const displayValue = isEditing ? draftValue : value;
  const clamp = (value: number) => Math.min(Math.max(value, min), max);

  function commitDraft() {
    const updatedValue = clamp(parseInt(draftValue, 10));

    if (draftValue !== '' && updatedValue !== value) {
      handleChange(updatedValue);
    }

    cancelEditing();
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function startEditing() {
    setIsEditing(true);
    setDraftValue(value.toString());
  }

  const inputProps = {
    inputMode: 'numeric',
    onBlur: () => shouldCommitOnBlur.current && commitDraft(),
    onChange: (event) => setDraftValue(event.target.value.replace(/[^0-9]/g, '')),
    onFocus: () => {
      startEditing();
      shouldCommitOnBlur.current = true;
    },
    onKeyDown: (event) => {
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
    },
    value: displayValue,
  } satisfies InputHTMLAttributes<HTMLInputElement>;

  const incrementButtonProps = {
    disabled: value >= max,
    onClick: () => {
      if (isEditing) cancelEditing();
      handleChange(clamp(value + 1));
    },
  } satisfies ButtonHTMLAttributes<HTMLButtonElement>;

  const decrementButtonProps = {
    disabled: value <= min,
    onClick: () => {
      if (isEditing) cancelEditing();
      handleChange(clamp(value - 1));
    },
  } satisfies ButtonHTMLAttributes<HTMLButtonElement>;

  return {
    decrementButtonProps,
    incrementButtonProps,
    inputProps,
    value,
  };
}
