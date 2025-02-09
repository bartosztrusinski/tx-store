import { ReactNode } from 'react';

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
      <ul className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {limitedProducts.length > 0 ?
          limitedProducts.map((product) => (
            <li key={product.slug} className='rounded border p-4'>
              <p>{product.name}</p>
              <p>{product.price}</p>
            </li>
          ))
        : <p>No products found</p>}
      </ul>
    </div>
  );
}
