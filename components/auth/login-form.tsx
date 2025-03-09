'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SuccessAlert } from '@/components/success-alert';
import { ErrorAlert } from '@/components/error-alert';
import { login } from '@/lib/actions/auth';

import { FieldErrors } from './field-errors';

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, {
    isSuccess: false,
  });

  return (
    <form action={action} className='flex flex-col gap-3'>
      <Input type='email' name='email' placeholder='Email' />
      <FieldErrors errors={state?.errors?.email} />
      <Input type='password' name='password' placeholder='Password' />
      <FieldErrors errors={state?.errors?.password} />

      {state?.message &&
        (state.isSuccess ?
          <SuccessAlert message={state.message} />
        : <ErrorAlert message={state.message} />)}

      <Button type='submit' disabled={isPending} className='mt-2'>
        {isPending ? 'Submitting...' : 'Log In'}
      </Button>
    </form>
  );
}
