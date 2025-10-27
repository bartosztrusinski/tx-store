'use client';

import { type LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type ComponentProps, type ReactNode, useEffect, useState } from 'react';

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

export function ThemeIcon(props: ComponentProps<LucideIcon>) {
  const { Icon } = useCurrentTheme();
  return <Icon {...props} />;
}

export function ThemeLabel(props: ComponentProps<'span'>) {
  const { label } = useCurrentTheme();
  return <span {...props}>{label}</span>;
}

export function ThemeSwitcher({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const { setTheme, theme: activeTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <DropdownMenu>
      {children}
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

export function ThemeSwitcherTrigger(props: ComponentProps<typeof DropdownMenuTrigger>) {
  return <DropdownMenuTrigger {...props} />;
}

function useCurrentTheme(): Theme {
  const { theme: activeTheme } = useTheme();
  return themes.find(({ mode }) => mode === activeTheme) ?? defaultTheme;
}
