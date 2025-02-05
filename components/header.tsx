import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, ShoppingCart, Sun, User } from 'lucide-react';

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
import { APP_NAME } from '@/lib/constants';

export default function Header() {
  return (
    <header className='border-b'>
      <div className='wrapper flex-between gap-4'>
        <section className='flex-center gap-2 md:gap-4'>
          <Drawer direction='left'>
            <DrawerTrigger asChild>
              <Button variant='outline'>
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
              <div className='flex-center mx-2 flex-col gap-2 overflow-y-auto'>
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
            <Image src='logo.svg' alt={`${APP_NAME} logo`} width={32} height={32} priority />
            <p className='heading-1 hidden md:block'>Store</p>
          </Link>
        </section>
        <section>
          <form className='flex-center gap-2'>
            <Input type='search' placeholder='Search' />
            <Button type='submit'>
              <Search />
            </Button>
          </form>
        </section>
        <section className='hidden space-x-2 sm:block'>
          <Button variant='ghost'>
            <Sun />
          </Button>
          <Button variant='ghost'>
            <ShoppingCart /> Cart
          </Button>
          <Button>
            <User /> Sign In
          </Button>
        </section>
      </div>
    </header>
  );
}
