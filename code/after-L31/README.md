# Le Bistro after L31 · Le passe

Le Bistro at the end of **L31 · context, useReducer and compound components**: the end of the Le Bistro track. Start L32 from here.

Lecture: [`../../L31-context/`](../../L31-context/guide.md).

## New in this lecture

- `auth/AuthContext.ts` + `auth/AuthProvider.tsx` + `useAuth()`
- `cart/cartReducer.ts` (every cart rule), `cart/CartContext.ts` + `cart/CartProvider.tsx` + `useCart()`
- No cart or session props anywhere; `App.tsx` only lists routes
- "Order all three" on the home page, "Empty the order" in the cart
- `components/Accordion.tsx` (a compound component) and the `/faq` page

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

The dish photos come from the Le Bistro API server, so the page needs internet, and so does the menu: `vite.config.ts` forwards `/api/...` to https://srmsapi.stepacademy.ge (the API accepts browser requests only from its own site and from localhost:4200, so the browser must not call it directly). Restart `npm run dev` after changing the config.

Test accounts are listed at the top of https://srmsapi.stepacademy.ge/swagger. Access tokens live 2 minutes.

## Deploy

Import the folder (or its git repo) in Vercel, or run `npx vercel`. `vercel.json` makes F5 work on every page and forwards `/api` to the real API.
