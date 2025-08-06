import Link from 'next/link';
import { headers } from 'next/headers';
import { LogIn, ShoppingCart } from 'lucide-react';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { HeaderActionsDrawer } from './header-actions-drawer';
import { ThemeSwitcher } from './theme-switcher';
import { UserMenu } from './user-menu';

// TODO Conditional rendering for mobile and desktop
export async function HeaderActions() {
  const session = await auth.api.getSession({ headers: await headers() });

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
            {session ?
              <UserMenu {...session.user} />
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
    </>
  );
}
