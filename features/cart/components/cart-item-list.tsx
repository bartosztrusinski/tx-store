'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useOptimistic, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { deselectCartItem, selectCartItem } from '@/features/cart/actions';
import { ProductPrice } from '@/features/product/components/product-price';
import { type Prisma, type Product } from '@/lib/generated/prisma/client';

import { CartItemQuantityStepper } from './cart-item-quantity-stepper';

type Props = {
  cartItems: Prisma.CartItemGetPayload<{
    select: {
      id: true;
      isSelected: true;
      product: {
        select: {
          id: true;
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

export function CartItemList({ cartItems }: Props) {
  const hasItems = cartItems.length > 0;
  const [isPending, startTransition] = useTransition();
  const [optimisticCartItems, setOptimisticCartItems] = useOptimistic<
    typeof cartItems,
    Product['slug']
  >(cartItems, (items, productSlug) =>
    items.map((item) =>
      item.product.slug === productSlug ? { ...item, isSelected: !item.isSelected } : item,
    ),
  );
  const cartTotal = optimisticCartItems
    ?.filter((item) => item.isSelected)
    .reduce(
      (total, item) => ({
        price: total.price + Number(item.product.price) * item.quantity,
        quantity: total.quantity + item.quantity,
      }),
      { price: 0, quantity: 0 },
    ) ?? { price: 0, quantity: 0 };
  const isAnyItemSelected = optimisticCartItems.some((item) => item.isSelected);

  function handleCartItemSelect(productSlug: Product['slug']) {
    startTransition(() => {
      setOptimisticCartItems(productSlug);
      selectCartItem(productSlug);
    });
  }

  function handleCartItemDeselect(productSlug: Product['slug']) {
    startTransition(() => {
      setOptimisticCartItems(productSlug);
      deselectCartItem(productSlug);
    });
  }

  return (
    <>
      {hasItems ?
        <ul className='space-y-3'>
          {optimisticCartItems.map((item) => (
            <li key={item.id}>
              <Card className='space-y-3 p-3'>
                <div className='flex items-center gap-3'>
                  <Checkbox
                    checked={item.isSelected}
                    className='size-5'
                    onCheckedChange={(isChecked) =>
                      isChecked ?
                        handleCartItemSelect(item.product.slug)
                      : handleCartItemDeselect(item.product.slug)
                    }
                  />
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
      : <p className='p-4 text-center text-muted-foreground'>Your cart is empty.</p>}
      <Card className='mt-4 p-4'>
        <span className='flex-between gap-3'>
          Subtotal
          <ProductPrice className='text-xl font-medium' price={cartTotal.price} />
        </span>
        <Button
          className='mt-4 w-full text-base font-medium'
          disabled={isPending || !isAnyItemSelected}
        >
          {isPending ? 'Processing...' : 'Proceed to checkout'}
        </Button>
      </Card>
    </>
  );
}
