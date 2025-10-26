import { type CSSProperties, type ReactNode } from 'react';

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

export function CategoryDrawer({ children }: { children: ReactNode }) {
  return (
    <Drawer direction='left'>
      {children}
      <DrawerContent
        className='inset-2 m-0 max-w-80 rounded-lg px-4 after:hidden'
        handleDirection='right'
        style={{ '--initial-transform': 'calc(100% + 0.5rem)' } as CSSProperties}
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
  );
}

export function CategoryDrawerTrigger(props: React.ComponentProps<typeof DrawerTrigger>) {
  return <DrawerTrigger {...props} />;
}
