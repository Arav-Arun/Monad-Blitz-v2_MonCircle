import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  monBalance: number;
  monApplied: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QTY"; productId: string; quantity: number }
  | { type: "TOGGLE_MON" }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  monBalance: 1240,
  monApplied: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.productId),
      };
    case "UPDATE_QTY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.product.id !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: action.quantity }
            : i,
        ),
      };
    case "TOGGLE_MON":
      return { ...state, monApplied: !state.monApplied };
    case "CLEAR_CART":
      return { ...state, items: [], monApplied: false };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: Dispatch<CartAction>;
  cartTotal: number;
  cartCount: number;
  totalMONEarned: number;
  monDiscount: number;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const cartTotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const totalMONEarned = state.items.reduce((sum, item) => {
    const monPer = Math.round(
      (item.product.price / 100) * item.product.monEarnRate * 100,
    );
    return sum + monPer * item.quantity;
  }, 0);

  // 1 MON = ₹0.5 fiat value
  const monDiscount = state.monApplied
    ? Math.min(state.monBalance * 0.5, cartTotal * 0.15)
    : 0;

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        cartTotal,
        cartCount,
        totalMONEarned,
        monDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
