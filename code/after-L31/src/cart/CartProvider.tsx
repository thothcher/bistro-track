import { useEffect, useReducer, type ReactNode } from "react";
import type { CartItem } from "../types";
import { CartContext, type CartContextValue } from "./CartContext";
import { cartReducer } from "./cartReducer";

// Read the saved cart once, when the app starts
function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem("bistro.cart");
    return saved === null ? [] : (JSON.parse(saved) as CartItem[]);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  useEffect(() => {
    try {
      localStorage.setItem("bistro.cart", JSON.stringify(items));
    } catch {
      // storage blocked: the cart still works, it just forgets on refresh
    }
  }, [items]);

  const value: CartContextValue = {
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    total: items.reduce((sum, item) => sum + item.dish.price * item.qty, 0),
    qtyOf: (dishId) => items.find((item) => item.dish.id === dishId)?.qty ?? 0,
    add: (dish) => dispatch({ type: "added", dish }),
    changeQty: (dishId, delta) => dispatch({ type: "qtyChanged", dishId, delta }),
    remove: (dishId) => dispatch({ type: "removed", dishId }),
    clear: () => dispatch({ type: "cleared" }),
  };

  return <CartContext value={value}>{children}</CartContext>;
}
