# Le Bistro after L38 · Le coup de feu

Le Bistro at the end of **L38 · speed and resilience** (syllabus v2: L40): the second lecture of the third Le Bistro track. The site **looks the same** and behaves differently: it sends less code first, it does not lose letters in the search box, one bad dish no longer turns the page white, and a kitchen screen with 800 orders stays smooth. It also gets a size budget that the robot of L37 enforces.

Lecture: [`../../L38-performance/`](../../L38-performance/guide.md).

## New in this lecture

- **The React Compiler.** Four dev dependencies (`babel-plugin-react-compiler` 1.0.0, `@rolldown/plugin-babel` 0.2.4, `@babel/core`, `@types/babel__core`) and one line in `vite.config.ts`: `babel({ presets: [reactCompilerPreset()] })`. Vitest reads the same file, so the tests run the compiled code. It compiles 102 components and hooks and leaves two as written, with a reason each (`node scripts/compiler-report.mjs` prints the list): `useLocalStorage` (a value block inside a `try/catch`) and `OrderList` (an incompatible library, `useVirtualizer`). Cost: about 27 kB of JavaScript before compression (+9 kB gzip), and a build that takes 2.4 seconds instead of 1.1.
- **React in a file of its own.** `build.rolldownOptions.output.codeSplitting.groups` in `vite.config.ts` puts `react`, `react-dom` and `scheduler` in `react-vendor`: a deploy of our code does not make a returning guest download React again.
- **Lazy pages.** Every page except the home page and the menu is `lazy(() => import(...).then((m) => ({ default: m.Page })))` in `App.tsx` (the pages export a name, not `default`). One `<Suspense fallback={<PageSkeleton />}>` in `SiteLayout` waits for them. `npm run build` now prints a file per page.
- **One import moved.** `toKitchenNotes` lives in `lib/kitchenNotes.ts` (with a type-only import of `TableNotes`) instead of next to the Zod schema, so Zod (83 kB before compression) no longer reaches the first file through `CartSheet` → `orders.ts`. The first file went from 549.5 to 464.5 kB.
- **Boundaries, three levels** (`react-error-boundary` 6.1.6): `DishGrid` gives every card its own (one dish with a `null` price becomes one grey card), `PageBoundary` is around the page (`resetKeys` is the address; `onError` writes to the console, the place for a service such as Sentry), and `RootCrash` is around the whole app in `main.tsx`. `lib/preloadError.ts`: when a lazy page's file is gone after a new deploy, Vite fires `vite:preloadError` and the handler reloads once (never twice within ten seconds).
- **The search box keeps its own text.** `SearchBox` has a `useState` for the text, reports it to the page after a 400 ms pause (`useDebounce`, with a `useEffectEvent` so that the effect does not depend on the page's function), and follows the address when something else changes it (the Back button): adjusting state while rendering, no effect. **This fixes a real bug:** React Router 8 runs an address change as a transition, so a box controlled by the address lost letters when the CPU was busy ("french onion soup" became "fe ion soup" on a slowed CPU). `MenuPage` gives the box a `key` that changes with the category chips, so a half-typed word does not come back.
- **Photos.** `DishCard` images have `loading="lazy" decoding="async"`; the hero has `fetchPriority="high"`.
- **The kitchen page** (`/kitchen`, staff only): tabs by status (`StatusTabs`, with `useTransition`), a text filter (`useDeferredValue`), `OrderList` (a virtual list with `@tanstack/react-virtual` 3: only the rows near the window exist, `aria-posinset` and `aria-setsize` tell a screen reader how many there are) and `OrderRow` in `memo`, fed by a `const { mutate }` so that its function never changes. `lib/orders.ts` has the pure filtering and counting. In development only, `/kitchen?rush=800` adds 800 pretend orders to the real ones (`dev/rush.ts`; the production build contains no such code).
- **`scripts/compiler-report.mjs`**: runs the same compiler over every file of `src/` (the tests left out) and prints how many components it compiled and which it left alone, with the compiler's reason. Not part of the build.
- **A size budget.** `scripts/check-size.mjs` adds up the JavaScript that `dist/index.html` asks for up front, gzips each file and fails above **170 kB** (we measure about 160). `npm run size`, and a step in `.github/workflows/ci.yml` after the build.
- **Tests: 151 in 26 files** (L37 had 115 in 17). New: `SearchBox.test.tsx` (5), `PageBoundary.test.tsx` (4), `DishGrid.test.tsx` (3), `lib/preloadError.test.ts` (4), `lib/orders.test.ts` (7), `lib/kitchenNotes.test.ts` (2, moved from `tableNotes.test.ts`), `pages/KitchenPage.test.tsx` (7, one with 800 orders), `dev/rush.test.ts` (3), `App.test.tsx` (3: the skeleton while a lazy page arrives, the header stays, an unknown address). `src/test/layout.ts` gives every element a size: jsdom has no layout, a virtual list asks "how tall is my window?" and hears zero. `setup.ts` also clears `sessionStorage` and calls `vi.restoreAllMocks()`.
- New dependencies: `react-error-boundary` 6.1.6, `@tanstack/react-virtual` 3.14. Version `1.2.0`.

## The numbers (measured on the lecturer's laptop, 2026-10-22)

| | L37 | L38 |
|---|---|---|
| JavaScript before the first page (gzip, `npm run size`) | 196.1 kB, one file | 160.3 kB, five files |
| The same, brotli | 184.7 kB | 151.1 kB |
| Components rendered while typing "soup" (4 keys) | 2,110 | 48 |
| One key at 4× CPU, React's own time | 46.2 ms | 0.6 ms |
| Letters lost in the search box (CPU 6× slower, a key every 120 ms) | 6 of 17 | 0 |
| Kitchen with 803 orders, main thread blocked while it draws (CPU 4×) | 425 ms, 6,484 elements (a plain list) | 82 ms, 172 elements |

A one-line deploy, first-load files only: with React in the main file a returning guest downloads 147.0 of 160.6 kB again; with `react-vendor`, 83.4 of 160.4 kB.

Most of the weight of the menu page is not code: the 25 photos are 3.97 MB. Adding one bar chart with `recharts` 3.10.1 to the home page puts the first load at 261.2 kB (the budget fails); loading the chart with `lazy()` keeps it at 160.5 kB. Putting `toKitchenNotes` back next to the schema: 184.3 kB (the budget fails).

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check (the tests included) + production build: one file per page
npm run size      # the budget: run it after the build
npm test          # 151 tests, about half a minute
npm run lint      # oxlint
npm run preview   # the built site, http://localhost:4173: measure this one, not npm run dev
```

To see what the compiler and React Scan show: `npm run build && npm run preview`, then `npx react-scan@latest http://localhost:4173`. The React Developer Tools Profiler works with `npm run dev` (times are not the guests' times: React renders twice on purpose and does extra checks); for honest milliseconds, build once with the alias `{ find: /^react-dom\/client$/, replacement: "react-dom/profiling" }` in a copy of `vite.config.ts`.

The dish photos and the data come from the Le Bistro API server, so the page needs internet: `vite.config.ts` forwards `/api/...` to https://srmsapi.stepacademy.ge. Test accounts are listed at the top of https://srmsapi.stepacademy.ge/swagger (the staff queue needs `kitchen@itstep.ge` or `waiter@itstep.ge`). Access tokens live 2 minutes.

## Deploy

Import the folder (or its git repo) in Vercel, or run `npx vercel`. `vercel.json` makes F5 work on every page and forwards `/api` to the real API. Vercel serves files with a hash in the name with long cache headers, which is what the `react-vendor` file relies on.

## How it was checked

- **On a clean copy**, the way the robot starts: `npm ci` (587 packages, 21 s), `npm run lint` (oxlint: exit 0, no warnings), `npm run build` (`tsc -b` over the app and the tests, then Vite 8.3.5), `npm run size` (160.3 kB, budget 170) and `npx vitest run`: **151 tests in 26 files pass**, in about 43 seconds with two workers on a laptop that was short of memory (about half a minute on a free one; coverage on: 62.42% of the statements, 1,010 of 1,618, and 53.65% of the branches, counted on a build that now includes the compiler, so **do not compare these totals with L37's 59.08%**). `actionlint` 1.7.12 finds nothing in `ci.yml`. The workflow has **not been run on GitHub**: the new `npm run size` step is checked locally only.
- **The numbers in the table above** are one machine on one day: the first-load sizes are what `npm run size` prints (gzip, Node's zlib; Vite's own report differs by about one per cent); renders are counted from the React DevTools hook on the production build (unminified, so that the names survive), in headless Chrome, for four keys typed "soup" with a key every 180 ms; times are from Chrome with the CPU slowed 4 or 6 times; the kitchen numbers are the median of several runs against a local copy of the API with 803 pretend orders (the staff endpoints of the real API were **not** called). The L37 numbers come from a build of `code/after-L37` made the same way.
- **The tests were checked by breaking the code on purpose** (four edits, each undone afterwards): without the boundary around each card, 2 of the 3 tests of `DishGrid.test.tsx` go red (the grey card, and the second try); without the `resetKeys` of the page boundary, 1 of 4 (the one about another address clearing the message); without the ten-second guard of `lib/preloadError.ts`, 1 of 4 (the second failure must not reload); without the "follow the address" block of `SearchBox`, 2 of 5 (the Back button, and not undoing a change of address when the page hands the box a new function).
- **React Scan 0.5.7** was injected into the built app to take the two screenshots of the slides (the L37 build, and this code); the version of the extension and the command are the ones in its README on 2026-10-22.
- **Not tested here:** the staff login and the order queue on the live API (built from the Swagger description); a real phone (the CPU was slowed in Chrome); the deploy on Vercel; the `vite:preloadError` handler against a real deploy (its tests use a fake `reload`, and the lecture's simulation shows the mechanism, not a real 404).
- **Known:** `npm audit` still reports 7 high-severity findings, all through the `shadcn` command-line tool, which the generator listed under `dependencies` (see L37). It never reaches the browser bundle; the Security Day uses it as a practice case. The build prints a Rolldown notice about slow plugin callbacks (`@rolldown/plugin-babel`, the compiler): it is not an error.
