import { ArrowLeftCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/login-form';
import { getSession } from '@/lib/auth';
import { APP_NAME, DEFAULT_REDIRECT_PATH } from '@/lib/constants';

type Props = {
  searchParams: Promise<{ callbackPath?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await getSession();
  const { callbackPath = DEFAULT_REDIRECT_PATH } = await searchParams;

  if (session) {
    redirect(callbackPath);
  }

  return (
    <Card className='relative basis-full space-y-2'>
      <Link className='flex-center absolute left-1 top-1 gap-1 p-2 text-sm' href='/'>
        <ArrowLeftCircle className='size-5' />
        Back
      </Link>
      <CardHeader className='flex-center gap-1'>
        <Link className='p-0.5' href='/'>
          <Image alt={`${APP_NAME} logo`} height={36} src='/images/logo.svg' width={36} />
        </Link>
        <h1 className='heading-2'>Log In</h1>
        <p className='text-pretty text-center text-muted-foreground'>
          Sign in to your account to continue
        </p>
      </CardHeader>
      <CardContent>
        <LoginForm callbackPath={callbackPath} />
      </CardContent>
      <CardFooter>
        <p>
          Don&apos;t have an account?{' '}
          <Link className='underline' href='/register'>
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
