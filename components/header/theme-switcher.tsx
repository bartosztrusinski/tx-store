'use client';

import { type LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = {
  Icon: LucideIcon;
  label: string;
  mode: 'light' | 'dark' | 'system';
};

const defaultTheme: Theme = { Icon: Sun, label: 'Light', mode: 'light' };

const themes: Theme[] = [
  defaultTheme,
  { Icon: Moon, label: 'Dark', mode: 'dark' },
  { Icon: Monitor, label: 'System', mode: 'system' },
];

type Props = {
  withText?: boolean;
};

export function ThemeSwitcher({ withText = false }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const { setTheme, theme: activeTheme } = useTheme();
  const { Icon, label } = themes.find(({ mode }) => mode === activeTheme) ?? defaultTheme;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className='size-10'></div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='flex' size={withText ? 'default' : 'icon'} variant='ghost'>
          {withText && label}
          <Icon />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-1'>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map(({ label, mode }) => (
          <DropdownMenuCheckboxItem
            checked={activeTheme === mode}
            className='cursor-pointer'
            key={mode}
            onCheckedChange={() => setTheme(mode)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
