import Image from 'next/image';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <>
      <div className='flex items-center gap-1 p-2 bg-white text-black'>
        <Image src='logo.svg' alt='tx store logo' width={32} height={32} />
        <p>Store</p>
      </div>
      <div className='flex-center p-4'>
        <Button>Get Started</Button>
      </div>
    </>
  );
}
