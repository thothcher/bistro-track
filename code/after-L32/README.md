# Le Bistro after L32 · Le garde-manger

Le Bistro at the end of **L32 · Zustand and "where does this state live?"** (syllabus v2: L34). Start L33 from here.

Lecture: [`../../L32-zustand/`](../../L32-zustand/guide.md).

## New in this lecture

- `cart/cartStore.ts`: the cart as a Zustand store: `create`, the `persist` middleware (the localStorage key is still `bistro.cart`) and the selectors `selectCount`, `selectTotal`, `selectQtyOf`. The rules are the same `cart/cartReducer.ts` as in L31: only where they live changed.
- `auth/authStore.ts`: the session as a store.
- `lib/api.ts` signs the guest out when the token has expired, with `useAuthStore.getState().logout()`. A store can be used outside components, and `RequireAuth` then sends the guest to `/login` from any page.
- No providers any more: `AuthContext`, `AuthProvider`, `CartContext` and `CartProvider` are deleted and `main.tsx` has no wrappers.
- Components subscribe to small pieces with selectors. Adding one dish re-renders **1** `DishCard` instead of **25** (measured on the menu page, production build).
- `AccountPage` and `KitchenPage` lost their "sign in again" notices: an expired token ends the session in one place.
- Version `0.6.0`. New dependency: `zustand`.

## Where does each piece of state live?

| State | Home | Why |
|---|---|---|
| Is the cart panel open? | `useState` in `Header` | only the Header cares |
| Selected category, search text | the URL (`useSearchParams`) | shareable, survives F5, Back works |
| The cart | a store (`cartStore`) | far-apart components read it; saved by `persist` |
| The session | a store (`authStore`) | the Header, the guards and `api.ts` need it |
| The menu, the profile, the order queue | `useApi` for now | they belong to the server: TanStack Query takes over in L34 |
| The login form's fields | `useState` for now | React Hook Form takes over in L33 |

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

## How it was checked

Type-checked (`tsc -b`), built, and linted with oxlint and `eslint-plugin-react-hooks` 7.1.1: zero warnings. Run in a browser (cart, F5, login, an expired token) against a local stand-in for the API that follows its Swagger description. The authenticated endpoints were **not** called on the live server: try the login once before class.
