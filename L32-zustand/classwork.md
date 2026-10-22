# L32 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The second one is done with an AI. One new package today: `zustand` (`npm install zustand`).

---

## Classwork 1 · Your cart in a store (slide 21)

### Base (everyone)

1. Install it and write the store. Keep the reducer you wrote in L31: the rules do not change.
   ```ts
   // src/cart/cartStore.ts
   import { create } from "zustand";
   import { persist } from "zustand/middleware";
   import type { CartItem, Product } from "../types";
   import { cartReducer } from "./cartReducer";

   type CartState = {
     items: CartItem[];
     add: (product: Product) => void;
     changeQty: (productId: number, delta: number) => void;
     remove: (productId: number) => void;
     clear: () => void;
   };

   export const useCartStore = create<CartState>()(
     persist(
       (set) => ({
         items: [],
         add: (product) =>
           set((s) => ({ items: cartReducer(s.items, { type: "added", product }) })),
         changeQty: (productId, delta) =>
           set((s) => ({ items: cartReducer(s.items, { type: "qtyChanged", productId, delta }) })),
         remove: (productId) =>
           set((s) => ({ items: cartReducer(s.items, { type: "removed", productId }) })),
         clear: () => set({ items: [] }),
       }),
       { name: "shop.cart", partialize: (s) => ({ items: s.items }) },
     ),
   );

   export const selectCount = (s: CartState) => s.items.reduce((sum, i) => sum + i.qty, 0);
   export const selectTotal = (s: CartState) =>
     s.items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
   export const selectQtyOf = (productId: number) => (s: CartState) =>
     s.items.find((i) => i.product.id === productId)?.qty ?? 0;
   ```
2. Replace `useCart()` in the Header, the product cards and the cart panel with selectors:
   ```tsx
   const qty = useCartStore(selectQtyOf(product.id));
   const add = useCartStore((s) => s.add);
   const count = useCartStore(selectCount);
   ```
3. Delete the cart's context and provider, and the provider in `main.tsx`.
4. Test: add a product, press F5. The cart is still there.

### Plus

The session too: `auth/authStore.ts` with `session`, `login`, `logout` (saved under `shop.session`). Delete `AuthProvider`. In a component that needs several actions at once, use `useShallow`:

```tsx
import { useShallow } from "zustand/react/shallow";
const { changeQty, remove, clear } = useCartStore(
  useShallow((s) => ({ changeQty: s.changeQty, remove: s.remove, clear: s.clear })),
);
```

### Pro

A wishlist store: a heart on every product card, `wishlistStore.ts` with `persist` and `partialize`. In React DevTools with **Highlight updates** on, clicking a heart must flash only that card.

### Done when

- [ ] Searching the project for `Provider` finds none for the cart (or the session, if you did Plus)
- [ ] No `useCart()` left
- [ ] React DevTools → Highlight updates: adding one product flashes **one** card
- [ ] The cart is still there after F5

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `const { items, add } = useCartStore()` everywhere | It works, but every component re-renders. One selector per value |
| `The result of getSnapshot should be cached…` / `Maximum update depth exceeded` | A selector returns a new object: select one value, or `useShallow` |
| `Cannot find module '../cart/CartContext'` | A file still imports the deleted context |
| `React has detected a change in the order of Hooks` | The hook is after an early `return` in the component. Move it to the top |
| The cart is empty after the change | The saved shape changed (`{ state, version }`): the old array is ignored once |
| The count in the header is stuck | `useCartStore.getState()` in the component body. Use the hook |

---

## Classwork 2 · Prompt it: a store and the state map (with AI, slide 37)

