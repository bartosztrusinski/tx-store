import Image from 'next/image';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';

export function Logo() {
  return (
    <Link className='flex-center shrink-0 gap-1' href='/'>
      <Image alt={`${APP_NAME} logo`} height={32} priority src='/images/logo.svg' width={32} />
      <span className='heading-1'>Store</span>
    </Link>
  );
}
