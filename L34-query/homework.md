# L34 · Homework: your shop, version 0.8

**Due:** before L35. **Submit:** the GitHub link and the Vercel link.

## Base (required)

1. **One cache:** a `queryClient` in its own module (`lib/queryClient.ts`, with a `staleTime` you can defend) and the `QueryClientProvider` in `main.tsx`, with the DevTools.
2. **Your questions in one place:** a `queries/` folder with `queryOptions` for the product list (by category), one product, the categories and the search. Every key lists what its function uses; every function throws when the response is not `ok`.
3. **No fetch hooks:** your own fetch hook is deleted and no `useEffect` fetches. No `useState` holds a copy of query data.
4. **One request for three pages:** the home page, the product list and the product page share their data. In the Network tab, Home → list → a product → Back to the list requests the list **once**.
5. **A smooth category change:** `placeholderData: keepPreviousData` with the grid dimmed while the new products load (`isPlaceholderData`), and `enabled` so that the search asks nothing without text.
6. **A way out of an error:** a "Try again" button that calls `refetch()`, and a sentence for a 429 or a 404 (not only "something went wrong").

## Plus

- **Faster than the click:** prefetch a category on hover **and** on focus (`queryClient.prefetchQuery`).
- **A retry rule:** a `retry` function in `queryClient.ts` that does not retry a 4xx and tries a 5xx at most twice.
- A screenshot of the DevTools with your keys in the README, and one sentence for each `staleTime` you chose.

## Pro

- **A guest's data:** `GET /auth/me` (or your shop's profile) with the guest in the key (`["me", username]`), and a cache that is cleared when the guest signs out (`useAuthStore.subscribe`). Two accounts, one browser: the second account never sees the first one's data.
- The product page starts from the list's data (`initialData` from the cache) and opens at once.

## Before you submit

- [ ] Network tab: Home → list → a product → Back requests the list once
- [ ] Search your project for `useEffect`: none fetches
- [ ] Search for `new QueryClient`: one, in its own module
- [ ] Every `queryKey` lists the variables of its `queryFn`
- [ ] React DevTools / TanStack DevTools: keys fresh and in use; the category switch keeps the old products
- [ ] `npm run build` passes, the Vercel link works

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | All server data on `useQuery` with `queryOptions`; one `queryClient`; no fetch hook, no `useEffect` fetch, no state copy |
| 2 | Keys that list what their functions use; the list is requested once for three pages |
| 2 | `keepPreviousData` and `enabled`; the dimmed grid |
| 1 | An error that can be retried, with a useful sentence |
| 1 | Query v5 syntax only; no warnings in the console |
| 1 | Deployed and working |
| +1 | Plus |
| +1 | Pro |

**Heads-up:** in L35 your shop learns to **change** data: a button that sends something to the server, a list that updates by itself afterwards, and a button that answers before the server does. Keep your `queries/` folder tidy: it is the starting point.
