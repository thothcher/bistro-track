# L29 · Le marché — lecturer guide

**useEffect, useRef and custom hooks: real data.** Le Bistro track, lecture 3 of 5 (syllabus v2: L29, React lecture 4).
**Deck:** [`index.html`](index.html), 42 slides. **Code:** starts from [`../code/after-L28`](../code/after-L28), ends at [`../code/after-L29`](../code/after-L29).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | `useEffect` (effect, cleanup, dependencies), fetching with loading / error / empty, CORS and the Vite proxy, StrictMode's double run, race conditions and `AbortController`, custom hooks (`useApi`, `useDebounce`, `useLocalStorage`), `useRef`, "you might not need an effect" |
| **Le Bistro gets** | The real menu and categories from the API, grey skeleton cards while loading, a debounced search with the 429 message, a cart that survives F5, "/" focuses the search |
| **Students' project** | v0.3: products from DummyJSON, loading and error states, saved cart, debounced search |
| **The two problems** | 1. The menu is a typed file; fetching during render loops forever. 2. Slow answers overwrite fast ones, every keystroke is a request, F5 empties the cart |
| **The two answers** | 1. `useEffect` with dependencies. 2. Cleanups and custom hooks |

---

## Before class

- [ ] Your Le Bistro from L28 runs. If not, copy `code/after-L28`.
- [ ] Internet works in the room (the API is real). Test https://srmsapi.stepacademy.ge/api/v1/enterprise/categories in a browser.
- [ ] Know where DevTools → Network and its "Offline" / "Slow 4G" switch are: you show them three times.
- [ ] The API is busy during class: the search is limited to **10 requests per minute per IP**, and the whole class may share one IP. If you see 429 in the live demo, that's the lesson, not a failure.
- [ ] `code/after-L29` open in a second VS Code window.

---

## Learn it first (40 minutes: this is the hardest lecture of the five)

### 1. Effects are for the outside world

React's job is to turn data into UI, as a pure calculation. Anything outside that (the network, timers, the keyboard, `localStorage`, the page title) is a **side effect**. It must not run during render. It runs **after** React has updated the screen:

```tsx
useEffect(() => {
  // talk to the outside world
  return () => {
    // clean up: cancel, unsubscribe, clear
  };
}, [dependencies]);
```

### 2. Dependencies decide when it runs again

| You write | It runs |
|---|---|
| `useEffect(fn, [])` | once, after the first render |
| `useEffect(fn, [category])` | after the first render, and whenever `category` changed |
| `useEffect(fn)` | after every render: with a setState inside, an endless loop |

The rule: list every value from the component that the effect uses. The ESLint plugin warns when one is missing.

### 3. The cleanup runs before the next effect, and at the end

Category changes from "drinks" to "desserts": React renders, updates the screen, runs the **cleanup of the drinks effect**, then the desserts effect. When the component leaves the page, the last cleanup runs.

### 4. Fetching: four endings

Every request ends in **loading**, **data**, **empty** or **error**. Design all four. `fetch` does not throw on 404 or 500: check `res.ok` yourself.

```tsx
const [dishes, setDishes] = useState<Dish[] | null>(null);
const [failed, setFailed] = useState(false);

useEffect(() => {
  fetch("/api/v1/enterprise/dishes")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data: Dish[]) => setDishes(data))
    .catch(() => setFailed(true));
}, []);
```

Note: `setState` is called inside `then` / `catch` (after the answer), never synchronously in the effect body. The React lint rule `set-state-in-effect` enforces this.

### 5. CORS and the proxy

The browser asks a server whether a page from another origin may read its answers. The Le Bistro API says yes only to `srms.stepacademy.ge` and `localhost:4200`, so a fetch from `localhost:5173` is blocked. The fix: Vite's dev server forwards `/api/...` to the API (servers don't have CORS), so the app fetches relative paths:

```ts
// vite.config.ts
server: {
  proxy: {
    "/api": { target: "https://srmsapi.stepacademy.ge", changeOrigin: true },
  },
},
```

Restart `npm run dev` after editing the config. Students' DummyJSON allows every origin, so they don't need this.

### 6. StrictMode runs effects twice in development

`<StrictMode>` in main.tsx mounts, unmounts and remounts every component in development, to reveal effects without a correct cleanup. You will see two requests (the first "canceled"). It doesn't happen in production. Never remove StrictMode to "fix" it.

### 7. Race conditions

Click "Main Courses" (3 s) then "Drinks" (0.2 s). Without protection, the drinks arrive first and show, then the main courses arrive and overwrite them under the Drinks chip. Two protections:

- **AbortController**: the cleanup aborts the old request.
- **Tagging**: store the answer together with the path it belongs to, and show it only if it matches the current path. `loading` is then derived: "we have no answer for the current path yet".

### 8. Custom hooks

A function whose name starts with `use` and that calls other hooks. It packages state and effects for reuse; **each caller gets its own state** (hooks share logic, not data). Today: `useApi(path)`, `useDebounce(value, delay)`, `useLocalStorage(key, initial)`.

### 9. useRef

A box that survives renders and does **not** cause them. Two uses: holding a DOM element (`ref={inputRef}`, then `inputRef.current.focus()`), and holding a value the screen doesn't show (a timer id). Don't read refs during render.

### 10. You might not need an effect

