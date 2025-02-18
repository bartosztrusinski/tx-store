import { ProductList } from '@/components/product/product-list';

import prisma from '@/lib/prisma';

export default async function HomePage() {
  const products = await prisma.product.findMany();
  const title = <h1 className='heading-2 mb-4 font-bold'>Newest Arrivals</h1>;

  return (
    <>
      <ProductList title={title} products={products} limit={8} />
    </>
  );
}
