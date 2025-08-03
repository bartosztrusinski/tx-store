'use client';

import { useActionState } from 'react';
import { login } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SuccessAlert } from '@/components/success-alert';
import { ErrorAlert } from '@/components/error-alert';
import { FieldErrors } from './field-errors';

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, { isSuccess: false });

  return (
    <form action={action} className='flex flex-col gap-3'>
      <div>
        <Input type='email' name='email' placeholder='Email' autoComplete='email' />
        <FieldErrors errors={state?.errors?.email} />
      </div>
      <div>
        <Input
          type='password'
          name='password'
          placeholder='Password'
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
