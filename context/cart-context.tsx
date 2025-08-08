'use client';

import { Product } from '@prisma/client';
import { createContext, ReactNode, useContext, useState } from 'react';

type CartItem = {
  id: Product['id'];
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  removeItem: (id: CartItem['id']) => void;
  incrementItemQuantity: (id: CartItem['id']) => void;
  decrementItemQuantity: (id: CartItem['id']) => void;
  setItemQuantity: (id: CartItem['id'], quantity: number) => void;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  removeItem: () => {},
  incrementItemQuantity: () => {},
  decrementItemQuantity: () => {},
  setItemQuantity: () => {},
});

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`${useCart.name} must be used within ${CartProvider.name}`);
  }

  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const incrementItemQuantity = (id: CartItem['id']) => {
    const currentQuantity = cartItems.find((item) => item.id === id)?.quantity;

    setCartItems((prevItems) =>
      currentQuantity ?
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: currentQuantity + 1 } : item,
        )
      : [...prevItems, { id, quantity: 1 }],
    );
  };

  const decrementItemQuantity = (id: CartItem['id']) => {
    const currentQuantity = cartItems.find((item) => item.id === id)?.quantity;

    setCartItems((prevItems) =>
      currentQuantity === 1 ?
        prevItems.filter((item) => item.id !== id)
      : prevItems.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item,
        ),
    );
  };

  const setItemQuantity = (id: CartItem['id'], quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item,
      ),
    );
  };

  const removeItem = (id: CartItem['id']) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        incrementItemQuantity,
        decrementItemQuantity,
        removeItem,
        setItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
