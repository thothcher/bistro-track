# Le Bistro after L34 · La chambre froide

Le Bistro at the end of **L34 · TanStack Query I: reading data** (syllabus v2: L36). Start L35 from here.

Lecture: [`../../L34-query/`](../../L34-query/guide.md).

## New in this lecture

- `lib/queryClient.ts`: the one cache of the app. Defaults: data counts as fresh for a minute (`staleTime`), a failed request is retried twice except a 4xx (a 404 or a 429 will not fix itself), and the cache is emptied when the guest signs out (`useAuthStore.subscribe`).
- `main.tsx`: `QueryClientProvider` and `ReactQueryDevtools` (the devtools are not in the production build).
- `queries/dishes.ts`, `queries/account.ts`, `queries/kitchen.ts`: the query keys, functions and options in one place (`queryOptions`). Every key about dishes starts with `"dishes"`, every key about orders with `"orders"`; a guest's data has the guest in its key.
- `hooks/useApi.ts` is **deleted**: 40 lines became `useQuery(dishQueries.list("all"))`.
- Menu page: `placeholderData: keepPreviousData` (the old dishes stay while another category loads), `enabled` (no search request for an empty box), **prefetch on hover** (`prefetchQuery`: the 3-second `main-courses` request starts when the pointer reaches the chip), a "Try again" button (`refetch`), and no retries on a 429.
- The home page, the menu and the dish page share one cache entry: the dish list is fetched once for three pages, and the dish page opens at once.
- Kitchen page: the order queue refreshes itself every 5 seconds (`refetchInterval`) and when the guest comes back to the tab.
- Version `0.8.0`. New dependencies: `@tanstack/react-query`, `@tanstack/react-query-devtools`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

Open the devtools (the small flower at the bottom of the page), then visit Home → Menu → a dish and watch one `["dishes","list","all"]` entry go fresh → stale. Hover "Main Courses", wait three seconds, click: the dishes are already there.

The dish photos come from the Le Bistro API server, so the page needs internet, and so does the menu: `vite.config.ts` forwards `/api/...` to https://srmsapi.stepacademy.ge (the API accepts browser requests only from its own site and from localhost:4200, so the browser must not call it directly). Restart `npm run dev` after changing the config. The search endpoint allows 10 requests a minute per IP, and a classroom shares one IP: a 429 in class is part of the lesson.

Test accounts are listed at the top of https://srmsapi.stepacademy.ge/swagger. Access tokens live 2 minutes.

## Deploy

Import the folder (or its git repo) in Vercel, or run `npx vercel`. `vercel.json` makes F5 work on every page and forwards `/api` to the real API.

## How it was checked

Type-checked, built and linted (oxlint, `eslint-plugin-react-hooks` 7.1.1): zero warnings. Run in a browser against a local stand-in for the API that follows its Swagger description: one request for three pages, prefetch on hover, `keepPreviousData`, a cached search, a 429 that is not retried, polling, and a cache that is empty after sign-out. The public endpoints (`dishes`, `categories`, `search`) match the live server. The protected ones (`profile`, the order queue) were **not** called on the live server.
