import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ProductPrice } from '@/features/product/components/product-price';

import { getCartItems } from '../data';

export async function CartDrawer() {
  const cartItems = await getCartItems({
    createdAt: true,
    id: true,
    product: { select: { images: true, name: true, price: true, slug: true } },
    quantity: true,
  });
  const sortedCartItems = cartItems?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const hasItems = Array.isArray(cartItems) && cartItems.length > 0;
  const cartTotal = cartItems?.reduce(
    (total, item) => ({
      price: total.price + Number(item.product.price) * item.quantity,
      quantity: total.quantity + item.quantity,
    }),
    { price: 0, quantity: 0 },
  ) ?? { price: 0, quantity: 0 };

  return (
    <Drawer direction='right'>
      <DrawerTrigger asChild>
        <Button className='relative w-full' variant='ghost'>
          <ShoppingCart />
          {hasItems && (
            <span className='absolute right-1 top-1 w-4 rounded-md bg-primary text-xs font-medium text-primary-foreground'>
              {cartTotal.quantity}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className='inset-y-2 left-auto right-2 m-0 ml-2 min-w-64 max-w-80 rounded-lg after:hidden'
        style={{ '--initial-transform': 'calc(100% + 0.5rem)' } as React.CSSProperties}
      >
        <DrawerHeader>
          <DrawerTitle className='flex items-center justify-between gap-3'>
            <span>
              My cart{' '}
              {hasItems && (
                <span className='text-sm text-muted-foreground'>({cartTotal.quantity})</span>
              )}
            </span>
            {hasItems && (
              <span>
                Total: <ProductPrice price={cartTotal.price} size='sm' />
              </span>
            )}
          </DrawerTitle>
        </DrawerHeader>
        {hasItems ?
          <>
            <ul className='overflow-y-auto'>
              {sortedCartItems?.map((item) => (
                <li key={item.id}>
                  <DrawerClose asChild>
                    <Link
                      className='flex cursor-pointer items-center gap-3 px-3 py-2'
                      href={`/products/${item.product.slug}`}
                    >
                      {item.product.images[0] && (
                        <Image
                          alt={item.product.name}
                          className='grow-0 rounded-sm'
                          height={56}
                          src={item.product.images[0]}
                          width={56}
                        />
                      )}
                      <div className='grow'>
                        <p>{item.product.name}</p>
                        <div className='flex justify-between'>
                          <span className='text-sm text-muted-foreground'>
                            Quantity: {item.quantity}
                          </span>
                          <ProductPrice
                            price={Number(item.product.price) * item.quantity}
                            size='sm'
                          />
                        </div>
                      </div>
                    </Link>
                  </DrawerClose>
                </li>
              ))}
            </ul>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button asChild>
                  <Link
                    className='w-full cursor-pointer focus:bg-primary focus:text-primary-foreground focus-visible:hover:ring-0'
                    href='/'
                  >
                    View Cart
                  </Link>
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        : <p className='justify-center p-4 text-center'>The cart is empty.</p>}
      </DrawerContent>
    </Drawer>
  );
}
