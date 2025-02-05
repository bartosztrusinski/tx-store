import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ModeToggle } from '@/components/mode-toggle';
import { APP_NAME } from '@/lib/constants';
import logo from '@/public/logo.svg';

export function Header() {
  return (
    <header className='border-b'>
      <div className='wrapper flex-between gap-4'>
        <section className='flex-center gap-2 md:gap-4'>
          <Drawer direction='left'>
            <DrawerTrigger asChild>
              <Button variant='outline' size='icon' className='shrink-0'>
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent
              className='inset-y-2 left-2 m-0 w-full max-w-80 rounded-lg px-4 after:hidden'
              style={{ '--initial-transform': 'calc(100% + 0.5rem)' } as React.CSSProperties}
            >
              <DrawerHeader>
                <DrawerTitle>Categories</DrawerTitle>
                <DrawerDescription>Select a category</DrawerDescription>
              </DrawerHeader>
              <div className='mx-2 flex flex-col gap-2 overflow-y-auto'>
                <Button variant='ghost'>Tops</Button>
                <Button variant='ghost'>Pants</Button>
                <Button variant='ghost'>Shoes</Button>
                <Button variant='ghost'>Accessories</Button>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant='outline'>Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
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
