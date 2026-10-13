# Le Bistro after L29 · Le marché

Le Bistro at the end of **L29 · effects and custom hooks**: the real menu from the API, and a cart that survives F5. Start L30 from here.

Lecture: [`../../L29-effects/`](../../L29-effects/guide.md).

## New in this lecture

- `vite.config.ts`: the `/api` proxy; `lib/api.ts`: `fetch` with an `ApiError` (status, Retry-After)
- Hooks: `useApi` (answers tagged with their path, `AbortController` cleanup), `useDebounce`, `useLocalStorage`
- `Favourites` and `MenuSection` load from the API, with skeleton cards, errors and the 429 message
- `SearchBox`: `useRef` and the "/" shortcut; the cart is saved under `bistro.cart`

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

The dish photos come from the Le Bistro API server, so the page needs internet, and so does the menu: `vite.config.ts` forwards `/api/...` to https://srmsapi.stepacademy.ge (the API accepts browser requests only from its own site and from localhost:4200, so the browser must not call it directly). Restart `npm run dev` after changing the config.
