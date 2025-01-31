import Image from 'next/image';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <>
      <div className="flex items-center gap-1">
        <Image src="logo.svg" alt="tx store logo" width={32} height={32} />
        <p className="heading-1">Store</p>
      </div>
      <div className="p-4 text-center">
        <Button>Get Started</Button>
      </div>
    </>
  );
}
