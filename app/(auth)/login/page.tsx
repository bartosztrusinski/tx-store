import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { login } from '@/lib/actions/auth';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  return (
    <Card className='basis-full space-y-2'>
      <CardHeader className='flex flex-col items-center gap-1'>
        <Image src='/images/logo.svg' alt={`${APP_NAME} logo`} width={36} height={36} />
        <h1 className='heading-2'>Login</h1>
      </CardHeader>
      <CardContent>
        <form action={login} className='flex flex-col gap-3'>
          <Input type='email' name='email' />
          <Input type='password' name='password' />
          <Button type='submit'>Login</Button>
        </form>
      </CardContent>
      <CardFooter>
        <p>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='underline'>
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
