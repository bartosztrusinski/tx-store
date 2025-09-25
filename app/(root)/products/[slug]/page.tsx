import { notFound } from 'next/navigation';

import { ProductDetail } from '@/features/product/components/product-detail';
import { getProductBySlug } from '@/features/product/data';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
