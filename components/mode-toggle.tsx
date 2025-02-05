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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = {
  label: string;
  mode: 'light' | 'dark' | 'system';
  icon: LucideIcon;
};

const themes: Theme[] = [
  { label: 'Light', mode: 'light', icon: Sun },
  { label: 'Dark', mode: 'dark', icon: Moon },
  { label: 'System', mode: 'system', icon: Monitor },
];

export function ModeToggle() {
  const { theme: currentTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const ThemeIcon = themes.find((theme) => theme.mode === currentTheme)?.icon ?? Monitor;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          {isMounted && <ThemeIcon className='h-[1.2rem] w-[1.2rem]' />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {themes.map((theme) => (
          <DropdownMenuCheckboxItem
            key={theme.mode}
            checked={currentTheme === theme.mode}
            onCheckedChange={() => setTheme(theme.mode)}
            className='cursor-pointer'
          >
            {theme.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
