'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { register } from '@/lib/actions/auth';

import { FieldErrors } from './field-errors';

export function RegisterForm() {
  const [state, action, isPending] = useActionState(register, {
    isSuccess: false,
  });

  return (
    <form action={action} className='flex flex-col gap-3'>
      <Input name='name' placeholder='Name' />
      <FieldErrors errors={state.errors?.name} />
      <Input type='email' name='email' placeholder='Email' />
      <FieldErrors errors={state.errors?.email} />
      <Input type='password' name='password' placeholder='Password' />
      <FieldErrors errors={state.errors?.password} />
      <Input type='password' name='confirmPassword' placeholder='Repeat Password' />
      <FieldErrors errors={state.errors?.confirmPassword} />

      {state.message && (
        <p className='text-green-500' aria-live='polite'>
          {state.message}
        </p>
      )}
      <Button type='submit' disabled={isPending} className='mt-2'>
        {isPending ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </form>
  );
}
