# L35 · Homework: your shop, version 0.9

**Due:** before L36. **Submit:** the GitHub link and the Vercel link.

**Remember:** DummyJSON only pretends to save. `POST /carts/add` and `PUT /products/{id}` answer as if the change was made, and the next `GET` shows the old data. Your proof is the Network tab and the cache (DevTools), not what the server remembers. Write one sentence about it in your README.

## Base (required)

1. **A change, done properly:** a "Place order" `useMutation` (`POST /carts/add`) in its own hook (`queries/orders.ts`). The button is `disabled` while the mutation is pending and says "Sending…". Pressing it twice sends **one** request.
2. **Tell the cache:** `onSuccess` clears the cart, shows a message, and calls `invalidateQueries({ queryKey: ["orders"] })`. No `refetch()` and no `setState` inside `onSuccess`.
3. **One place for failures:** a toast store (Zustand) with a `Toaster` in your layout, and one `MutationCache({ onError })` in `lib/queryClient.ts`. A failed change shows a toast; no mutation has its own copy of the error code.
4. **A history that follows:** "My orders" (`GET /carts/user/{id}`, key `["orders","mine",userId]`) is refetched after a success. Show it next to the cart, or open it afterwards: the Network tab shows the new request.
5. **Query v5 only:** one options object, `isPending`, `{ queryKey }`. Every `mutateAsync` has a `try`/`catch`; otherwise use `mutate`.

## Plus

- **Answer first:** an optimistic heart (or "mark as sold out") on the cached product list: `onMutate` with `cancelQueries`, a snapshot and `setQueryData`; a rollback in `onError`. Test the rollback with a wrong URL and write down what you saw. DummyJSON keeps no changes, so leave the refetch out of `onSettled` here and say why in a comment.
- A `README` paragraph: which of your calls are mutations, what each one invalidates or updates.

## Pro

- **A page at a time:** an infinite product list (`/products?limit=10&skip=…`) with `useInfiniteQuery` (`initialPageParam`, `getNextPageParam` that ends with `undefined`), an `IntersectionObserver` sentinel with cleanup, **and** a "Show more" button.

## Before you submit

- [ ] Press "Place order" twice, quickly: the Network tab shows one `POST`
- [ ] Search your project for `refetch(`: none inside an `onSuccess`
- [ ] Search for `mutateAsync`: each one has a `try`/`catch` (or you use `mutate`)
- [ ] Turn the URL wrong for a minute: a failed request shows a toast, and the button comes back
- [ ] The messages use `role="status"` (good news) and `role="alert"` (errors)
- [ ] `npm run build` passes, the Vercel link works

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | "Place order" is a `useMutation`: disabled while pending, two presses send one request, the cart is cleared on success |
| 2 | `invalidateQueries` with the start of the key; no `refetch()` or `setState` in `onSuccess`; "My orders" refetches (Network tab) |
| 2 | A toast store and one `MutationCache.onError`: every failed change shows a toast |
| 1 | Query v5 syntax only; no unhandled `mutateAsync`; no warnings in the console |
| 1 | Messages a screen reader announces (`role="status"` / `role="alert"`) |
| 1 | Deployed and working |
| +1 | Plus |
| +1 | Pro |

**Heads-up:** in L36 your shop learns to be used without a mouse: a cart that traps the focus while it is open and closes with Esc, a menu you can drive with arrow keys, and a toast library that does what your hand-made toaster does. Keep every toast call as `toast.success(…)` or `toast.error(…)` in one place: when the library comes, only the import changes.
