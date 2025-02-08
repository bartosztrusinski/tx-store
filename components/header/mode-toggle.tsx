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
  icon: LucideIcon;
};

const themes: Theme[] = [
  { label: 'Light', mode: 'light', icon: Sun },
  { label: 'Dark', mode: 'dark', icon: Moon },
  { label: 'System', mode: 'system', icon: Monitor },
];

type Props = {
  showLabel?: boolean;
};

export function ModeToggle({ showLabel = false }: Props) {
  const { theme: currentTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const themeConfig = themes.find((theme) => theme.mode === currentTheme);
  const themeLabel = themeConfig?.label ?? 'Theme';
  const ThemeIcon = themeConfig?.icon ?? Monitor;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size={showLabel ? 'default' : 'icon'}>
          {showLabel && themeLabel}
          {isMounted && <ThemeIcon className='h-[1.2rem] w-[1.2rem]' />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-1'>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
