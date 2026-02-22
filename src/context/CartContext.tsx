import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type Dispatch,
  type ReactNode,
} from "react";
import type { Product } from "../data/products";
import { useAuth } from "./AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
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
  monEarnedBreakdown: Record<string, number>;
  monDiscount: number;
  maxRedeemableMON: number;
  monRedemptionBreakdown: Record<string, number>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  const REWARD_ALLOCATION = 0.01;
  const CONVERSION_RATE = 1.83; // 1 MON = 1.83 INR for earning, also for spending (user request: "same conversion rate")

  const cartTotal = useMemo(() => state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  ), [state.items]);

  const cartCount = useMemo(() => state.items.reduce((sum, item) => sum + item.quantity, 0), [state.items]);

  // Breakdown of MON earned per brand in this cart
  const monEarnedBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    state.items.forEach(item => {
      const earned = (item.product.price * item.quantity * REWARD_ALLOCATION) / CONVERSION_RATE;
      breakdown[item.product.brand] = Number(((breakdown[item.product.brand] || 0) + earned).toFixed(2));
    });
    return breakdown;
  }, [state.items]);

  const totalMONEarned = useMemo(() => 
    Object.values(monEarnedBreakdown).reduce((sum, val) => sum + val, 0)
  , [monEarnedBreakdown]);

  // Redemption logic: GLOBAL REDEMPTION for Demo
  const { maxRedeemableMON, monRedemptionBreakdown } = useMemo(() => {
    if (!user || !user.balances) return { maxRedeemableMON: 0, monRedemptionBreakdown: {} };
    
    const totalUserMON = Object.values(user.balances).reduce((sum, val) => sum + (val as number), 0);
    if (totalUserMON <= 0) return { maxRedeemableMON: 0, monRedemptionBreakdown: {} };

    // Cap at 50% of entire order total for simplicity and "Wow" factor
    const maxDiscountINR = cartTotal * 0.5;
    const maxSpendableInMON = maxDiscountINR / CONVERSION_RATE;
    
    const actuallyRedeemable = Math.min(totalUserMON, maxSpendableInMON);
    
    // For the breakdown, we'll just attribute it to the brands in the cart proportionally
    // to maintain backend consistency, or just send a global "redemption" brand.
    const breakdown: Record<string, number> = { "Global": Number(actuallyRedeemable.toFixed(2)) };

    return { maxRedeemableMON: Number(actuallyRedeemable.toFixed(2)), monRedemptionBreakdown: breakdown };
  }, [user, state.items, cartTotal]);

  const monDiscount = state.monApplied ? maxRedeemableMON * CONVERSION_RATE : 0;

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        cartTotal,
        cartCount,
        totalMONEarned,
        monEarnedBreakdown,
        monDiscount,
        maxRedeemableMON,
        monRedemptionBreakdown,
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
