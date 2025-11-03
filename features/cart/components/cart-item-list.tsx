import { type Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductPrice } from '@/features/product/components/product-price';

import { CartItemQuantityStepper } from './cart-item-quantity-stepper';

type Props = {
  cartItems: Prisma.CartItemGetPayload<{
    select: {
      id: true;
      product: {
        select: {
          images: true;
          name: true;
          price: true;
          slug: true;
          stock: true;
        };
      };
      quantity: true;
    };
  }>[];
};

export async function CartItemList({ cartItems }: Props) {
  const hasItems = cartItems.length > 0;

  return hasItems ?
      <ul className='space-y-3'>
        {cartItems.map((item) => (
          <li key={item.id}>
            <Card className='space-y-3 p-3'>
              <div className='flex items-center gap-3'>
                <Checkbox className='size-5' />
                <Link className='flex gap-2' href={`/products/${item.product.slug}`}>
                  {item.product.images[0] && (
                    <Image
                      alt={item.product.name}
                      className='rounded-sm'
                      height={96}
                      src={item.product.images[0]}
                      width={96}
                    />
                  )}
                  <p className='font-medium'>{item.product.name}</p>
                </Link>
              </div>
              <div className='flex-between gap-3'>
                <CartItemQuantityStepper
                  buttonClassName='size-9'
                  inputClassName='h-9 w-10 p-1'
                  productSlug={item.product.slug}
                  quantity={item.quantity}
                  showInitialCta={false}
                  stock={item.product.stock}
                />
                <div>
                  <ProductPrice
                    className='text-lg font-medium'
                    price={Number(item.product.price) * item.quantity}
                  />
                  {item.quantity > 1 && (
                    <div className='text-sm text-muted-foreground'>
                      <ProductPrice price={Number(item.product.price)} /> each
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    : <p className='p-4 text-center text-muted-foreground'>Your cart is empty.</p>;
}
