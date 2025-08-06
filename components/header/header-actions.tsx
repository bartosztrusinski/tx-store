import Link from 'next/link';
import { LogIn, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeaderActionsDrawer } from './header-actions-drawer';
import { ThemeSwitcher } from './theme-switcher';

// TODO Conditional rendering for mobile and desktop
export async function HeaderActions() {
  return (
    <>
      <nav aria-label='User actions' className='hidden sm:block'>
        <ul role='menubar' className='flex items-center gap-2'>
          <li>
            <ThemeSwitcher />
          </li>
          <li>
            <Button variant='ghost'>
              <ShoppingCart /> Cart
            </Button>
          </li>
          <li>
            <Button asChild>
              <Link href='/login'>
                <LogIn /> Sign In
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
      <div className='sm:hidden'>
        <HeaderActionsDrawer />
      </div>
    </>
  );
}
