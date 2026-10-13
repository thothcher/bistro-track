# L31 · Le passe — lecturer guide

**Context, useReducer and compound components.** Le Bistro track, lecture 5 of 5 (syllabus v2: L31, React lecture 6).
**Deck:** [`index.html`](index.html), 43 slides. **Code:** starts from [`../code/after-L30`](../code/after-L30), ends at [`../code/after-L31`](../code/after-L31).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | Prop drilling, `createContext` / provider / `useContext`, a custom hook around a context, React 19's `<Context value>`, who re-renders when a context changes, when context is (not) the right tool, `useReducer` with typed actions, pure reducers, a lazy first state, context + reducer as one "store", compound components |
| **Le Bistro gets** | `AuthProvider` + `useAuth()`, `CartProvider` + `useCart()` with `cartReducer`, an "Order all three" button, "Empty the order", an FAQ page built from a compound `Accordion`. App.tsx goes from 87 lines to 39 |
| **Students' project** | v0.5: an auth context, a cart reducer in a provider, no cart or session props |
| **The two problems** | 1. The cart and the session are passed hand to hand: 43 props in 8 files. 2. The cart's rules are spread over four files, and a new button breaks them |
| **The two answers** | 1. Context. 2. useReducer (inside a provider). Bonus: compound components |

---

## Before class

- [ ] Your Le Bistro from L30 runs (or copy `code/after-L30`, `npm install`).
- [ ] Count the props yourself once: in `code/after-L30/src`, search for `cart={`, `session={`, `onAdd={`. That's the problem you will show.
- [ ] `code/after-L31` open in a second VS Code window.
- [ ] Have the API's test accounts at hand (see the L30 guide): you sign in once in each half.
- [ ] Try the four demos on slides 8, 15, 22 and 26 once. They run in the deck, no internet needed.

---

## Learn it first (35 minutes)

### 1. Prop drilling

Data flows down through props. When a component deep in the tree needs a value that lives high up, every component on the way must accept it and pass it on, even if it never uses it. In Le Bistro after L30:

- `cart` goes App → HomePage → Favourites → DishGrid, App → MenuPage → DishGrid, App → SiteLayout → Header → CartPanel. SiteLayout, HomePage, Favourites and MenuPage never read it.
- `session` goes App → SiteLayout → Header. SiteLayout never reads it.

Adding one more piece of cart data means touching every component on the way. That's the cost.

### 2. Context in three parts

```tsx
// 1. build the pass (once, at module level)
const AuthContext = createContext<AuthContextValue | null>(null);

// 2. put a value on it (a provider component near the top of the app)
<AuthContext value={{ session, login, logout }}>{children}</AuthContext>

// 3. pick it up (in any component inside the provider, at any depth)
const auth = useContext(AuthContext);
```

- The provider covers **everything rendered inside it**, however deep. Outside any provider, `useContext` returns the default value (`null` here).
- React 19 renders the context itself as the provider: `<AuthContext value={…}>`. Code written before 2025 uses `<AuthContext.Provider value={…}>`; both work in React 19.
- `children` is whatever is written between the provider's tags. In `main.tsx` that is the whole app.

### 3. Wrap it in a hook

```ts
export function useAuth() {
  const auth = useContext(AuthContext);
  if (auth === null) throw new Error("useAuth() must be used inside <AuthProvider>");
  return auth;
}
```

Components import `useAuth()`, never the context. The check turns "forgot the provider" into a clear error instead of `Cannot read properties of null`, and TypeScript then knows the value is not null.

**File layout:** the context and the hook in `AuthContext.ts`, the provider component in `AuthProvider.tsx`. If one `.tsx` file exports both a component and a context, Vite's fast refresh can't hot-swap it, and oxlint warns: `Fast refresh only works when a file only exports components. Move your React context(s) to a separate file.`

### 4. Who re-renders

When a provider's value changes, **every component that reads that context** re-renders, wherever it is. Components that don't read it are not affected. Consequences:

