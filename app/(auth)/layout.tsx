import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <div className='flex-center mx-auto min-h-screen w-full max-w-sm p-4'>{children}</div>;
}
