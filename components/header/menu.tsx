import { ShoppingCart, User } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { MenuDrawer } from './menu-drawer';
import { ModeToggle } from './mode-toggle';

export function Menu() {
  return (
    <nav>
      <ul role='menubar' className='hidden items-center gap-2 sm:flex'>
        <li>
          <Button variant='ghost'>
            <ShoppingCart /> Cart
          </Button>
        </li>
        <li>
          <Button>
            <User /> Sign In
          </Button>
        </li>
        <li>
          <ModeToggle />
        </li>
      </ul>
      <div className='sm:hidden'>
        <MenuDrawer />
      </div>
    </nav>
  );
}