- Split contexts by topic: a cart change shouldn't re-render the components that only read the session. That's why Le Bistro has `AuthContext` and `CartContext`, not one `AppContext`.
- Keep state local when only one component uses it (`isCartOpen` stays in the Header, the search text in MenuPage).
- Re-rendering is cheap for normal pages. It matters for values that change many times a second; for those, L32's store (Zustand) lets a component subscribe to just one slice.

### 5. When to use context

1. Do components far apart need it? No → props, or lift the state to the closest common parent (L28).
2. Does it change many times a second? Yes → keep it local, or a store with selectors (L32).
3. Is it data from a server? Yes → TanStack Query (L34). Our menu from the API will move there.
4. Otherwise: context. Typical: the session, the cart, the theme, the language.

### 6. useReducer

```tsx
const [cart, dispatch] = useReducer(cartReducer, [], loadCart);
dispatch({ type: "added", dish });
```

- A **reducer** is a function `(state, action) => newState`. It contains every rule of how the state may change.
- An **action** describes what happened: `{ type: "added", dish }`. Components only dispatch actions; they don't know the rules.
- When an action is dispatched, React calls the reducer with the current state and re-renders with what it returns. Returning the same state object means "nothing changed", and React skips the re-render.
- The third argument is a lazy initializer: `loadCart` runs once, on the first render. `useReducer(cartReducer, loadCart())` would read localStorage on every render.

**A reducer must be pure:** the same state and action always give the same result, nothing else happens. No `fetch`, no `localStorage`, no `Date.now()`, no `Math.random()`, and never change the old state (`push`, `splice`, assigning to `item.qty`). StrictMode calls reducers twice in development to catch impure ones. Saving to localStorage is an effect in the provider.

