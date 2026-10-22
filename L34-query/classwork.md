# L34 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The second one is done with an AI. Two new packages today: `npm install @tanstack/react-query @tanstack/react-query-devtools`.

---

## Classwork 1 · Your product list in a cache (slide 20)

### Base (everyone)

1. Install the packages. Make **one** cache in its own module, and give it to the app:
   ```ts
   // src/lib/queryClient.ts
   import { QueryClient } from "@tanstack/react-query";

   export const queryClient = new QueryClient({
     defaultOptions: { queries: { staleTime: 60_000 } }, // fresh for a minute
   });
   ```
   ```tsx
   // src/main.tsx
   <QueryClientProvider client={queryClient}>
     <BrowserRouter>
       <App />
     </BrowserRouter>
     <ReactQueryDevtools initialIsOpen={false} />
   </QueryClientProvider>
   ```
2. One file for the questions your shop asks (DummyJSON):
   ```ts
   // src/queries/products.ts
   import { queryOptions } from "@tanstack/react-query";
   import type { Product, ProductList } from "../types";

   const BASE = "https://dummyjson.com";
   async function getJson<T>(path: string): Promise<T> {
     const res = await fetch(BASE + path);
     if (!res.ok) throw new Error(`HTTP ${res.status}`); // a queryFn must throw on failure
     return (await res.json()) as T;
   }

   export const productQueries = {
     list: (category: string) =>
       queryOptions({
         queryKey: ["products", "list", category],
         queryFn: async () =>
           (
             await getJson<ProductList>(
               category === "all" ? "/products?limit=30" : `/products/category/${category}`,
             )
           ).products,
       }),
     detail: (id: number) =>
       queryOptions({
         queryKey: ["products", "detail", id],
         queryFn: () => getJson<Product>(`/products/${id}`),
       }),
   };
   ```
3. Use them. In the list page and the product page, replace your fetch hook (or your `useEffect` + `useState`):
   ```tsx
   // list page
   const category = params.get("category") ?? "all";
   const { data: products, isPending, isError } = useQuery(productQueries.list(category));

   // product page: the hooks run before any early return
   const { id } = useParams();
   const { data: product, isPending, isError } = useQuery(productQueries.detail(Number(id)));
   ```
4. Delete your fetch hook. Follow TypeScript's red lines.
5. Test: open the Network tab (Fetch/XHR) and the DevTools. List → a product → back to the list: the list is requested **once**.

### Plus

- Categories in the key (already there) and `placeholderData: keepPreviousData`, so the old products stay while another category loads:
  ```tsx
  import { keepPreviousData, useQuery } from "@tanstack/react-query";

  const list = useQuery({
    ...productQueries.list(category),
    placeholderData: keepPreviousData,
    enabled: !searching, // no list request while a search is showing
  });
  ```
- A search that waits for its text: `useQuery({ ...productQueries.search(search), enabled: searching })` with `search: (text) => queryOptions({ queryKey: ["products", "search", text], queryFn: … /products/search?q= })`.

### Pro

The product page starts from the data the list already has (so it opens at once), then checks the server:

```ts
detail: (id: number) =>
  queryOptions({
    queryKey: ["products", "detail", id],
    queryFn: () => getJson<Product>(`/products/${id}`),
    // start from the list we already have, if it is in the cache
    initialData: () =>
      queryClient.getQueryData(productQueries.list("all").queryKey)?.find((p) => p.id === id),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(productQueries.list("all").queryKey)?.dataUpdatedAt,
  }),
```

(`queryClient` is the one from `lib/queryClient.ts`. If the list is not in the cache, `initialData` returns `undefined` and the query fetches as usual.)

### Done when

- [ ] Network tab: list → product → back is **one** request for the list
- [ ] No fetch hook and no `useEffect` that fetches is left
- [ ] Every variable the function uses is in its key
- [ ] The DevTools show your keys

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `Error: No QueryClient set, use QueryClientProvider to set one` | The provider is missing from `main.tsx`, or the component is outside it |
| `TS2769 · Property 'queryKey' is missing in type 'string[]'` | Query v4 syntax: one options object |
| Clicking a category changes nothing | The key forgets the category |
| The list is fetched again on every page | The pages use different keys, or `new QueryClient()` is inside a component |
| `data` is the whole answer object, and `.map` is not a function | The DummyJSON list is `{ products, total, skip, limit }`: return `.products` from the `queryFn` |
| `Rendered more hooks than during the previous render` / the order-of-Hooks error | `useQuery` after an early `return`: move the hooks to the top |
| A 404 for a product ends in `isError` | Expected: DummyJSON answers 404 for an unknown id; show "not found" |

---

## Classwork 2 · Prompt it: a cache with settings (with AI, slide 36)

