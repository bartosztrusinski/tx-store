'use client';

import { useActionState, useId } from 'react';
import { register } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SuccessAlert } from '@/components/success-alert';
import { ErrorAlert } from '@/components/error-alert';
import { FieldErrors } from './field-errors';
import { Label } from '@/components/ui/label';

export function RegisterForm() {
  const [state, action, isPending] = useActionState(register, { isSuccess: false });
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
        <FieldErrors errors={state.errors?.email} />
      </div>
      <div className='flex flex-col gap-1'>
        <Label htmlFor={`${id}-name`}>Name</Label>
        <Input id={`${id}-name`} name='name' placeholder='John Doe' autoComplete='name' />
        <FieldErrors errors={state.errors?.name} />
      </div>
      <div className='flex flex-col gap-1'>
        <Label htmlFor={`${id}-password`}>Password</Label>
        <Input
          id={`${id}-password`}
          type='password'
          name='password'
          placeholder='********'
          autoComplete='new-password'
        />
        <FieldErrors errors={state.errors?.password} />
      </div>
      <div className='flex flex-col gap-1'>
        <Label htmlFor={`${id}-confirmPassword`}>Repeat Password</Label>
        <Input
          id={`${id}-confirmPassword`}
          type='password'
          name='confirmPassword'
          placeholder='********'
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
