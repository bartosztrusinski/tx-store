import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCartItems } from '@/features/cart/data';
import { ProductPrice } from '@/features/product/components/product-price';

export async function CartDropdown() {
  const cartItems = await getCartItems({
    createdAt: true,
    id: true,
    product: { select: { images: true, name: true, price: true, slug: true } },
    quantity: true,
  });
  const sortedCartItems = cartItems?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const isCartEmpty = cartItems?.length === 0;
  const cartTotal = cartItems?.reduce(
    (acc, item) => {
      acc.quantity += item.quantity;
      acc.price += Number(item.product.price) * item.quantity;
      return acc;
    },
    { price: 0, quantity: 0 },
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='relative' variant='ghost'>
          <ShoppingCart />
          <span className='absolute right-1 top-1 w-4 rounded-md bg-primary text-xs font-medium text-primary-foreground'>
            {cartTotal?.quantity ?? 0}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-1 min-w-60'>
        <DropdownMenuLabel className='flex items-center justify-between gap-3 text-base'>
          <span>My cart {!isCartEmpty && `(${cartTotal?.quantity ?? 0})`}</span>
          <span>
            Total: <ProductPrice price={cartTotal?.price ?? 0} size='sm' />
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isCartEmpty ?
          <p className='p-2'>The cart is empty.</p>
        : <>
            {sortedCartItems?.map((item) => (
              <Link className='flex gap-3 p-2' href={`/product/${item.product.slug}`} key={item.id}>
                <Image
                  alt={item.product.name}
                  className='rounded'
                  height={56}
                  src={item.product.images[0] ?? '/images/products/default.png'}
                  width={56}
                />
                <div className='grow'>
                  <p className='pb-1 font-medium'>{item.product.name}</p>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm text-muted-foreground'>Quantity: {item.quantity}</p>
                    <ProductPrice price={Number(item.product.price) * item.quantity} size='sm' />
                  </div>
                </div>
              </Link>
            ))}
            <DropdownMenuSeparator />
            <div className='p-2'>
              <Button asChild>
                <Link className='w-full' href='/cart'>
                  View Cart
                </Link>
              </Button>
            </div>
          </>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
