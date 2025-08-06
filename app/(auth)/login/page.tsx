import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ArrowLeftCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';
import { APP_NAME } from '@/lib/constants';
import { auth } from '@/lib/auth';

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

const DEFAULT_CALLBACK_URL = '/';

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { callbackUrl = DEFAULT_CALLBACK_URL } = await searchParams;

  if (session) {
    redirect(callbackUrl);
  }

  return (
    <Card className='relative basis-full space-y-2'>
      <Link href='/' className='flex-center absolute left-1 top-1 gap-1 p-2 text-sm'>
        <ArrowLeftCircle className='size-5' />
        Back
      </Link>
      <CardHeader className='flex-center'>
        <Link href='/' className='p-0.5'>
          <Image src='/images/logo.svg' alt={`${APP_NAME} logo`} width={36} height={36} />
        </Link>
        <h1 className='heading-2'>Log In</h1>
        <p className='text-pretty text-center text-muted-foreground'>
          Sign in to your account to continue
        </p>
      </CardHeader>
      <CardContent>
        <LoginForm callbackUrl={callbackUrl} />
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
