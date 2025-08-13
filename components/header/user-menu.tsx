import { LogOut, User } from 'lucide-react';
import Link from 'next/link';

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
import { logOut } from '@/lib/actions/auth';

type Props = {
  email: string;
  image?: string | null;
  name: string;
};

export function UserMenu({ email, image, name }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='transition-transform will-change-transform hover:scale-105'>
          <AvatarImage alt={`Avatar of ${name}`} src={image ?? undefined} />
          <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuLabel className='flex flex-col leading-snug'>
          <span>{name}</span>
          <span className='overflow-hidden text-ellipsis whitespace-nowrap font-normal text-muted-foreground'>
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href='/profile'>
            <User />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='p-0'>
          <form action={logOut}>
            <Button className='h-auto w-full justify-start px-2 py-1.5' variant='ghost'>
              <LogOut />
              Log Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
