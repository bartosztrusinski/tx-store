import { ProductList } from '@/components/product/product-list';
import { getLatestProducts } from '@/features/product/data';

export default async function HomePage() {
  const latestProducts = await getLatestProducts();
  const title = <h1 className='heading-2 mb-4 font-bold'>Newest Arrivals</h1>;

  return (
    <>
      <ProductList limit={4} products={latestProducts} title={title} />
    </>
  );
}
