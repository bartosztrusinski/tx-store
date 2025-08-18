'use client';

import { type Product } from '@prisma/client';
import { createContext, type ReactNode, useContext, useEffect, useReducer } from 'react';

type Action =
  | { payload: { id: Product['id'] }; type: 'cart/incrementItemQuantity' }
  | { payload: { id: Product['id'] }; type: 'cart/decrementItemQuantity' }
  | { payload: { id: Product['id'] }; type: 'cart/removeItem' }
  | { payload: { id: Product['id']; quantity: number }; type: 'cart/setItemQuantity' };
type Dispatch = (action: Action) => void;
type State = Record<Product['id'], { quantity: number }>;

const CART_STORAGE_KEY = 'cart';

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'cart/decrementItemQuantity': {
      const { id } = action.payload;
      const currentQuantity = state[id]?.quantity;

      if (!currentQuantity) {
        return state;
      }

      if (currentQuantity <= 1) {
        const { [id]: _, ...updatedState } = state;
        return updatedState;
      }

      return { ...state, [id]: { ...state[id], quantity: currentQuantity - 1 } };
    }

    case 'cart/incrementItemQuantity': {
      const { id } = action.payload;
      const currentQuantity = state[id]?.quantity ?? 0;
      return { ...state, [id]: { ...state[id], quantity: currentQuantity + 1 } };
    }

    case 'cart/removeItem': {
      const { id } = action.payload;
      const { [id]: _, ...updatedState } = state;
      return updatedState;
    }

    case 'cart/setItemQuantity': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        const { [id]: _, ...updatedState } = state;
        return updatedState;
      }

      return { ...state, [id]: { ...state[id], quantity } };
    }

    default: {
      const _exhaustiveCheck: never = action;
      throw new Error(`Unhandled action: ${(_exhaustiveCheck as Action).type}`);
    }
  }
}

const CartContext = createContext<{ cart: State; dispatch: Dispatch } | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {}, (initialCart) => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : initialCart;
    } catch (error) {
      console.error(`Failed to get local cart: ${error}`);
    }

    return initialCart;
  });
  const value = { cart, dispatch };

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`${useCart.name} must be used within ${CartProvider.name}`);
  }

  return context;
}
