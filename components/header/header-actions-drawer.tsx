import { EllipsisVertical, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
        <Button className='px-2' variant='ghost'>
          <EllipsisVertical />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className='inset-y-2 left-auto right-2 m-0 w-[calc(100%-theme(spacing.4))] max-w-64 rounded-lg after:hidden'
        handleDirection='left'
        style={{ '--initial-transform': 'calc(100% + 0.5rem)' } as React.CSSProperties}
      >
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <nav aria-label='User actions'>
          <ul className='flex flex-col gap-3 p-2 px-4' role='menubar'>
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
