import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from '@/components/ui/drawer';

export function CategoryDrawer() {
  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <Button variant='outline' size='icon'>
          <Menu />
          <span className='sr-only'>Open categories</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent
        handleDirection='right'
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
  );
}
