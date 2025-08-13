import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className='flex-center h-screen flex-col gap-4 p-10 text-center'>
      <Image alt={`${APP_NAME} logo`} height={48} src='/images/logo.svg' width={48} />
      <div>
        <h1 className='heading-2'>Not Found</h1>
        <p className='mt-1 lg:text-lg'>Looks like this page got lost in the fashion jungle</p>
      </div>
      <Button asChild className='mt-4' variant='outline'>
        <Link href='/'>Back To Home</Link>
      </Button>
    </div>
  );
}
