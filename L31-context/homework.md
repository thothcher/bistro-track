# L31 · Homework: your shop, version 0.5

**Due:** before L32. **Submit:** the GitHub link and the Vercel link.

## Base (required)

1. **Auth context:** `src/auth/AuthContext.ts` (type, context, `useAuth()`) and `src/auth/AuthProvider.tsx`. No component receives `session`, `onLogin` or `onLogout` as a prop.
2. **Cart reducer:** `src/cart/cartReducer.ts` with `added`, `qtyChanged`, `removed`, `cleared`. It holds every rule: no duplicate lines, never more than the product's `stock`, nothing when sold out, the line disappears at 0.
3. **Cart provider:** `CartContext.ts` + `CartProvider.tsx` + `useCart()`. Saved in localStorage with an effect. No component receives the cart as a prop.
4. **"Empty the cart"** in the cart panel, and the count in the Header, both from `useCart()`.

## Plus

A compound component built from parts that share a small private context: an `Accordion` (product details, or an FAQ page) or `Tabs` (`<Tabs>`, `<TabList>`, `<Tab>`, `<TabPanel>`).

## Pro

A wishlist: a second reducer (`added`, `removed`) in its own provider with `useWishlist()`, a heart button on every card, a `/wishlist` page, saved in localStorage.

## Before you submit

- [ ] Search the project for `cart=` and `session=`: nothing
- [ ] Add the same product twice: one line, qty 2
- [ ] Press + until the stock: it stops
- [ ] The reducer has no `push`, `splice`, `localStorage` or `fetch`
- [ ] No oxlint warnings (context and hook in `.ts`, provider in `.tsx`)
- [ ] `npm run build` passes, the Vercel link works

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | Auth context: no session props, login and logout through `useAuth()` |
| 3 | Cart reducer: every rule, pure, typed actions |
| 2 | Cart provider: `useCart()` everywhere, no cart props, saved after F5 |
| 1 | Clean files: contexts and hooks in `.ts`, providers in `.tsx`, no warnings |
| 1 | Deployed and working |
| +1 | Plus |
| +1 | Pro |

**Heads-up:** in L32 the cart moves into a Zustand store, without a provider. Keep your reducer: the rules don't change, only where they live.
