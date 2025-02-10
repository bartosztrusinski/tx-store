import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Product } from '@/lib/sample-data';
import Link from 'next/link';

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
      <CardFooter className='flex-between px-3 py-2'>
        <p className='text-yellow-500'>{product.rating}/5</p>
        <p className='text-lg font-semibold md:text-xl'>${product.price}</p>
      </CardFooter>
    </Card>
  );
}
