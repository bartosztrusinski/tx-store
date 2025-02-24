import type { ReactNode } from 'react';
import type { Product } from '@prisma/client';

import { ProductCard } from './product-card';

type Props = {
  products: Product[];
  title?: ReactNode;
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
