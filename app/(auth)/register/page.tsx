import { ArrowLeftCircle } from 'lucide-react';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { RegisterForm } from '@/features/auth/components/register-form';
import { auth } from '@/lib/auth';
import { APP_NAME } from '@/lib/constants';

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

const DEFAULT_CALLBACK_URL = '/';

export default async function RegisterPage({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { callbackUrl = DEFAULT_CALLBACK_URL } = await searchParams;

  if (session) {
    redirect(callbackUrl);
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
        <h1 className='heading-2'>Sign Up</h1>
        <p className='text-pretty text-center text-muted-foreground'>
          Create an account to get started with {APP_NAME}
        </p>
      </CardHeader>
      <CardContent>
        <RegisterForm callbackUrl={callbackUrl} />
      </CardContent>
      <CardFooter>
        <p>
          Already have an account?{' '}
          <Link className='underline' href='/login'>
            Log In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
