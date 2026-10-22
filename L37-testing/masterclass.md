# L37 · Masterclass: Le Bistro after L37 in one prompt

**Where:** slides 41–43, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L37`](../code/after-L37), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Nothing to attach: the data comes from the API, and the prompt names the endpoints.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project (`npm install zustand react-hook-form zod @hookform/resolvers@5 @tanstack/react-query && npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom msw @vitest/coverage-v8`) and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 41, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 42, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L37` next to it.
3. **The short version** (slide 43, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 41 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site. Vite + React 19 + TypeScript + Tailwind CSS 4,
react-router 8 (import from "react-router"), Zustand 5, react-hook-form 7, zod 4,
@tanstack/react-query 5, shadcn/ui (Radix, lucide-react, sonner). API at /api through a
Vite proxy: dishes, categories, search (10 requests a minute), login (2-minute token),
profile, learning/cart, enterprise/orders (POST, queue), profile/orders (paged).
Tests: Vitest 5, jsdom, @testing-library/react 16, user-event 14, jest-dom, MSW 3.

ROLE
You are a senior React developer who writes code and tests for beginners to read.

ACTION
Build the site as it is so far (pages, role guards, stores, forms, data with TanStack Query
v5, shadcn/ui dialogs) and test it like a guest, with Vitest:
- vite.config.ts with a test block (jsdom, setupFiles). src/test/setup.ts: jest-dom matchers,
  cleanup, an MSW server (onUnhandledFrame: "error", resetHandlers, close), and both stores
  emptied after every test. Handlers for categories, dishes, search, login, auth/me, cart, orders.
- createQueryClient() in lib/queryClient.ts (the app uses it, the tests use it with retry:
  false) and a renderWithProviders helper (cache, MemoryRouter, a location display).
- At least 40 tests: cartReducer (with it.each), the cart store, useDebounce (fake timers),
  useLocalStorage, useInView (a fake IntersectionObserver), format, the zod schemas, api(),
  LoginPage, MenuPage (loading, filter, search, error with retry, 429, slow, offline),
  RequireAuth, UserMenu, CartSheet (focus in, Tab inside, Esc, focus back), MyOrders.
- .github/workflows/ci.yml: npm ci, lint, build, tests with coverage, on every pull request.

FORMAT
First a table: every test file and what it protects.
Then every file in full with its path.

TARGET
Beginners will read it. Find things by role, label or text: never by CSS class or test id.
Every click is awaited. Test names are sentences. npm test, npm run build and npm run lint
pass. Then break the code on purpose three times and show which test goes red each time.
```

## The short version

The Copy button on slide 43 copies exactly this:

```text
You're a senior React developer writing code and tests for beginners. Le Bistro is a Vite + React 19 + TypeScript + Tailwind 4 app with react-router 8, Zustand 5, react-hook-form 7, zod 4, @tanstack/react-query 5 and shadcn/ui, and an API at /api through a Vite proxy (dishes, categories, search at 10 requests a minute, a 2-minute token login, the profile, the server's cart, orders with a paged history and the staff queue); tests use Vitest 5, jsdom, Testing Library 16, user-event 14, jest-dom and MSW 3. Build the site as it is so far and test it like a guest: a Vitest config with jsdom; a setup file with jest-dom, cleanup, an MSW server that fails on unplanned requests (onUnhandledFrame: "error") and both stores emptied after every test; handlers for the API; a createQueryClient() that the tests use with retry: false, and a renderWithProviders helper; at least 40 tests (the reducer with it.each, the store, the hooks with fake timers and a fake IntersectionObserver, the schemas, api(), the login and menu pages with loading, error, 429, slow and offline, the role guard, the user menu, the cart sheet's four keyboard checks, the order history); and a GitHub Actions workflow that runs npm ci, lint, build and the tests with coverage on every pull request. Answer with a table of every test file and what it protects, then every file in full with its path. Keep it simple for beginners: find things by role, label or text, never by CSS class or test id; await every click; name tests as sentences; npm test, npm run build and npm run lint must pass; then break the code on purpose three times and show which test goes red each time.
```

## Check the answer with today's knowledge

- [ ] The MSW code is version 3: `http` and `HttpResponse` from `msw`, `setupServer` from `msw/node`, and `onUnhandledFrame: "error"` (not `rest`, `ctx`, `res(ctx.json(…))` or `onUnhandledRequest`)
- [ ] Things are found by role, label or text; there is no `getByTestId` (except the little location display), no `container.querySelector`, and no snapshot
- [ ] Every `user.click` and `user.type` is awaited, and the user comes from `userEvent.setup()`
- [ ] Both stores are emptied in `afterEach`, the test `QueryClient` has `retry: false`, and no test needs another to run first
- [ ] `npm test`, `npm run build` and `npm run lint` pass, and then you **break the code three ways** and the tests go red: ask which test caught each one, and what would escape

**What AIs often get wrong here:** AIs write the tests of last year: MSW 1 syntax, `jest.fn()` and `jest.mock`, `fireEvent`, `getByTestId` everywhere, a snapshot of a whole page, a click with no `await`, a test with no `expect`, and tests that mock the module they are testing. All of them are on today's slides.

## When the AI goes off track

- **MSW 1 or MSW 2 code** (`rest.get(…, (req, res, ctx) => res(ctx.json(…)))`, `onUnhandledRequest`): the Context line names MSW 3. Point at it and ask for `http.get(…, () => HttpResponse.json(…))` and `onUnhandledFrame`.
- **Jest instead of Vitest** (`jest.fn()`, `jest.mock`, a `jest.config.js`): ask for Vitest only, with `vi.fn()` and a `test` block in `vite.config.ts`.
- **Tests that cannot fail** (no `expect`, a snapshot, the module under test mocked): ask which behaviour each test protects, and ask for an `expect` a guest would notice.
- **Real network calls** (a test that fetches the real API): ask for MSW handlers, and for `onUnhandledFrame: "error"` so that nothing leaves the test.
- **Half an answer** ("the other files are similar"): ask for the missing files by name: "Give me src/test/setup.ts, src/test/handlers.ts, src/test/render.tsx and CartSheet.test.tsx in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once. Before you run the tests, install the dev dependencies of the second command (the first one is the same as in the earlier lectures), and make sure `vite.config.ts` takes `defineConfig` from `vitest/config`.
- **No internet or no time:** show `code/after-L37` and the answer you saved before class.
