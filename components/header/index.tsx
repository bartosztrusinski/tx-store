import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/lib/constants';

import { CategoryDrawer } from './category-drawer';
import { HeaderActions } from './header-actions';

export function Header() {
  return (
    <header className='sticky top-0 z-50 border-b border-transparent bg-background shadow dark:border-border'>
      <div className='wrapper flex-between gap-3 px-2 sm:gap-4 sm:px-4'>
        <section className='flex-center shrink-0 gap-3 md:gap-6'>
          <CategoryDrawer />
          <Link className='flex-center gap-1' href='/'>
            <Image
              alt={`${APP_NAME} logo`}
              height={32}
              priority
              src='/images/logo.svg'
              width={32}
            />
            <p className='heading-1 hidden md:block'>Store</p>
          </Link>
        </section>
        <section>
          <form className='flex-center gap-1 sm:gap-2'>
            <Input placeholder='Search' type='search' />
            <Button className='shrink-0' size='icon' type='submit'>
              <Search />
              <span className='sr-only'>Search</span>
            </Button>
          </form>
        </section>
        <HeaderActions />
      </div>
    </header>
  );
}
