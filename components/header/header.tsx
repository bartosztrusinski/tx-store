import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ModeToggle } from '@/components/header/mode-toggle';
import { CategoryDrawer } from '@/components/header/category-drawer';
import { APP_NAME } from '@/lib/constants';
import logo from '@/public/logo.svg';

export function Header() {
  return (
    <header className='border-b'>
      <div className='wrapper flex-between gap-4'>
        <section className='flex-center gap-2 md:gap-4'>
          <CategoryDrawer />
          <Link href='/' className='flex-center shrink-0 gap-1'>
            <Image src={logo} alt={`${APP_NAME} logo`} width={32} height={32} priority />
            <p className='heading-1 hidden md:block'>Store</p>
          </Link>
        </section>
        <section>
          <form className='flex-center gap-2'>
            <Input type='search' placeholder='Search' />
            <Button type='submit' size='icon' className='shrink-0'>
              <Search />
            </Button>
          </form>
        </section>
        <section className='hidden gap-2 sm:flex'>
          <Button variant='ghost'>
            <ShoppingCart /> Cart
          </Button>
          <Button>
            <User /> Sign In
          </Button>
          <ModeToggle />
        </section>
      </div>
    </header>
  );
}
