import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/register-form';
import { APP_NAME } from '@/lib/constants';

export default function RegisterPage() {
  return (
    <Card className='basis-full space-y-2'>
      <CardHeader className='flex-center gap-1'>
        <Image src='/images/logo.svg' alt={`${APP_NAME} logo`} width={36} height={36} />
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