The second classwork is done **with an AI**. You write the prompt, the AI writes the code, and you check it. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** Your product list and product page on `useQuery` with `queryOptions`, a `queryClient` module and the provider. No fetch hook left.
- **Plus:** `keepPreviousData` on a category change, `enabled` for the search, and a prefetch on hover and focus of a category.
- **Pro:** A guest's data (`GET https://dummyjson.com/auth/me`) with the guest in the key, and a cache that is cleared on sign-out.

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| C | **Context** | Your shop and stack, with versions: `@tanstack/react-query` 5. Paste your fetch hook and your list page. |
| R | **Role** | "A React teacher who writes small TanStack Query code for a beginner." |
| A | **Action** | The Base task. Plus and Pro in follow-up prompts. |
| F | **Format** | "Only the files that change, complete, with paths. Query v5: one options object." |
| T | **Target** | "Every variable the function uses is in its key. No useEffect fetching, no state copy." |

### A sample prompt (Tech store)

```text
CONTEXT
Shop "Volt" (phones, laptops). Vite + React 19 + TypeScript
+ Tailwind 4, @tanstack/react-query 5. DummyJSON API. Products
are fetched in useProducts, a useEffect hook (pasted).
ROLE
A React teacher who writes small TanStack Query code.
ACTION
Replace useProducts with queries/products.ts (queryOptions:
list by category, one product). queryClient.ts with a
1 minute staleTime. Keep the old products while a category
loads; prefetch a category on hover.
FORMAT
Only changed files, complete, with paths. Query v5.
TARGET
Every variable used by a queryFn is in its key.
```

### The rules

1. Read every line before it goes into your project. You must be able to explain it.
2. Run it. If something fails, the next prompt is the exact error message.
3. One step at a time: Base first, then Plus and Pro as follow-up prompts.
4. Log it in `AI.md`: your prompt, what you kept, what you changed and why.

### Done when

- [ ] Every key lists what its function uses
- [ ] No `useEffect` fetches and no `useState` copies the data
- [ ] Query v5 syntax: one options object, `gcTime`, `placeholderData`
- [ ] AI.md: your prompt and one thing you changed

### What the AI tends to get wrong here (for the lecturer)

| The AI writes | The follow-up prompt |
|---|---|
| `useQuery(["products"], fetchProducts)`, `cacheTime`, `keepPreviousData: true`, `onSuccess` (Query v4) | "Use TanStack Query v5: one options object, `gcTime`, `placeholderData: keepPreviousData`, no callbacks." |
| `useEffect(() => { if (data) setProducts(data) }, [data])` | "Use `data` directly. No state copy of query data." |
| `const queryClient = new QueryClient()` inside `App` | "Make the `QueryClient` once, in `lib/queryClient.ts`." |
| `queryKey: ["products"]` for `fetchProducts(category)` | "The key must list everything the queryFn uses: `["products", "list", category]`." |
| A skeleton on `isPending` for the search that is `enabled: false` | "Show the skeleton only while the query is enabled (use `isLoading`)." |
| `queryKey: ["me"]` for the guest's data | "Put the guest in the key, and clear the cache on sign-out." |
| `fetch` that does not throw on a 404 (so a 404 becomes data) | "The `queryFn` must throw when `res.ok` is false." |
| Prefetch only on `onMouseEnter` | "Also on `onFocus`, for keyboard users." |
| Retries on every error | "Do not retry a 4xx: write a `retry` function." |

### What a good answer looks like

The hand-written solution, to check what the AI produced.

#### Base (everyone)

The files of Classwork 1: `lib/queryClient.ts`, the provider in `main.tsx`, `queries/products.ts`, and the two pages on `useQuery`.

#### Plus

```tsx
// the list page
const queryClient = useQueryClient();
const list = useQuery({
  ...productQueries.list(category),
  placeholderData: keepPreviousData, // the old products stay while another category loads
  enabled: !searching,
});

<CategoryChips
  categories={categories.data ?? []}
  onSelect={selectCategory}
  // start the request when the pointer arrives
  onHover={(slug) => void queryClient.prefetchQuery(productQueries.list(slug))}
/>

// CategoryChips.tsx
<button
  onClick={() => onSelect(chip.slug)}
  onMouseEnter={() => onHover?.(chip.slug)}
  onFocus={() => onHover?.(chip.slug)}
>
```

#### Pro

```ts
// src/queries/account.ts: the guest is part of the key
export const accountQueries = {
  me: (username: string) =>
    queryOptions({
      queryKey: ["me", username],
      queryFn: () => getJson<User>("/auth/me", token), // the token as your helper sends it
    }),
};

// src/lib/queryClient.ts: the cache must not outlive the guest
useAuthStore.subscribe((state, previous) => {
  if (previous.session && !state.session) queryClient.clear();
});
```

#### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| The AI's answer does not compile on `useQuery([...], fn)` | It is Query v4: ask for v5 and one options object |
| The products stay after clicking a category | The key forgets the category |
| Everything is fetched again on every render | `new QueryClient()` inside a component |
| A 404 shows an empty list instead of an error | The `queryFn` does not throw when `res.ok` is false |
| Another guest sees the previous guest's data | No guest in the key, and no `clear()` on sign-out |