If you only calculate something from props or state (a filtered list, a total), calculate it during render. An effect plus a state for it is slower and creates two truths.

### Check yourself

1. Where does `fetch` go in a component? → inside `useEffect`, never directly in the body.
2. What does `[]` mean? → run once, after the first render.
3. Why do I see two requests in development? → StrictMode's double run.
4. How do you stop an old request? → `AbortController`, aborted in the cleanup.
5. What is a custom hook? → a `use…` function that calls hooks; it shares logic, not state.
6. Do you need an effect for the cart total? → No: derive it.

Further reading (react.dev): *Synchronizing with Effects*, *You Might Not Need an Effect*, *Lifecycle of Reactive Effects*, *Reusing Logic with Custom Hooks*, *Referencing Values with Refs*.

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting, menu, route, the curtain opens on today's result |
| 0:03 | Questions | 5–6 | Backup questions; two v0.2 demos, then **refresh** (the cart is gone) |
| 0:12 | Problem 1 | 7–10 | File vs server, the endless fetch loop demo |
| 0:18 | Solution 1 | 11–19 | useEffect, its life, dependencies, **CORS + proxy (live)**, **Favourites from the API (live)**, four endings, StrictMode |
| 0:42 | Classwork 1 | 20 | Products from DummyJSON |
| 0:57 | Break | 21 | |
| 1:07 | Problem 2 | 22–25 | The race demo (switch No cleanup / With cleanup), 429 demo |
| 1:12 | Solution 2 | 26–37 | Cancel + tag, **useApi (live or copy)**, MenuSection, **useLocalStorage (live)**, debounce, useRef, "you might not need an effect" |
| 1:37 | Classwork 2 | 38 | Saved cart, debounced search |
| 1:52 | Wrap-up | 39–42 | Recap, flip cards, homework, next problem |

Running late? Skip slides 13 (dependency table: say the rule), 31 (debounce timeline) and 37 (quiz). Copy `useApi.ts` instead of typing it.

---

## The live build, step by step

1. **Proxy** (slide 14): add the `server.proxy` block to `vite.config.ts`, restart `npm run dev`.
2. **lib/api.ts**: copy it from `code/after-L29` (a fetch wrapper that throws `ApiError` with the status and the Retry-After header).
3. **types.ts**: copy it (Category now has the API's fields; `SearchResponse` is new).
4. **DishGrid.tsx**: add `DishGridSkeleton` (copy the function).
5. **Favourites.tsx, first version** (slide 15): move the favourites Section out of App into its own component with `useState` + `useEffect` + `fetch`. Show the request in DevTools.
6. **hooks/useApi.ts** (slides 26–28): copy or type it. Favourites becomes `const { data, error, loading } = useApi<Dish[]>("/api/v1/enterprise/dishes");`.
7. **MenuSection.tsx** (slide 29): categories and dishes from `useApi`. Delete `data/dishes.ts` and `data/categories.ts`. Try the race: Main Courses, then Drinks.
8. **hooks/useLocalStorage.ts** (slide 30): copy or type. In App: `useLocalStorage<CartItem[]>("bistro.cart", [])`. Refresh: the cart stays.
9. **hooks/useDebounce.ts + search** (slide 32): copy the full MenuSection from `code/after-L29` and walk through the debounce and the 429 message.
10. **SearchBox.tsx** (slide 33): `useRef` and the "/" shortcut.

**Checkpoint:** your app equals `code/after-L29`. Commit: `git commit -am "L29: real API, hooks, saved cart"`.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| Hundreds of requests in Network | `fetch` in the component body, or `useEffect` without a dependency array | Move it into `useEffect(…, [deps])` |
| `has been blocked by CORS policy` | Absolute URL to srmsapi from localhost:5173 | Use the proxy and a relative `/api/...` path; restart the dev server |
| 404 on `/api/...` | The dev server wasn't restarted after editing vite.config.ts | Stop and run `npm run dev` again |
| `Effect callbacks are synchronous…` | `useEffect(async () => …)` | Keep the effect sync; use `.then` or an inner async function |
| `React Hook useEffect has a missing dependency` | A value used inside but not listed | Add it to the array (don't silence the warning) |
| Two requests, one "(canceled)" | StrictMode in development | Expected. Not in production |
| `Unexpected token '<' … is not valid JSON` | The path is wrong and the server answered an HTML page | Check the path in the Network tab |
| 429 Too Many Requests | The search rate limit (10/min per IP; a classroom shares one IP) | Debounce; wait the seconds in Retry-After |
| Cart not saved | useLocalStorage used for something else, or a different key | Same key everywhere (`"bistro.cart"`) |
| Photos fail to load | No internet | The API serves the photos; nothing to do offline |

---

## Questions students ask

- **"Why not fetch in an event handler?"** You can, when the request is caused by a click (submitting a form). Data the screen needs as soon as it appears is loaded in an effect.
- **"Why not async/await?"** You can, inside the effect: `async function load() { … } load();`. The effect function itself must not be async.
- **"Is this how real apps fetch?"** Real apps use a library that does caching, retries and deduplication: TanStack Query, lectures L34–L35. Today you learn what it does for you.
- **"localStorage or a database?"** localStorage is per browser, for small things like a cart. Accounts and orders belong on the server (Next.js module).
- **"Why AbortController and the tag?"** The abort saves the network; the tag guarantees correctness even if an answer slips through before the abort.
