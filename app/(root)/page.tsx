import { ProductList } from '@/features/product/components/product-list';
import { getLatestProducts } from '@/features/product/data';

export default async function HomePage() {
  const latestProducts = await getLatestProducts({
    brand: true,
    images: true,
    name: true,
    price: true,
    rating: true,
    slug: true,
    stock: true,
  });

  return (
    <>
      <h1 className='heading-2 mb-4 font-bold'>Newest Arrivals</h1>
      <ProductList limit={4} products={latestProducts} />
    </>
  );
}
