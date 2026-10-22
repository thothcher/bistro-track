# L32 · Homework: your shop, version 0.6

**Due:** before L33. **Submit:** the GitHub link and the Vercel link.

## Base (required)

1. **Cart store:** `cart/cartStore.ts` with Zustand and `persist` (a key of your own, `partialize` for the items), calling your `cartReducer`. `selectCount`, `selectTotal` and `selectQtyOf` live in the same file.
2. **Session store:** `auth/authStore.ts` with `session`, `login`, `logout`, saved.
3. **No providers:** the cart's and the session's contexts and providers are deleted. Every component reads the stores with a selector: no bare `useCartStore()` or `useAuthStore()` anywhere.
4. **Signing out in one place:** your fetch helper calls `useAuthStore.getState().logout()` when the API says the token has expired (DummyJSON: a 401 for an expired access token). The pages lose their "sign in again" notices.
5. **A "where does it live?" table** in the README: every piece of state in your shop, its home (local, URL, form, store, server) and a one-line reason.

## Plus

- `useShallow` wherever a component needs several values or actions at once, and `partialize` in both stores.
- A `selectCount`-style selector for every number your header or cards show.

## Pro

- A wishlist: a third store with hearts on every card, a `/wishlist` page, saved in localStorage. In React DevTools with Highlight updates on, a click flashes only its own card.
- The `devtools` middleware, and a screenshot of the Redux DevTools extension showing your cart's actions in the README.

## Before you submit

- [ ] Search the project for `Provider`: nothing for the cart or the session
- [ ] Search for `useCartStore()` and `useAuthStore()` with empty parentheses: nothing
- [ ] React DevTools → Highlight updates: adding one product flashes one card
- [ ] F5 keeps the cart and the session
- [ ] The README table is there
- [ ] `npm run build` passes, the Vercel link works

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | Cart and session in stores, the cart's rules still in a pure reducer |
| 2 | Selectors everywhere: no bare store hooks, no object selectors without `useShallow` |
| 2 | `persist` works: F5 keeps the cart and the session; only the data is saved |
| 1 | `api.ts` / the fetch helper signs out on an expired token |
| 1 | The README table (a home and a reason for every row) |
| 1 | Deployed and working |
| +1 | Plus |
| +1 | Pro |

**Heads-up:** in L33 the login form is rebuilt with React Hook Form and Zod, and a sign-up form joins it. Keep your login page working: it is the starting point.