**Typed actions** make TypeScript a safety net: a union type `CartAction` rejects `{ type: "add" }`, and the `switch` on `action.type` knows which fields each case has. With `noFallthroughCasesInSwitch` (on in Vite's template), a case that forgets its `return` is a build error.

### 7. The kitchen metaphor (use it in class)

- The **pass** (le passe) is the counter where finished plates wait: one central place everyone can reach. That's the context.
- The **ticket rail** holds the orders in the order they came. The chef reads them one by one and follows the house rules. Waiters never cook. That's `dispatch` (puts a ticket on the rail) and the reducer (the chef).

### 8. Context + reducer

Put `useReducer` inside a provider, and put the state, derived values and named actions on the pass:

```tsx
const value: CartContextValue = {
  items,
  count: items.reduce((sum, item) => sum + item.qty, 0), // derived, never stored
  add: (dish) => dispatch({ type: "added", dish }),      // a named action
  // …
};
```

Components call `useCart().add(dish)`, never `dispatch` directly. This is the pattern that Redux and Zustand formalise; it's worth understanding by hand once.

### 9. Compound components

A component made of parts that only work together, like `<select>` and `<option>`:

```tsx
<Accordion defaultValue="kitchen">
  <AccordionItem value="kitchen">
    <AccordionTrigger>When does the kitchen close?</AccordionTrigger>
    <AccordionPanel>At 22:30.</AccordionPanel>
  </AccordionItem>
</Accordion>
```

`Accordion` holds the state (which item is open) and shares it through a small **private** context; `AccordionItem` adds a second context with its own `value` and `isOpen`; Trigger and Panel just read. The alternative is one component with a dozen props (`items`, `openId`, `onToggle`, `renderTitle`, …), which gets harder to use with every feature. `useId()` gives each panel a stable id for `aria-controls`.

### Check yourself

1. Who can call `useAuth()`? → Any component inside `AuthProvider`, at any depth.
2. What does `useContext` return outside any provider? → The default value given to `createContext` (`null` here).
3. When does a component that calls `useCart()` re-render? → Whenever the cart provider's value changes.
4. What's an action? → An object describing what happened, with a `type`.
5. Why may a reducer not call `localStorage.setItem`? → It must be pure; StrictMode even calls it twice. Effects go in `useEffect`.
6. What does returning the old state from a reducer mean? → Nothing changed: no re-render.
7. Why does `Accordion` use a context? → So its parts share state without props between them.

Further reading (react.dev): *Passing Data Deeply with Context*, *Extracting State Logic into a Reducer*, *Scaling Up with Reducer and Context*, *useReducer*, *useContext*.

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting, menu, route, the blind rolls up on the new App.tsx |
| 0:03 | Questions | 5–6 | Backup questions; two v0.4 demos, each ending with "count the props" |
| 0:12 | Problem 1 | 7–9 | Follow the props: cart, onAdd, session |
| 0:18 | Solution 1 | 10–18 | Hand to hand vs the pass, three parts, **AuthContext + AuthProvider (live)**, **remove the session props (live)**, who re-renders, the right tool, mistakes, quiz |
| 0:42 | Classwork 1 | 19 | An auth context in their shop |
| 0:57 | Break | 20 | |
| 1:07 | Problem 2 | 21–23 | "Order the usual" breaks the cart; where the rules live |
| 1:12 | Solution 2 | 24–37 | The ticket rail, a reducer in four parts, **run the tickets**, **cartReducer (live)**, CartContext + CartProvider, **remove the cart props (live)**, compound components and the FAQ, mistakes, the whole picture, quiz |
| 1:37 | Classwork 2 | 38 | A cart reducer, a cart provider |
| 1:52 | Wrap-up | 39–43 | Recap, flip cards, homework, the finished track, next time |

Running late? Skip slides 16 (say: "context is for a few app-wide values"), 18 and 37 (quizzes), and copy `Accordion.tsx` without walking through slide 34.

---

## The demos

| Slide | Demo | How |
|---|---|---|
| 8 | Follow the props | Press next three times (cart, onAdd, session) or click the buttons. Green = reads it, brass = only passes it on, wine wires = the road |
| 15 | Who re-renders | "Two contexts": Sign in → Header and AccountPage flash; Add a dish → Header and the three DishCards. Switch to "One big context" (it resets) and repeat: every reader flashes every time. Footer never |
| 22 | Order the usual | Add Coq au Vin with its card, then press "Order the usual": Coq au Vin appears twice, Bouillabaisse (off the menu) gets in. Press it again: more lines |
| 26 | Run the tickets | Each button puts a ticket on the rail; the reducer handles them one by one and the state on the right changes. Coq au Vin twice → qty 2. Bouillabaisse → refused. "Order the usual" → three tickets. +1 until 10 → it stops. −1 to 0 → the line disappears |
| 33 | The FAQ | Click the questions. The dark panel shows what the two contexts hold |

In the demos, Bouillabaisse plays "off the menu today". In the real API it is available; the reducer's rule matters whenever the kitchen switches a dish off (`isAvailable: false`).

---

## The live build, step by step

Part 1 (before the break): the session.

1. **`src/auth/AuthContext.ts`** (slide 12): the type, `createContext`, `useAuth()`. Type it: it's short and it's the pattern.
2. **`src/auth/AuthProvider.tsx`** (slide 13): cut the session line out of `App.tsx`, paste it into the provider, build the value, render `<AuthContext value={value}>{children}</AuthContext>`.
3. **`main.tsx`**: `<BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>`.
4. **Header and SiteLayout** (slide 14): delete `session` and `onLogout` from both prop types; the Header calls `const { session, logout } = useAuth();`.
5. **RequireAuth, LoginPage, AccountPage, KitchenPage**: `session`, `onLogin`, `onExpired` props are replaced by `useAuth()` (`login`, `session`, `logout`). AccountPage and KitchenPage pass `session?.token` to `useApi`.
6. **App.tsx**: delete the session state, `logout` and every session prop. The account and kitchen routes become `element={<AccountPage />}` and `element={<KitchenPage />}`. Follow TypeScript's red lines until `npm run build` is green.

**Checkpoint 1:** sign in, F5, sign out: all still work. `git commit -am "L31: auth context"`.

Part 2 (after the break): the cart.

7. **`src/cart/cartReducer.ts`** (slides 27–28): type it with the room, case by case. In `QuantityStepper.tsx`, replace `const MAX_QTY = 10;` with `import { MAX_QTY } from "../cart/cartReducer";`.
8. **`src/cart/CartContext.ts`** (slide 29) and **`src/cart/CartProvider.tsx`** (slides 30–31): copy both, walk through `loadCart`, `useReducer`, the saving effect and the value.
9. **`main.tsx`**: `<AuthProvider><CartProvider><App /></CartProvider></AuthProvider>`.
10. **Copy the readers** from `code/after-L31` (slide 32): `DishCard.tsx` (props: only `dish`), `Header.tsx`, `CartPanel.tsx` (only `onClose`, plus "Empty the order"), `Favourites.tsx` (plus "Order all three").
11. **Delete the cart props** from `DishGrid`, `HomePage`, `MenuPage`, `DishPage` (it calls `useCart()` for its own button), `SiteLayout` and `App`. Delete `addToCart`, `changeQty`, `removeFromCart` and the cart state from App. App ends at 39 lines.
12. **`index.css`**: copy it (new classes: `section__actions`, `cart-panel__clear`, `narrow`, `accordion*`).
13. **The FAQ** (slides 33–34): copy `components/Accordion.tsx`, `pages/FaqPage.tsx`, `data/faq.ts`; add `<Route path="faq" element={<FaqPage />} />` and an FAQ `NavLink` in the Header (it's in the copied Header).
14. **Test:** "Order all three" twice on the home page → three lines with 2 each. F5 → the cart is still there (same "bistro.cart" key as before).

**Checkpoint 2:** your app equals `code/after-L31`. `git commit -am "L31: context, reducer, FAQ"`.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| `useAuth() must be used inside <AuthProvider>` | The provider is missing, or wraps less than it should (e.g. inside App instead of around it) | Wrap `<App />` in main.tsx |
| `Cannot read properties of null (reading 'session')` | `useContext(AuthContext)` used directly, outside a provider | Use the `useAuth()` hook; add the provider |
| Fast refresh warning from oxlint, or the page fully reloads on every save | A `.tsx` file exports both a component and a context or hook | Context + hook in `.ts`, provider in `.tsx` |
| `Property 'cart' does not exist on type 'IntrinsicAttributes & …'` | A parent still passes a prop that the child no longer declares | Delete the prop where the red line is |
| The cart doesn't update after a click | The reducer changed the old array (`push`) and returned it | Return a new array: `[...cart, item]`, `map`, `filter` |
| Removing one dish empties the cart | A `case` without `return` falls through into `"cleared"` | `return` in every case (TypeScript: `Fallthrough case in switch`) |
| `Type '"add"' is not assignable to type '"added" \| …'` | A typo in an action type | Use the names from `CartAction` |
| `Function lacks ending return statement…` | A new action type without a case | Add the case to the reducer |
| The cart is empty after F5 | A different localStorage key, or the saving effect is missing | `"bistro.cart"` in `loadCart` and in the effect |
| Things happen twice in development | StrictMode calls reducers and initializers twice | Expected; it only shows that something isn't pure |
| The FAQ panels never open | `AccordionItem` missing around Trigger/Panel ("Trigger and Panel must be inside &lt;AccordionItem&gt;") | Keep the parts inside their item |

---

## Questions students ask

- **"Should everything go in context then?"** No. Context is for a few app-wide values. Local state stays local, server data goes to TanStack Query (L34).
- **"Context vs Redux / Zustand?"** Context only *passes* a value; it isn't a state manager. Context + useReducer is a small store. Zustand (L32) does the same with less code, no provider, and lets components subscribe to one slice. Redux Toolkit is the bigger, older relative; you'll meet it in job ads.
- **"Why `.ts` for the context and `.tsx` for the provider?"** JSX only in `.tsx`, and fast refresh needs component files to export only components.
- **"Why not keep `useState` and pass `setCart` through context?"** Then every component can change the cart any way it likes, and the rules spread again. Named actions keep the rules in one place.
- **"Is `dispatch` stable?"** Yes, React keeps the same `dispatch` function for the life of the component, so it's safe in dependency arrays.
- **"Why does the menu have its own MAX_QTY?"** It doesn't anymore: the stepper imports it from the reducer, so the button and the rule can't disagree.
