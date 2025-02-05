import Image from 'next/image';
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

export default function Header() {
  return (
    <header className='border-b'>
      <div className='wrapper flex-between gap-4 p-4 sm:p-5'>
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
          <div className='flex-center shrink-0 gap-1'>
            <Image src='logo.svg' alt='tx store logo' width={32} height={32} />
            <p className='heading-1 hidden md:block'>Store</p>
          </div>
        </section>
        <section className='self-center'>
          <form className='flex-start gap-2'>
            <Input type='search' placeholder='Search' />
            <Button type='submit'>
              <Search />
            </Button>
          </form>
        </section>
        <section className='hidden gap-2 sm:flex'>
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
