# L35 · Le serveur — lecturer guide

**TanStack Query II: changing data.** Le Bistro track, lecture 9 of 10 (syllabus v2: **L37**, React lecture 10).
**Deck:** [`index.html`](index.html), 41 slides. **Code:** starts from [`../code/after-L34`](../code/after-L34), ends at [`../code/after-L35`](../code/after-L35).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md). **Masterclass script:** [`masterclass.md`](masterclass.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | A query reads, a mutation changes; `useMutation` (`mutationFn`, `mutate`, `isPending`, `onSuccess` / `onError` / `onSettled`); `mutate` against `mutateAsync`; `invalidateQueries` (matching by key prefix, active entries refetch now, inactive ones are only marked old); one global handler for failed changes (`MutationCache`) and a toast store with a `Toaster`; optimistic updates (`onMutate` with `cancelQueries`, a snapshot and `setQueryData`, a rollback in `onError`, `onSettled`); `useInfiniteQuery` (`initialPageParam`, `getNextPageParam`, `data.pages`, `fetchNextPage`, `hasNextPage`); an `IntersectionObserver` hook with cleanup and a real button |
| **Le Bistro gets** | `queries/orders.ts` (`useSendOrder`, `orderQueries.mine`), `queries/kitchen.ts` with the optimistic `useSetOrderStatus`, `toast/` (a Zustand store and a `Toaster`), a `MutationCache` in `lib/queryClient.ts`, `components/MyOrders.tsx` and `hooks/useInView.ts`, "Send to the kitchen" in the cart panel, the kitchen's buttons Start cooking → Ready → Delivered. Version 0.9.0, **no new package** |
| **Students' project** | v0.9: a "Place order" mutation with a guard and invalidation, one global error toast; Plus: an optimistic update with a rollback; Pro: an infinite list with a button and an observer |
| **The two problems** | 1. A button that can send twice, tells nobody, and fails in silence. 2. A card that waits for the server, and a history loaded all at once |
| **The two answers** | 1. A mutation: `isPending` as the guard, `invalidateQueries`, one `MutationCache` handler. 2. An optimistic update with a rollback; `useInfiniteQuery` with an observer |
| **AI** | Classwork 2 is done with an AI: a CRAFT prompt (Context, Role, Action, Format, Target), then the students check the code. The Masterclass rebuilds Le Bistro after L35 with one prompt |

**Numbers** (measured on the real code against our local copy of the API): pressing "Send to the kitchen" again while the first request runs creates **no second order** with the mutation; the optimistic card shows the new status after about **54 ms** while the server needs 800 ms; a refused move shows the sequence **COOKING → PENDING → COOKING** (optimistic, rolled back, then the truth from the refetch); page two of "My orders" loads when the observer sees the sentinel; no new dependency.

---

## Before class

- [ ] Your Le Bistro from L34 runs (or copy `code/after-L34`, `npm install`).
- [ ] **The order, cart and kitchen endpoints were not called on the live server.** They were built from the API's Swagger description and run here against a local copy of it. Run the whole flow once before class (sign in as the student, send an order, sign in as the kitchen, press "Start cooking") and note anything that differs, for example the wording of the 422.
- [ ] The access token lives **2 minutes**: sign in right before you send an order.
- [ ] Send three or four orders from the student account, so that "My orders" has more than one page (it shows three at a time).
- [ ] Open the kitchen page (`kitchen` account) in a second window for the rollback demo.
- [ ] `code/after-L35` open in a second VS Code window.
- [ ] Try the demos on slides 8, 16, 23, 24, 27 and 30 once. They run in the deck, no internet needed.
- [ ] Remind the students that DummyJSON **fakes** changes: `POST /carts/add` and `PUT /products/{id}` answer as if they had saved, and do not (checked: a `PUT` echoes the known fields it was given, drops any other, and the next `GET` shows the original; an unknown id or a wrong path answers 404). The Network tab and the cache are the evidence, not the server's data. This decides one detail of the optimistic-heart exercise: **no `invalidateQueries` in `onSettled`** there, or the refetch brings the old product back and the heart switches off after a second. With a real API you would keep the refetch (that is what Le Bistro does).

---

## Learn it first (35 minutes)

### 1. A query reads, a mutation changes

A **query** is for reading: it runs when a component needs it, it is stored in the cache under a key, and it can be refetched. A **mutation** is for changing: it runs when *you* call `mutate()`, it is not stored under a key, and the cache does not know about it unless you tell it. Both live in TanStack Query and talk to the same cache.

### 2. `useMutation`

```tsx
// queries/orders.ts: what Le Bistro does (shortened)
export function useSendOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // the API keeps its own copy of the cart and prices it itself: make it match ours, then order
      await api("/api/v1/learning/cart", { method: "DELETE" }, token());
      for (const { dish, qty } of items) { /* POST each line */ }
      return api<Order>("/api/v1/enterprise/orders", { method: "POST", body: … }, token());
    },
    onSuccess: () => {
      useCartStore.getState().clear();
      toast.success("Your order is with the kitchen.");
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// the button
const sendOrder = useSendOrder();
sendOrder.mutate(undefined, { onSuccess: onClose });   // run it now; this one has no variables
sendOrder.isPending                                    // a request is running
sendOrder.isError · sendOrder.error
```

- `mutationFn` returns a promise and **throws** on failure. It receives the variables given to `mutate` (here none: the cart is read from the store, so the call is `mutate(undefined, …)`). Three requests in a row are still **one** mutation: it is pending until the last one answers.
- `isPending` is true from the call until the answer. **Disable the button with it**: that is the guard against a double order. (In v4 the flag was `isLoading`; it is gone from mutations.) It stops every second click that comes at least a millisecond after the first, which is every click a person can make. Two clicks in the very same millisecond (a script, or a test's `dblclick()`) can both get through; for money, the server must refuse duplicates too (an idempotency key).
- `onSuccess`, `onError`, `onSettled` can be given to `useMutation` (they belong to the mutation and always run) and to `mutate(variables, { onSuccess })` (they belong to that call and run only if the component is still mounted). Use the first for "clear the cart, tell the cache" and the second for "close the panel".
- **`mutate` or `mutateAsync`?** `mutate` never throws: errors go to `onError` and the global handler. `mutateAsync` returns a promise that **rejects**: you must `try`/`catch` it, or you get an `Uncaught (in promise)`. Use `mutate` by default.

### 3. Telling the cache: invalidation

```ts
onSuccess: () => {
  void queryClient.invalidateQueries({ queryKey: ["orders"] });
},
```

`invalidateQueries` matches every key that **starts with** the given one. The kitchen's queue is `["orders","queue"]` and "My orders" is `["orders","mine",email]`, so `["orders"]` reaches both; that is why L34 gave the keys a common start. Entries a component is showing **refetch now**; entries nobody uses are only **marked old** and refetch the next time a component asks. (We verified this with the library: the two active entries refetched, a typo `["order"]` matched nothing and did nothing, an inactive entry was only marked.)

Three habits: put the start of the key in one place, never call `refetch()` by name from a mutation (the next screen that shows the data would be forgotten), and remember that **the cache lives in one browser**: `invalidateQueries` refreshes the screens in *this* browser. A waiter's tablet that shows the kitchen page and "My orders" refreshes both; a guest's phone has only "My orders"; a kitchen screen on another machine has its own cache and learns about the order from its own five-second polling (L34).

### 4. One place for failures

```ts
export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "No connection. Try again."),
  }),
  // …
});
```

The `MutationCache`'s `onError` runs for **every** failed mutation, so no mutation has to remember to say it failed. A mutation can still have its own `onError`; both run. The toast comes from a small **Zustand store** (L32): because a store lives outside React, `toast.error("…")` works anywhere, here inside the `QueryClient`. The `Toaster` component shows them: `role="alert"` for errors (a screen reader reads them at once) and `role="status"` for the rest. L36 replaces this hand-made toaster with a library's (Sonner): the calls `toast.success("…")` and `toast.error("…")` stay as they are, only the `import` line changes.

### 5. Optimistic updates

The server almost always says yes. So change the screen first, and undo it if the answer is no:

```ts
// queries/kitchen.ts: useSetOrderStatus (the options of useMutation; mutationFn is the PATCH)
onMutate: async ({ id, status }) => {
  await queryClient.cancelQueries({ queryKey: queueKey });   // a refresh would overwrite us
  const previous = queryClient.getQueryData(queueKey);        // the snapshot
  queryClient.setQueryData(queueKey, (queue) =>
    queue
      ? { ...queue, orders: queue.orders?.map((o) => (o.id === id ? { ...o, status } : o)) ?? null }
      : queue,
  );
  return { previous };                                        // arrives as `context`
},
onError: (_error, _vars, context) => {
  if (context) queryClient.setQueryData(queueKey, context.previous);   // put the old queue back
},
onSettled: () => queryClient.invalidateQueries({ queryKey: queueKey }),
```

- **`cancelQueries`** first: the queue refreshes every five seconds, and a refresh already on its way would land after our change and put the old status back for a moment.
- What `onMutate` **returns** is handed to `onError` and `onSettled` as `context`: that is how the snapshot travels to the rollback. The error toast is not written here: the `MutationCache` shows it.
- **`onSettled`** runs on success and on failure: refetch, so that the screen always ends up showing the truth.
- Try the rollback with two windows on the same order (`kitchen@itstep.ge` in both). Press "Start cooking" in window A, then **quickly** in window B: B refreshes every 5 seconds, and once it has refreshed it shows COOKING and offers "Ready" instead. The second press gets a 422 (`COOKING → COOKING` is not a move): B's card goes to COOKING, back to PENDING, and to COOKING again from the refetch, with a red toast.
- **When not to:** when the server may refuse often, or when the result cannot be guessed (a price, a new id). A payment is not optimistic.

### 6. Infinite queries and the observer

```ts
infiniteQueryOptions({
  queryKey: ["orders", "mine", email],
  queryFn: ({ pageParam }) => api<Paged<Order>>(`/api/v1/profile/orders?page=${pageParam}&size=3`),
  initialPageParam: 1,
  getNextPageParam: (last) => (last.hasNext ? last.page + 1 : undefined),
})
```

- One cache entry holds **all the pages** (`data.pages`); `flatMap` them into one list. `fetchNextPage()` asks for the next one; `hasNextPage` and `isFetchingNextPage` say whether and when.
- `initialPageParam` is **required** in v5. `getNextPageParam` must return **`undefined`** on the last page, or the list asks for ever.
- The page-loading trigger is a **sentinel**: an empty `div` under the list watched by an `IntersectionObserver` (the browser does the watching: no scroll listener). The hook disconnects in the effect's cleanup (L29), and it is `enabled` only while there is a next page and none is loading; when it re-enables, the observer reports the sentinel at once, so a short page keeps loading until the screen is full.
- **Always add a real button too** ("Show more orders"): an endless list is hard for keyboard users and for anybody who wants to reach the footer.

### 7. Query v4 → v5 (mutations and infinite queries)

| Query v4 | Query v5 | TypeScript says |
|---|---|---|
| `useMutation(sendOrder, { onSuccess })` | `useMutation({ mutationFn: sendOrder, onSuccess })` | `TS2559 · Type '() => Promise<…>' has no properties in common with type 'UseMutationOptions<…>'` |
| `queryClient.invalidateQueries(["orders"])` | `invalidateQueries({ queryKey: ["orders"] })` | `TS2559 · Type 'string[]' has no properties in common with type 'InvalidateQueryFilters<…>'` |
| `send.isLoading` | `send.isPending` | `TS2339 · Property 'isLoading' does not exist on type 'UseMutationResult<…>'` |
| `useInfiniteQuery(["orders"], fn, { getNextPageParam })` | one object with `initialPageParam: 1` | `TS2769 · Property 'initialPageParam' is missing in type … but required in type 'UseInfiniteQueryOptions<…>'` |

(The messages come from compiling these lines with TypeScript 6 and Query 5.104.)

### Check yourself

1. What is the difference between `useQuery` and `useMutation`? → A query runs when a component needs it and is cached by key; a mutation runs when you call `mutate()`.
2. How does `isPending` prevent a double order? → It is true from the press until the answer, and the button is `disabled` while it is.
3. Why `invalidateQueries({ queryKey: ["orders"] })` and not `refetch()`? → It reaches every key that starts with "orders", on every screen in this browser, without naming them.
4. What does a typo in the key do? → Nothing, silently.
5. What does `cancelQueries` protect against in an optimistic update? → A refresh already in flight landing after our change and putting the old value back.
6. Where does the value returned by `onMutate` go? → To `onError` and `onSettled` as `context`.
7. Why must `getNextPageParam` return `undefined` on the last page? → That is how `hasNextPage` becomes false; otherwise the list asks for ever.
8. Why a button next to the observer? → Keyboard users, and anybody who needs to reach the footer.

Further reading: the TanStack Query docs (tanstack.com/query → *Mutations*, *Invalidations from Mutations*, *Optimistic Updates*, *Infinite Queries*) and MDN's *Intersection Observer API*.

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting, menu, the second five-lecture route, the blind rolls up on the Send button |
| 0:03 | Questions | 5–6 | Backup questions; two v0.8 demos, each ending with "what should refresh after a change?" |
| 0:11 | Problem 1 | 7–10 | **The order that goes nowhere**; the button written by hand; "What would we need?" |
| 0:16 | Solution 1 | 11–19 | A mutation then tell the cache, `useMutation` in one picture, **useSendOrder (live)**, **the Send button (live)**, **invalidateQueries (live)**, **which entries does it mark?**, **toasts and one handler (live)**, mistakes, quiz |
| 0:40 | Classwork 1 | 20 | A button that changes data, in their shop |
| 0:55 | Break | 21 | |
| 1:05 | Problem 2 | 22–25 | **Press, then wait**; **a history of forty orders**; "What would we need now?" |
| 1:10 | Solution 2 | 26–33 | **An optimistic update (live)**, **answer first**, **useInfiniteQuery (live)**, **the observer (live)**, **three at a time**, the numbers at the end, mistakes, quiz |
| 1:32 | Classwork 2 with AI | 34 | Students prompt an AI for changes that feel instant, then check them |
| 1:47 | Masterclass | 35–37 | One prompt rebuilds Le Bistro after L35: part by part, run and check, the short version |
| 1:55 | Wrap-up | 38–41 | Recap, flip cards, homework, next time (accessible UI) |

Running late? Skip slides 9 (say it in a sentence), 12 (`useMutation` in one picture), 16 (the invalidation demo: slide 15 says it), 19 and 33 (the quizzes), 24 (the history of forty orders: say it) and 31 (the numbers). In the second half, copy `useInView.ts` instead of typing slide 29. Never skip the classworks. In the Masterclass, show the parts (slide 35) and the short version (slide 37), and skip the live run.

---

## Classwork 2 with AI and the Masterclass

**Classwork 2 with AI** (slide 34, 15 minutes). The task is a "Place order" mutation with a guard and invalidation (Base), a global error toast and an optimistic heart with a rollback (Plus), and an infinite product list with a button and an observer (Pro). The students write a five-part prompt (**CRAFT**), the AI writes the code, and they check it against "Done when".
- Any AI tool works: Claude, ChatGPT, Copilot Chat. Students who have none can pair up.
- The check is the **rollback**: does the AI's optimistic update undo itself? To test it, point the mutation at a wrong URL for a moment: the heart must flip back, with a toast. Ask students to explain one line the AI wrote. Code they can't explain doesn't count.
- When the answer doesn't work, the next prompt is the exact error message.
- The template, a sample prompt (blurred on the slide until clicked) and the follow-up prompts for the AI's usual mistakes are in [`classwork.md`](classwork.md).

**Masterclass** (slides 35–37, 8 minutes). One prompt rebuilds Le Bistro as it is after today:
1. **The prompt, part by part.** Each press opens one part. For each, one sentence: what would the AI do without it?
2. **Run it, then check it.** Show the answer and go through the checks: each one is something from today.
3. **The short version.** The same five parts as one paragraph; press next and each part lights up.

**Before class:** run the Masterclass prompt once and keep the answer open (a minute or two, and it varies). The exact texts are in [`masterclass.md`](masterclass.md).

---

## The demos

| Slide | Demo | How |
|---|---|---|
| 8 | The order that goes nowhere | "By hand": **Send to the kitchen** → the server has 1, "My orders" stays 0 for good, the kitchen's screen (another browser) learns after its 5-second poll. **Press it twice** → two orders. **Make the server fail once** → nothing, no message. "useMutation + invalidate" (it resets): the button is disabled and says "Sending…", a toast, "My orders" updates at once, pressed twice = **one** order, a failure = a red toast |
| 16 | Which entries does it mark? | Press a call. `["orders"]`: the two entries in use refetch. `["order"]` (a typo): nothing, and no error. `["dishes","list"]`: "all" (in use) refetches, "drinks" (not in use) turns **old**. Click the number in an "In use" cell to mount or unmount a component: mounting an old entry refetches it |
| 23 | Press, then wait | **Start cooking** on a card: 0.8 seconds with the card unchanged, then the status flips. The counter adds up the seconds spent staring |
| 24 | A history of forty orders | **Open My orders**: a skeleton for 2.4 seconds, then forty rows |
| 27 | Answer first | "Optimistic update" on: the card changes at once (a few milliseconds), and the log says so. Tick "Another cook already pressed it" and press: COOKING at once, **back to PENDING** with a toast (the 422), then COOKING again after the refetch. Each switch resets |
| 30 | Three at a time | The browser's real `IntersectionObserver` runs here. The first pages load by themselves until the box is full; scroll to load more, up to "That's all your orders" (`hasNextPage` false, 5 requests for 14 orders). Switch the observer off (it resets): only the "Show more orders" button loads the next page |
| 34 | The sample prompt | Click the blurred box on the Classwork 2 slide: a complete CRAFT prompt for one shop theme |
| 35 | The prompt, part by part | Press next five times; **Copy** copies the whole prompt with its five labels |
| 37 | The short version | Press next: each part lights up in its colour; **Copy** copies the paragraph |

---

## The live build, step by step

Part 1 (before the break): the order.

1. **The toasts** (slide 17): `src/toast/toastStore.ts` and `Toaster.tsx` (copy them from `code/after-L35`, explain the store), `<Toaster />` in `SiteLayout`, and the toast styles of `index.css`.
2. **`lib/queryClient.ts`** (slide 17): add the `mutationCache` with its `onError`.
3. **`src/queries/orders.ts`** (slide 13): `useSendOrder`, with the `onSuccess` of slide 15.
4. **`CartPanel`** (slide 14): the button with `disabled={sendOrder.isPending}`; a "Sign in to send your order" link for a guest who is not signed in.
5. **Test:** sign in as the student, add a dish, press **Send to the kitchen** twice: one order. Turn the network off (DevTools → Network → Offline) and press it: a red toast.

**Checkpoint 1:** `git commit -am "L35: send the order with a mutation"`.

Part 2 (after the break): the kitchen and the history.

6. **`useSetOrderStatus`** in `queries/kitchen.ts` (slide 26): `mutationFn`, then `onMutate`, `onError`, `onSettled`, one at a time. In `KitchenPage` add the buttons with the `NEXT` map (Start cooking → Ready → Delivered).
7. **`orderQueries.mine`** in `queries/orders.ts` (slide 28) and `components/MyOrders.tsx` on the account page.
8. **`hooks/useInView.ts`** (slide 29): copy it, explain the cleanup; the sentinel and the "Show more orders" button in `MyOrders`.
9. **Test:** two kitchen windows, press "Start cooking" on the same order in both (the rollback and the toast); scroll "My orders" (the next three load).

**Checkpoint 2:** your app equals `code/after-L35`. `git commit -am "L35: optimistic kitchen buttons and My orders"`. This is where L36 starts.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| The order is sent twice | The button is not disabled while the mutation runs | `disabled={sendOrder.isPending}` |
| The order is sent but "My orders" stays old | Nothing invalidates the history | `invalidateQueries({ queryKey: ["orders"] })` in `onSuccess` |
| Nothing refreshes after the invalidation | A typo in the key | Copy the start of the key from the query file |
| `Uncaught (in promise) ApiError` | `mutateAsync` with no `catch` | `mutate()` with callbacks, or `try`/`catch` |
| `TS2559 · Type '() => Promise<…>' has no properties in common with type 'UseMutationOptions<…>'` | Query v4: the function as the first argument | One options object: `{ mutationFn, onSuccess }` |
| `TS2559 · Type 'string[]' has no properties in common with type 'InvalidateQueryFilters<…>'` | Query v4: the key as an argument | `{ queryKey: ["orders"] }` |
| `TS2339 · Property 'isLoading' does not exist on type 'UseMutationResult<…>'` | Query v4 flag | `isPending` |
| `TS2769 · Property 'initialPageParam' is missing …` | Query v4 infinite query | `initialPageParam: 1` in the one options object |
| The card flickers back for a moment after "Start cooking" | The optimistic update has no `cancelQueries` | `await queryClient.cancelQueries(…)` first |
| The card says COOKING for ever although the server said no | No rollback, no `onSettled` | Return `{ previous }` from `onMutate`, restore it in `onError`, refetch in `onSettled` |
| "My orders" asks for page after page, for ever | `getNextPageParam` never returns `undefined` | `last.hasNext ? last.page + 1 : undefined` |
| The next page never loads on a short list | The observer is created once and never re-armed | `enabled` as a dependency of the effect: it reconnects when a page finishes |
| A 401 on the order a few minutes after signing in | The access token lives 2 minutes | Sign in again. `api()` signs the guest out when it sees `X-Token-Expired`, `RequireAuth` redirects to `/login`, and the toast says "Your session has ended" |
| The kitchen button answers 422 | Two cooks pressed the same move | Expected: the rollback and the toast are the lesson |

---

## Questions students ask

- **"Is `disabled` enough against a double order?"** For a person, yes: after the first click the button is disabled within a millisecond or so, and nobody clicks twice that fast. A script that fires two clicks in the same millisecond can send two requests, because `mutate()` itself does not check: each call starts its own mutation. So test a double click with a pause between the clicks, and for payments let the server refuse duplicates too (an idempotency key).
- **"Why not `refetch()` in `onSuccess`?"** It refetches one thing by name; the screen you forgot stays old. `invalidateQueries` says what changed, and every screen that shows it follows.
- **"Does it refresh the other person's screen?"** No: the cache is in one browser. Another browser learns by polling (L34), or by WebSockets or server-sent events, which our API does not have.
- **"Do mutations have a key?"** Not for caching. They can have a `mutationKey` to be found in the DevTools or by `useMutationState`; we do not need it.
- **"What if the user leaves the page while it sends?"** The request still finishes and the mutation's `onSuccess` still runs; a per-call callback given to `mutate(…, { onSuccess })` does not run if the component is gone.
- **"Is an optimistic update always good?"** No. Use it when the server rarely refuses and the result is easy to guess. Never for a payment.
- **"Why `setQueryData` and not `setState`?"** The data is in the cache, and every screen that shows it reads from there: change it there and all of them follow.
- **"Infinite scroll or pages?"** Pages with numbers are better for finding a particular item; an endless list suits a feed. With a button next to the observer, both reach the keyboard.
- **"Why a hand-made toaster?"** To see the idea (a store, outside React). L36 replaces it with a library's, and the call sites stay.
- **"Where do I put the global error handling for queries?"** In the `QueryCache`'s `onError`, the twin of the `MutationCache`'s.
