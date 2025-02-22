import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { CategoryDrawer } from './category-drawer';
import { Menu } from './menu';

import { APP_NAME } from '@/lib/constants';

export function Header() {
  return (
    <header className='sticky top-0 z-50 border-b border-transparent bg-background shadow dark:border-border'>
      <div className='wrapper flex-between gap-3 px-2 sm:gap-4 sm:px-4'>
        <section className='flex-center shrink-0 gap-3 md:gap-6'>
          <CategoryDrawer />
          <Link href='/' className='flex-center gap-1'>
            <Image
              src='/images/logo.svg'
              alt={`${APP_NAME} logo`}
              width={32}
              height={32}
              priority
            />
            <p className='heading-1 hidden md:block'>Store</p>
          </Link>
        </section>
        <section>
          <form className='flex-center gap-1 sm:gap-2'>
            <Input type='search' placeholder='Search' />
            <Button type='submit' size='icon' className='shrink-0'>
              <Search />
              <span className='sr-only'>Search</span>
            </Button>
          </form>
        </section>
        <Menu />
      </div>
    </header>
  );
}
