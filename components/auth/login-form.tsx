'use client';

import { useActionState, useId } from 'react';
import { login } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SuccessAlert } from '@/components/success-alert';
import { ErrorAlert } from '@/components/error-alert';
import { FieldErrors } from './field-errors';

export function LoginForm() {
  const id = useId();
  const [state, action, isPending] = useActionState(login, { isSuccess: false });

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
