# L31 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The second one is done with an AI. No new packages today: `createContext`, `useContext` and `useReducer` come with React.

---

## Classwork 1 · Your session, everywhere (slide 19)

### Base (everyone)

1. `src/auth/AuthContext.ts`: what is on the pass, the pass, and a hook to pick it up.
   ```ts
   import { createContext, useContext } from "react";
   import type { Session } from "../types";

   export type AuthContextValue = {
     session: Session | null;
     login: (session: Session) => void;
     logout: () => void;
   };

   export const AuthContext = createContext<AuthContextValue | null>(null);

   export function useAuth() {
     const auth = useContext(AuthContext);
     if (auth === null) throw new Error("useAuth() must be used inside <AuthProvider>");
     return auth;
   }
   ```
2. `src/auth/AuthProvider.tsx`: move your session line out of App into here (keep the same key).
   ```tsx
   import type { ReactNode } from "react";
   import { useLocalStorage } from "../hooks/useLocalStorage";
   import type { Session } from "../types";
   import { AuthContext, type AuthContextValue } from "./AuthContext";

   export function AuthProvider({ children }: { children: ReactNode }) {
     const [session, setSession] = useLocalStorage<Session | null>("shop.session", null);

     const value: AuthContextValue = {
       session,
       login: (next) => setSession(next),
       logout: () => setSession(null),
     };

     return <AuthContext value={value}>{children}</AuthContext>;
   }
   ```
3. In `main.tsx`, inside `<BrowserRouter>`: `<AuthProvider><App /></AuthProvider>`.
4. Header, LoginPage, ProfilePage and RequireAuth call `useAuth()`. Delete every `session`, `onLogin` and `onLogout` prop and follow TypeScript's red lines.

### Plus

A theme: `ThemeContext` with `"light" | "dark"`, a `ThemeProvider` and a toggle button in the Header. The provider adds the `dark` class to `<html>`:

```tsx
useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark");
}, [theme]);
```

Tailwind v4 needs one line in `index.css` so that `dark:` follows the class instead of the system setting:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Then style with `dark:bg-neutral-900 dark:text-neutral-100`.

### Pro

The theme survives F5 (`useLocalStorage`) and, on the first visit, starts from the system setting: `window.matchMedia("(prefers-color-scheme: dark)").matches`.

### Done when

- [ ] Searching the project for `session=` finds nothing
- [ ] Log in, press F5: still signed in
- [ ] "Sign out" in the Header works
- [ ] A guest on `/profile` still lands on `/login`

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `useAuth() must be used inside <AuthProvider>` | The provider is missing in main.tsx, or placed inside App instead of around it |
| oxlint: `Fast refresh only works when a file only exports components…` | The context or hook is exported from the provider's `.tsx` file: move them to `AuthContext.ts` |
| Signed out after the change | A different localStorage key than before |
| `Property 'session' does not exist on type…` | A parent still passes the old prop: delete it |
| The theme toggles but nothing changes colour | The `@custom-variant dark` line is missing |

---

## Classwork 2 · Prompt it: one cart, one reducer (with AI, slide 38)

The second classwork is done **with an AI**. You write the prompt, the AI writes the code, and you check it. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** A `cartReducer` (`added`, `qtyChanged`, `removed`, `cleared`: no duplicates, never more than `stock`, gone at 0), used in `App` with `useReducer`.
- **Plus:** A `CartProvider` + `useCart()`: no cart props left.
- **Pro:** A compound `Accordion` on the product page.

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| C | **Context** | Your shop and stack. Paste the cart code from `App.tsx` and `types.ts`. |
| R | **Role** | "A React teacher who writes pure, simple reducers." |
| A | **Action** | The Base task with your rules, then Plus in a follow-up prompt. |
| F | **Format** | "Context and hook in a .ts file, the provider in .tsx. Only changed files." |
| T | **Target** | "Mark every rule in the reducer with a one-line comment." |

### A sample prompt (Furniture house)

