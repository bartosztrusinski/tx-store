import { type ReactNode } from 'react';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { NavigationBar } from '@/components/navigation-bar';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className='flex min-h-screen flex-col pb-14'>
      <Header />
      <main className='wrapper flex-1'>{children}</main>
      <Footer />
      <NavigationBar />
    </div>
  );
}
