# L34 · La chambre froide — lecturer guide

**TanStack Query I: reading data.** Le Bistro track, lecture 8 of 10 (syllabus v2: **L36**, React lecture 9).
**Deck:** [`index.html`](index.html), 43 slides. **Code:** starts from [`../code/after-L33`](../code/after-L33), ends at [`../code/after-L34`](../code/after-L34).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md). **Masterclass script:** [`masterclass.md`](masterclass.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | Why server data needs a cache of its own; `QueryClient` and its provider; `useQuery` (`queryKey`, `queryFn`, `data`, `isPending`, `isError`, `isFetching`); `queryOptions` and a `queries/` folder; the key as the address of the data (a dependency array); the two clocks, `staleTime` (fresh → stale) and `gcTime` (inactive → gone); sharing and de-duplication; the DevTools; `placeholderData: keepPreviousData`, `enabled`, `prefetchQuery` on hover; `refetchInterval` and refetching on focus; the retry rule; a guest's data with the guest in the key and a cache that is cleared on sign-out |
| **Le Bistro gets** | `lib/queryClient.ts`; `queries/dishes.ts`, `account.ts`, `kitchen.ts`; the `useApi` hook **deleted**; a menu page with `keepPreviousData`, `enabled` search, prefetch on hover and focus, a "Try again" button and a message for a 429; a kitchen page that refreshes every 5 seconds; one cache entry shared by Home, Menu and the dish page; a cache emptied on sign-out |
| **Students' project** | v0.8: all server data on TanStack Query, keys that list what their functions use, `keepPreviousData` and `enabled`, a "Try again" button; Plus: prefetch and a retry rule; Pro: a guest's data with the guest in the key |
| **The two problems** | 1. The same menu is fetched on every page and forgotten with the page. 2. Three seconds of nothing, a queue that gets old, a guest who leaves |
| **The two answers** | 1. A cache by key. 2. Settings, not code: `keepPreviousData`, `prefetchQuery`, `refetchInterval`, a retry rule, the guest in the key and `clear()` |
| **AI** | Classwork 2 is done with an AI: a CRAFT prompt (Context, Role, Action, Format, Target), then the students check the code. The Masterclass rebuilds Le Bistro after L34 with one prompt |

**Numbers** (measured on production builds against our local copy of the API): Home → Menu → a dish → Back to the menu sends `GET /dishes` **4 times** with `useApi` (1, 2, 3, 4) and **once** with TanStack Query. After a hover on "Main Courses" the click renders the six dishes in about **70 ms** instead of waiting 3 seconds. The kitchen queue asks again every **5 seconds**, and a 429 is **not** retried (one request). The bundle grows by about **10 kB** (gzip): 131.1 kB after L33, 141.3 kB now; the DevTools are not in the production build.

---

## Before class

- [ ] Your Le Bistro from L33 runs (or copy `code/after-L33`, `npm install`).
- [ ] Do the measurement once: in `code/after-L33`, open the Network tab (filter Fetch/XHR) and click Home → Menu → a dish → Back to the menu. Count the requests for `/dishes`: four. That is the problem you will show.
- [ ] `code/after-L34` open in a second VS Code window. Install with `npm install @tanstack/react-query @tanstack/react-query-devtools`.
- [ ] The real API has two traps that the lecture uses: the `main-courses` list takes **3 seconds**, and the search endpoint allows **10 requests a minute** per IP (then 429 with a `Retry-After`). A classroom shares one IP: a 429 in class is part of the lesson.
- [ ] The authenticated endpoints used by the profile and the kitchen queue were built from the API's Swagger description and run here against a local copy of it; they were **not** called on the live server. The public ones (`dishes`, `categories`, `search`) match the live server.
- [ ] Try the demos on slides 8, 15, 16, 23, 24, 28, 30, 31 and 32 once. They run in the deck, no internet needed.
- [ ] Remind the students that their shop's data comes from DummyJSON: `/products?limit=30`, `/products/category/{slug}`, `/products/search?q=`, `/products/{id}` and `/products/categories`.

---

## Learn it first (35 minutes)

### 1. Server state needs a cache

In L32 the state map had a fifth home, "server": the data the server owns and we only copy. A copy of someone else's data has questions a `useState` does not answer: how old is it? who else needs it? what if the request fails? what if it changes? The `useApi` hook from L29 answers one of them well (it cancels old requests and never shows an answer under the wrong question) and none of the others: its answer lives in a `useState` of the component that called it, so Home, Menu and the dish page each ask again, and the answer dies with the page.

A **server-state cache** keeps the answers **outside the components**, labelled with a **key** and a **date**, and answers from memory when it can. TanStack Query (until 2022 "React Query") is the standard tool. In this course: v5, `@tanstack/react-query` 5.104.

### 2. The cache and its provider

```ts
// src/lib/queryClient.ts: in its own module, never inside a component
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
});
```

```tsx
// src/main.tsx
<QueryClientProvider client={queryClient}>
  <BrowserRouter><App /></BrowserRouter>
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

- A `new QueryClient()` **inside a component** makes an empty cache on every render: everything is fetched again and nothing errors.
- Without the provider: `Error: No QueryClient set, use QueryClientProvider to set one`.
- The DevTools are a panel for development; they are left out of the production build.

### 3. `useQuery`

```tsx
const { data, isPending, isError, error, isFetching } = useQuery({
  queryKey: ["dishes", "list", category],
  queryFn: () => api<Dish[]>(path),
});
```

- **`queryKey`**: the address of the data in the cache. Same key, same entry.
- **`queryFn`**: how to fetch it; a function that returns a promise and **throws** on failure. Called only when the cache has no fresh answer.
- **`data`** is `undefined` until the first answer. **`isPending`**: no data yet. **`isError`**: the last fetch failed. **`isFetching`**: a request is running *right now*, the first or a refresh in the background. **`isLoading`** is `isPending && isFetching`: the very first request in flight.
- After the first answer, a refresh has `isFetching` true and `isPending` false: show a small "Updating…", keep the data on screen.
- **A disabled query** (`enabled: false`) that never ran is `isPending: true`, `isFetching: false`, `isLoading: false` (we checked). A skeleton shown on `isPending` would never go away.
- In v5 **everything goes in one options object**. `queryOptions({ queryKey, queryFn })` wraps the pair so that every page asks the same question the same way (`dishQueries.list("all")`).

### 4. The key

The key is an **array**. It is the cache's address, and it works like a **dependency array**: if the function uses a value, the value goes in the key. Put the general part first: `["dishes", "list", category]`, `["dishes", "search", text]`, `["orders", "queue"]`, `["profile", email]`. Every key about dishes starts with `"dishes"`, so that one call can refresh them all together (L35's `invalidateQueries({ queryKey: ["dishes"] })` matches a prefix).

A key that forgets a variable is a **silent bug**: with `["dishes"]` for `fetchDishes(category)` every category shares one entry, and the starters stay on screen under a "Drinks" chip. Slide 16 shows it.

### 5. The two clocks

| | What it means | Default | Our setting |
|---|---|---|---|
| **`staleTime`** | How long an answer counts as **fresh** after it arrives | `0` | 60 s for everything; 0 for the kitchen queue; 10 min for the categories |
| **`gcTime`** | How long an entry nobody uses stays in the cache | 5 minutes | the default |

- **Fresh**: a new component that asks gets the answer at once. **No request.**
- **Stale**: it gets the answer at once **and** a refresh runs in the background (mount, window focus, reconnect). Stale does not mean broken: it means "show it, then check".
- **Inactive**: no component uses the entry. It stays until `gcTime` passes, then it is **gone**: the next component starts from a skeleton. (We checked: after the last component unmounts the entry is still in the cache.)
- With the default `staleTime: 0` every new mount and every return to the tab refetches. That surprises people ("why does it fetch again?"): set a `staleTime` that the data deserves.
- Two components that ask for the same key at the same moment share **one** request (de-duplication, verified).

### 6. Smooth switching

- **`placeholderData: keepPreviousData`** keeps the previous answer on screen while the new key loads; `isPlaceholderData` is true meanwhile (dim the grid, set `aria-busy`). The stand-in is never stored in the cache. In v4 it was `keepPreviousData: true`: gone.
- **`enabled`**: `enabled: false` asks nothing. No menu request while a search is showing; no search request without text.
- **`queryClient.prefetchQuery(options)`** fills the cache for a key without a component. It respects `staleTime`: a fresh entry is not fetched again. We call it from `onMouseEnter` **and** `onFocus` of the category chips, so that the three-second `main-courses` request starts when the pointer arrives. Measured: click → six dishes in about 70 ms after a three-second hover. A prefetch is a cheap bet; do not prefetch the whole site.

### 7. Data that changes on its own

`refetchInterval: 5_000` asks again every five seconds while the page is open (the library pauses it in a background tab unless told otherwise). `refetchOnWindowFocus` is on by default for stale data. The kitchen queue also has `staleTime: 0`: an old queue is not to be trusted. Polling is the simple tool; real-time systems use WebSockets or server-sent events, which our API does not have.

### 8. Failure

The default is **3 retries** after 1 s, 2 s and 4 s (the error shows after about 7 seconds). A 5xx or a lost connection may recover; a 4xx never will (404 does not exist, 429 means "too many requests" and asking again makes it worse). Our rule:

```ts
retry: (failureCount, error) =>
  !(error instanceof ApiError && error.status >= 400 && error.status < 500) &&
  failureCount < 2,
```

A "Try again" button calls `refetch()`. A 429 shows the `Retry-After` seconds from the `ApiError`.

### 9. A guest's data

A cache does not know who is looking. `["profile"]` with no guest in it means: Maia signs in, signs out, Beso signs in, and the entry is still fresh, so **Beso sees Maia's profile**. Two rules, both on slide 32: the guest is **in the key** (`["profile", email]`), and the cache is **cleared when the session ends**:

```ts
useAuthStore.subscribe((state, previous) => {
  if (previous.session && !state.session) queryClient.clear();
});
```

`subscribe` is the store feature from L32 that works outside React. This is a privacy rule, not a performance one.

### 10. Query v4 → v5 (what old tutorials and many AIs write)

| Query v4 | Query v5 | TypeScript says |
|---|---|---|
| `useQuery(["dishes"], fetchDishes)` | `useQuery({ queryKey: ["dishes"], queryFn: fetchDishes })` | `TS2769 · Property 'queryKey' is missing in type 'string[]'` |
| `cacheTime` | `gcTime` | `'cacheTime' does not exist in type 'UseQueryOptions<…>'` |
| `keepPreviousData: true` | `placeholderData: keepPreviousData` | `'keepPreviousData' does not exist in type …` |
| `onSuccess` / `onError` on `useQuery` | removed: use `data`, or the cache's global handlers (L35) | `'onSuccess' does not exist in type …` |
| `status === "loading"` | `status === "pending"` (and `isPending`) | |

(The messages come from compiling these lines with TypeScript 6 and Query 5.104.)

### Check yourself

1. Why does `useApi` fetch the dishes four times for Home → Menu → a dish → Back? → Each call keeps its answer in its own `useState`, and it dies with the component.
2. What does the key do, and what goes in it? → It is the address of the data; everything the function uses.
3. What is wrong with `queryKey: ["dishes"]` and `fetchDishes(category)`? → Every category shares one entry, so the wrong data shows. No error.
4. What is the difference between `staleTime` and `gcTime`? → `staleTime`: how long an answer is fresh. `gcTime`: how long an unused entry stays in the cache.
5. What does `keepPreviousData` do? → Keeps the last answer on screen (flagged `isPlaceholderData`) while the new key loads.
6. Why prefetch on `onFocus` too? → Keyboard users get the same head start as mouse users.
7. Why is a 429 not retried? → Asking again makes it worse; a 4xx will not fix itself.
8. Why is the guest in the profile's key? → Otherwise the next guest in the same browser gets the previous guest's fresh entry.

Further reading: the TanStack Query docs (tanstack.com/query → *Important Defaults*, *Query Keys*, *Query Options*, *Placeholder Query Data*, *Prefetching & Router Integration*, *Query Retries*) and the community post "Practical React Query".

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting, menu, the second five-lecture route, the blind rolls up on `MenuPage` |
| 0:03 | Questions | 5–6 | Backup questions; two v0.7 demos, each ending with the Network tab |
| 0:11 | Problem 1 | 7–10 | **Home, Menu, a dish: count the requests**; the `useApi` hook read as a reviewer; "What would we need?" |
| 0:16 | Solution 1 | 11–19 | A cache between the pages and the server, `useQuery` in one picture, **the cache and its provider (live)**, **the dishes by key (live)**, **fresh, stale, inactive, gone**, **the key is the address**, the DevTools, mistakes, quiz |
| 0:40 | Classwork 1 | 20 | Their product list in a cache |
| 0:55 | Break | 21 | |
| 1:05 | Problem 2 | 22–25 | **Click a category, wait**; **the queue is as old as the page**; "What would we need now?" |
| 1:10 | Solution 2 | 26–35 | `keepPreviousData` and `enabled` (live), **prefetch on hover (live)**, **two settings, no blank screen**, polling (live), **the queue refreshes itself**, **retry what can recover**, **two guests, one cache**, the numbers at the end, mistakes, quiz |
| 1:32 | Classwork 2 with AI | 36 | Students prompt an AI for a cache with settings, then check it |
| 1:47 | Masterclass | 37–39 | One prompt rebuilds Le Bistro after L34: part by part, run and check, the short version |
| 1:55 | Wrap-up | 40–43 | Recap, flip cards, homework, next time (mutations) |

Running late? Skip slides 9 (say it in one sentence), 12 (`useQuery` in one picture: "two things in, a few flags out"), 16 (the key lab: mistake 1 on slide 18 covers it), 17 (open the DevTools live instead), 19 and 35 (quizzes), 31 (read the retry rule aloud) and 33 (the numbers). In the second half, copy `queries/kitchen.ts` instead of typing slide 29. Never skip the classworks. In the Masterclass, show the parts (slide 37) and the short version (slide 39), and skip the live run.

---

## Classwork 2 with AI and the Masterclass

**Classwork 2 with AI** (slide 36, 15 minutes). The task is the product list and product page on `useQuery` with `queryOptions` (Base), `keepPreviousData`, `enabled` for the search and a prefetch on hover (Plus), and a guest's data with the guest in the key and a cache cleared on sign-out (Pro). The students write a five-part prompt (**CRAFT**), the AI writes the code, and they check it against "Done when".
- Any AI tool works: Claude, ChatGPT, Copilot Chat. Students who have none can pair up.
- The check is mostly "is it Query **v5**?": two arguments, `cacheTime`, `keepPreviousData: true` and `onSuccess` are all v4, and TypeScript says so. Ask students to explain one line the AI wrote. Code they can't explain doesn't count.
- When the answer doesn't work, the next prompt is the exact error message.
- The template, a sample prompt (blurred on the slide until clicked) and the follow-up prompts for the AI's usual mistakes are in [`classwork.md`](classwork.md).

**Masterclass** (slides 37–39, 8 minutes). One prompt rebuilds Le Bistro as it is after today:
1. **The prompt, part by part.** Each press opens one part. For each, one sentence: what would the AI do without it?
2. **Run it, then check it.** Show the answer and go through the checks: each one is something from today.
3. **The short version.** The same five parts as one paragraph; press next and each part lights up.

**Before class:** run the Masterclass prompt once and keep the answer open (a minute or two, and it varies). The exact texts are in [`masterclass.md`](masterclass.md).

---

## The demos

| Slide | Demo | How |
|---|---|---|
| 8 | Home, Menu, a dish: count the requests | **Walk it for me** with "Each page asks (useApi)": four requests, about three seconds of skeleton, a skeleton on every page. Switch to "One cache" (it resets) and walk again: one request, one skeleton, "fresh: no request" in the log. Click the pages by hand too |
| 15 | Fresh, stale, inactive, gone | The clocks are scaled down (10 s and 30 s). **Mount a component**: no entry → a request (1 s), a skeleton, then the dishes. **Unmount it**: the entry stays, inactive. Mount again inside 10 s: no request. **+10 s**, mount: shown at once, refreshed in the background. Unmount and press **+10 s** three times: gone, and the next mount starts from a skeleton |
| 16 | The key is the address | With `["dishes","list",category]`: Starters, Drinks, Starters (the second Starters is a **hit**, two entries). Switch to `["dishes"]` (it resets): Starters, then Drinks → the starters under a "Drinks" chip |
| 23 | Click a category, wait | "Main Courses": three seconds of skeleton. "Drinks": half a second. "Main Courses" again: instant. The counters show requests and the seconds of blank screen |
| 24 | The queue is as old as the page | The server adds an order every 4 seconds; the page keeps its first copy and its age grows; **Reload the page (F5)** catches up |
| 28 | Two settings, no blank screen | **Keep the old dishes**: the grid stays, dimmed, while the new one loads. **Prefetch on hover**: hover "Main Courses" for three seconds, then click: the dishes show in a few milliseconds and the request count stays 1. Each switch resets |
| 30 | The queue refreshes itself | **Refetch every 5 seconds**: the page catches up in steps; "Updating…" shows without hiding the list. **Refetch when the guest comes back** + the button: asks at once |
| 31 | Retry what can recover | "Our policy": 500 → three attempts (now, +1 s, +3 s) and the error at 3 s; 404 and 429 → one attempt. "The default": 500 → four attempts, the error at 7 s; it even retries a 404. The demo runs 2.5× faster than the real delays; the axis shows the real seconds |
| 32 | Two guests, one cache | Both switches off: Maia signs in, Sign out, Beso signs in → **Maia's profile** with a red banner. Switch on "the guest is in the key": Beso gets a request of their own. Switch on "clear on sign-out" instead: the cache is empty when Beso arrives |
| 36 | The sample prompt | Click the blurred box on the Classwork 2 slide: a complete CRAFT prompt for one shop theme |
| 37 | The prompt, part by part | Press next five times; **Copy** copies the whole prompt with its five labels |
| 39 | The short version | Press next: each part lights up in its colour; **Copy** copies the paragraph |

---

## The live build, step by step

Part 1 (before the break): the dishes in a cache.

1. **Install:** `npm install @tanstack/react-query @tanstack/react-query-devtools`.
2. **`src/lib/queryClient.ts`** (slide 13): the cache, with `staleTime: 60_000`.
3. **`src/main.tsx`** (slide 13): `QueryClientProvider` around the router, then `ReactQueryDevtools`.
4. **`src/queries/dishes.ts`** (slide 14): `dishQueries.list(category)`; copy `search` and `categories` from `code/after-L34/src/queries/dishes.ts` (the categories have `staleTime: 10 * 60_000`).
5. **Replace `useApi`** in `Favourites` (`isPending`, `isError`), `MenuPage` (three queries) and `DishPage` (`useQuery(dishQueries.list("all"))`; the hooks must run before the early `return`s). Follow TypeScript's red lines.
6. **Delete `hooks/useApi.ts`.**
7. **Test:** open the Network tab: Home → Menu → a dish → Back: **one** request for the dishes. Open the DevTools (the flower at the bottom): the keys, fresh, in use.

**Checkpoint 1:** `git commit -am "L34: dishes in the cache"`.

Part 2 (after the break): settings.

8. **`MenuPage`** (slide 26): `placeholderData: keepPreviousData` and the dimmed grid with `isPlaceholderData`; `enabled: !searching`; the "Try again" button (`refetch`) and the 429 message.
9. **Prefetch** (slide 27): `useQueryClient()`, `onHover` on `CategoryChips` with `onMouseEnter` and `onFocus`.
10. **`queries/kitchen.ts`** (slide 29) and `KitchenPage`: `staleTime: 0`, `refetchInterval: 5_000`, "Updating…" on `isFetching && !isPending`. **`queries/account.ts`** with `["profile", email]` and `AccountPage` (the "sign in again" logic stays in `api()`).
11. **`lib/queryClient.ts`**: add the `retry` function (slide 31) and the `useAuthStore.subscribe(…)` that calls `queryClient.clear()` (slide 32).
12. **Test:** hover "Main Courses" for three seconds, then click (instant). Sign in as the kitchen, watch a request every five seconds. Sign in as one guest, sign out, sign in as another: no leak.

**Checkpoint 2:** your app equals `code/after-L34`. `git commit -am "L34: a cache with settings"`. This is where L35 starts.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| `Error: No QueryClient set, use QueryClientProvider to set one` | No provider around the app | `<QueryClientProvider client={queryClient}>` in `main.tsx` |
| `TS2769 · Property 'queryKey' is missing in type 'string[]'` | Query v4: key and function as two arguments | One options object: `useQuery({ queryKey, queryFn })` |
| `TS2769 · … 'cacheTime' does not exist in type 'UseQueryOptions<…>'` (also `keepPreviousData`, `onSuccess`) | Query v4 options | `gcTime`; `placeholderData: keepPreviousData`; use `data` instead of callbacks |
| Click Drinks and the starters stay | The key forgets the category | `["dishes", "list", category]` |
| Everything is fetched again on every render; the DevTools show an empty cache | `new QueryClient()` inside a component | One `queryClient` in its own module |
| A skeleton that never goes away for the search | A skeleton on `isPending` for a disabled query | `isLoading`, or show it only while the query is enabled |
| The dish page fetches again instead of using the menu's data | Another key (`["dishes"]` vs `["dishes","list","all"]`) | One `dishQueries.list("all")` for all three pages |
| `React has detected a change in the order of Hooks` in `DishPage` | `useQuery` after an early `return` | Hooks first, then the `return`s |
| It fetches again every time the tab gets focus | The default `staleTime` is 0 | Set a `staleTime`; fresh data is not refetched on focus |
| A 429 on the search in class | 10 requests a minute per IP, and the room shares one | Expected; no retry on a 4xx, and the message shows the `Retry-After` seconds |
| Beso sees Maia's profile | The key has no guest, and the cache is not cleared | `["profile", email]` and `queryClient.clear()` on sign-out |
| The kitchen queue never updates | No `refetchInterval`, or a long `staleTime` on the queue | `staleTime: 0`, `refetchInterval: 5_000` |
| The DevTools are missing | The devtools package is not installed or not rendered, or it is a production build | `npm install @tanstack/react-query-devtools`; `<ReactQueryDevtools />` in `main.tsx` |

---

## Questions students ask

- **"Why not `useEffect` and `fetch`?"** You can, and L29 did. A cache adds what that code lacks: memory, sharing between components, freshness, refetching, retries, de-duplication, cancellation. It deletes the 40 lines we wrote.
- **"TanStack Query or Zustand?"** Different homes on the state map. Zustand: data we own (the cart, the session). TanStack Query: copies of the server's data. Do not put the menu in a store.
- **"Is `staleTime` the same as `cacheTime`?"** No: `staleTime` says how long an answer is fresh; `gcTime` (the old `cacheTime`) says how long an unused entry stays.
- **"What is the difference between `isFetching` and `isPending`?"** `isPending`: no data yet. `isFetching`: a request is running. After the first answer a refresh is `isFetching` only.
- **"Can I use axios?"** Yes: the `queryFn` is any function that returns a promise and throws on failure.
- **"Does it survive F5?"** Not by default: the cache is in memory. There is a persister plugin; we do not need it, the cart is already in a store.
- **"Where do I show errors for every request?"** In the cache's global handlers (L35 adds a toast).
- **"What about `select`?"** `select: (dishes) => dishes.find(…)` lets a component subscribe to a slice of the data. Our dish page reads the whole list; it is an optimisation, not a necessity.
- **"What about changing data?"** That is `useMutation`: L35, with invalidation and optimistic updates.
- **"Are the DevTools in production?"** No: the package leaves them out of the production build.