```text
CONTEXT
My shop "Maison" sells furniture. Vite + React 19 +
TypeScript + Tailwind 4. My cart is useState in
App.tsx (pasted, with types.ts).
ROLE
A React teacher who writes pure, simple reducers.
ACTION
Replace it with cartReducer in src/cart/cartReducer.ts:
added, qtyChanged, removed, cleared. No duplicate
lines, never more than product.stock, gone at 0.
FORMAT
Only the files that change, complete, with their paths.
TARGET
Mark every rule in the reducer with a one-line comment.
```

### The rules

1. Read every line before it goes into your project. You must be able to explain it.
2. Run it. If something fails, the next prompt is the exact error message.
3. One step at a time: Base first, then Plus and Pro as follow-up prompts.
4. Log it in `AI.md`: your prompt, what you kept, what you changed and why.

### Done when

- [ ] The same product twice: one line, qty 2
- [ ] Never more than in stock
- [ ] No `push`, `splice` or `localStorage` in the reducer
- [ ] AI.md: your prompt and one thing you changed

### What the AI tends to get wrong here (for the lecturer)

| The AI writes | The follow-up prompt |
|---|---|
| `localStorage.setItem` inside the reducer | "Keep the reducer pure; save in an effect in the provider." |
| `state.push(…)` or `item.qty++` | "Return new arrays and objects; never change the old state." |
| One context for the whole app | "One context per topic: the cart has its own." |
| The context and the provider in one .tsx file | "Context and hook in CartContext.ts, the provider in CartProvider.tsx." |

### What a good answer looks like

The hand-written solution, to check what the AI produced.

#### Base (everyone)

`src/cart/cartReducer.ts`: every rule of your cart in one pure function. Your cart lines are `{ product, qty }` and DummyJSON tells you each product's `stock`.

```ts
import type { CartItem, Product } from "../types";

export type CartAction =
  | { type: "added"; product: Product }
  | { type: "qtyChanged"; productId: number; delta: number }
  | { type: "removed"; productId: number }
  | { type: "cleared" };

export function cartReducer(cart: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "added": {
      if (action.product.stock === 0) return cart; // sold out: nothing changes
      const inCart = cart.some((item) => item.product.id === action.product.id);
      if (!inCart) return [...cart, { product: action.product, qty: 1 }];
      return cart.map((item) =>
        item.product.id === action.product.id
          ? { ...item, qty: Math.min(item.product.stock, item.qty + 1) }
          : item,
      );
    }
    case "qtyChanged":
      return cart
        .map((item) =>
          item.product.id === action.productId
            ? { ...item, qty: Math.min(item.product.stock, item.qty + action.delta) }
            : item,
        )
        .filter((item) => item.qty > 0);
    case "removed":
      return cart.filter((item) => item.product.id !== action.productId);
    case "cleared":
      return [];
  }
}
```

Use it in App first, instead of your cart `useState`:

```tsx
const [cart, dispatch] = useReducer(cartReducer, []);
// <ProductCard onAdd={() => dispatch({ type: "added", product })} … />
```

#### Plus

Move it into a provider, like Le Bistro (`code/after-L31/src/cart/`):

- `CartContext.ts`: the value type (`items`, `count`, `total`, `qtyOf`, `add`, `changeQty`, `remove`, `clear`), `createContext`, `useCart()`.
- `CartProvider.tsx`: `useReducer(cartReducer, [], loadCart)`, an effect that saves to localStorage, the value with named actions.
- Wrap the app in main.tsx, inside `AuthProvider`. Every component calls `useCart()`; delete every cart prop.

#### Pro

A compound `Accordion` on the product page with four items: description, shipping (`shippingInformation`), returns (`returnPolicy`) and reviews (`reviews`). Model it on `code/after-L31/src/components/Accordion.tsx`.

#### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| Clicking "Add" does nothing on screen | The reducer pushed into the old array and returned it: return a new array |
| Removing one product empties the cart | A `case` without `return` falls into `"cleared"` |
| `Type '"add"' is not assignable to type…` | A typo in the action type |
| The cart is saved twice / weird doubles in development | localStorage inside the reducer: StrictMode runs reducers twice. Save in an effect |
| `useCart() must be used inside <CartProvider>` | The provider doesn't wrap the component (check main.tsx) |
