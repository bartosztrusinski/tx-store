import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { register } from '@/lib/actions/auth';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  return (
    <Card className='basis-full space-y-2'>
      <CardHeader className='flex flex-col items-center gap-1'>
        <Image src='/images/logo.svg' alt={`${APP_NAME} logo`} width={36} height={36} />
        <h1 className='heading-2'>Sign Up</h1>
        <p className='text-pretty text-center text-muted-foreground'>
          Create an account to get started with {APP_NAME}.
        </p>
      </CardHeader>
      <CardContent>
        <form action={register} className='flex flex-col gap-3'>
          <Input name='name' placeholder='Name' />
          <Input type='email' name='email' placeholder='Email' />
          <Input type='password' name='password' placeholder='Password' />
          <Input type='password' name='password-confirm' placeholder='Repeat Password' />
          <Button type='submit'>Sign Up</Button>
        </form>
      </CardContent>
      <CardFooter>
        <p>
          Already have an account?{' '}
          <Link href='/login' className='underline'>
            Log In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
