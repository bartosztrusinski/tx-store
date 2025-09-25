import { type Product } from '@prisma/client';

import { Card } from '@/components/ui/card';
import { AddToCartWrapper } from '@/features/cart/components/add-to-cart-wrapper';

import { ProductImageGallery } from './product-image-gallery';
import { ProductPrice } from './product-price';

type Props = {
  product: Product;
};

export function ProductDetail({ product }: Props) {
  const isInStock = product.stock > 0;
  const isLowStock = isInStock && product.stock < 5;
  const hasImages = product.images.length > 0;

  return (
    <article className='flex flex-col gap-4 md:flex-row md:items-start'>
      {hasImages && (
        <section className='basis-full'>
          <ProductImageGallery
            alt={`${product.category} ${product.name}`}
            images={product.images}
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
            <span>Stock</span>
            <span className={`${isLowStock || !isInStock ? 'text-red-600' : ''}`}>
              {isInStock ? product.stock : 'Out of stock'}
            </span>
          </div>
          <div className='mt-4'>
            <AddToCartWrapper productId={product.id} productStock={product.stock} />
          </div>
        </Card>
      </section>
    </article>
  );
}
