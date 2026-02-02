import { CartItemList } from '@/features/cart/components/cart-item-list';
import { getCartItems } from '@/features/cart/data';

export default async function CartPage() {
  const cartItems = await getCartItems({
    id: true,
    isSelected: true,
    product: {
      select: { id: true, images: true, name: true, price: true, slug: true, stock: true },
    },
    quantity: true,
  });
  const serializedCartItems = JSON.parse(JSON.stringify(cartItems ?? []));

  return (
    <>
      <h1 className='heading-1 mb-2'>Your Cart</h1>
      <CartItemList cartItems={serializedCartItems} />
    </>
  );
}
