import { createContext, useContext } from "react";
import type { CartItem, Dish } from "../types";

// What every component can read from the cart, and what it can ask the cart to do
export type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  qtyOf: (dishId: number) => number;
  add: (dish: Dish) => void;
  changeQty: (dishId: number, delta: number) => void;
  remove: (dishId: number) => void;
  clear: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

// Any component below <CartProvider> can call useCart(). No props needed.
export function useCart() {
  const cart = useContext(CartContext);
  if (cart === null) throw new Error("useCart() must be used inside <CartProvider>");
  return cart;
}
