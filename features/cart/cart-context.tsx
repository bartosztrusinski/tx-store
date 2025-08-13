'use client';

import { type Product } from '@prisma/client';
import { createContext, type ReactNode, useContext, useState } from 'react';

type CartContextType = {
  cartItems: Map<Product['id'], CartItem>;
  decrementItemQuantity: (id: Product['id']) => void;
  incrementItemQuantity: (id: Product['id']) => void;
  removeItem: (id: Product['id']) => void;
  setItemQuantity: (id: Product['id'], quantity: number) => void;
};

type CartItem = {
  quantity: number;
};

const CartContext = createContext<CartContextType>({
  cartItems: new Map(),
  decrementItemQuantity: () => {},
  incrementItemQuantity: () => {},
  removeItem: () => {},
  setItemQuantity: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartContextType['cartItems']>(new Map());

  const getItemQuantity = (id: Product['id']): CartItem['quantity'] | null => {
    return cartItems.get(id)?.quantity ?? null;
  };

  const incrementItemQuantity = (id: Product['id']) => {
    const currentQuantity = getItemQuantity(id) ?? 0;
    setCartItems((prevItems) => new Map(prevItems).set(id, { quantity: currentQuantity + 1 }));
  };

  const decrementItemQuantity = (id: Product['id']) => {
    const currentQuantity = getItemQuantity(id);
    const newCartItems = new Map(cartItems);

    if (!currentQuantity) {
      return;
    }

    if (currentQuantity > 1) {
      newCartItems.set(id, { quantity: currentQuantity - 1 });
    } else {
      newCartItems.delete(id);
    }

    setCartItems(newCartItems);
  };

  const setItemQuantity = (id: Product['id'], quantity: number) => {
    setCartItems((prevItems) =>
      new Map(prevItems).set(id, { quantity: Math.max(0, Math.round(quantity)) }),
    );
  };

  const removeItem = (id: Product['id']) => {
    setCartItems((prevItems) => {
      const updatedItems = new Map(prevItems);
      updatedItems.delete(id);
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        decrementItemQuantity,
        incrementItemQuantity,
        removeItem,
        setItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`${useCart.name} must be used within ${CartProvider.name}`);
  }

  return context;
}
