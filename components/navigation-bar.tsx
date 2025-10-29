import { Home, type LucideIcon, Menu, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { type ComponentType, type ReactNode } from 'react';

import {
  AccountAvatar,
  AccountDropdown,
  AccountDropdownTrigger,
} from '@/components/account-dropdown';
import { CategoryDrawer, CategoryDrawerTrigger } from '@/components/category-drawer';
import { ThemeIcon, ThemeSwitcher, ThemeSwitcherTrigger } from '@/components/theme-switcher';
import { CartDrawer, CartDrawerTrigger } from '@/features/cart/components/cart-drawer';

type NavigationItem = {
  Icon: ComponentType<{ className?: string }> | LucideIcon;
  label: string;
  Wrapper: ComponentType<{ children: ReactNode; className?: string }>;
};

const navItems: NavigationItem[] = [
  {
    Icon: Home,
    label: 'Start',
    Wrapper: ({ children, className }) => (
      <Link className={className} href='/'>
        {children}
      </Link>
    ),
  },
  {
    Icon: Menu,
    label: 'Categories',
    Wrapper: ({ children, className }) => (
      <CategoryDrawer>
        <CategoryDrawerTrigger className={className}>{children}</CategoryDrawerTrigger>
      </CategoryDrawer>
    ),
  },
  {
    Icon: ShoppingCart,
    label: 'Cart',
    Wrapper: ({ children, className }) => (
      <CartDrawer>
        {(hasItems, totalQuantity) => (
          <CartDrawerTrigger className={`relative ${className}`}>
            {children}
            {hasItems && (
              <span className='absolute -top-0.5 left-[55%] min-w-3 rounded-sm bg-primary px-px font-normal text-primary-foreground'>
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </span>
            )}
          </CartDrawerTrigger>
        )}
      </CartDrawer>
    ),
  },
  {
    Icon: AccountAvatar,
    label: 'Account',
    Wrapper: ({ children, className }) => (
      <AccountDropdown>
        <AccountDropdownTrigger className={className}>{children}</AccountDropdownTrigger>
      </AccountDropdown>
    ),
  },
  {
    Icon: ThemeIcon,
    label: 'Theme',
    Wrapper: ({ children, className }) => (
      <ThemeSwitcher>
        <ThemeSwitcherTrigger className={className}>{children}</ThemeSwitcherTrigger>
      </ThemeSwitcher>
    ),
  },
];

export function NavigationBar() {
  return (
    <nav className='fixed inset-x-0 bottom-0 border-t border-border bg-background shadow'>
      <ul className='flex-between py-2'>
        {navItems.map(({ Icon, label, Wrapper }, index) => (
          <li className='grow basis-0' key={index}>
            <Wrapper className='flex-center w-full flex-col gap-0 text-xs'>
              <Icon className='size-6' />
              {label}
            </Wrapper>
          </li>
        ))}
      </ul>
    </nav>
  );
}
