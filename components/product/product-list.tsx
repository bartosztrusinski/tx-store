import { ReactNode } from 'react';

import { ProductCard } from './product-card';

import type { Product } from '@/lib/sample-data';

type Props = {
  title?: ReactNode;
  products: Product[];
  limit?: number;
};

export function ProductList({ title, products, limit }: Props) {
  const limitedProducts = limit ? products.toSpliced(limit) : products;

  return (
    <div>
      {title}
      <ul className='grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4'>
        {limitedProducts.length > 0 ?
          limitedProducts.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))
        : <p>No products found</p>}
      </ul>
    </div>
  );
}
