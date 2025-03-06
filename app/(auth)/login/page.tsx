import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  return (
    <Card className='basis-full space-y-2'>
      <CardHeader className='flex-center gap-1'>
        <Image src='/images/logo.svg' alt={`${APP_NAME} logo`} width={36} height={36} />
        <h1 className='heading-2'>Log In</h1>
        <p className='text-pretty text-center text-muted-foreground'>
          Sign in to your account to continue
        </p>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter>
        <p>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='underline'>
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
