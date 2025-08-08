'use client';

import { Product } from '@prisma/client';
import { createContext, ReactNode, useContext, useState } from 'react';

type CartItem = {
  id: Product['id'];
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addItem: (id: CartItem['id']) => void;
  removeItem: (id: CartItem['id']) => void;
  incrementItemQuantity: (id: CartItem['id']) => void;
  decrementItemQuantity: (id: CartItem['id']) => void;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addItem: () => {},
  removeItem: () => {},
  incrementItemQuantity: () => {},
  decrementItemQuantity: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItem = (id: CartItem['id']) => {
    setCartItems((prevItems) => [...prevItems, { id, quantity: 1 }]);
  };

  const removeItem = (id: CartItem['id']) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const incrementItemQuantity = (id: CartItem['id']) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  };

  const decrementItemQuantity = (id: CartItem['id']) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item,
      ),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        incrementItemQuantity,
        decrementItemQuantity,
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
