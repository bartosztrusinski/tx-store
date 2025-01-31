import Image from 'next/image';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <>
      <div className='flex gap-1 items-center'>
        <Image src='logo.svg' alt='tx store logo' width={32} height={32} />
        <p className='heading-1'>Store</p>
      </div>
      <div className='text-center p-4'>
        <Button>Get Started</Button>
      </div>
    </>
  );
}