The second classwork is done **with an AI**. You write the prompt, the AI writes the code, and you check it. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** A `cartStore` with Zustand, `persist` and your reducer, plus `selectCount` and `selectQtyOf`. The Header and the product cards use them.
- **Plus:** An `authStore`, and `api.ts` (or your fetch helper) signs the guest out when the API answers 401.
- **Pro:** A table in `README.md`: every piece of state in your shop and its home.

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| C | **Context** | Your shop and stack. Paste your cart provider, your reducer and `types.ts`. |
| R | **Role** | "A React teacher who writes small Zustand stores for a beginner." |
| A | **Action** | The Base task. Plus and Pro in follow-up prompts. |
| F | **Format** | "Only the files that change, complete, with paths. Zustand 5, no other library." |
| T | **Target** | "Every component selects only what it needs: no `useCartStore()` without a selector." |

### A sample prompt (Tech store)

```text
CONTEXT
Shop "Volt" (phones, laptops). Vite + React 19 + TypeScript
+ Tailwind 4. The cart is useReducer in CartProvider
(pasted, with cartReducer.ts and types.ts).
ROLE
A React teacher who writes small Zustand stores.
ACTION
Replace CartProvider with cartStore.ts (Zustand 5, persist,
key "volt.cart") that calls my cartReducer. Add selectCount
and selectQtyOf(id); show Header and ProductCard using them.
FORMAT
Only changed files, complete, with paths. No new library.
TARGET
Every component selects only what it needs.
```

### The rules

1. Read every line before it goes into your project. You must be able to explain it.
2. Run it. If something fails, the next prompt is the exact error message.
3. One step at a time: Base first, then Plus and Pro as follow-up prompts.
4. Log it in `AI.md`: your prompt, what you kept, what you changed and why.

### Done when

- [ ] No provider and no `useCart()` left
- [ ] Every `useCartStore(…)` has a selector
- [ ] The reducer is still pure; `persist` does the saving
- [ ] AI.md: your prompt and one thing you changed

### What the AI tends to get wrong here (for the lecturer)

| The AI writes | The follow-up prompt |
|---|---|
| `const { items, add } = useCartStore()` | "Select each value with its own selector. No bare useCartStore()." |
| Zustand 4 habits: `useCartStore(selector, shallow)` (an equality function as a second argument), `create((set) => …)` without the second `()` | "Use Zustand 5: `create<State>()(…)`, and wrap the selector in `useShallow` (from `zustand/react/shallow`)." |
| The products, a `loading` flag and a `fetchProducts` action in the store | "Only client state: the cart. The products stay in my useApi hook." |
| `persist` with no `partialize`, or a different key | "Save only `items`, under the key `shop.cart`." |
| `localStorage.setItem` inside the reducer | "Keep the reducer pure; `persist` does the saving." |

### What a good answer looks like

The hand-written solution, to check what the AI produced.

#### Base (everyone)

The store in Classwork 1 above, plus the readers:

```tsx
// ProductCard.tsx
const qty = useCartStore(selectQtyOf(product.id));
const add = useCartStore((s) => s.add);

// Header.tsx
const count = useCartStore(selectCount);
```

#### Plus

```ts
// src/auth/authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      login: (session) => set({ session }),
      logout: () => set({ session: null }),
    }),
    { name: "shop.session", partialize: (s) => ({ session: s.session }) },
  ),
);
```

```ts
// in your fetch helper, when the answer is 401:
if (res.status === 401) useAuthStore.getState().logout();
```

(DummyJSON answers `401 { "message": "Invalid/Expired Token!" }` for a bad or expired access token, and `401 { "message": "Access Token is required" }` when there is none.)

#### Pro

```md
| State | Home | Why |
|---|---|---|
| Is the cart open? | `useState` in Header | only the Header cares |
| Category, search text | the URL | shareable, survives F5 |
| The cart | `cartStore` (saved) | far-apart components read it |
| The session | `authStore` (saved) | Header, guards and the fetch helper need it |
| Products | `useApi`, until L34 | the server's data |
| The login form | `useState`, until L33 | a form |
```

#### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| Every card flashes | A bare `useCartStore()` somewhere: search for `useCartStore()` |
| `Maximum update depth exceeded` | An object selector without `useShallow` |
| Two copies of the cart (an old context and the store) | Delete the old provider and every `useCart()` |
| The table has no "why" column | The reason is the answer to the four questions: write it |
