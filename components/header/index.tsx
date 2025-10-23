import Image from 'next/image';
import Link from 'next/link';

import { SearchBar } from '@/components/header/search-bar';
import { APP_NAME } from '@/lib/constants';

export function Header() {
  return (
    <header className='flex-between sticky top-0 z-10 gap-3 border-b border-transparent bg-background px-4 py-3 shadow dark:border-border'>
      <Link className='flex-center shrink-0 gap-1' href='/'>
        <Image alt={`${APP_NAME} logo`} height={32} priority src='/images/logo.svg' width={32} />
        <span className='heading-1'>Store</span>
      </Link>
      <SearchBar />
    </header>
  );
}
