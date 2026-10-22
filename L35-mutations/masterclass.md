# L35 · Masterclass: Le Bistro after L35 in one prompt

**Where:** slides 35–37, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L35`](../code/after-L35), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Nothing to attach: the data comes from the API, and the prompt names the endpoints.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project (`npm install zustand react-hook-form zod @hookform/resolvers@5 @tanstack/react-query`) and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 35, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 36, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L35` next to it.
3. **The short version** (slide 37, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 35 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site. Vite + React 19 + TypeScript + Tailwind CSS 4,
react-router 8 (import from "react-router"), Zustand 5, react-hook-form 7, zod 4,
@tanstack/react-query 5. API at /api through a Vite proxy: dishes, categories, search,
login (2-minute token), profile, learning/cart (DELETE, POST), enterprise/orders (POST,
queue), profile/orders (paged), enterprise/orders/{id}/status (PATCH, 422 if not allowed).

ROLE
You are a senior React developer who writes code for beginners to read.

ACTION
Build the site as it is so far (pages, role guards, stores, forms, all reading on TanStack
Query v5) and add the changes:
- toast/ (a Zustand store and a Toaster); lib/queryClient.ts gets a MutationCache whose
  onError shows every failed change as a toast.
- queries/orders.ts: useSendOrder (empty the server's cart, add each line, create the order;
  on success clear the local cart, toast, invalidate ["orders"]) and a paged "my orders"
  infinite query, 3 at a time, that stops at the last page.
- queries/kitchen.ts: useSetOrderStatus, optimistic (cancelQueries, snapshot, rollback,
  invalidate on settled). CartPanel: a button disabled while pending. MyOrders: an
  IntersectionObserver sentinel and a "Show more" button. Kitchen: Start, Ready, Delivered.

FORMAT
First a table: each change (mutation), what it sends, and what it invalidates or updates.
Then every file in full with its path.

TARGET
Beginners will read it: no double orders, no manual refetch after a change, a toast for
every failed change, Query v5 syntax only. It must pass npm run build.
```

## The short version

The Copy button on slide 37 copies exactly this:

```text
You're a senior React developer writing for beginners. Le Bistro is a Vite + React 19 + TypeScript + Tailwind 4 app with react-router 8, Zustand 5, react-hook-form 7, zod 4 and @tanstack/react-query 5, and an API at /api through a Vite proxy (dishes, categories, search, a 2-minute token login, the profile, the server's cart, orders with a paged history and the staff-only queue, and a status endpoint that answers 422 for a move that is not allowed). Build the site as it is so far (pages, role guards, stores, forms, everything read with TanStack Query v5) and add the changes: a Zustand toast store with a Toaster, and a MutationCache that shows every failed change as a toast; a useSendOrder mutation (empty the server's cart, add each line, create the order; then clear the local cart, toast and invalidate "orders") on a button that is disabled while it sends; a "my orders" infinite query, three at a time, that stops at the last page, with an IntersectionObserver sentinel and a "Show more" button; and an optimistic useSetOrderStatus for the kitchen's buttons (cancelQueries, a snapshot, a rollback, an invalidation on settled). Answer with a table of each change, what it sends and what it invalidates or updates, then every file in full with its path. Keep it simple for beginners, with no double orders, no manual refetch after a change and v5 syntax only, and make sure npm run build passes.
```

## Check the answer with today's knowledge

- [ ] Query v5 only: one options object, `isPending`, `{ queryKey }`, `initialPageParam`; no `isLoading` on a mutation
- [ ] The button is disabled while the mutation is pending; no `refetch()` in `onSuccess`: `invalidateQueries`
- [ ] The optimistic update has `cancelQueries`, a snapshot returned from `onMutate` (it arrives as `context`), a rollback in `onError` and an `onSettled`
- [ ] One `MutationCache.onError` shows every failed change; `getNextPageParam` ends with `undefined`
- [ ] The infinite list has an `IntersectionObserver` with cleanup **and** a "Show more" button

**What AIs often get wrong here:** AIs call `refetch()` or `setState` in `onSuccess`, forget `cancelQueries` and the rollback, and write Query v4. All of them are on today's mistakes slides.

## When the AI goes off track

- **Old versions** (Query v4's `useMutation(fn, { … })`, `invalidateQueries(["orders"])`, `isLoading`, `useInfiniteQuery(["k"], fn, { … })`, `react-router-dom`, a `tailwind.config.js`): point at the Context line that names the versions and ask it to follow it. That's the lesson: the Context part exists for exactly this.
- **A different order flow** (one request with the lines in the body, or invented endpoints): paste the sentence from the Action part (empty the server's cart, add each line, create the order) and ask it to follow it.
- **A scroll listener** instead of an `IntersectionObserver`, or an observer with no button: ask for the sentinel, the cleanup and the "Show more" button from the Action part.
- **Half an answer** ("the other files are similar"): ask for the missing files by name: "Give me queries/orders.ts and queries/kitchen.ts in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once. To try the order, sign in: the test accounts are listed at the top of the API's Swagger page, and the token lives 2 minutes, so sign in right before you send one.
- **No internet or no time:** show `code/after-L35` and the answer you saved before class.
