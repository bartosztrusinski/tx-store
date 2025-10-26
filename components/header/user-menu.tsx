import { LogIn, LogOut, User, UserIcon, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { type ComponentProps, type ReactNode } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logOut } from '@/features/auth/actions';
import { getCurrentUser } from '@/lib/auth';

export async function UserAvatar(props: ComponentProps<typeof Avatar>) {
  const user = await getCurrentUser();

  return (
    <Avatar {...props}>
      {user ?
        <>
          <AvatarImage alt={`Avatar of ${user.name}`} src={user.image ?? undefined} />
          <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
        </>
      : <AvatarFallback className='bg-inherit'>
          <User />
        </AvatarFallback>
      }
    </Avatar>
  );
}

export async function UserMenu({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <DropdownMenu>
      {children}
      <DropdownMenuContent className='w-44'>
        <DropdownMenuLabel className='flex flex-col leading-snug'>
          {user ?
            <>
              {user.name}
              <span className='overflow-hidden text-ellipsis whitespace-nowrap font-normal text-muted-foreground'>
                {user.email}
              </span>
            </>
          : 'Your Account'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user ?
          <>
            <DropdownMenuItem asChild>
              <Link href='/profile'>
                <UserIcon />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className='p-0'>
              <form action={logOut}>
                <Button
                  className='h-auto w-full justify-start px-2 py-1.5 font-normal'
                  type='submit'
                  variant='ghost'
                >
                  <LogOut />
                  Log Out
                </Button>
              </form>
            </DropdownMenuItem>
          </>
        : <>
            <DropdownMenuItem asChild>
              <Link href='/login'>
                <LogIn />
                Log In
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/register'>
                <UserPlus />
                Register
              </Link>
            </DropdownMenuItem>
          </>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserMenuTrigger(props: ComponentProps<typeof DropdownMenuTrigger>) {
  return <DropdownMenuTrigger {...props} />;
}
