import { ProductList } from '@/components/product/product-list';

import { sampleData } from '@/lib/sample-data';

export default function HomePage() {
  const { products } = sampleData;
  const title = <h1 className='heading-2 mb-4 font-bold'>Newest Arrivals</h1>;

  return (
    <>
      <ProductList title={title} products={products} limit={8} />
    </>
  );
}
