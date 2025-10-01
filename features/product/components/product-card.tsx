import { type Product } from '@prisma/client';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ProductPrice } from './product-price';

type Props = {
  product: Pick<Product, 'brand' | 'images' | 'name' | 'price' | 'rating' | 'slug' | 'stock'>;
};

export function ProductCard({ product }: Props) {
  const firstImage = product.images[0];

  return (
    <Card>
      <CardContent className='rounded-t-lg border-b p-0'>
        <Link href={`/products/${product.slug}`}>
          {firstImage && (
            <Image
              alt={product.name}
              className='w-full rounded-t-lg'
              height={300}
              priority
              src={firstImage}
              width={300}
            />
          )}
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
          {product.rating.toString()}
          <span className='sr-only'>out of 5 stars</span>
        </p>
        {product.stock > 0 ?
          <ProductPrice price={product.price.toNumber()} size='lg' />
        : <p className='text-destructive lg:text-lg'>Out of stock</p>}
      </CardFooter>
    </Card>
  );
}
