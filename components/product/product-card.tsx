import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ProductPrice } from './product-price';

import type { Product } from '@/lib/sample-data';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <Card>
      <CardContent className='rounded-t-lg border-b p-0'>
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority
            className='w-full rounded-t-lg'
          />
        </Link>
      </CardContent>
      <CardHeader className='px-3 py-2'>
        <CardDescription>{product.brand}</CardDescription>
        <CardTitle>
          <Link href={`/products/${product.slug}`}>
            <h2 className='text-balance text-base leading-tight sm:text-lg sm:leading-tight'>
              {product.name}
            </h2>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardFooter className='flex-between flex-wrap gap-x-3 px-3 py-2'>
        <p className='flex-center gap-1 text-sm font-medium text-muted-foreground sm:text-base'>
          <Star className='size-4 fill-yellow-500 stroke-none sm:size-5' />
          {product.rating}
          <span className='sr-only'>out of 5 stars</span>
        </p>
        {product.stock > 0 ?
          <ProductPrice price={product.price} />
        : <p className='text-destructive lg:text-lg'>Out of stock</p>}
      </CardFooter>
    </Card>
  );
}
