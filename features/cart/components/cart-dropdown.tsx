import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const hasItems = Array.isArray(cartItems) && cartItems.length > 0;
  const cartTotal = cartItems?.reduce(
    (total, item) => ({
      price: total.price + Number(item.product.price) * item.quantity,
      quantity: total.quantity + item.quantity,
    }),
    { price: 0, quantity: 0 },
  ) ?? { price: 0, quantity: 0 };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='relative' variant='ghost'>
          <ShoppingCart />
          {hasItems && (
            <span className='absolute right-1 top-1 w-4 rounded-md bg-primary text-xs font-medium text-primary-foreground'>
              {cartTotal.quantity}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-1 min-w-60'>
        <DropdownMenuLabel className='flex items-center justify-between gap-3 text-base'>
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
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hasItems ?
          <>
            <div className='max-h-96 overflow-y-auto'>
              {sortedCartItems?.map((item) => (
                <DropdownMenuItem
                  asChild
                  className='my-1 mr-1 cursor-pointer gap-3 p-2'
                  key={item.id}
                >
                  <Link href={`/products/${item.product.slug}`}>
                    {item.product.images[0] && (
                      <Image
                        alt={item.product.name}
                        className='rounded-sm'
                        height={56}
                        src={item.product.images[0]}
                        width={56}
                      />
                    )}
                    <div className='grow'>
                      <p className='font-medium'>{item.product.name}</p>
                      <div className='flex items-center justify-between'>
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
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className='p-2'>
              <DropdownMenuItem asChild>
                <Button asChild>
                  <Link
                    className='w-full cursor-pointer focus:bg-primary focus:text-primary-foreground focus-visible:hover:ring-0'
                    href='/'
                  >
                    View Cart
                  </Link>
                </Button>
              </DropdownMenuItem>
            </div>
          </>
        : <p className='justify-center p-4 text-center'>The cart is empty.</p>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
