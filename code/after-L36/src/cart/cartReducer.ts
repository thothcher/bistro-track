import type { CartItem, Dish } from "../types";

// Every change the cart can go through, as a named action ("a ticket for the kitchen")
export type CartAction =
  | { type: "added"; dish: Dish }
  | { type: "qtyChanged"; dishId: number; delta: number }
  | { type: "removed"; dishId: number }
  | { type: "cleared" };

export const MAX_QTY = 10; // the stepper imports it too: one rule, one place

// All the cart's rules in one pure function: same cart + same action = same new cart.
// No fetch, no localStorage, no Date.now() in here.
export function cartReducer(cart: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "added": {
      if (!action.dish.isAvailable) return cart; // off the menu today: nothing changes
      const inCart = cart.some((item) => item.dish.id === action.dish.id);
      if (inCart) {
        return cart.map((item) =>
          item.dish.id === action.dish.id
            ? { ...item, qty: Math.min(MAX_QTY, item.qty + 1) }
            : item,
        );
      }
      return [...cart, { dish: action.dish, qty: 1 }];
    }
    case "qtyChanged":
      return cart
        .map((item) =>
          item.dish.id === action.dishId
            ? { ...item, qty: Math.min(MAX_QTY, item.qty + action.delta) }
            : item,
        )
        .filter((item) => item.qty > 0);
    case "removed":
      return cart.filter((item) => item.dish.id !== action.dishId);
    case "cleared":
      return [];
  }
}
