import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { logOut } from '@/lib/actions/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type Props = {
  email: string;
  name: string;
  image?: string | null;
};

export function UserMenu({ email, name, image }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={image ?? undefined} alt={`Avatar of ${name}`} />
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
            <Button variant='ghost' className='h-auto w-full justify-start px-2 py-1.5'>
              <LogOut />
              Log Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
