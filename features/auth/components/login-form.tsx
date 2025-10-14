'use client';

import { useActionState, useId } from 'react';

import { Alert } from '@/components/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { logIn } from '../actions';
import { FieldErrors } from './field-errors';

type Props = {
  callbackPath: string;
};

export function LoginForm({ callbackPath }: Props) {
  const [state, action, isPending] = useActionState(logIn, { isSuccess: false });
  const id = useId();

  return (
    <form action={action} className='flex flex-col gap-5'>
      <div className='flex flex-col gap-1'>
        <Label htmlFor={`${id}-email`}>Email</Label>
        <Input
          autoComplete='email'
          id={`${id}-email`}
          name='email'
          placeholder='john@doe.com'
          required
          type='email'
        />
        <FieldErrors errors={state?.fieldErrors?.email} />
      </div>
      <div className='flex flex-col gap-1'>
        <Label htmlFor={`${id}-password`}>Password</Label>
        <Input
          autoComplete='current-password'
          id={`${id}-password`}
          name='password'
          placeholder='********'
          required
          type='password'
        />
        <FieldErrors errors={state?.fieldErrors?.password} />
      </div>

      <input name='callbackPath' type='hidden' value={callbackPath} />

      {state?.message && (
        <Alert message={state.message} variant={state.isSuccess ? 'success' : 'error'} />
      )}

      <Button className='mt-2' disabled={isPending} type='submit'>
        {isPending ? 'Submitting...' : 'Log In'}
      </Button>
    </form>
  );
}
