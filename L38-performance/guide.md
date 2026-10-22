# L38 · Le coup de feu: lecturer guide

**Speed and resilience: a page that stays quick, and a page that does not fall over.** Le Bistro track, lecture 12 (syllabus v2: **L40**, React lecture 13). The second lecture of the third five.
**Deck:** [`index.html`](index.html), 54 slides. **Code:** starts from [`../code/after-L37`](../code/after-L37), ends at [`../code/after-L38`](../code/after-L38).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md). **Masterclass script:** [`masterclass.md`](masterclass.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | What a render is (trigger, render, commit, paint) and how to see it (React Scan, the React DevTools Profiler, a flame graph); why a component renders again (state, a parent, a new prop) and what `memo` can and cannot do; moving state down; what the React Compiler writes for you, what it leaves alone and what it costs; when you still write `memo`, `useMemo`, `useCallback`; what is in a bundle and how to read it; code splitting with `lazy` and `Suspense`; a vendor chunk and the browser cache; why photos can outweigh code; error boundaries at three levels and what they do not catch; the old tab after a deploy (`vite:preloadError`); `useTransition` and `useDeferredValue`; list virtualization; a size budget that the robot enforces; measuring honestly (CPU slowed, a throttled network, before and after on the same setup) |
| **Le Bistro gets** | The compiler (`@rolldown/plugin-babel`, `reactCompilerPreset()`), a `react-vendor` chunk, lazy pages with one `Suspense` and `PageSkeleton`, `lib/kitchenNotes.ts` (Zod leaves the first file), `PageBoundary`, a boundary around every dish card, `RootCrash`, `lib/preloadError.ts`, a `SearchBox` that owns its text (this fixes a real bug), lazy photos and a high-priority hero, the kitchen page (`StatusTabs`, `OrderList` with `@tanstack/react-virtual`, `OrderRow` in `memo`, `/kitchen?rush=800` in development), `scripts/check-size.mjs` and `npm run size` (and a step in `ci.yml`), **26 test files and 151 tests**. Version 1.2.0 |
| **Students' project** | v1.2: a before/after table in the README (at least two rows with numbers), lazy pages with one skeleton, an error boundary around the page; Plus: lazy photos, a boundary around each product card (with a test), a size budget in CI; Pro: a virtual list or paging for the 194 products, and a `vite:preloadError` handler with a test |
| **The two problems** | 1. The search box that eats letters (and a page that renders 2,110 components for four keys, with every test green). 2. Friday night: 628 kB before the first dish, one dish with no price turns the whole page white, and 803 tickets freeze the kitchen screen |
| **The two answers** | 1. See it, count it, move the state down; the compiler remembers what you would have written; `memo` stays on the list row. 2. Send less (lazy pages, a budget), fail small (boundaries), draw less (a virtual list; a transition and a late copy for the rest) |
| **AI** | Classwork 2 is done with an AI: a CRAFT prompt for a review of the student's shop, then they **measure** the change. The Masterclass rebuilds the whole performance work of Le Bistro v1.2 with one prompt |

**Numbers** (all measured on the real code, on the lecturer's laptop, 2026-10-22):
- **First-load JavaScript:** L37 628.0 kB in one file (**196.1 kB gzip**, 184.7 brotli); L38 502.7 kB in five files (**160.3 kB gzip**, 151.1 brotli). The first file alone: 549.5 kB with lazy pages, 464.5 kB after `toKitchenNotes` left the schema file (Zod is 83.4 kB, 15 per cent of the first file at that moment); `react-dom` is 44 per cent of the first file.
- **Renders** (every component that React ran and used, counted from the DevTools hook): typing "soup" (4 keys) **2,110 → 295 with the compiler → 53 with the state moved down (no compiler) → 48 (both)**; clicking "Desserts" 645 / 149 / 1,208 / 159 (the per-card boundary doubles the tree without the compiler); drawing the menu 547 to 577 and adding a dish 11 to 17 in all builds. One key at 4× CPU, React's own time: **46.2 ms** (the grid and its 25 cards are 85 per cent) → 19.9 ms with the compiler (the rest is 50 router links) → **0.6 ms**.
- **The bug:** CPU 6× slower, a key every 120 ms, "french onion soup": L37 kept **"fe ion soup"** (6 of 17 letters lost); L38 loses none. (The same typing with no delay between keys: "fenop" at 1× and "p" at 6×.)
- **Compiler:** 102 components compiled, 2 left alone; +27 kB raw (+9 kB gzip); the build goes from 1.1 to 2.4 s; the test suite from about 12 s (115 tests) to 27 to 43 s (151 tests, and the compiled code; 43 s on a clean copy with two workers).
- **Kitchen, 803 orders, CPU 4×** (median of several runs; main thread blocked while the page first draws / elements): plain list **425 ms, 6,484**; plain + compiler 636 ms (the compiler makes the mount slower); transition + deferred value on the plain list 551 ms; **virtual list only 129 ms, 172**; all three **82 ms**; all three without the compiler 58 ms. Clicking a tab: 176 → 128 (transition, plain list) → 80 (virtual) → 40 ms (all three). **One ticket changes** (renders of `OrderRow`): 1,606 (nothing), 2,409 (compiler, with `setStatus.mutate` as the function: the mutation object changes three times), 1,606 (compiler and a stable `mutate`: the compiler cannot skip a row made inside `.map()`), 1,606 (`memo`, with a new function every time), **1** (`memo` and a stable function).
- **Photos:** 25 JPEGs, **3.97 MB** (average 159 kB, the soup 446 kB), against 160 kB of JavaScript.
- **A one-line deploy** (first-load files): one main file, 147.0 of 160.6 kB downloaded again; with `react-vendor`, 83.4 of 160.4 kB.
- **Pull requests against the 170 kB budget:** typo 160.3 kB (pass); `toKitchenNotes` back next to the schema 184.3 (fail by 14.3); one `recharts` 3.10.1 bar chart on the home page 261.2 (fail by 91.2; the chart's own file is 100.4 kB gzip); the same chart with `lazy()` 160.5 (pass).
- **Real pages, one cold desktop load, 2026-10-22** (bytes on the wire): Hacker News 2 kB of JavaScript, 821 elements; vite.dev 137 kB in 7 files (a click on "Guide" adds 3 files, 18 kB, no reload); a Wikipedia article 293 kB in 7 files and 5,128 elements; react.dev 572 kB in 13 files (one is a tag manager; "Learn" adds 6 files, 96 kB); an npm package page 1,100 kB in 3 files; a GitHub repository page 134 script files, 1,597 kB; BBC News 92 script files, 2,492 kB from many hosts. Long pages: Wikipedia's list of programming languages 2,733 elements (12,457 px tall), the UN list of countries by population 7,013 elements; the demo list of React Virtuoso is 53,000 px tall and keeps **18 elements** in it at every scroll position.
- **Not measured, and said so on the slides:** the time the 25 photos take on a slow network. The test harness served them from disk, outside the throttle. The seconds on that slide (about 19 s for 3.97 MB at 1.6 Mbit/s) are arithmetic.

---

## Before class

- [ ] Your Le Bistro from L37 runs (or copy `code/after-L37`, `npm install`). **Install the new packages before class**, so that the live part is typing and not downloading: `npm install react-error-boundary @tanstack/react-virtual` and `npm install -D @rolldown/plugin-babel @babel/core babel-plugin-react-compiler @types/babel__core`. Vite 8, React 19 and Node 22.12 or newer (we used Node 24).
- [ ] **Try every demo once** (slides 8, 9, 12, 14, 17, 19, 26, 28, 29, 31 to 35, 37, 38, 39, 41 to 43). They run in the deck with no internet. Five of them (slides 8, 12, 35, 39, 41) are **real React** (`vendor/perf-lab.js`, 340 kB, built from small components), counting renders and milliseconds in your browser: the first press of a button can take a moment. **Click once inside a demo before you use the keys**; inside the labs the deck's own shortcuts are switched off, so you can type.
- [ ] Install the **React Developer Tools** extension in Chrome (Components and Profiler tabs). Try `npm run build && npm run preview` on your Le Bistro, then `npx react-scan@latest http://localhost:4173` (it opens its own browser; it needs internet to download once). The Profiler **does not work on a plain production build** ("Profiling not supported"): use `npm run dev` with it (times are inflated and React renders everything twice on purpose) or the profiling alias described below.
- [ ] **See the bug yourself** before you promise it: in Chrome DevTools, Performance tab, gear icon, **CPU: 6× slowdown**, open the L37 menu (`npm run build && npm run preview` of `code/after-L37`) and type "french onion soup" fast. Letters go missing on some runs and not on others; a fast laptop with no slowdown rarely shows it. If it does not show on your machine, the lab on slide 8 does it with real React.
- [ ] **The kitchen page.** `code/after-L38` has `/kitchen` for staff (`kitchen@itstep.ge` or `waiter@itstep.ge`; the passwords are at the top of the API's Swagger page). The staff login and the order queue were **not** called on the live server: they were built from the Swagger description, so try the login once before class. `npm run dev`, then `http://localhost:5173/kitchen?rush=800` adds 800 pretend orders to the real ones (development only). If the live API will not let you in, `npm test -- KitchenPage` runs seven tests of that page against a fake kitchen, including one with 800 orders, and slides 40 to 43 do not need the page.
- [ ] **Measuring honestly:** the numbers on the slides come from the lecturer's laptop. Yours will differ; the proportions will not. Do not quote a slide's millisecond figure as if it were the students' own.
- [ ] Fonts come from Google Fonts: with no internet the deck still works with fallback fonts. The treemap, the waterfall and the "real pages" ladder are drawn from data inside the deck (`window.L38`), so they work offline; **real pages change daily**, so open one of them yourself in DevTools (Network, "Disable cache", reload) before you promise anything about it.
- [ ] Photos on the menu come from the API's image server: the page needs internet.
- [ ] Run the Masterclass prompt once (a minute or two) and keep the answer open.
- [ ] `code/after-L38` open in a second VS Code window.
- [ ] Remind the students that their shop uses DummyJSON: `https://dummyjson.com/products?limit=0` returns all **194** products, so a long list is already there.

---

## Learn it first (50 minutes)

### 1. The habit

**Measure, change one thing, measure again.** A change you cannot measure is a hope. "It feels faster" is not a row in the table. Everything else in this lecture is a tool for the first or the third word. Keep three questions apart, because they have three different tools:
- **Is it rendering too much?** (React Scan, the Profiler.) Cost: the CPU of the phone.
- **Is it arriving too slowly?** (the Network tab, a bundle map.) Cost: bytes and round trips.
- **Is there too much on the screen?** (the number of elements, a virtual list.) Cost: the browser's own work, style, layout and paint, for every element.

### 2. What a render is

When a guest presses a key, React does four things: **trigger** (a state changed, here or in a parent; a context changed), **render** (React *calls your component function* for the component and for every child it re-creates), **commit** (it compares with last time and changes only the DOM that differs) and the browser **paints** a frame. A frame is 16.7 ms at 60 per second; a render that takes 46 ms is almost three frames the guest cannot use (the real number of one key in the L37 menu, CPU slowed 4 times, slide 11). **Render does not mean "the screen changed"**: React often calls a function and finds nothing to change. That is cheap per component, and 2,110 of them for four letters is not.

### 3. Seeing it

- **React Scan:** outlines every component that renders, with a counter. `npx react-scan@latest http://localhost:4173` (or a script tag in `index.html` while you develop). Works on a built preview. The screenshots on slide 15 are real (React Scan 0.5.7): one key in the L37 menu outlines every card, link and dialog; in L38 only the search box.
- **The React Developer Tools, tab Profiler:** record, press one key, stop. A flame graph per commit (each row a level of the component tree; **width is time**), and, with "Record why each component rendered" on in the settings, **"Why did this render?"** for each component. Rule: the widest bar you can change is where you look first; then record again.
- **Production or development?** In development React is slower, renders every component twice on purpose (StrictMode) and runs extra checks, so the milliseconds are not the guests' milliseconds. The extension cannot profile a plain production build. For honest numbers, compare before and after **on the same setup**, and, when you need real milliseconds, build once with React's profiling build:

```ts
// a copy of vite.config.ts, for measuring only
resolve: { alias: [{ find: /^react-dom\/client$/, replacement: "react-dom/profiling" }] },
```

  and slow the CPU 4 times in DevTools (Performance, gear icon) to see what a phone sees. Our flame graphs (slide 14) were made that way, with the DevTools hook.
- **Counting renders yourself:** never with a `useRef` counter inside a component. The compiler refuses it (`Cannot access refs during render`, the linter says the same), and React renders twice on purpose in development. Count from the outside (the lab on slide 12 listens to the same hook the DevTools use).

### 4. Why a component renders again

Three reasons: its **state** changed, its **parent** rendered (so it is called again unless something stops it), or a **context** it reads changed. Props are compared **by identity** when you wrap a child in `memo`: a new object, array or function is a different prop even when it looks the same. So:
- `memo(Card)` with `onAdd={() => add()}` from the parent: the parent makes a new function at every render, `memo` sees a changed prop, the card renders anyway. **48 cards for 4 keys, the same as with no memo** (version 2 of the lab on slide 12).
- `memo` plus a function that stays the same (`useCallback`): **0**. That is the manual way, and you must remember both halves.
- The best fix is often to **move the state down**: the search text only matters to the box, so it lives in the box (version 5 in the lab: 0 cards, no `memo`, no compiler). The rule on slide 16: *state lives where it changes fastest; what must answer at once stays in the component, what is shared or slow goes to the address.*

**The real bug.** In L30 we made the search box *controlled by the address*. React Router 8 runs an address change as a transition (a low-priority update React may delay and restart). A controlled input needs an urgent update; a transition is the opposite. When the page is busy rendering 25 cards, the box still shows the old text, and the next letter lands on it. That is what the lab on slide 8 does with real React, and what the table on slide 9 measured on the real app (CPU 6×, a key every 120 ms: "fe ion soup"). We also tried turning off the router's transitions (`useTransitions={false}`): no letters lost, but every navigation becomes urgent too; and `flushSync: true` helped without curing it. The cure is local state in `SearchBox`, reporting after a pause (`useDebounce`), with a `useEffectEvent` (React 19.2, stable) so that the effect does not depend on the page's function, and "adjust state while rendering" (`if (value !== seen) { setSeen(value); … }`) so that the Back button still changes the box. Five tests in `SearchBox.test.tsx` pin those cases.

### 5. The React Compiler

A build step: it reads your components and writes the memoization you would have written by hand (`useMemo`, `useCallback`, `memo`). Version 1.0.0 is stable. It works because React's rules are strict: a component must be a pure function of its props and state. In Vite 8 (Rolldown): `npm install -D @rolldown/plugin-babel @babel/core babel-plugin-react-compiler @types/babel__core`, then `babel({ presets: [reactCompilerPreset()] })` after `react()` in `vite.config.ts` (`reactCompilerPreset` comes with `@vitejs/plugin-react` 6). Vitest reads the same file, so the tests run the compiled code.

What it writes (slide 17, real output): `const $ = _c(8)` is a cache of 8 slots that lives as long as the component, and each `if ($[0] !== items)` asks "did the input change?". The whole `DishGrid` becomes one cached value: if `dishes` is the same array, the same JSX comes back and React skips every card.

What it does **not** do:
- It does not make a slow calculation fast, shrink the bundle or fix state that is too high.
- It does not skip a child that its parent **re-creates**: rows made inside a `.map()` still render (row 3 of the matrix on slide 19: 1,606 renders), so a list row still wants `memo`.
- It refuses code that breaks the rules, with a message: a ref read or written while rendering (`Cannot access refs during render`), a hook in an `if` (`Hooks must always be called in a consistent order, and may not be called conditionally`). To see what it does with *your* project, `node scripts/compiler-report.mjs` (in `code/after-L38`) runs the same compiler over every file of `src/` and prints how many components it compiled and which it left alone, with the reason (Le Bistro: 102 and 2). (The React team's `npx react-compiler-healthcheck@latest` said "108 out of 108" and "no incompatible libraries" on the same project: it counts differently and does not report what the build's plugin skips, so we do not use it for this.) Two real Le Bistro files are left as written: `useLocalStorage` (`Support value blocks (conditional, logical, optional chaining, etc) within a try/catch statement`) and `OrderList` (`Use of incompatible library`, because of `useVirtualizer`).
- **It is not a safety net.** Mutating a prop (`items.push(...)` in the body of a component) is compiled without a word (compiler 1.0.0; the linter's `recommended-latest` preset is silent too, 2026-10-22). The rules are still yours.

Cost, measured: +27 kB raw (+9 kB gzip), build 1.1 → 2.4 s, tests about twice as slow, and **a slower first mount** on the kitchen page (636 against 425 ms): the compiler pays back on the renders after the first. `"use no memo"` as the first line of a component keeps it as written; careful teams start with `compilationMode: "annotation"` and add `"use memo"` one component at a time. A surprise (slide 13): L38 without the compiler is **worse** than L37 when you click a category (1,208 renders, not 645), because we gave every dish card its own error boundary (two more components per card); with the compiler the cost disappears. The count can go up when you add safety: measure again after every change.

### 6. Do you still write `memo`, `useMemo`, `useCallback`?

On **list rows**, yes, together with a function that never changes; and in three more cases (slide 20): a value a **library compares by identity** (an effect's dependency, a table's columns, a chart's options), **code the compiler skips** (the linter tells you which), and a calculation that is **really** slow (remembering a result does not make the first run fast; measure it, or use a better algorithm). Never "just in case": it costs memory, hides the code, and without a measurement you do not know that it helped.

The kitchen matrix (slide 19, real counts of `OrderRow` renders when one of 803 tickets changes): nothing 1,606; compiler on with `setStatus.mutate` 2,409 (**worse**: the mutation object changes three times, idle, pending, done, so the function handed to the rows changes three times); compiler and `const { mutate } = useSetOrderStatus()` 1,606; `memo` with a new function every time 1,606; `memo` and `useCallback` **1**; compiler (it writes the `useCallback`), `memo` and `const { mutate }` **1**. The 1,606 is 803 rows twice: once for the optimistic update of L35, once for the refresh that follows.

### 7. What is in the first file

You cannot reduce what you cannot see. `build: { sourcemap: true }`, `npm run build`, `npx source-map-explorer dist/assets/index-*.js` (delete or keep private the maps before you deploy), and look at the top three blocks. The L37 bundle (slide 28): `react-dom` 211 kB (34 per cent, nothing to do), `radix-ui` 89 kB, **`zod` 83 kB** (a form validator that the home page does not use), `react-hook-form` 46 kB, `react-router` 38 kB, `@tanstack/query` 36 kB, `sonner` 34 kB, our own code about 45 kB.

**One import away** (slide 29): after we made the pages lazy, Zod was still in the first file. The chain, real: `main.tsx` → `App.tsx` → `SiteLayout` → `Header` → `CartSheet` → `CartContents` → `queries/orders.ts` → `schemas/tableNotes.ts` → `zod`. `orders.ts` needed `toKitchenNotes`, a function that lived next to the schema "because it belongs there" and needs only the *type* of its argument. Moving it to `lib/kitchenNotes.ts` with `import type { TableNotes }` (a type import is erased by the build) took the first file from 549.5 to 464.5 kB; Zod and react-hook-form now live in a `schemas` file of 131 kB that only the form pages download. A plain `import` of a file brings that file and everything it imports, and nobody wrote "import Zod in the header".

### 8. Code splitting: `lazy` and `Suspense`

```tsx
const FaqPage = lazy(() => import("./pages/FaqPage").then((m) => ({ default: m.FaqPage })));
// the routes are unchanged
<Suspense fallback={<PageSkeleton />}><Outlet /></Suspense>   // in SiteLayout
```

Home and the menu stay in the main file (most guests start there); every other page is its own file, downloaded when somebody first goes there. `lazy` expects a module with a **default** export; our pages export a name (a habit from L27), so `.then` says which one is the default. Without it React says (a real message): `lazy: Expected the result of a dynamic import() call. Instead received: [Module] { … }` in the console, and then `Element type is invalid. Received a promise that resolves to: undefined. Lazy element type must resolve to a class or function.` Split by page, and by a heavy thing that is not always needed (a chart, an editor, a map); do not split everything: a file costs a round trip. `npm run build` now lists one file per page (FaqPage 3.8 kB, KitchenPage 38.9 kB, `schemas` 131 kB; the main file 257.4 kB raw, 84.1 gzip).

**The waterfall** (slide 31, a real load of the menu, slow 4G and CPU 4× slower): the page, one big script (a full second at 1.6 Mbit/s), the styles, then, only after the script has *run*, the two API calls, then the photos. Read it as a story: what waits for what? Less code first means an earlier question to the API (first dish card 2,252 → 2,071 ms). The photos are the exception to "measured": see the numbers section.

### 9. A file for React, a file for us (the cache)

`build.rolldownOptions.output.codeSplitting.groups: [{ name: "react-vendor", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ }]`. File names carry a hash of their content: the same name means "you already have it". React changes twice a year, our code every day. After a one-line deploy a returning guest downloads 147.0 of 160.6 kB again when React is in the main file, and 83.4 of 160.4 kB when it is in its own file (slide 32). You only see this in the Network tab of a *second* visit. A host must send long cache headers for files with a hash in the name (Vercel does).

### 10. Photos weigh more than code

The 25 menu photos are 3.97 MB, twenty-five times our JavaScript (slide 33). Before you optimise code, look at what weighs the most. The tools we used: `loading="lazy" decoding="async"` on the cards below the fold (the box has its shape already, so nothing jumps), and **`fetchPriority="high"` on the one big picture of the first screen** (the opposite of lazy: a lazy hero image is held back until the browser has laid out the page). A smaller format (WebP, AVIF) and the right size for the screen would help more than any of this, and that is a job for the server or an image service, not for the page. We did not measure the effect of `fetchPriority` on Le Bistro: web.dev's guidance on the Largest Contentful Paint is the source.

### 11. A budget, and a robot that enforces it

`scripts/check-size.mjs` (about 35 lines, half of them comments) adds up the files that `dist/index.html` asks for up front (the script and the `modulepreload` links), gzips each, and exits with 1 above 170 kB; `npm run size` runs it, and `ci.yml` has the step after the build (slide 34). **A budget is a test for size.** A red check is a conversation: find what grew (a new library? a page that is no longer lazy?) or, if the growth is worth it, raise `BUDGET_KB` **in the same pull request, with the reason**. A budget that moves to make the pull request green tells you nothing. The four real pull requests of slide 34 are in the numbers section; the chart is `recharts` 3.10.1, the kind of library the admin dashboard of the next lectures will want, and the lesson is that a chart belongs behind `lazy()`.

### 12. Error boundaries

**A component that catches errors thrown by the components below it *while React renders*, and shows something else.** Without one, React 19 throws the whole tree away (a white page: the lab on slide 35). Three levels, close to the problem first (slide 36): around **each dish card** (`fallback`, `resetKeys={[dish]}`: a dish with a `null` price becomes one grey card, and new data from the API gives it another try), around **the page** (`PageBoundary`: the header and footer stay; `resetKeys={[pathname]}` clears the error when the address changes; `onError` is where a log or a service such as Sentry goes: a boundary that tells nobody hides the problem), and around **the whole app** (`RootCrash`, plain, no router: the last net). We use `react-error-boundary` 6.1.6, which wraps the class component React needs.

**What a boundary does not catch** (slide 37; React's documentation): errors in **event handlers** (use `try/catch`, or the `onError` of a mutation and a toast, as in L35), in **asynchronous code** (a promise, a timer; with TanStack Query, `throwOnError: true` hands a failed request to the nearest boundary), in **server rendering**, and in the **boundary's own fallback** (the next boundary above catches that one, which is why there are three). What it *does* catch: an error during render, and a **lazy page whose file cannot be downloaded**. A per-card boundary has a price in renders without the compiler (slide 13).

### 13. The old tab after a deploy

Every file Vite builds has a hash in its name; a new deploy means new names, and the old files are removed. A guest who had the page open before the deploy clicks "FAQ": the browser asks for `FaqPage-c3d4.js`, gets a 404 (`TypeError: Failed to fetch dynamically imported module`), and the lazy page throws: our page boundary says "Something burnt in the kitchen", and "Try again" asks for the same missing file. Vite fires **`vite:preloadError`**: `event.preventDefault()` says "handled", and the handler reloads the page, **once** (a `sessionStorage` time stamp stops a loop: a second failure within ten seconds is a real problem, and the boundary tells the truth). The other half of the answer is a host that keeps the previous deploy's files for a while. `lib/preloadError.ts` has four tests (one reload, no second reload within ten seconds, a reload for a later deploy, switched off). Slide 38 simulates the three steps with the real handler; the file names are invented.

### 14. Urgent, and can wait: `useTransition` and `useDeferredValue`

The wish: **the control must never lag behind my fingers**. Two tools for two situations. **`useTransition`** is for an update *you start* (a tab click): `startTransition(() => setStatusFilter(next))` marks it as not urgent, the tab answers at once and the list follows, and React may interrupt the list if another key arrives. **`useDeferredValue`** is for a value you *receive* (the typed text): the box shows `text`, the list reads `lateText`, an older copy that is allowed to run late. **A deferred value without `memo` is no better** (153 ms against 156 in the lab on slide 39): the list still renders in the urgent pass because its parent did; with `memo` it is skipped until its late props change, and then renders at low priority (22 ms, in the same run). On the real kitchen page with 803 orders, the biggest win is the one with the least to do with hooks (slide 42): **draw less**.

### 15. Long lists: draw only what you see

The browser has to create, style and lay out every element. A **virtual list** makes a tall empty box for the scrollbar and puts only the rows near the window in it, moving them as you scroll: 20,000 rows are 74 elements (12 ms) against 5,000 plain rows that are 30,001 elements (about 460 ms) in the lab on slide 41. Costs: the row height must be known or measured, the browser's "find in page" cannot see rows that do not exist, and a screen reader needs `aria-posinset` and `aria-setsize` (Le Bistro's `OrderList` sets both). The scrolling box needs a **fixed height** (`h-[65vh]`), and it is focusable (`tabIndex={0}`) so that a keyboard user can scroll it. `content-visibility: auto` is the cheap cousin: it skips painting rows that are off screen, but they are all still elements. Wikipedia puts 2,733 to 7,013 elements in one page and is fine, because a long document of *text* is easy for the browser; what hurts is thousands of rows that are *components*, each with state, handlers and effects.

In tests, jsdom has no layout: a virtual list asks its box "how tall is your window?" and hears 0, and draws no rows. `src/test/layout.ts` gives every element a size (`giveElementsASize()` in `beforeEach`).

### 16. Measuring honestly

Compare before and after **on the same setup**; slow the CPU (4× in DevTools) and the network (Slow 4G) so that you see what a phone sees; use a production build (React Scan, the Network tab) or a profiling build (the Profiler); take the median of several runs; write the date and the machine. And expect surprises: we measured that the compiler makes the *first* draw of the kitchen slower, that a per-card boundary doubles the renders of a click without the compiler, that `setStatus.mutate` made the rows render 2,409 times with the compiler on, and that the deferred value did little on the kitchen page. Every one of them was found by measuring, and none by reading code.

### Check yourself

1. **What is a render?** React calling your function. It is not the same as updating the screen: React compares, and changes the DOM only where it differs.
2. **Why does `memo(Card)` do nothing when the parent passes `onAdd={() => add()}`?** A new function at every render is a different prop, so `memo` renders anyway. A function that stays the same (`useCallback`, or the compiler writing it) fixes it.
3. **Why did the search box lose letters?** It was controlled by the address; React Router runs an address change as a transition; a controlled input needs an urgent update. Keep the text next to the box.
4. **Does the compiler replace `memo`?** On a list row, no: it cannot skip a child that its parent re-creates inside `.map()`. It does replace the `useMemo` and `useCallback` you used to write.
5. **A page is slow on a phone and the Profiler shows thin bars. Where next?** The Network tab: the waterfall, the JavaScript, the photos.
6. **Why did Zod arrive in the first file with lazy pages in place?** A chain of imports ended in a file that held both a schema and a function that only needed its type. `import type` costs nothing.
7. **What does a boundary not catch?** Event handlers, asynchronous code (promises, timers), server rendering, and its own fallback.
8. **What does `vite:preloadError` solve, and why only once?** A lazy page's file is gone after a deploy; reload to the new version. Twice in ten seconds means something else is wrong.
9. **`useTransition` or `useDeferredValue`?** A transition for an update you start; a late copy for a value you receive (and pair it with `memo`).
10. **A virtual list draws no rows in a test. Why?** jsdom has no layout; the box is 0 pixels tall. Give the elements a size.

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting; today's menu; the route as a git log; the real readout of today's goal unveiled |
| 0:03 | Questions | 5–6 | Backup questions (cleanup between tests, coverage that says "ran", `npm ci`); the v1.1 homework check |
| 0:11 | Problem 1 | 7–10 | **The search box that eats letters**; **the lab** (real React, type fast yourself); **it is real** (the measured table); "What would we need?" |
| 0:16 | Solution 1 | 11–22 | Trigger, render, commit, paint; **why did it render?** (the mini React Scan, five versions); **renders, counted**; **reading a flame graph**; React Scan and the Profiler; recipe: the text lives next to the box; **the compiler** (real output); recipe: turn it on; **the memo matrix**; four cases where you still decide; mistakes; quiz |
| 0:40 | Classwork 1 | 23 | Measure your own shop: React Scan, a table before and after |
| 0:55 | Break | 24 | A pit stop (a stopwatch) |
| 1:05 | Problem 2 | 25–27 | **Friday night** (three alarms); **real pages side by side** (one cold load of seven real sites); "What would we need?" |
| 1:10 | Solution 2 | 28–45 | **The treemap** (who is in the first file); **one import away**; recipe: lazy and Suspense; **the waterfall**; **a file for React, a file for us**; photos weigh more than code; **four pull requests and a budget**; **where does the damage stop?** (the boundary lab); recipe: three boundaries; **does a boundary catch it?**; **a deploy while a guest is on the page**; **urgent, and can wait** (the lab); recipe: the kitchen page; **how many rows does the page need?** (the lab); **the kitchen, six ways**; long lists in the wild; mistakes; quiz |
| 1:32 | Classwork 2 with AI | 46 | Students prompt an AI for a performance review of their shop, then measure |
| 1:47 | Masterclass | 47–49 | One prompt for the whole work of v1.2 |
| 1:55 | Wrap-up | 50–54 | Recap, flip cards, homework v1.2, twelve lectures one restaurant, next time |

**Both halves are dense: Solution 1 has 12 slides in 24 minutes, and Problem 2 + Solution 2 have 21 in 27. Running late?** First half: slide 13 (the counts) in one sentence, 15 (the tools) in a minute, 18 (the recipe for the compiler) read aloud, and **skip 20 and 21 and 22** (read one mistake). Second half, the cuts in this order: 45 (quiz), 43 (long lists), 27 (need), 40 (the kitchen recipe: read the three lines), 44 (mistakes: read one), 32 (the cache: press the button once and say the two numbers), 31 (the waterfall: one sentence), 33 (photos: say the ratio), 26 (real pages: choose one metric, click one row), and on 37 (does a boundary catch it?) do three rows. **Never skip** 7–9 (the bug), 12 (why did it render), 17 (the compiler), 19 (the matrix), 25 (Friday night), 28–29 (the treemap and the chain), 34 (the budget), 35–36 (the boundaries), 38 (the old tab), 39 and 41 (the two labs), 42 (the kitchen) or the classworks. In the Masterclass, show the parts (slide 47) and the short version (slide 49), and skip the live run.

---

## Classwork 2 with AI and the Masterclass

**Classwork 2 with AI** (slide 46, 15 minutes). Base: an AI review of the student's shop (the three biggest costs, how to measure each, one change applied) with a before and after number. Plus: lazy pages, one skeleton, a boundary around the page, and the size budget in `ci.yml`. Pro: lazy images, a high-priority hero and a list that draws only what is on screen, with the number of elements before and after. The students write a five-part prompt (**CRAFT**) and the AI writes the code.
- The check is **not** "does it build". It is: **was there a number before, and is there one after?** Walk around and ask: "what was your number before?" If there is none, they measure now, then paste.
- The AI's usual mistakes (`useMemo` and `useCallback` on everything, `React.lazy` with a named export and no `.then`, `next/dynamic` in a Vite project, `loading="lazy"` on the hero picture, invented numbers, a virtual list in a box with no height, `memo` on cheap components) and the follow-up prompts are in [`classwork.md`](classwork.md).

**Masterclass** (slides 47–49, 8 minutes). One prompt describes the whole performance and resilience work of Le Bistro v1.2:
1. **The prompt, part by part.** Each press opens one part; for each, one sentence: what would the AI do without it?
2. **Run it, then check it.** Show the answer and go through the six checks, ending with "put a `null` price in the data".
3. **The short version.** The same five parts as one paragraph; each part lights up.

**Before class:** run the Masterclass prompt once and keep the answer open. The exact texts are in [`masterclass.md`](masterclass.md).

---

## The demos

All of them run in the page, offline. Five of them run **real React** inside the slide. **Click once inside the demo first** (the deck's keys are switched off inside the labs).

| Slide | Demo | How |
|---|---|---|
| 8 | Where does the text live? (real React) | Leave the settings (the address, ×6, a key every 30 ms) and press "Type … for me": letters are missing (8 runs of 8 lost some; at ×4 and a key every 60 ms the render keeps up and none are lost). Then "next to the box": every letter arrives. Then the address at ×1 and 120 ms: fine. Only the speed and the place of the text changed |
| 9 | What the box held (measured) | Press next: the L38 column appears next to the L37 one. Seven real runs of the real app |
| 12 | Why did it render? (real React) | Five versions of one page; for each, press "Type soup" and read the counts: 48, 48 (memo with a new function), 0 (memo and useCallback), 0 (compiled), 0 (state moved down). Amber flash = a card rendered, blue = the page |
| 13 | Renders, counted | Press next: a column per build. The surprise at the end |
| 14 | Reading a flame graph | Three real captures on one time axis (0–50 ms = three frames). Hover a bar: its time and its share. L37, L37 + compiler, L38 |
| 17 | The compiler playground | Nine examples with their real output: a total, a list, a function, a ref counter (refused), a hook in an `if` (refused), a changed prop (compiled without a word), two real Le Bistro files (refused) and `QuantityStepper` (compiled) |
| 19 | The memo matrix | Guess, then click each of the six cells |
| 26 | Real pages, side by side | Six measurements; the list re-sorts for each. Le Bistro's two rows (amber) are JavaScript only. Click a row for what we saw |
| 28 | The treemap | Three real builds of Le Bistro; hover a block; Zod pulses. The third build has no Zod, and a `schemas` file in the list of later files |
| 29 | One import away | Press next nine times (the chain), then the three changes and the result |
| 31 | The waterfall | L37 against L38 on one time axis; the photos are an open bar (see the numbers section) |
| 32 | A file for React, a file for us | "Deploy a one-line fix": the red files are what a returning guest downloads again |
| 33 | Photos against code | The 25 real photos by size |
| 34 | Four pull requests | Click each: the robot's real output, the bar against the budget, the Merge button |
| 35 | Where does the damage stop? (real React) | "none", "around the page", "around each card", with the red button |
| 37 | Does a boundary catch it? | Six cases: caught or not caught, then the reason |
| 38 | A deploy while a guest is on the page | Three steps, with and without the handler |
| 39 | Urgent, and can wait (real React) | ×6, 240 rows, "Type it for me" for each of the three settings; the bars are the time until each letter is on the screen |
| 41 | How many rows? (real React) | All rows, content-visibility, only the visible ones; 1,000 to 100,000; "Scroll to the end". Plain rows freeze the tab on purpose |
| 42 | The kitchen, six ways | Four measurements, six variants, median of several runs |
| 43 | Long lists in the wild | Seven pages, elements and height |
| 46 | The sample prompt | Click the blurred box |
| 47 | The prompt, part by part | Press next five times; **Copy** copies the whole prompt with its five labels |
| 49 | The short version | Press next: each part lights up; **Copy** copies the paragraph |

---

## The live build, step by step

You build Le Bistro v1.1 into v1.2. Do not type everything: **type** the `SearchBox` change, the compiler line, two `lazy()` pages and one boundary; **copy** the rest from `code/after-L38`.

Part 1 (before the break):

1. **Measure first** (slides 11 to 15). `npm run build && npm run preview` of v1.1, React Scan on it, type three letters in the search box. Write the numbers on the board.
2. **See the bug** (slide 8): CPU 6× slower in DevTools, type fast. Then explain the address and the transition.
3. **Move the state down** (slide 16): the `useState` in `SearchBox.tsx`, then the pause (`useDebounce`), then `useEffectEvent`, then the Back-button case. Run the five tests of `SearchBox.test.tsx`. Measure again: the same three letters.
4. **Turn the compiler on** (slide 18): four packages, one line. `npm run build`: it works, and it is slower. Measure again.

**Checkpoint 1:** `git commit -am "L38: the search box keeps its own text, the compiler"`.

Part 2 (after the break):

5. **Read the bundle** (slides 28 and 29): `sourcemap: true`, `source-map-explorer`, find the three biggest blocks. Move `toKitchenNotes` (copy `lib/kitchenNotes.ts`, change one import) and see the first file shrink.
6. **Lazy pages** (slide 30): `App.tsx`, two pages, then the `Suspense` in `SiteLayout`. `npm run build`: a file per page. The Network tab: click "FAQ".
7. **React in its own file** (slide 32): the three lines in `vite.config.ts`.
8. **Boundaries** (slides 35 and 36): `PageBoundary` and `DishGrid`; break a price on purpose (`price: null` in the data) and watch one card turn grey. Copy `RootCrash` and `lib/preloadError.ts`.
9. **The kitchen page** (slides 39 to 42): copy `KitchenPage.tsx`, `StatusTabs`, `OrderList`, `OrderRow`; open `/kitchen?rush=800`; scroll.
10. **The budget** (slide 34): copy `scripts/check-size.mjs`, `npm run size`, the step in `ci.yml`. Put `toKitchenNotes` back next to the schema in a branch: red.

**Checkpoint 2:** your app equals `code/after-L38`. `git commit -am "L38: lazy pages, boundaries, a kitchen that stays light, a budget"`.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| `Error: Cannot find package '@babel/core'` (when the build starts) | the compiler's plugin needs `@babel/core` as a peer dependency | install all four: `npm install -D @rolldown/plugin-babel @babel/core babel-plugin-react-compiler @types/babel__core` |
| after the build, `The slowest callbacks, timed inside each callback … plugin @rolldown/plugin-babel transform (79%, 3.4s, 69 calls)` | a notice from Rolldown about plugin timings: the compiler runs on every file | nothing to fix: it is not an error. It is why the build takes 2.4 s |
| the Profiler tab says **Profiling not supported** | the page is a plain production build | use `npm run dev` for the Profiler, or a profiling build (the alias in section 3); React Scan works on a preview |
| `lazy: Expected the result of a dynamic import() call. Instead received: [Module] { … }`, then `Element type is invalid. Received a promise that resolves to: undefined. Lazy element type must resolve to a class or function.` | the page has no default export | `.then((m) => ({ default: m.FaqPage }))`, or `export default` |
| a lazy page never opens and the screen is blank | no `Suspense` above it, or no boundary to show the failure | one `<Suspense>` around the `<Outlet />`, and `PageBoundary` outside it |
| `TypeError: Failed to fetch dynamically imported module: …/assets/FaqPage-….js` | the file is gone after a deploy (a 404), or the network failed | the `vite:preloadError` handler (reload once); a host that keeps the previous deploy's files |
| `Unable to preload CSS for /assets/….css` | the same, for a page's stylesheet | the same handler |
| `Cannot access refs during render` (the compiler's message, and the linter's) | a `useRef` read or written in the body of a component, for example a render counter | count from outside (React Scan, the Profiler) |
| `Hooks must always be called in a consistent order, and may not be called conditionally` | a hook in an `if` | move the hook up, and put the `if` inside or below it |
| the compiler's report says `Use of incompatible library` for a component | it calls a hook of a library whose functions are not safe to remember (`useVirtualizer`) | nothing: it stays as written; the linter notice can be switched off for that one line, on purpose (`oxlint-disable-next-line react/incompatible-library`) |
| a virtual list shows no rows **in a test** | jsdom has no layout: the scrolling box is 0 pixels tall | `giveElementsASize()` from `src/test/layout.ts` in `beforeEach` |
| a virtual list draws too many rows, or jumps | the scrolling box has no fixed height, or `estimateSize` is far from the real row height | `h-[65vh]` (a fixed height) on the box; an estimate close to the real height |
| `npm run size` prints `Over budget by 14.3 kB. Find what grew …` | something got heavier: a new library, a page that is no longer lazy, an import that drags a heavy file in | read the treemap; `lazy()` it, or move the function; raise `BUDGET_KB` only with a reason in the same pull request |
| `npm run size` fails with `ENOENT … dist/index.html` | you ran it before the build | `npm run build` first |
| the search box loses letters again | the text is state of the page (or of the address) again | keep it in `SearchBox`; the five tests of `SearchBox.test.tsx` say which case broke |
| the Back button does not change the text in the box | the "adjust state while rendering" block was left out | see `SearchBox.tsx`: `if (value !== seen) { setSeen(value); … }` |
| a half-typed word comes back after a category chip | the box was not reset | `MenuPage` gives the box a `key` that changes with the chips |
| a dish with a `null` price blanks the whole page | no boundary near the card | `ErrorBoundary` in `DishGrid.tsx`, around each card |
| the page boundary keeps showing the message after the guest goes to another page | no `resetKeys` | `resetKeys={[pathname]}` |
| the reload loops forever after a deploy | the handler reloads without a guard | the ten-second guard in `lib/preloadError.ts` |
| the typed letters are late, even with `useDeferredValue` | the list is not in `memo`: it renders in the urgent pass because its parent did | wrap the list in `memo` |
| every kitchen row renders when one ticket changes | `memo` is missing, or the function changes: `setStatus.mutate` is a property of an object that changes three times | `const { mutate } = useSetOrderStatus()` and `memo(OrderRow)` |
| the `/kitchen` page says "Forbidden" or "No connection" | not signed in as staff, the token expired (2 minutes), or the API is not reachable | sign in as `kitchen@itstep.ge` or `waiter@itstep.ge` again; the queue endpoint was not called on the live server by us |
| `npm test` takes two to three times as long as in L37 | the compiled code, and 36 more tests | normal: 27 to 43 s for 151 tests |

---

## Questions students ask

- **"Do I put `memo` on everything?"** No. It costs memory, hides the code, and without a measurement you do not know that it helped. List rows, and a few other cases (slide 20).
- **"Does the compiler make my app fast?"** It removes the `useMemo` and `useCallback` you used to write, and the renders that those saved. It does not shrink the bundle, make a slow calculation fast, or fix state that is too high; and it makes the very first draw a bit slower.
- **"Is the compiler safe?"** It refuses code that breaks the rules of React and says why, but it compiles some broken code without a word (a mutated prop), so the rules are still yours. Start with the annotation mode if you are careful.
- **"Why is my number different from the slide?"** Your machine, your browser, the day. Compare before and after on *your* setup; the proportions will agree.
- **"Why not just use `npm run dev` for the Profiler?"** You can, to find the widest bar. Do not quote its milliseconds.
- **"How small should the bundle be?"** There is no number for every site. Know what you ship, set a budget a little above what you measure, and let the robot hold it. A page can be heavy and fine, or light and slow (slide 26: bytes and main-thread time are different measurements).
- **"Should every page be lazy?"** No. The first screens stay in the main file, because a lazy page is one more round trip.
- **"Does lazy-loading hurt SEO?"** It is a client-rendered app in this course; search engines and server rendering are a different lecture (Next.js).
- **"Why not catch errors with `try/catch` in the component?"** A `try/catch` cannot catch what a *child* throws while rendering; a boundary can. It cannot catch an event handler's error; `try/catch` can.
- **"Is a boundary around every component too much?"** One per card was cheap with the compiler, and a measured cost without it (1,208 renders for a category click against 645). Put one where a failure should stop, not everywhere.
- **"Should I virtualize every list?"** No: 200 rows are fine. Wikipedia puts thousands of rows of text in a page. Virtualize when each row is a component and the list is long.
- **"`useTransition` or `useDeferredValue`?"** A transition for an update you start (a tab); a late copy for a value you receive (a typed text). With the late copy, `memo` the list.
- **"Can the AI make my app faster?"** It can propose, and it loves `useMemo`. The measurement is yours: a number before and a number after.
