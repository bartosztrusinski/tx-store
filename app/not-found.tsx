import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

import logo from '@/public/logo.svg';
import { APP_NAME } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className='flex-center h-screen flex-col gap-4 p-10 text-center'>
      <Image src={logo} alt={`${APP_NAME} logo`} width={48} height={48} />
      <div>
        <h1 className='heading-2'>Not Found</h1>
        <p className='mt-1 lg:text-lg'>Looks like this page got lost in the fashion jungle</p>
      </div>
      <Button asChild variant='outline' className='mt-4'>
        <Link href='/'>Back To Home</Link>
      </Button>
    </div>
  );
}
