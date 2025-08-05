import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ArrowLeftCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/register-form';
import { APP_NAME } from '@/lib/constants';
import { auth } from '@/lib/auth';

export default async function RegisterPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect('/');
  }

  return (
    <Card className='relative basis-full space-y-2'>
      <Link href='/' className='flex-center absolute left-1 top-1 gap-1 p-2 text-sm'>
        <ArrowLeftCircle className='size-5' />
        Back
      </Link>
      <CardHeader className='flex-center gap-1'>
        <Link href='/' className='p-0.5'>
          <Image src='/images/logo.svg' alt={`${APP_NAME} logo`} width={36} height={36} />
        </Link>
        <h1 className='heading-2'>Sign Up</h1>
        <p className='text-pretty text-center text-muted-foreground'>
          Create an account to get started with {APP_NAME}
        </p>
      </CardHeader>
      <CardContent>
        <RegisterForm />
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
