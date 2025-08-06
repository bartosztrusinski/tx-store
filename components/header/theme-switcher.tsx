'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
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
  label: string;
  mode: 'light' | 'dark' | 'system';
  Icon: LucideIcon;
};

const themes: Theme[] = [
  { label: 'Light', mode: 'light', Icon: Sun },
  { label: 'Dark', mode: 'dark', Icon: Moon },
  { label: 'System', mode: 'system', Icon: Monitor },
];

type Props = {
  withText?: boolean;
};

export function ThemeSwitcher({ withText = false }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme: activeTheme, setTheme } = useTheme();
  const { Icon, label } = themes.find(({ mode }) => mode === activeTheme) ?? themes[0];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size={withText ? 'default' : 'icon'} className='flex'>
          {withText && label}
          {isMounted && <Icon className='h-[1.2rem] w-[1.2rem]' />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-1'>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map(({ mode, label }) => (
          <DropdownMenuCheckboxItem
            key={mode}
            checked={activeTheme === mode}
            onCheckedChange={() => setTheme(mode)}
            className='cursor-pointer'
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
