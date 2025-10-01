import { type ComponentProps } from 'react';

import { ProductCard } from './product-card';

type Props = {
  limit?: number;
  products: ComponentProps<typeof ProductCard>['product'][];
};

export function ProductList({ limit, products }: Props) {
  const limitedProducts = limit ? products.toSpliced(limit) : products;

  return (
    <ul className='grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4'>
      {limitedProducts.length > 0 ?
        limitedProducts.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))
      : <p>No products found</p>}
    </ul>
  );
}
