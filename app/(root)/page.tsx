import { ProductList } from '@/components/product/product-list';

import { getLatestProducts } from '@/lib/actions/product';

export default async function HomePage() {
  const latestProducts = await getLatestProducts();
  const title = <h1 className='heading-2 mb-4 font-bold'>Newest Arrivals</h1>;

  return (
    <>
      <ProductList title={title} products={latestProducts} limit={4} />
    </>
  );
}
