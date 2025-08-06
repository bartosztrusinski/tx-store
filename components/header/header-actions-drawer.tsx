import { EllipsisVertical, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { ThemeSwitcher } from './theme-switcher';

export function HeaderActionsDrawer() {
  return (
    <Drawer direction='right'>
      <DrawerTrigger asChild>
        <Button variant='ghost' className='px-2'>
          <EllipsisVertical />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent
        handleDirection='left'
        className='inset-y-2 left-auto right-2 m-0 w-full max-w-72 rounded-lg px-4 after:hidden'
        style={{ '--initial-transform': 'calc(100% + 0.5rem)' } as React.CSSProperties}
      >
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>
        <nav aria-label='User actions'>
          <ul role='menubar' className='flex flex-col gap-3 p-2'>
            <li>
              <Button variant='ghost' className='w-full'>
                <ShoppingCart /> Cart
              </Button>
            </li>
            <li>
              <Button className='w-full'>
                <User /> Sign In
              </Button>
            </li>
          </ul>
        </nav>
        <DrawerFooter className='space-y-1'>
          <ThemeSwitcher withText />
          <DrawerClose asChild>
            <Button variant='outline'>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
