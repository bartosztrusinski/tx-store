import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { CartProvider } from '@/features/cart/cart-context';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='flex min-h-screen flex-col font-sans'>
      <CartProvider>
        <Header />
        <main className='wrapper flex-1'>{children}</main>
      </CartProvider>
      <Footer />
    </div>
  );
}
