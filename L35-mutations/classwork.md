# L35 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The second one is done with an AI. No new package today: mutations are part of the TanStack Query you already have.

**Read this first.** DummyJSON only *pretends* to save. `POST /carts/add` and `PUT /products/{id}` answer as if the change was made, and the next `GET` shows the old data. So your proof is the **Network tab** and the **cache** (the DevTools), not what the server remembers.

---

## Classwork 1 · A button that changes data (slide 20)

### Base (everyone)

1. A home for the requests that send. If your `getJson` is still inside `queries/products.ts`, move it to `src/lib/http.ts` (and `export` it), and add two functions next to it:
   ```ts
   // src/lib/http.ts
   const BASE = "https://dummyjson.com";

   export async function getJson<T>(path: string): Promise<T> {
     const res = await fetch(BASE + path);
     if (!res.ok) throw new Error(`HTTP ${res.status}`); // a queryFn must throw on failure
     return (await res.json()) as T;
   }

   // POST, PUT and PATCH send JSON and read JSON. A mutationFn must throw on failure too.
   async function sendJson<T>(method: string, path: string, body: unknown): Promise<T> {
     const res = await fetch(BASE + path, {
       method,
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(body),
     });
     if (!res.ok) throw new Error(`HTTP ${res.status}`);
     return (await res.json()) as T;
   }

   export const postJson = <T>(path: string, body: unknown) =>
     sendJson<T>("POST", path, body);
   export const putJson = <T>(path: string, body: unknown) => sendJson<T>("PUT", path, body);
   ```
