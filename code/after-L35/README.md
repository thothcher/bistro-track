# Le Bistro after L35 · Le serveur

Le Bistro at the end of **L35 · TanStack Query II: changing data** (syllabus v2: L37). Start L36 from here.

Lecture: [`../../L35-mutations/`](../../L35-mutations/guide.md).

## New in this lecture

- `queries/orders.ts`: `useSendOrder()`, a `useMutation` that sends the order: it empties the server's copy of the cart, adds every line, then creates the order (the API prices it from its own copy). On success: the local cart is emptied, a toast says so, and `invalidateQueries({ queryKey: ["orders"] })` marks the kitchen's queue and "My orders" as old. While it runs, `isPending` disables the button: no double order.
- `queries/kitchen.ts`: `useSetOrderStatus()`, an **optimistic update**. `onMutate` cancels refreshes, saves the queue and changes the cached card at once; `onError` puts the old queue back; `onSettled` asks the server what is true now. The kitchen page has the buttons Start cooking → Ready → Delivered.
- `toast/toastStore.ts` + `toast/Toaster.tsx`: a small toaster built on a Zustand store. `toast.error("…")` works anywhere, because the store is outside React. `lib/queryClient.ts` has a `MutationCache` whose `onError` shows every failed change as a toast: no mutation has to remember to.
- `queries/orders.ts` `orderQueries.mine` + `components/MyOrders.tsx` + `hooks/useInView.ts`: "My orders" on the account page, three at a time, with `useInfiniteQuery`. An `IntersectionObserver` watches an empty div under the list and loads the next page when it scrolls into view; a "Show more orders" button does the same for keyboard users.
- The cart panel has "Send to the kitchen" (or "Sign in to send your order").
- Version `0.9.0`. No new dependencies.

## Try the rollback

Open the kitchen page (`kitchen@itstep.ge`) in two windows. In window A press **Start cooking** on an order; in window B, which still shows it as PENDING (it refreshes every 5 seconds), press **Start cooking** on the same order. The server answers 422 (`COOKING → COOKING` is not a move), B's card flips to COOKING, back to PENDING, and then to COOKING again from the refetch, and a red toast explains.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

The dish photos come from the Le Bistro API server, so the page needs internet, and so does the menu: `vite.config.ts` forwards `/api/...` to https://srmsapi.stepacademy.ge (the API accepts browser requests only from its own site and from localhost:4200, so the browser must not call it directly). Restart `npm run dev` after changing the config.

Test accounts are listed at the top of https://srmsapi.stepacademy.ge/swagger. Access tokens live 2 minutes: sign in right before you send an order. Before class, send three or four orders from the student account, so "My orders" has more than one page.

## Deploy

Import the folder (or its git repo) in Vercel, or run `npx vercel`. `vercel.json` makes F5 work on every page and forwards `/api` to the real API.

## How it was checked

Type-checked, built and linted (oxlint, `eslint-plugin-react-hooks` 7.1.1): zero warnings. Run in a browser against a local stand-in for the API that follows its Swagger description: no second order when the button is pressed again while the first request runs (`disabled={isPending}` stops a person; two clicks in the very same millisecond, which only a script can make, can both get through), the history refreshed by invalidation, page two loaded by the observer, the optimistic card showing the new status after 54 ms (the server needed 800), and the rollback sequence `COOKING → PENDING → COOKING`. **None of the order, cart or kitchen endpoints was called on the live server** (they need a signed-in account): run the flow once before class. The API also has `POST /api/v1/enterprise/cart/sync`; this version uses the plain cart endpoints because their behaviour is documented line by line.
