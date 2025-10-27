import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  return (
    <form className='flex-center gap-1 sm:gap-2'>
      <Input className='text-sm' name='query' placeholder='Search' type='search' />
      <Button className='shrink-0' size='icon' type='submit'>
        <Search />
        <span className='sr-only'>Search</span>
      </Button>
    </form>
  );
}
