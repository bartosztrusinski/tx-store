import Image from 'next/image';
import Link from 'next/link';
import { type ComponentProps, type CSSProperties, type ReactNode } from 'react';

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
import { CartItemQuantityStepper } from '@/features/cart/components/cart-item-quantity-stepper';
import { ProductPrice } from '@/features/product/components/product-price';

import { getCartItems } from '../data';

export async function CartDrawer({
  children,
}: {
  children: ReactNode | ((hasItems: boolean, totalQuantity: number) => ReactNode);
}) {
  const cartItems = await getCartItems({
    id: true,
    product: { select: { images: true, name: true, price: true, slug: true, stock: true } },
    quantity: true,
  });
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
      {typeof children === 'function' ? children(hasItems, cartTotal.quantity) : children}
      <DrawerContent
        className='inset-y-2 left-auto right-2 m-0 ml-2 min-w-64 max-w-80 rounded-lg after:hidden'
        style={{ '--initial-transform': 'calc(100% + 0.5rem)' } as CSSProperties}
      >
        <DrawerHeader>
          <DrawerTitle className='flex-between gap-3'>
            <span>
              My cart{' '}
              {hasItems && (
                <span className='text-sm text-muted-foreground'>({cartTotal.quantity})</span>
              )}
            </span>
            {hasItems && (
              <span className='text-base'>
                Total: <ProductPrice price={cartTotal.price} />
              </span>
            )}
          </DrawerTitle>
        </DrawerHeader>
        {hasItems ?
          <>
            <ul className='overflow-y-auto'>
              {cartItems.map((item) => (
                <li className='flex flex-col gap-1 p-3' key={item.id}>
                  <DrawerClose asChild className='flex gap-2'>
                    <Link href={`/products/${item.product.slug}`}>
                      {item.product.images[0] && (
                        <Image
                          alt={item.product.name}
                          className='rounded-sm'
                          height={76}
                          src={item.product.images[0]}
                          width={76}
                        />
                      )}
                      <p>{item.product.name}</p>
                    </Link>
                  </DrawerClose>
                  <div className='flex-between gap-3'>
                    <CartItemQuantityStepper
                      buttonClassName='size-8'
                      inputClassName='h-8 w-14 p-1'
                      productSlug={item.product.slug}
                      quantity={item.quantity}
                      showInitialCta={false}
                      stock={item.product.stock}
                    />
                    <div className='font-semibold'>
                      <ProductPrice price={Number(item.product.price) * item.quantity} />
                      <div className='text-sm text-muted-foreground'>
                        <ProductPrice price={Number(item.product.price)} /> each
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button asChild>
                  <Link
                    className='w-full cursor-pointer focus:bg-primary focus:text-primary-foreground focus-visible:hover:ring-0'
                    href='/cart'
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

export function CartDrawerTrigger(props: ComponentProps<typeof DrawerTrigger>) {
  return <DrawerTrigger {...props} />;
}
