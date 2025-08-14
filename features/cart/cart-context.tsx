'use client';

import { type Product } from '@prisma/client';
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react';

type CartActions = {
  cartItems: CartItems;
  decrementItemQuantity: (id: Product['id']) => void;
  getItemQuantity: (id: Product['id']) => number | null;
  incrementItemQuantity: (id: Product['id']) => void;
  removeItem: (id: Product['id']) => void;
  setItemQuantity: (id: Product['id'], quantity: number) => void;
};

type CartContext = {
  cartItems: CartItems;
  setCartItems: Dispatch<SetStateAction<CartItems>>;
};

type CartItems = Map<Product['id'], { quantity: number }>;

const CartContext = createContext<CartContext | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItems>(new Map());

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartActions {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`${useCart.name} must be used within ${CartProvider.name}`);
  }

  const { cartItems, setCartItems } = context;

  const getItemQuantity = (id: Product['id']): number | null => {
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

  return {
    cartItems,
    decrementItemQuantity,
    getItemQuantity,
    incrementItemQuantity,
    removeItem,
    setItemQuantity,
  };
}
