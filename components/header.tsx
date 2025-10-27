import { Logo } from '@/components/logo';

import { SearchBar } from './search-bar';

export function Header() {
  return (
    <header className='flex-between sticky top-0 z-10 gap-3 border-b border-transparent bg-background px-4 py-3 shadow dark:border-border'>
      <Logo />
      <SearchBar />
    </header>
  );
}
