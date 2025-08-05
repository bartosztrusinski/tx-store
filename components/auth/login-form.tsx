'use client';

import { useActionState, useId } from 'react';
import { logIn } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/alert';
import { FieldErrors } from './field-errors';

export function LoginForm() {
  const [state, action, isPending] = useActionState(logIn, { isSuccess: false });
  const id = useId();

  return (
    <form action={action} className='flex flex-col gap-5'>
      <div className='flex flex-col gap-1'>
        <Label htmlFor={`${id}-email`}>Email</Label>
        <Input
          id={`${id}-email`}
          type='email'
          name='email'
          placeholder='john@doe.com'
          autoComplete='email'
        />
        <FieldErrors errors={state?.errors?.email} />
      </div>
      <div className='flex flex-col gap-1'>
        <Label htmlFor={`${id}-password`}>Password</Label>
        <Input
          id={`${id}-password`}
          type='password'
          name='password'
          placeholder='********'
          autoComplete='current-password'
        />
        <FieldErrors errors={state?.errors?.password} />
      </div>

      {state?.message && (
        <Alert message={state.message} variant={state.isSuccess ? 'success' : 'error'} />
      )}

      <Button type='submit' disabled={isPending} className='mt-2'>
        {isPending ? 'Submitting...' : 'Log In'}
      </Button>
    </form>
  );
}
