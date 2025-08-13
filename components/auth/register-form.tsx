'use client';

import { useActionState, useId } from 'react';

import { Alert } from '@/components/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/lib/actions/auth';

import { FieldErrors } from './field-errors';

type Props = {
  callbackUrl: string;
};

export function RegisterForm({ callbackUrl }: Props) {
  const [state, action, isPending] = useActionState(register, { isSuccess: false });
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
          type='email'
        />
        <FieldErrors errors={state.errors?.email} />
      </div>
      <div className='flex flex-col gap-1'>
        <Label htmlFor={`${id}-name`}>Name</Label>
        <Input autoComplete='name' id={`${id}-name`} name='name' placeholder='John Doe' />
        <FieldErrors errors={state.errors?.name} />
      </div>
      <div className='flex flex-col gap-1'>
        <Label htmlFor={`${id}-password`}>Password</Label>
        <Input
          autoComplete='new-password'
          id={`${id}-password`}
          name='password'
          placeholder='********'
          type='password'
        />
        <FieldErrors errors={state.errors?.password} />
      </div>
      <div className='flex flex-col gap-1'>
        <Label htmlFor={`${id}-confirmPassword`}>Repeat Password</Label>
        <Input
          autoComplete='new-password'
          id={`${id}-confirmPassword`}
          name='confirmPassword'
          placeholder='********'
          type='password'
        />
        <FieldErrors errors={state.errors?.confirmPassword} />
      </div>

      <input name='callbackUrl' type='hidden' value={callbackUrl} />
      <FieldErrors errors={state?.errors?.callbackUrl} />

      {state?.message && (
        <Alert message={state.message} variant={state.isSuccess ? 'success' : 'error'} />
      )}

      <Button className='mt-2' disabled={isPending} type='submit'>
        {isPending ? 'Submitting...' : 'Sign Up'}
      </Button>
    </form>
  );
}