2. Two types (DummyJSON's cart, as it answers):
   ```ts
   // src/types.ts
   export type NewCart = { userId: number; products: { id: number; quantity: number }[] };

   export type Cart = {
     id: number;
     userId: number;
     total: number;
     totalProducts: number;
     totalQuantity: number;
   };
   ```
3. The change, as a hook in `src/queries/orders.ts`:
   ```ts
   import { useMutation, useQueryClient } from "@tanstack/react-query";
   import { useCartStore } from "../cart/cartStore";
   import { postJson } from "../lib/http";
   import type { Cart, NewCart } from "../types";

   export function usePlaceOrder() {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: (cart: NewCart) => postJson<Cart>("/carts/add", cart),
       onSuccess: () => {
         useCartStore.getState().clear(); // the order left: empty the cart
         // everything that starts with "orders" is old now; what is on screen refetches
         void queryClient.invalidateQueries({ queryKey: ["orders"] });
       },
     });
   }
   ```
4. The button, as a component for your cart page (or panel):
   ```tsx
   // src/components/PlaceOrderButton.tsx
   import { useCartStore } from "../cart/cartStore";
   import { usePlaceOrder } from "../queries/orders";

   export function PlaceOrderButton() {
     const items = useCartStore((s) => s.items);
     const placeOrder = usePlaceOrder();

     return (
       <>
         <button
           type="button"
           disabled={placeOrder.isPending || items.length === 0}
           onClick={() =>
             placeOrder.mutate({
               userId: 1, // DummyJSON's test user; your shop's signed-in user if you have one
               products: items.map((i) => ({ id: i.product.id, quantity: i.qty })),
             })
           }
         >
           {placeOrder.isPending ? "Sending…" : "Place order"}
         </button>
         {placeOrder.isSuccess && (
           <p role="status">Thank you! Order #{placeOrder.data.id} is on its way.</p>
         )}
         {placeOrder.isError && (
           <p role="alert">We could not place your order. Please try again.</p>
         )}
       </>
     );
   }
   ```
   Render `<PlaceOrderButton />` **outside** the "cart is empty" branch of your page (the button is disabled for an empty cart anyway). Otherwise the whole component disappears the moment `onSuccess` empties the cart, and the success line with it.
5. Test: add two products and press the button twice, quickly (a normal double click). The Network tab shows **one** `POST /carts/add`, the button says "Sending…" in between, and the cart is empty afterwards.

### Plus

One place for every failure, with a small **toast** store. This is the shape Le Bistro uses (`code/after-L35/src/toast/`). Read it before you copy it: it is about 50 lines.

```ts
// src/toast/toastStore.ts
import { create } from "zustand";

type Toast = { id: number; kind: "success" | "error"; text: string };

type ToastState = {
  toasts: Toast[];
  show: (kind: Toast["kind"], text: string) => void;
  dismiss: (id: number) => void;
};

let nextId = 1;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (kind, text) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, kind, text }] }));
    setTimeout(() => get().dismiss(id), 5000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// The store is outside React, so toast.error("…") works anywhere: also in the QueryClient.
export const toast = {
  success: (text: string) => useToastStore.getState().show("success", text),
  error: (text: string) => useToastStore.getState().show("error", text),
};
```

```tsx
// src/toast/Toaster.tsx: put <Toaster /> once, high in your layout
import { useToastStore } from "./toastStore";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        // role="alert" makes a screen reader read an error at once; "status" waits politely
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className={`flex items-center gap-3 rounded-md px-4 py-3 text-white shadow-lg ${
            t.kind === "error" ? "bg-red-700" : "bg-emerald-700"
          }`}
        >
          <span>{t.text}</span>
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
```

Then the one handler for every failed change, in `lib/queryClient.ts` (keep what is already there, add `mutationCache`):

```ts
import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "../toast/toastStore";

export const queryClient = new QueryClient({
  // One place that runs when ANY change (mutation) fails
  mutationCache: new MutationCache({
    onError: () => toast.error("Something went wrong. Please try again."),
  }),
  defaultOptions: { queries: { staleTime: 60_000 } },
});
```

Test it with a **wrong URL**: change `"/carts/add"` to `"/carts/ad"` for a minute. DummyJSON answers 404, a red toast appears, and the button comes back. Put the URL back. Then you can delete the local `isError` line of the Base step: the toast says it for every change.

### Pro

A history that follows the order. Show "My orders" next to the cart.

```ts
// src/queries/orders.ts: the whole file now (the new lines are the query and two imports)
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "../cart/cartStore";
import { getJson, postJson } from "../lib/http";
import type { Cart, NewCart } from "../types";

export const orderQueries = {
  // the guest is part of the key (L34); it starts with "orders", like everything we invalidate
  mine: (userId: number) =>
    queryOptions({
      queryKey: ["orders", "mine", userId],
      queryFn: async () =>
        (await getJson<{ carts: Cart[] }>(`/carts/user/${userId}`)).carts,
    }),
};

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cart: NewCart) => postJson<Cart>("/carts/add", cart),
    onSuccess: () => {
      useCartStore.getState().clear(); // the order left: empty the cart
      // everything that starts with "orders" is old now; what is on screen refetches
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
```

```tsx
// src/components/MyOrders.tsx
import { useQuery } from "@tanstack/react-query";
import { orderQueries } from "../queries/orders";

export function MyOrders() {
  const { data: orders, isPending, isError } = useQuery(orderQueries.mine(1));

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p role="alert">We couldn't load your orders.</p>;
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          Order #{order.id} · {order.totalQuantity} items · ${order.total.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}
```

Place an order with "My orders" on screen: the Network tab shows `POST /carts/add` and, right after it, `GET /carts/user/1` again. The list looks the same (DummyJSON did not store your cart): the **request** is the proof. If "My orders" is on another page, the entry is only marked old, and it refetches when you open the page.

### Done when

- [ ] Pressing the button twice sends **one** request
- [ ] After a success the history is refetched (Network tab)
- [ ] A failed request shows a toast
- [ ] No `refetch()` call inside `onSuccess`: only `invalidateQueries`

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| Two requests when pressing twice | The button is not `disabled={placeOrder.isPending}` |
| `TS2559 · Type '() => Promise<…>' has no properties in common with type 'UseMutationOptions<…>'` | Query v4 syntax: one options object `{ mutationFn, onSuccess }` |
| `TS2559 · Type 'string[]' has no properties in common with type 'InvalidateQueryFilters<…>'` | `invalidateQueries({ queryKey: ["orders"] })` |
| `TS2339 · Property 'isLoading' does not exist on type 'UseMutationResult<…>'` | `isPending` |
| The cart empties, nothing else refreshes | No `invalidateQueries`, or a typo in the key (`["order"]` matches nothing, silently) |
| "My orders" does not refetch at the moment of the order | It is not on screen: an unused entry is only marked old. Show it next to the cart, or open it afterwards |
| The history looks the same after a success | Expected: DummyJSON does not store what you send. Look at the Network tab |
| A `POST` on every render, or "Too many re-renders" | `mutate()` called in the component body: it belongs in an event handler |
| `Uncaught (in promise)` in the console | `mutateAsync` without a `try`/`catch`: use `mutate` |
| No toast for a failed order | `mutationCache` is not in `new QueryClient({ … })`, or `<Toaster />` is not on the page |
| The success line never shows | It sits inside the "cart is empty → show nothing" branch |

---

## Classwork 2 · Prompt it: changes that feel instant (with AI, slide 34)

The second classwork is done **with an AI**. You write the prompt, the AI writes the code, and you check it. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** A "Place order" mutation: disabled while pending; on success clear the cart and invalidate the history.
- **Plus:** A global error toast (`MutationCache`) and an **optimistic heart** on the products, with a rollback.
- **Pro:** An infinite product list with a "Show more" button **and** an `IntersectionObserver`.

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| C | **Context** | Your shop and stack, with versions: `@tanstack/react-query` 5. Paste your cart store. |
| R | **Role** | "A React teacher who writes small TanStack Query code for a beginner." |
| A | **Action** | The Base task. Plus and Pro in follow-up prompts. |
| F | **Format** | "Only the files that change, complete, with paths. Query v5." |
| T | **Target** | "No `refetch()` in `onSuccess`. `cancelQueries` first. No double orders." |

### A sample prompt (Tech store)

```text
CONTEXT
Shop "Volt". Vite + React 19 + TypeScript + Tailwind 4,
@tanstack/react-query 5, a Zustand cart (pasted).
ROLE
A React teacher who writes small TanStack Query code.
ACTION
usePlaceOrder (useMutation): button disabled while pending;
on success clear the cart, invalidate ["orders"]. A heart on
each product: optimistic update with rollback. A toast on
every failed mutation (MutationCache).
FORMAT
Only changed files, complete, with paths. Query v5.
TARGET
No refetch() in onSuccess. cancelQueries before the update.
```

### The rules

1. Read every line before it goes into your project. You must be able to explain it.
2. Run it. If something fails, the next prompt is the exact error message.
3. One step at a time: Base first, then Plus and Pro as follow-up prompts.
4. Test the rollback on purpose: point the heart's request at a wrong URL for a moment. The heart must flip back, with a toast.
5. Log it in `AI.md`: your prompt, what you kept, what you changed and why.

### Done when

- [ ] Two presses send one order
- [ ] `invalidateQueries`, not `refetch()`
- [ ] Optimistic: `cancelQueries`, a snapshot, a rollback
- [ ] AI.md: your prompt and one thing you changed

### What the AI tends to get wrong here (for the lecturer)

| The AI writes | The follow-up prompt |
|---|---|
| `useMutation(sendOrder, { onSuccess })`, `invalidateQueries(["orders"])`, `send.isLoading` (Query v4) | "Use TanStack Query v5: one options object `{ mutationFn, onSuccess }`, `invalidateQueries({ queryKey })`, `isPending`." |
| `refetch()` or `setOrders(…)` in `onSuccess` | "Do not refetch by hand: call `invalidateQueries` with the start of the key." |
| A `useState(false)` flag for "sending", or a button that is not disabled | "Use the mutation's `isPending` and disable the button with it. No extra state." |
| `await send.mutateAsync()` with no `try`/`catch` | "Use `mutate` with callbacks, or wrap `mutateAsync` in `try`/`catch`." |
| An `onError: () => toast(…)` copied into every mutation | "One `MutationCache({ onError })` in `queryClient.ts`. Remove the `onError` from each mutation." |
| An optimistic update that calls `setQueryData` straight away | "Call `await queryClient.cancelQueries({ queryKey })` first." |
| An `onMutate` with no rollback | "Return `{ previous }` from `onMutate` and put it back in `onError`." |
| `old.push(…)` or `old[i].liked = true` on the cached data | "Never change the cached data. Return a new array with `map`." |
| `onSettled: invalidateQueries` on the heart (right for a real API) | "DummyJSON does not keep changes, so the refetch brings the old product back. Leave the refetch out of this exercise and say why in a comment." |
| `getNextPageParam: (last) => last.skip + last.limit` (no end) | "Return `undefined` on the last page: `next < last.total ? next : undefined`." |
| `useInfiniteQuery` without `initialPageParam` | "Query v5 needs `initialPageParam: 0`." |
| `window.addEventListener("scroll", …)` | "Use an `IntersectionObserver` on a sentinel `div`, created in `useEffect`, with `disconnect()` in the cleanup." |
| An observer and no button | "Also add a 'Show more' button, for keyboard users." |

### What a good answer looks like

The hand-written solution, to check what the AI produced.

#### Base (everyone)

The files of Classwork 1: `lib/http.ts`, `queries/orders.ts` with `usePlaceOrder`, and the button.

#### Plus

The toast store, the `Toaster` and the `MutationCache` of Classwork 1, and an optimistic heart on the list that is on screen:

```ts
// src/types.ts: one new optional field on your Product. The heart exists only in the cache.
export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  liked?: boolean;
  // …and the fields you already have
};
```

```ts
// src/queries/likes.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putJson } from "../lib/http";
import type { Product } from "../types";
import { productQueries } from "./products";

// An optimistic heart on the product list that is on screen
export function useToggleLike(category: string) {
  const queryClient = useQueryClient();
  const listKey = productQueries.list(category).queryKey;

  return useMutation({
    mutationFn: ({ id, liked }: { id: number; liked: boolean }) =>
      putJson<Product>(`/products/${id}`, { liked }),

    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries({ queryKey: listKey }); // a refresh now would overwrite us
      const previous = queryClient.getQueryData(listKey); // the snapshot
      queryClient.setQueryData(listKey, (products) =>
        products?.map((p) => (p.id === id ? { ...p, liked } : p)),
      );
      return { previous }; // arrives as `context`
    },

    onError: (_error, _vars, context) => {
      if (context) queryClient.setQueryData(listKey, context.previous); // the rollback
    },

    // No onSettled refetch in THIS exercise: DummyJSON forgets every change, so the refetch
    // would bring the old product back. With a real API you would invalidate here.
  });
}
```

```tsx
// src/components/HeartButton.tsx
import { useToggleLike } from "../queries/likes";
import type { Product } from "../types";

export function HeartButton({ product, category }: { product: Product; category: string }) {
  const toggle = useToggleLike(category);
  const liked = product.liked ?? false;

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={
        liked
          ? `Remove ${product.title} from favourites`
          : `Add ${product.title} to favourites`
      }
      onClick={() => toggle.mutate({ id: product.id, liked: !liked })}
    >
      {liked ? "♥" : "♡"}
    </button>
  );
}
```

Two honest limits to say out loud. The heart lives in **one** cache entry (the list that is on screen): the product page has its own entry and does not know. And a reload forgets it: DummyJSON never stored it.

#### Pro

```ts
// src/queries/products.ts: add to productQueries (and import infiniteQueryOptions)
infinite: () =>
  infiniteQueryOptions({
    queryKey: ["products", "infinite"],
    queryFn: ({ pageParam }) =>
      getJson<ProductList>(`/products?limit=10&skip=${pageParam}`),
    initialPageParam: 0, // skip=0 is the first page
    getNextPageParam: (last) => {
      const next = last.skip + last.limit;
      return next < last.total ? next : undefined; // undefined: that was the last page
    },
  }),
```

```ts
// src/hooks/useInView.ts: calls onEnter when the sentinel scrolls into view
import { useEffect, useRef } from "react";

export function useInView<T extends Element>(onEnter: () => void, enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onEnter();
      },
      { rootMargin: "200px" }, // start a little before the sentinel is visible
    );
    observer.observe(node);
    return () => observer.disconnect(); // cleanup: stop watching
  }, [onEnter, enabled]);

  return ref;
}
```

```tsx
// src/components/AllProducts.tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "../hooks/useInView";
import { productQueries } from "../queries/products";

export function AllProducts() {
  const { data, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(productQueries.infinite());
  const sentinel = useInView<HTMLDivElement>(
    () => void fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  );

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p role="alert">We couldn't load the products.</p>;

  // data.pages is a list of pages: flatten it into one list
  const products = data.pages.flatMap((page) => page.products);
  return (
    <>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
      <div ref={sentinel} />
      {hasNextPage && (
        <button
          type="button"
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading…" : "Show more"}
        </button>
      )}
    </>
  );
}
```

DummyJSON has 194 products: twenty pages of ten. The observer fills the screen by itself; scrolling loads the rest, and when the last page arrives `hasNextPage` turns false and the button goes.

#### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| The AI's answer does not compile on `useMutation(fn, { … })` | It is Query v4: ask for v5 and one options object |
| The heart switches off about a second after it turns on | `invalidateQueries` in `onSettled`: DummyJSON returns the original product. Leave the refetch out here |
| The heart does not flip back on an error | No rollback, or the test URL is still correct. Check that `onMutate` returns `{ previous }` and that `onError` restores it |
| The heart flickers back for a moment | No `cancelQueries` before `setQueryData` |
| The cached list changes but the screen does not | `setQueryData` was given the same array (a `push`); return a new one with `map` |
| The list asks for page after page, for ever | `getNextPageParam` never returns `undefined` |
| `TS2769 · Property 'initialPageParam' is missing …` | Query v4 infinite query: one options object with `initialPageParam` |
| The next page never loads on a short list | The observer is not re-armed: `enabled` must be in the effect's dependencies |
| Keyboard users cannot load more | No "Show more" button next to the observer |
