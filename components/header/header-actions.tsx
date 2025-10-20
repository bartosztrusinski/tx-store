import { LogIn } from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CartDropdown } from '@/features/cart/components/cart-dropdown';
import { getCurrentUser } from '@/lib/auth';

import { HeaderActionsDrawer } from './header-actions-drawer';
import { ThemeSwitcher } from './theme-switcher';
import { UserMenu } from './user-menu';

// TODO Conditional rendering for mobile and desktop
export async function HeaderActions() {
  const user = await getCurrentUser();

  return (
    <ThemeProvider attribute='class' defaultTheme='system' disableTransitionOnChange enableSystem>
      <nav aria-label='User actions' className='hidden sm:block'>
        <ul className='flex items-center gap-2' role='menubar'>
          <li>
            <ThemeSwitcher />
          </li>
          <li>
            <CartDropdown />
          </li>
          <li>
            {user ?
              <UserMenu {...user} />
            : <Button asChild>
                <Link href='/login'>
                  <LogIn /> Sign In
                </Link>
              </Button>
            }
          </li>
        </ul>
      </nav>
      <div className='sm:hidden'>
        <HeaderActionsDrawer />
      </div>
    </ThemeProvider>
  );
}
