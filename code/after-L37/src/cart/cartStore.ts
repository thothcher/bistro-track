import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TableNotes } from "../schemas/tableNotes";
import type { CartItem, Dish } from "../types";
import { cartReducer } from "./cartReducer";

type CartState = {
  items: CartItem[];
  notes: TableNotes | null; // filled in by the table-notes form (lecture L33)
  add: (dish: Dish) => void;
  changeQty: (dishId: number, delta: number) => void;
  remove: (dishId: number) => void;
  saveNotes: (notes: TableNotes) => void;
  clear: () => void;
};

// A store lives outside React: no provider, no context. create() returns a hook,
// and every component that calls it with a selector subscribes to just that piece.
// The rules did not change since L31: the same cartReducer decides the new cart.
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      notes: null,
      add: (dish) =>
        set((s) => ({ items: cartReducer(s.items, { type: "added", dish }) })),
      changeQty: (dishId, delta) =>
        set((s) => ({
          items: cartReducer(s.items, { type: "qtyChanged", dishId, delta }),
        })),
      remove: (dishId) =>
        set((s) => ({ items: cartReducer(s.items, { type: "removed", dishId }) })),
      saveNotes: (notes) => set({ notes }),
      clear: () => set({ items: [], notes: null }),
    }),
    {
      name: "bistro.cart", // the localStorage key; persist saves and restores for us
      partialize: (s) => ({ items: s.items, notes: s.notes }), // save the data, not the functions
    },
  ),
);

// Selectors: small functions that pick, or calculate, one thing from the state.
// They return numbers, so a component only re-renders when its number changes.
export const selectCount = (s: CartState) => s.items.reduce((sum, i) => sum + i.qty, 0);
export const selectTotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.dish.price * i.qty, 0);
export const selectQtyOf = (dishId: number) => (s: CartState) =>
  s.items.find((i) => i.dish.id === dishId)?.qty ?? 0;
