import Image from 'next/image';
import type { Product } from '@prisma/client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { ProductPrice } from './product-price';

type Props = {
  product: Product;
};

export function ProductDetail({ product }: Props) {
  const isInStock = product.stock > 0;
  const hasImages = product.images.length > 0;

  return (
    <article className='flex flex-col gap-4 md:flex-row md:items-start'>
      {hasImages && (
        // TODO Add image carousel and handle logic
        <section className='flex basis-full flex-col gap-4 md:flex-row'>
          <div className='order-2 flex shrink-0 gap-2 md:order-none md:flex-col'>
            {product.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${product.name} preview ${index + 1}`}
                width={60}
                height={60}
                className='rounded'
              />
            ))}
          </div>
          <Image
            src={product.images[0]}
            alt={`Image of ${product.name}`}
            width={640}
            height={640}
            className='w-full min-w-0 rounded object-cover object-center'
            priority
          />
        </section>
      )}

      <section className='flex basis-full flex-col gap-x-4 gap-y-8 lg:flex-row'>
        <div className='flex grow flex-col gap-6'>
          <div>
            <h1 className='heading-1 font-semibold'>{product.name}</h1>
            <p className='text-lg text-muted-foreground'>{product.category}</p>
          </div>
          <ProductPrice price={product.price.toNumber()} size='lg' />
          <p>{product.description}</p>
        </div>
        <Card className='p-3 lg:w-52 lg:shrink-0 lg:self-start'>
          <div className='flex-between gap-2'>
            <span>Price</span>
            <ProductPrice price={product.price.toNumber()} size='sm' />
          </div>
          <div className='flex-between mt-2 gap-2'>
            <span>Status</span>
            <Badge className='text-sm' variant={isInStock ? 'outline' : 'destructive'}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
          <Button size='lg' className='mt-4 w-full' disabled={product.stock <= 0}>
            Add to Bag
          </Button>
        </Card>
      </section>
    </article>
  );
}
