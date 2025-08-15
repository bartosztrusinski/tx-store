'use client';

import { type Product } from '@prisma/client';
import { createContext, type ReactNode, useContext, useReducer } from 'react';

type Action =
  | { payload: { id: Product['id'] }; type: 'cart/incrementItemQuantity' }
  | { payload: { id: Product['id'] }; type: 'cart/decrementItemQuantity' }
  | { payload: { id: Product['id'] }; type: 'cart/removeItem' }
  | { payload: { id: Product['id']; quantity: number }; type: 'cart/setItemQuantity' };
type Dispatch = (action: Action) => void;
type State = Map<Product['id'], { quantity: number }>;

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'cart/decrementItemQuantity': {
      const { id } = action.payload;
      const currentQuantity = state.get(id)?.quantity;
      const updatedState = new Map(state);

      if (!currentQuantity) {
        return state;
      }

      if (currentQuantity > 1) {
        updatedState.set(id, { quantity: currentQuantity - 1 });
      } else {
        updatedState.delete(id);
      }

      return updatedState;
    }
    case 'cart/incrementItemQuantity': {
      const { id } = action.payload;
      const currentQuantity = state.get(id)?.quantity ?? 0;
      return new Map(state).set(id, { quantity: currentQuantity + 1 });
    }
    case 'cart/removeItem': {
      const { id } = action.payload;
      const updatedState = new Map(state);
      updatedState.delete(id);
      return updatedState;
    }
    case 'cart/setItemQuantity': {
      const { id, quantity } = action.payload;
      return new Map(state).set(id, { quantity: Math.max(0, Math.round(quantity)) });
    }
    default: {
      throw new Error(`Unhandled action: ${action}`);
    }
  }
}

const CartContext = createContext<{ cart: State; dispatch: Dispatch } | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, new Map());
  const value = { cart, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`${useCart.name} must be used within ${CartProvider.name}`);
  }

  return context;
}
