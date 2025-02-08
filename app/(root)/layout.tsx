import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='flex min-h-screen flex-col font-sans'>
      <Header />
      <main className='wrapper flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
