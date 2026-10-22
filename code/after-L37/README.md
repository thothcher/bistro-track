# Le Bistro after L37 · Le goûteur

Le Bistro at the end of **L37 · testing React** (syllabus v2: L39): the first lecture of the third Le Bistro track. The app hardly changes (one small refactor, below). It gets a net of **115 tests** and a robot that runs them on every pull request.

Lecture: [`../../L37-testing/`](../../L37-testing/guide.md).

## New in this lecture

- **The toolchain** (dev dependencies): `vitest` 5.0.5, `@vitest/coverage-v8` 5.0.5, `jsdom` 30.1.3, `@testing-library/react` 16.3.3, `@testing-library/dom` 10.4.2, `@testing-library/user-event` 14.6.8, `@testing-library/jest-dom` 7.0.1, `msw` 3.0.3. New scripts: `npm test` (one run, like the robot), `npm run test:watch`, `npm run coverage`.
- **`vite.config.ts`** takes `defineConfig` from `vitest/config` and has a `test` block: the `jsdom` environment, `setupFiles`, a `testTimeout` of 15 seconds (the first test of a file pays for loading the app's code), and a v8 coverage setup that leaves out the shadcn files (`components/ui`) and `main.tsx` and keeps the report when a test fails (`reportOnFailure: true`: by default Vitest writes none, and the robot's artifact would be empty exactly when you need it). One config for the app and the tests: the same plugins and the same `@` alias. The tests import `describe`, `it` and `expect` from `"vitest"` (no globals).
- **`src/test/`**, the helpers every test shares:
  - `setup.ts`: the jest-dom matchers; `findBy…` and `waitFor` allowed five seconds instead of one (`configure({ asyncUtilTimeout: 5000 })`, once, for every test: a busy laptop or a shared robot needs it); the fake API on (`onUnhandledFrame: "error"`: a request nobody planned fails the test); and after every test `cleanup()`, `server.resetHandlers()`, `vi.unstubAllGlobals()`, both stores emptied and `localStorage.clear()`.
  - `server.ts`, `handlers.ts` (the happy kitchen: categories, dishes, search, login, `auth/me`, the cart, orders: the shapes follow the API's Swagger page) and `fixtures.ts` (three dishes, three categories, five orders).
  - `render.tsx`: `renderWithProviders`, the cache (retries off) and a `MemoryRouter` around the component, plus `LocationDisplay.tsx`, a paragraph that prints the address so that a test can read it.
  - `intersection.ts`: a fake `IntersectionObserver` (jsdom has none).
  - `safetyNet.test.ts`: proves that an unplanned request fails.
- **17 test files, next to the code they check** (115 tests):

  | File | Tests | It protects |
  |---|---|---|
  | `cart/cartReducer.test.ts` | 12 | the cart's rules: add, quantity, limit of ten, off-menu dishes, remove, clear, no change to the old cart |
  | `cart/cartStore.test.ts` | 6 | the store: add, count, total, saved in `localStorage`, notes |
  | `hooks/useDebounce.test.ts` | 3 | the 400 ms wait, with fake timers |
  | `hooks/useLocalStorage.test.ts` | 5 | saved values, broken JSON, a full storage |
  | `hooks/useInView.test.tsx` | 3 | watching the end of a list (fake observer), and stopping |
  | `lib/format.test.ts` | 8 | prices and item counts |
  | `lib/api.test.ts` | 7 | headers, the API's error sentences, `429` and `Retry-After`, the 2-minute token |
  | `schemas/auth.test.ts` | 10 | the login and register rules, the phone check (one request, only for a good shape) |
  | `schemas/tableNotes.test.ts` | 7 | the table form's rules and the sentence for the kitchen |
  | `routes/RequireAuth.test.tsx` | 5 | guests, signed-in guests and staff |
  | `components/QuantityStepper.test.tsx` | 4 | the stepper: its buttons, the limit, the keyboard |
  | `components/UserMenu.test.tsx` | 5 | the account menu: keyboard, staff-only link, signing out |
  | `components/MyOrders.test.tsx` | 5 | the history: pages, "Show more", the end of the list, empty, error |
  | `components/CartSheet.test.tsx` | 14 | the cart as a guest uses it: the four keyboard checks of L36, empty, quantities, "Empty the order", sending the order, a failed order |
  | `pages/LoginPage.test.tsx` | 7 | messages, signing in, going back to the wanted page, a wrong password, a slow server |
  | `pages/MenuPage.test.tsx` | 13 | loading, filters in the address, search, "/", errors and retry, slow, offline, `429` |
  | `test/safetyNet.test.ts` | 1 | the fake API refuses requests nobody planned |

- **One change in the app:** `lib/queryClient.ts` exports `createQueryClient(overrides)`, and `export const queryClient = createQueryClient()` is what the app uses (nothing else changes). A test builds its own with the app's real rules (the error toast included) and `retry: false`.
- **`.github/workflows/ci.yml`:** on every pull request and every push to `main`: `npm ci`, lint, build (types and the site), tests with coverage. The coverage report is kept as an artifact, even when a test fails. It may only read the code (`permissions: contents: read`). The actions are written with tags (`@v7`) to be readable; the Security Day shows what bigger projects write instead.
- `.gitignore` also ignores `coverage`. Version `1.1.0`.

## Coverage (the real report)

59.08% of the statements (270 of 457), 53.65% of the branches. By folder: `cart/`, `hooks/`, `schemas/`, `auth/` and `routes/` 100%; `lib/` 93%; `components/` 60%; `queries/` 53%; `pages/` 27% (`KitchenPage`, `RegisterPage` and `TableNotesPage` have no test yet: good exercises). Coverage shows what no test touched. It cannot show what a test checks: in this project, with the `disabled` attribute of the stepper deleted, a test that only clicks still passes at 100%.

## Run it

```bash
npm install
npm test             # one run, as the robot does it (about 12 seconds)
npm run test:watch   # stays on and reruns what you change
npm run coverage     # a table in the terminal, and an HTML report in coverage/
npm run dev          # the app: http://localhost:5173
npm run build        # type-check (the tests included) + production build
npm run lint         # oxlint
```

One file: `npx vitest run src/cart/cartReducer.test.ts`. One test, by part of its name: `npx vitest run -t "wrong"`. The tests need no internet: the API is a fake inside the test process, and a request nobody planned fails the test.

## How it was checked

- **Type-checked, built and linted** (oxlint): zero warnings. **115 tests pass** in 17 files, in about 12 seconds on the lecturer's laptop (three runs: 11.2 to 12.7 s; earlier runs of a slightly smaller suite on a busier laptop took up to 15 s). Most of that time is jsdom being created for each file, not the tests.
- **Flaky-test hunt.** The suite ran six times in a row with no failure. Then four copies at once on an 8-core laptop, to starve each other: with Vitest's and Testing Library's defaults 5 to 9 tests per copy failed (5-second test timeouts, `findBy`'s one second, and one test, "disables the button while it is signing in", that raced a 150 ms sleep). With the two settings above and a test-controlled "gate" instead of the sleep, none failed in twelve runs.
- **On a clean copy**, the way the robot starts: `npm ci`, `npm run lint`, `npm run build` and `npm run coverage` all pass. `actionlint` 1.7.12 finds nothing in `ci.yml`. The workflow has **not been run on GitHub** (nothing was pushed): the action versions are the latest on 2026-10-22 (checkout 7.0.1, setup-node 7.1.0, upload-artifact 7.0.2).
- **The tests were tested by breaking the code on purpose.** Six edits, each made exactly one test fail: the menu check in `cartReducer`, the `disabled` of the stepper, the wrong-password message of `LoginPage`, the staff-only condition of `UserMenu`, the expired-token sign-out of `api()` and the role check of `RequireAuth`. The reducer was also broken in five ways, alone and in eight combinations, against the real tests; the in-page lab of the lecture gives the same results.
- **A limit, found that way:** changing `MAX_QTY` from 10 to 11 passes every test that quotes the constant. `cartReducer.test.ts` has one test that says "ten" in plain numbers for that reason.
- **The four keyboard tests of the cart** pass on the `Sheet`, and all four fail on a plain `div` cart like the one before L36. Radix needs no polyfill in jsdom for the Sheet, the AlertDialog or the DropdownMenu (we tried all three); `IntersectionObserver` is missing, hence `intersection.ts`.
- **MSW 3 renamed an option:** `onUnhandledRequest` of MSW 2 is `onUnhandledFrame` in MSW 3, the default is only a warning, and the old name is ignored without a word. TypeScript notices (`TS2353`), which is why `tsc -b` covers the test files.
- **Not tested:** anything a pretend browser cannot see (layout, colour, contrast: jsdom has no layout), a real browser (that is what Playwright is for), the live API (the tests use a fake, and the login, cart and order flows were not called on the real server).
- **Known:** `npm audit` reports 7 high-severity findings, all through the `shadcn` command-line tool, which the generator listed under `dependencies`: `shadcn` → `@shadcn/registry` and `ts-morph` → `fast-glob` → `micromatch` → `braces` (an advisory about deeply nested patterns, GHSA-vfj7-8cjw-p6xm). It never reaches the browser bundle. The Security Day uses it as a practice case.
