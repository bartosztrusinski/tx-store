'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SuccessAlert } from '@/components/success-alert';
import { ErrorAlert } from '@/components/error-alert';
import { FieldErrors } from './field-errors';

export function RegisterForm() {
  const [state, action, isPending] = useActionState(register, { isSuccess: false });

  return (
    <form action={action} className='flex flex-col gap-3'>
      <div>
        <Input type='email' name='email' placeholder='Email' autoComplete='email' />
        <FieldErrors errors={state.errors?.email} />
      </div>
      <div>
        <Input name='name' placeholder='Name' autoComplete='name' />
        <FieldErrors errors={state.errors?.name} />
      </div>
      <div>
        <Input type='password' name='password' placeholder='Password' autoComplete='new-password' />
        <FieldErrors errors={state.errors?.password} />
      </div>
      <div>
        <Input
          type='password'
          name='confirmPassword'
          placeholder='Repeat Password'
          autoComplete='new-password'
        />
        <FieldErrors errors={state.errors?.confirmPassword} />
      </div>

      {state?.message &&
        (state.isSuccess ?
          <SuccessAlert message={state.message} />
        : <ErrorAlert message={state.message} />)}

      <Button type='submit' disabled={isPending} className='mt-2'>
        {isPending ? 'Submitting...' : 'Sign Up'}
      </Button>
    </form>
  );
}
