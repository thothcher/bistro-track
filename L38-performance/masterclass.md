# L38 · Masterclass: Le Bistro after L38 in one prompt

**Where:** slides 47–49, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L38`](../code/after-L38), from one prompt: the performance and resilience work of the whole lecture.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Nothing to attach: the data comes from the API, and the prompt names the endpoints.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project (`npm install zustand react-hook-form zod @hookform/resolvers@5 @tanstack/react-query react-error-boundary @tanstack/react-virtual` and `npm install -D @rolldown/plugin-babel @babel/core babel-plugin-react-compiler @types/babel__core vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom msw`) and run it, so you can show it working. **Measure it** (`npm run build && npm run size`), and compare with the 160 kB of `code/after-L38`: an answer that is much heavier is a finding.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 47, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 48, 4′). Show the answer and go through the six checks in its code, one per press. Then open `code/after-L38` next to it.
3. **The short version** (slide 49, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 47 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site: Vite 8 + React 19 + TypeScript + Tailwind CSS 4, react-router 8
(import from "react-router"), Zustand 5, react-hook-form 7, zod 4, @tanstack/react-query 5, shadcn/ui (Radix,
sonner), tests with Vitest 5, Testing Library 16 and MSW 3. API at /api through a Vite proxy: dishes (main
courses take 3 seconds), categories, search (10 requests a minute), login, profile, cart, orders, and the staff
queue (GET /orders/queue). The photos are 25 JPEGs of 90 to 450 kB.

ROLE
You are a senior React performance engineer who writes code for beginners to read, and who never changes
anything before it is measured.

ACTION
Take the site as it is after the tests lecture and make it fast and hard to break on a phone:
- The search box keeps its own text, reports it after a 400 ms pause, and follows the address when Back changes it.
- The React Compiler on (@rolldown/plugin-babel with reactCompilerPreset). React in its own chunk (codeSplitting.groups).
- Every page except home and menu with lazy() and one Suspense with a skeleton. toKitchenNotes moves out of the
  schema file (a type-only import) so Zod stays out of the first file.
- Boundaries (react-error-boundary): around each dish card, around the page (resetKeys on the address, onError logs),
  around the whole app. A vite:preloadError handler that reloads once.
- Images: loading="lazy" decoding="async" on the cards, fetchPriority="high" on the hero.
- A kitchen page for staff: tabs with useTransition, a text filter with useDeferredValue, a list that uses
  @tanstack/react-virtual, OrderRow in memo with a stable onAdvance.
- scripts/check-size.mjs (first-load JavaScript, gzip, budget 170 kB), npm run size, and a CI step.
- Tests for the search box, the boundaries, the preload handler and the kitchen page.

FORMAT
First a table: every change, why, and how to measure it. Then every file in full with its path.

TARGET
Beginners will read it. No useMemo or useCallback unless a measurement shows it is needed. The pages are exported by
name, so lazy() uses .then((m) => ({ default: m.Page })). npm test, npm run build and npm run lint pass. At the end,
name three numbers to measure before and after: first-load kB, renders while typing, main-thread time with 800 orders.
```

## The short version

The Copy button on slide 49 copies exactly this:

```text
You're a senior React performance engineer writing for beginners, and you never change anything before it is measured. Le Bistro is a Vite 8 + React 19 + TypeScript + Tailwind 4 app with react-router 8, Zustand 5, react-hook-form 7, zod 4, @tanstack/react-query 5, shadcn/ui and Vitest 5 tests; its API at /api has slow main courses, a rate-limited search and a staff queue of orders; its 25 photos weigh 90 to 450 kB. Make it fast and hard to break on a phone: a search box that keeps its own text and reports after a pause; the React Compiler and React in its own chunk; every page except home and menu behind lazy() and one Suspense skeleton, with toKitchenNotes moved out of the schema file so Zod stays out of the first file; error boundaries around each dish card, the page and the whole app, plus a vite:preloadError handler that reloads once; lazy photos and a high-priority hero; a staff kitchen page with a transition on the tabs, a deferred filter, a virtual list and a memo row with a stable function; a first-load size budget of 170 kB gzip checked in CI; and tests for the search box, the boundaries, the preload handler and the kitchen page. Answer with a table of every change, why, and how to measure it, then every file in full with its path. Keep it simple for beginners: no useMemo or useCallback unless a measurement shows the need; named page exports with lazy(() => import(...).then(...)); npm test, build and lint must pass; end with three numbers to measure before and after.
```

## Check the answer with today's knowledge

- [ ] The search text lives **in the box** (a state of `SearchBox`), is reported after a pause, and the box follows the address when Back changes it: not state of the page, and not only the address
- [ ] The pages are `lazy(() => import("./pages/X").then((m) => ({ default: m.X })))` and there is **one** `Suspense` around the outlet; the first pages (home, menu) are not lazy
- [ ] Boundaries at **three levels** (card, page, app), `resetKeys` on the first two, and an `onError` that tells somebody
- [ ] **No `useMemo` and `useCallback` sprinkled around.** `memo` only on the order row, with a stable function (`const { mutate }`, not the whole mutation object)
- [ ] The kitchen list sits in a box with a **fixed height**, uses `aria-posinset` and `aria-setsize`, and the hero image is `fetchPriority="high"` while the cards are lazy
- [ ] **Put a `null` price in the data:** one grey card, not a white page. Then `npm run build && npm run size`: is it under the budget? Then ask for the three numbers it promised to name, and measure them

**What AIs often get wrong here:** AIs love `useMemo` and `useCallback` on everything, put `loading="lazy"` on the hero picture, write `lazy()` for a named export without the `.then` (the page never opens), reach for `next/dynamic`, wrap the whole app in one boundary and call it done, and invent numbers ("this cuts the bundle by 40 per cent"). All of them are on today's slides.

## When the AI goes off track

- **`useMemo` and `useCallback` everywhere:** the Target line forbids them without a measurement. Point at it, and ask which one the Profiler would show as useful.
- **`next/dynamic` or server components:** the Context line says Vite and react-router 8. Ask for `React.lazy` and `Suspense`.
- **A virtual list with no fixed height, or a hand-written scroll listener:** ask for `@tanstack/react-virtual` in a box with a fixed height.
- **An old or half answer** (it forgets the boundary, the budget or the tests): ask for the missing item by name, one at a time, and paste the failing message word for word.
- **It does not build:** paste the first error and the file it is in. Most of the time the cause is a missing package: the Before class line lists the installs.
- **No internet:** the answer you saved in a tab is the Masterclass; the slides show the parts and the short version.
