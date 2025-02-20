import { notFound } from 'next/navigation';

import { ProductDetail } from '@/components/product/product-detail';

import { getProductBySlug } from '@/lib/actions/product';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  return <ProductDetail product={product} />;
}
