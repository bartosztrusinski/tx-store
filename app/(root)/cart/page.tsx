import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CartItemList } from '@/features/cart/components/cart-item-list';
import { getCartItems } from '@/features/cart/data';
import { ProductPrice } from '@/features/product/components/product-price';

export default async function CartPage() {
  const cartItems = await getCartItems({
    id: true,
    product: { select: { images: true, name: true, price: true, slug: true, stock: true } },
    quantity: true,
  });
  const cartTotal = cartItems?.reduce(
    (total, item) => ({
      price: total.price + Number(item.product.price) * item.quantity,
      quantity: total.quantity + item.quantity,
    }),
    { price: 0, quantity: 0 },
  ) ?? { price: 0, quantity: 0 };

  return (
    <div>
      <h1 className='heading-1 mb-2'>Your Cart</h1>
      <CartItemList cartItems={cartItems ?? []} />
      <Card className='mt-4 p-4'>
        <span className='flex-between gap-3'>
          Subtotal
          <ProductPrice className='text-xl font-medium' price={cartTotal.price} />
        </span>
        <Button className='mt-4 w-full text-base font-medium'>Proceed to checkout</Button>
      </Card>
    </div>
  );
}
