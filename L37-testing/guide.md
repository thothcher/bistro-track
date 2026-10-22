# L37 · Le goûteur: lecturer guide

**Testing React from the user's eyes.** Le Bistro track, lecture 11 (syllabus v2: **L39**, React lecture 12). The first lecture of the third five.
**Deck:** [`index.html`](index.html), 48 slides. **Code:** starts from [`../code/after-L36`](../code/after-L36), ends at [`../code/after-L37`](../code/after-L37).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md). **Masterclass script:** [`masterclass.md`](masterclass.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | A test as a tiny experiment (arrange, act, assert) with Vitest (`it`, `describe`, `expect`, `it.each`, `vi.fn()`, fake timers); testing from the user's eyes with Testing Library (`render`, `screen`, queries by role, label and text, `within`) and `userEvent` (always awaited); `jest-dom` matchers; reading a failing test; `getBy`, `queryBy`, `findBy`, `waitFor` and the one-second default; testing a form and a hook (`renderHook`); a router and a cache around a component; MSW 3 (handlers, `server.use`, `{ once: true }`, `delay`, `HttpResponse.error()`, `onUnhandledFrame`); a clean table between tests (stores live in memory); what jsdom has and lacks, and fakes for the rest; coverage and what it cannot say; breaking the code on purpose to test the tests; GitHub Actions on every pull request |
| **Le Bistro gets** | The test toolchain (`vitest`, `jsdom`, Testing Library, `user-event`, `jest-dom`, `msw`, `@vitest/coverage-v8`), a `test` block in `vite.config.ts`, `src/test/` (setup, fake server, handlers, fixtures, `renderWithProviders`, a fake `IntersectionObserver`), 17 test files and **115 tests** next to the code, `createQueryClient()` in `lib/queryClient.ts` (the only change to the app), `.github/workflows/ci.yml`. Version 1.1.0 |
| **Students' project** | v1.1: Vitest and Testing Library set up, at least six tests (three for the cart logic, two for components, one for a form or a hook), and a table of three deliberate breakages in the README; Plus: MSW for the product list (loading, error with retry, empty); Pro: a `ci.yml` and a pull request with a red check, then a green one |
| **The two problems** | 1. It worked yesterday: a quiet change breaks a rare corner and nobody notices. 2. Whose kitchen is this: a test that calls the real API is slow, rate-limited and flaky |
| **The two answers** | 1. Tests that act like a guest, and that you have seen fail. 2. A fake kitchen (MSW), a clean table between tests, and a robot that runs everything on every pull request |
| **AI** | Classwork 2 is done with an AI: a CRAFT prompt, then the students break their code on purpose to find out whether the AI's tests are worth anything. The Masterclass rebuilds Le Bistro v1.1 with one prompt |

**Numbers** (all measured, on the real code): **17 files, 115 tests, about 12 seconds** (three runs: 11.2 to 12.7 s on the lecturer's laptop; earlier runs of a slightly smaller suite on a busier laptop took up to 15 s); coverage **59.08%** of the statements (270 of 457), 53.65% of the branches (`cart/`, `hooks/`, `schemas/`, `auth/`, `routes/` at 100%, `lib/` 93%, `components/` 60%, `queries/` 53%, `pages/` 27%). Six deliberate breakages of the app, each caught by exactly one test; the four keyboard tests of the cart pass on the `Sheet` and all four fail on a plain `div` cart. Four copies of the suite run at once on an 8-core laptop: with the defaults 5 to 9 tests per copy failed, with `testTimeout: 15_000` and `asyncUtilTimeout: 5000` none in twelve runs. **The live API, measured on 2026-10-22** (public endpoints, from the lecturer's laptop): categories 437 ms, the whole menu 623 ms (28 dishes), starters 885 ms, **main courses 3212 ms**, pastries 678 ms, desserts 596 ms, drinks 321 ms; the search answers `200` ten times (80 to 99 ms), and **the eleventh time `429` with `Retry-After: 60`**. Real Testing Library queries on real login pages (2026-10-22): GitHub, Wikipedia, Hacker News (below). npm downloads, week 12 to 18 October 2026: Vitest 77.5 M, Jest 25.8 M, Testing Library for React 41.6 M, MSW 12.9 M, Playwright 69.8 M, Cypress 3.2 M, enzyme 0.66 M.

---

## Before class

- [ ] Your Le Bistro from L36 runs (or copy `code/after-L36`, `npm install`). **Install the test tools in it before class** (`npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom msw @vitest/coverage-v8`), so that the live part is typing and not downloading. Vitest 5 asks for Node 22.12 or newer (its `engines` are `^22.12 || ^24 || >=26`), and React Router 8 for 22.22 or newer; we used Node 24.
- [ ] Run `npm test` once in the empty project: Vitest says `No test files found, exiting with code 1`. That is the right answer, and slide 13 shows it.
- [ ] **Try every demo once** (slides 8, 11, 12, 14 to 20, 25, 29 to 32, 34, 36, 37). They run in the deck with no internet, and the Testing Library inside them is the real one, copied into `vendor/`. **Click once inside a demo before you use the keys**; inside the query playground, the search box and the fake clock the deck's own shortcuts are switched off, so you can type letters and spaces.
- [ ] Fonts come from Google Fonts: with no internet the deck still works with fallback fonts.
- [ ] **The tests never call the real API.** Before class, open the API's Swagger page and look at the shapes of the answers you will fake (dishes, categories, search, login, cart, orders). The login, cart and order flows were **not** called on the live server; they were built from the Swagger description. **Do not hammer the search endpoint:** it answers `429` after ten requests a minute (we saw it).
- [ ] For the robot (slides 35 to 37) you need a GitHub repository: create one, push `code/after-L37` (or your own copy), open a pull request and watch the checks. We checked the workflow file with `actionlint` and ran its commands on a clean copy (`npm ci`, lint, build, coverage), but **we did not run it on GitHub**: do it once before class. If you have no time, slide 36 (the pull request simulator) is enough.
- [ ] Optional, for the "real pages" moment (slide 18): open `github.com/login` in Chrome, DevTools, Elements, **Accessibility** panel, click the username field: its **Name** is what `getByRole("textbox", { name: … })` compares with. Pages change, so look before you promise anything.
- [ ] Run the Masterclass prompt once (a minute or two, and it varies) and keep the answer open.
- [ ] `code/after-L37` open in a second VS Code window.
- [ ] Remind the students: DummyJSON keeps no changes (a `POST /carts/add` answers and stores nothing), so test your own cart logic, and use MSW for what comes from the network. Their MSW handlers use the **full address** (`http.get("https://dummyjson.com/products", …)`), because their pages ask that address directly.

---

## Learn it first (45 minutes)

### 1. Why tests, and what they are not for

You change a line of the cart. Does the rest still work? By hand you check the five things you remember, and a quiet break in a rare corner (a dish that is off the menu today can be added to the order) goes out on Friday. A test is **a program that uses your program the way a guest would, and says yes or no**. It runs in seconds, never forgets the rare corner, and runs again on every change. It is the only thing that lets you change code without fear, which is why the next lectures (speed, security, the admin dashboard) come after this one.

What tests are **not**: a proof that the code is right (a test only checks what it says), a replacement for your eyes (a focus ring that is too faint, a button hidden behind another, a colour at 1.66:1: jsdom has no layout and no colour), or a replacement for a real browser run (Playwright and Cypress do that, from the outside; they are the top of the pyramid and a different lecture).

### 2. The toolchain

| Tool | Job |
|---|---|
| **Vitest** 5 | finds `*.test.ts(x)` files, runs them, prints the report. Reads the same `vite.config.ts` as the app, so the plugins and the `@` alias are the same. `npm test` = `vitest run` (once, and stops: the robot's command); `npm run test:watch` = `vitest` (stays on and reruns what you change) |
| **jsdom** 30 | a pretend browser inside Node: a `document`, events, forms, `localStorage`. No screen, no layout |
| **Testing Library** (`@testing-library/react` 16, `/dom` 10) | `render`, `screen`, the queries; it finds things the way a guest does |
| **user-event** 14 | a pretend guest with hands: `click`, `type`, `tab`, `keyboard` |
| **jest-dom** 7 | readable matchers: `toBeInTheDocument()`, `toBeDisabled()`, `toHaveFocus()`, `toHaveTextContent()`, `toBeInvalid()`, `toContainElement()` |
| **MSW** 3 | a fake server inside the test process (Problem 2) |
| **@vitest/coverage-v8** | the coverage report |

```ts
// vite.config.ts: only the import changes ("vite" → "vitest/config"), and a test block is added
test: {
  environment: "jsdom",
  testTimeout: 15_000, // the first test of a file pays for loading the app's code
  setupFiles: ["./src/test/setup.ts"],
  coverage: { provider: "v8", reportOnFailure: true, include: ["src/**/*.{ts,tsx}"], exclude: ["src/test/**", "src/**/*.test.{ts,tsx}", "src/main.tsx", "src/components/ui/**"] },
},
```

We do **not** turn Vitest's `globals` on: every test file imports `describe`, `it`, `expect`, `vi` from `"vitest"`, so a beginner can see where they come from (tutorials often switch globals on; then Testing Library's automatic cleanup works by itself. Without globals the setup file calls `cleanup()`: forget it and the second test fails with `Found multiple elements with the role "button"`, a real message we got). Versions in the snapshot: vitest 5.0.5, jsdom 30.1.3, @testing-library/react 16.3.3, /dom 10.4.2, user-event 14.6.8, jest-dom 7.0.1, msw 3.0.3.

**Why Vitest and not Jest?** It is a fact you can look up: in the week of 12 to 18 October 2026 npm counted 77.5 million downloads of Vitest and 25.8 million of Jest, and Vitest passed Jest in the four weeks from 23 March 2026 (slide 12; the numbers include CI installs, so they count machines, not people). The practical reason: Vitest uses the config you already have.

### 3. A test: arrange, act, assert

```ts
it("adds the same dish again by raising its quantity, not by adding a second line", () => {
  const withSoup = [{ dish: frenchOnionSoup, qty: 1 }];               // arrange

  const cart = cartReducer(withSoup, { type: "added", dish: frenchOnionSoup }); // act

  expect(cart).toHaveLength(1);                                       // assert
  expect(cart[0].qty).toBe(2);
});
```

`it("a sentence", () => { … })` is a function with a name; the name is what you read first when it fails, so write it as a sentence a kitchen could understand. `describe` groups tests. A test file sits **next to** the code (`cartReducer.test.ts` beside `cartReducer.ts`). **One test, one idea.** `it.each([...])` runs one rule on a table of inputs and names every row.

Start with pure functions (`cartReducer`, `format`, the zod schemas, `toKitchenNotes`): same input, same output, no page, no clicks. That is one more reason we kept the cart's rules out of the components in L31.

Three comparisons that trip people up: `toBe` is `Object.is` (the very same thing: two equal objects are **not** `toBe`), `toEqual` compares contents; `toHaveBeenCalledTimes(1)` needs a spy, `vi.fn()` (a function that does nothing except remember how it was called); `expect(a).not.toBe(b)` is how you say "must not".

### 4. Testing like a guest: the queries

```tsx
render(<QuantityStepper qty={2} onDecrease={vi.fn()} onIncrease={onIncrease} />);
await user.click(screen.getByRole("button", { name: "One more" }));
expect(onIncrease).toHaveBeenCalledTimes(1);
```

The test never looks inside the component: not its state, not its classes. It finds a **button called "One more"** and presses it. If tomorrow the stepper is rewritten, the test still passes as long as the guest sees the same button. That is the point of "testing from the user's eyes".

**The query ladder** (Testing Library's own priority; slide 16):

| Query | Finds | In Le Bistro |
|---|---|---|
| `getByRole("button", { name: … })` | what it is, and what it is called (its **accessible name**) | the stepper, "Sign in", the dialog "Your order" |
| `getByLabelText("Email")` | a form field by its label | the login form |
| `getByPlaceholderText` | the placeholder (a smell: it should have a label) | — |
| `getByText("₾61")` | text that is not interactive | the total |
| `getByDisplayValue` | what is typed in a field | — |
| `getByAltText`, `getByTitle` | an image, a `title` attribute | — |
| `getByTestId("location")` | last resort: the guest cannot see it | `LocationDisplay`, our own helper |

This is L36 seen from the other side: the name we gave the cart (`SheetTitle`) is exactly what `getByRole("dialog", { name: "Your order" })` looks for. An element's **role** comes from its tag: `<button>` is `button`, `<a href>` is `link`, `<h2>` is `heading` (with a `level`), `<ul>` and `<li>` are `list` and `listitem`, `<output>` is `status`, `<input type="search">` is `searchbox`, a Radix dialog is `dialog`, an `AlertDialog` is `alertdialog`, a dropdown is `menu` with `menuitem`s. **A password field has no role** (so that a screen reader does not read it aloud): find it with its label.

Three families: `getBy…` finds one or **throws** (also when it finds two: `Found multiple elements with the role "button" and name "One more"`); `queryBy…` returns `null` (how you say "this is not there"); `findBy…` **waits** (below). Add `All` (`getAllByRole`) for lists. `within(element)` limits a query to one part of the page.

**Read the error message.** When a query fails, Testing Library prints the page and, for a role query, the list of roles it **did** find: `Unable to find an accessible element with the role "textbox" and name "Staff only"`, then `Here are the accessible roles:` and the headings and paragraphs on the page. Most of the time the answer is in that list.

**Real pages, measured on 2026-10-22** (slide 18: the real Testing Library, loaded into each real page once, with the page's security policy switched off for the measurement only):

| | role + name | label | placeholder |
|---|---|---|---|
| GitHub login, username | found | found | none |
| GitHub login, password | no `textbox` | found | none |
| GitHub login, "Sign in" | **2 buttons**: "Sign in" and "Sign in with a passkey" (an exact name finds one) | | |
| Wikipedia login, username | found | found | found |
| Wikipedia login, password | no `textbox` | found | found |
| Hacker News login, username | none | none | none |
| Hacker News login, password | none | none | none |

Where a field has a label, the test and the screen reader find it with the same words. Where it has none (Hacker News: the words are table cells, tied to nothing; two forms on one page), both are lost. The playground on slide 17 uses **our own redrawn versions** of these pages (the same structure, none of their code or look). We checked that the four redrawn pages answer all 23 real-site queries exactly like the real pages did.

### 5. user-event, and `await`

```tsx
const user = userEvent.setup();   // before render
await user.type(screen.getByLabelText("Email"), "mari@example.com");
await user.click(screen.getByRole("button", { name: "Sign in" }));
await user.tab();
await user.keyboard("{Escape}");
```

`user-event` does what a person does: it moves the focus, fires `pointerdown`, `mousedown`, `focus`, `click`, and for typing `keydown`, `input`, `keyup` per character. (`fireEvent` fires one DOM event and nothing else; use `user-event` unless you have a reason.) **Always `await` it.** Forget it and the check runs before the click has happened: `expected "vi.fn()" to be called 1 times, but got 0 times`. This is the most common mistake of the first week (slide 19, card 2).

### 6. Async: `getBy`, `queryBy`, `findBy`, `waitFor`

A real page is never ready at once: the menu arrives from the server. `getByText` right after `render` **throws, even when the dish needs 0 ms**, because the state update arrives a moment later (slide 20 shows it with real timers). `findBy…` is `getBy…` plus a wait, and `waitFor(() => expect(...))` waits for any check to become true. **Both give up after one second by default**: a dish that arrives after 1500 ms makes `findByText` fail after about 1006 ms (we measured). Say how long you are willing to wait (`{ timeout: 4000 }`) only for a test that really needs it; for the whole project raise it in **one** place: our `src/test/setup.ts` has `configure({ asyncUtilTimeout: 5000 })`, because a busy laptop or a shared robot needs more than a second (see "A flaky-test hunt" below). A test that really waits five seconds is telling you something about the page: ask why first.

### 7. A form, a hook, a router, a cache

- **A form.** `LoginPage.test.tsx` presses "Sign in" with the form empty, and looks for the two messages: they are `role="alert"` (L33), so `findAllByRole("alert")` finds them, and `toBeInvalid()` reads `aria-invalid`. The attribute made for screen readers is also the hook for the test.
- **A hook.** A hook needs a component to live in: `renderHook(() => useDebounce(value, 400))` makes a tiny one for you. `rerender({ value: "sou" })` changes the props; `act(() => …)` wraps anything that changes state outside a user action.
- **A router.** A component that uses `useNavigate` or `Link` needs a router: `<MemoryRouter initialEntries={["/login"]}>` is one that lives in memory (no address bar). To check where the guest ended up, a tiny `LocationDisplay` prints `location.pathname + location.search` and the test reads it.
- **A cache.** A component that uses TanStack Query needs a `QueryClientProvider`. Give every test **its own client** (no data left over from the last test) with `retry: false` (a failing request must fail the test **now**, not after the app has politely tried three times). The only change we made to the app: `lib/queryClient.ts` exports `createQueryClient(overrides)`, and the app's own client is `createQueryClient()`; a test builds one with the app's real rules (the error toast included) and `retry: false`. `renderWithProviders` in `src/test/render.tsx` puts the cache, the router and `LocationDisplay` around a component.

### 8. MSW: a fake kitchen inside the test (Problem 2)

A test that calls the real API tests the school's kitchen, not your code. We measured it (slide 25): the main-courses category needs 3.2 seconds, a search is answered ten times and then refused (`429`, `Retry-After: 60`), and the login token dies after two minutes. Run the suite three or four times in a minute (watch mode does it for you) and the search tests go red with no change in the code. That is a **flaky** test: worse than no test, because people learn to press "run again" and then ignore a real red.

**MSW** (Mock Service Worker) answers instead of the network. In Node it catches `fetch` before it leaves the process; the page cannot tell. You describe the kitchen, not the plumbing:

```ts
// src/test/handlers.ts: the happy kitchen, one line per route the page uses
export const handlers = [
  http.get("/api/v1/enterprise/categories", () => HttpResponse.json(categories)),
  http.get("/api/v1/enterprise/dishes", () => HttpResponse.json(dishes)),
  // …login, search, cart, orders
];
// src/test/server.ts
export const server = setupServer(...handlers);
// src/test/setup.ts
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

A test that needs a broken kitchen puts one handler in front, for this test only (`server.resetHandlers()` brings the happy ones back):

```ts
server.use(http.get("/api/v1/enterprise/dishes", () => new HttpResponse(null, { status: 500 }), { once: true }));
```

The positions of the "server dial" (slide 29), each with a real test in `MenuPage.test.tsx`: the **happy** kitchen; a **slow** one (`await delay(1500)`: grey cards first, then the dishes); a **500** with `{ once: true }` (the first request fails, the retry works); a **network error** (`HttpResponse.error()`: the page cannot tell a broken kitchen from a closed one); and **429** with a `Retry-After` header on the search.

- **MSW 3 renamed an option, and the old name fails silently.** In MSW 2 it was `onUnhandledRequest`; in MSW 3 it is **`onUnhandledFrame`**, and the default is only to print a warning. `"error"` makes a request nobody planned fail the test: `[MSW] Error: intercepted a request without a matching request handler: • GET /…` and `TypeError: fetch failed`. Write the old name and MSW ignores it: no error at run time, and the safety net is off. **TypeScript notices** (`error TS2353: … 'onUnhandledRequest' does not exist in type …`): one more reason for `tsc -b` to cover the test files, as it does here.
- **Shapes come from the API's page, not from memory.** Our first `DELETE /learning/cart` handler answered `204` with no body. The page said "No connection. Try again.": `api()` reads JSON, an empty body is a `SyntaxError: Unexpected end of JSON input`, and the app's error toast calls anything that is not an `ApiError` "No connection". The Swagger page says the cart calls answer `200` with the cart.
- **`https` and `http` addresses.** Our handlers are relative (`/api/...`), like the code; jsdom's address (`http://localhost:3000`) is the base. A student's shop calls DummyJSON with its full address, so their handlers do too.

### 9. A clean table between tests (isolation)

**A test must not depend on another.** The stores live in memory: a Zustand store is a variable, and it outlives the test that filled it. Our first `setup.ts` said `localStorage.clear()` after each test (the session is saved there) and one test still failed: test 1 signed in, test 2 expects no session, and `localStorage.clear()` does not touch the variable. The message was `expected { token: 'token-123', user: { …(3) } } to be null`, green when run alone (`npx vitest run -t "password is wrong"`), red in the suite. The fix is in `afterEach` (slide 30): `useAuthStore.setState({ session: null })`, `useCartStore.setState({ items: [], notes: null })`, **then** `localStorage.clear()`. Same family: data shared by several tests (a `withSoup` array that one test changes in place: slide 14 shows a bug that makes an innocent test fail), and module-level caches (the phone check in `schemas/auth.ts` remembers every answer, so tests that need a fresh answer use a different number).

`setup.ts` also calls `cleanup()` (empties the page after each test), `server.resetHandlers()` and `vi.unstubAllGlobals()` (gives back what `vi.stubGlobal` replaced).

### 10. Fake timers

`useDebounce` waits 400 ms. A test that waits for real is slow and flaky. `vi.useFakeTimers()` replaces `setTimeout`: the clock stands still until the test moves it.

```ts
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());   // forget this and the next test's findBy hangs (we saw "Test timed out in 4000ms")

rerender({ value: "sou" });
act(() => void vi.advanceTimersByTime(399));
expect(result.current).toBe("so");     // one millisecond too early
act(() => void vi.advanceTimersByTime(1));
expect(result.current).toBe("sou");
```

The test can be exact to the millisecond (slide 31 lets you move a fake clock yourself and replays this test).

### 11. jsdom is not a browser

What we checked in a real test run on jsdom 30.1.3: it **has** `document`, `localStorage`, `sessionStorage`, `fetch` (Node's), `URL`, `FormData`, `MutationObserver`, `getComputedStyle`, `PointerEvent`, `WebSocket`, `AbortController`. It **lacks** `IntersectionObserver`, `ResizeObserver`, `matchMedia`, `Element.scrollIntoView`, `HTMLDialogElement.showModal` (the native `<dialog>` of L36), `navigator.clipboard`, `DataTransfer`, IndexedDB, `Worker`, `EventSource`, `Notification`, and **all layout**: every `getBoundingClientRect()` and `offsetWidth` is 0.

Our `MyOrders` (L35) watches the end of its list with an `IntersectionObserver`; its first test crashed with `ReferenceError: IntersectionObserver is not defined`, and the page in the report was empty (React unmounted everything). The cure is a fake the test provides: `src/test/intersection.ts` is a small class that remembers who watches what and lets the test say "that just came into view" (`vi.stubGlobal("IntersectionObserver", FakeObserver)`). Radix, on the other hand, needed **no** polyfill for the Sheet, the AlertDialog and the DropdownMenu (we tried all three).

### 12. The keyboard test, automatic

L36's four checks (the focus moves in, Tab stays inside, Esc closes, the focus goes back) are four tests in `CartSheet.test.tsx` ("for a guest who uses the keyboard"). **The same four tests on a plain `div` cart, the one before L36: four failures; on the `Sheet`: four passes** (slide 32, with the real messages: `<div aria-label="Your order" role="dialog" /> does not contain: <button />`, the focus escaping to the link of the page behind, the dialog still there after Esc, `Expected element with focus: <button>Your order · 3</button>, Received element with focus: <button>One less</button>`). Two honest details: the first version of the fourth test **passed on the div cart for the wrong reason** (nothing had moved the focus away from the button), and we fixed it by pressing Tab inside the cart first: read tests together and ask of each one whether it could pass by accident. And `modal={false}` on the `Sheet` does **not** break Tab looping (Radix's `FocusScope` loops regardless), so that edit would not have been a fair test of the test.

### 13. Breaking the code on purpose

**A test you have never seen fail is a test you cannot trust.** The habit: change the code so that it is wrong, run the tests, and see which one goes red (slide 14 has a lab for it, with the real reducer and the real twelve tests). The slide's results are not a simulation of a guess: we broke `cartReducer.ts` five ways, alone and in eight combinations, and ran the real Vitest; the lab gives the same result every time. Two things it teaches:
- an innocent test can fail because tests share data (the in-place bug breaks "removes the line when the quantity reaches zero", which never touched the bug);
- **a bug can pass every test.** Change `MAX_QTY` from 10 to 11 and all tests that quote the constant stay green, because they agree with whatever the code says. A rule of the restaurant must be written down **once, in plain numbers**, outside the code: `cartReducer.test.ts` has the test "stops at ten of a dish, whatever the code says", and with the limit at 11 it is the one that fails.

Tools that do this for you automatically are called **mutation testing** (Stryker is the usual one for JavaScript). We do not use it; the habit is what matters.

### 14. Coverage

`vitest run --coverage` prints a table of which lines ran (v8 provider; HTML in `coverage/`). Our project: 59.08% of the statements. Read it as **a map of what nobody has looked at yet** (`KitchenPage`, `RegisterPage`, `TableNotesPage`, the whole `pages/` folder at 27%), not as a score. **It cannot tell a weak test from a strong one** (slide 34, measured): a test that only renders and clicks `QuantityStepper`, and four tests that check it, both give 100% for the file; delete the `disabled` attribute and the first still passes while the second fails, and the coverage stays 100%. 100% with weak tests is worse than 60% with good ones, because it makes people stop looking. One setting that bit us: **Vitest writes no coverage report when a test fails** unless `coverage.reportOnFailure` is `true`, so the robot's artifact would be empty exactly when you need it.

### 15. The robot: GitHub Actions

`.github/workflows/ci.yml` is a list of what to do on a clean computer that GitHub lends you for a few minutes. Ours: when (`pull_request` and `push` to `main`); the least it may do (`permissions: contents: read`); on an `ubuntu-latest` machine: `actions/checkout`, `actions/setup-node` (Node 24, npm cache), `npm ci` (exactly what `package-lock.json` says), `npm run lint`, `npm run build` (types **and** the site), `npm run coverage`, and an upload of the report. **Every line is a command you already know; the one new idea is where it runs**: on a machine with none of your files and none of your habits. If it passes there, it passes for the teammate who pulls your branch. A red check blocks the Merge button when you tell the repository to require it (Settings, Branches or Rulesets, "Require status checks to pass before merging": the check is the job named `check`).

What breaks on the robot and not at home: a **file imported with the wrong letter case** (Windows and macOS do not mind, Linux does), a **date or number printed in your language** (the robot lives in UTC: the same moment, 2026-10-20 19:10 UTC, prints as 7:10 PM in UTC, 11:10 PM in Tbilisi and 3:10 PM in New York, and `20.10.2026` in German: do not assert on `toLocaleString()`), tests that depend on each other's **order**, and timing (the hunt below).

**What real projects check** (slide 37; read from their workflow files with the GitHub CLI on 2026-10-22). Zustand `test.yml` is 29 lines: format, types, ESLint, Vitest, build. Vite `ci.yml` is 185 lines: oxlint, a format check, types, Vitest, builds, real-browser tests (Playwright on Chrome), docs, on Node 20, 22, 24 and 26 on Linux, and on Node 24 on macOS and Windows. TanStack Query `pr.yml` is 84 lines: `nx affected` over ESLint and oxlint, unused-code and dead-link checks, library tests, types, build. All four run the same core, and ours is not a toy. Look at **how** their files are written: `permissions: {}` (nothing at all), and each action pinned to a **commit hash** (`actions/checkout@3d3c42e5…  # v7.0.1`) where ours says `@v7`. A tag can be moved, a hash cannot: why that matters is the Security Day. (Ours uses tags on purpose, to be readable.)

### 16. What to test, and what not

Test what a wrong answer costs: money, orders, login, rules (the cart, the limit, the roles), and every state the guest can meet (loading, empty, error, slow). Test the **behaviour** a guest sees, not the implementation (not the name of a state variable, not a CSS class). Do not test the library (`useState` works), the look (jsdom cannot see it), or what is already guaranteed by types. A good test fails for one reason, says which, and survives a refactor.

### 17. A flaky-test hunt (and what we changed)

We hunted our own suite. Six runs in a row: green. Then **four copies at once on an 8-core laptop**, to starve each other, the way a busy school laptop or a shared robot would: with Vitest's and Testing Library's defaults 5 to 9 tests per copy failed. Three causes, three cheap fixes: the first test of a file pays for loading the app's code and Vitest gives a test 5 seconds (`testTimeout: 15_000`); `findBy` gives up after one second (`configure({ asyncUtilTimeout: 5000 })` in `setup.ts`); and one test, "disables the button while it is signing in", **raced a 150 ms sleep** in its fake server (the button had already stopped being disabled when the assertion ran), now replaced by a promise that the test itself resolves when it is ready (a "gate"). After that: zero failures in twelve runs. Tell this story: a test that depends on a sleep is a race, and it loses on somebody's machine.

### Check yourself

1. What are the three parts of a test? → Arrange (the starting point), act (one thing), assert (what you expect).
2. Why `getByRole("button", { name: "One more" })` and not `.stepper__btn:last-child`? → The role and name only break when the guest loses something; the class breaks when a designer renames it, and the position finds the wrong button when two are swapped (slide 16, with the real library).
3. What does `queryByText` return for something that is not there? → `null`; `getByText` throws.
4. A `findByText` takes longer than a second. What happens? → It gives up (`Unable to find an element…`, after about 1006 ms). Say how long you will wait, or ask why it is slow.
5. What goes wrong if you forget `await` before `user.click`? → The check runs before the click: `called 1 times, but got 0 times`.
6. Why use MSW instead of calling the real API? → The real one is slow, limited, changing and not yours; a fake can be set to slow, broken or closed, on demand.
7. What does `onUnhandledFrame: "error"` do, and what happens if you write the old name? → A request nobody planned fails the test; with the old name MSW 3 ignores it (TypeScript flags it).
8. A test passes alone and fails in the suite. First suspect? → A shared variable in memory (a store, an array) that an earlier test left behind: reset it in `afterEach`.
9. 100% coverage, and a bug that no test catches. How? → Coverage counts lines that ran, not lines that were checked: a test with no `expect` (or one that quotes the constant it should check) runs everything and proves nothing.
10. What does the robot add that your laptop does not have? → A clean machine nobody owns: no leftovers, a fresh install, a different file system and time zone, and a check that blocks the merge.

Further reading: the Testing Library docs ("Guiding Principles", "About Queries" with the priority, "Common mistakes with React Testing Library"), the Vitest guide, the MSW documentation (the page about migrating from 2 to 3), `actionlint`, and the workflow files of Vite, Zustand and TanStack Query on GitHub.

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting; the test plan; the route as a git log; the real terminal of `npm test` unveiled |
| 0:03 | Questions | 5–6 | Backup questions (the dialog's name is what a test looks for); the keyboard run of v1.0, timed |
| 0:11 | Problem 1 | 7–9 | **It worked yesterday**; **release day** (check by hand, or run the tests); "What would we need?" |
| 0:16 | Solution 1 | 10–21 | Arrange, act, assert (walk the lines); **put the test in order**; Jest or Vitest (the real chart); set it up (live); **break it on purpose** (the lab); **reading a failing test**; **find things like a guest** (the refactor lab, with the real library); **the query playground**; three real login pages; **predict, then run**; **the waiting game**; test a form (live) |
| 0:40 | Classwork 1 | 22 | The first tests of their shop |
| 0:55 | Break | 23 | |
| 1:05 | Problem 2 | 24–26 | **Whose kitchen is this** (the real 429); **run the tests against the real kitchen**; "What would we need now?" |
| 1:10 | Solution 2 | 27–39 | The fake kitchen (schema); the recipe (live); **the server dial**; **passes alone, fails together**; **move the clock yourself**; **the keyboard test, two carts**; jsdom is not a browser; **what the tests never touch**; the robot (the workflow, step by step); **push a commit, watch the checks**; what real projects check; mistakes; quiz |
| 1:32 | Classwork 2 with AI | 40 | Students prompt an AI for tests, then break their code to test the tests |
| 1:47 | Masterclass | 41–43 | One prompt rebuilds Le Bistro v1.1 |
| 1:55 | Wrap-up | 44–48 | Recap, flip cards, homework, eleven lectures one restaurant, next time |


**Both halves are dense: Solution 1 has 12 slides in 24 minutes and Problem 2 + Solution 2 have 16 in 27. Running late?** Slide 12 (the chart) in one sentence; skip 11 (put in order) and 19 (predict; do cards 2 and 4 only); fold 18 (real pages) into 17; in 20 only run `getByText` and `findByText`. In the second half, say 33 (jsdom) with the red error only, skip 31 (the clock) and 37 (real CI files) and 39 (the quiz), and at 38 read one mistake aloud. **Never skip** 8 (release day), 14 (break it on purpose), 15 (reading a failure), 16 and 17 (queries), 25 (the real kitchen), 27–29 (the fake kitchen and the dial), 30 (passes alone), 32 (two carts), 35–36 (the robot) or the classworks. In the Masterclass, show the parts (slide 41) and the short version (slide 43), and skip the live run.

---

## Classwork 2 with AI and the Masterclass

**Classwork 2 with AI** (slide 40, 15 minutes). The task is tests for the logic of the cart and for one component (Base); the product list with MSW (loading, an error with retry, empty) and a `ci.yml` (Plus); breaking the code three ways and asking which tests noticed, then asking the AI for tests that catch what escaped (Pro). The students write a five-part prompt (**CRAFT**) and the AI writes the code.
- The check is **not** "do the tests pass". It is: **break your code on purpose** and see which tests go red. Walk around and ask: "break one line of your cart: which test caught it?" If the answer is "none", the AI wrote a test with no `expect`, a test that mocks the thing it tests, or a snapshot.
- The AI's usual mistakes (MSW 1 syntax, `jest.fn()`, `fireEvent`, `getByTestId` everywhere, a snapshot of everything, a click with no `await`, `waitFor` around a `getBy`, a test with no `expect`) and the follow-up prompts are in [`classwork.md`](classwork.md).

**Masterclass** (slides 41–43, 8 minutes). One prompt rebuilds Le Bistro as it is after today:
1. **The prompt, part by part.** Each press opens one part; for each, one sentence: what would the AI do without it?
2. **Run it, then check it.** Show the answer and go through the five checks, ending with "break the code three ways".
3. **The short version.** The same five parts as one paragraph; each part lights up.

**Before class:** run the Masterclass prompt once and keep the answer open. The exact texts are in [`masterclass.md`](masterclass.md).

---

## The demos

All of them run in the page, offline, with real logic. **Click once inside the demo first** (the deck's keys are switched off inside the ones with a text box).

| Slide | Demo | How |
|---|---|---|
| 8 | Release day | Pick Monday's change (A: rename a CSS class, B: tidy the cart code, C: tidy the login page). Click the ten flows one by one: each costs what it costs a careful person; the clock counts. Flow 6 or 8 is broken (B or C) and most people never click it. Then "Run the tests": the bar runs faster than real time, its clock counts to the real duration of the suite (12 seconds), and the real failing test name appears |
| 11 | Put the test in order | Drag five lines of a real test (or use the arrow keys); "Check order", "Show answer" |
| 12 | The npm chart | Hover; click a name in the legend to show or hide a line; the chart marks where Vitest passes Jest; on the right the last full week |
| 14 | Break it on purpose | Tick a bug and watch the real twelve tests of `cartReducer` re-run. Try them all; try two at once; tick "in place" (a second, innocent test fails); "limit eleven" (nothing fails) and then the last box, the test that says ten in plain numbers |
| 15 | Reading a failing test | Click the five parts of the real report, or the numbered buttons |
| 16 | Which query survives a change? | Click the four columns: today, classes renamed, buttons swapped, `div` instead of `button`. The table is computed by the real Testing Library on the little stepper |
| 17 | Query playground | Choose a page, type a query (or click an example), Run or Ctrl+Enter. The element is outlined, or the real error appears. Four pages: Le Bistro, a GitHub-like, a Wikipedia-like, a Hacker News-like |
| 18 | Three real login pages | Press next: each real site's measured results; the last card is the lesson |
| 19 | Predict, then run | Six small tests: click "passes" or "fails" first, then read the real output |
| 20 | The waiting game | Set how long the kitchen needs, then ask for the dish four ways (real `getByText`, `queryByText`, `findByText`, `waitFor`, real timers). Try 400 ms, then 1500 ms |
| 25 | The real kitchen | "Run the suite" a few times: one test is red every time (3.2 s against `findBy`'s 1 s); after the third run the searches go red with 429; "A minute passes" resets it |
| 29 | The server dial | Turn the dial (Happy, Slow, Error 500, Offline, Too many searches) and use the page: filters, search, "Try again". Each position shows the real handler and the real assertion |
| 30 | Passes alone, fails together | "Run only test 2" (green), "Run all three" (red), tick "afterEach: empty the store" and run again |
| 31 | Move the clock yourself | Type s-o-u-p, press +399 ms (nothing sent), +1 ms (one search); then "Replay this test" |
| 32 | Two carts | "div" (four red) and "Sheet" (four green); click a row to read the real message |
| 34 | What the tests never touch | The real coverage by folder (click one for its files); the two tests of the stepper, with and without the deleted line |
| 36 | Push a commit | "Push tidy (it has the bug)": lint and build pass, the test fails, Merge is blocked. "Push the fix": green, Merge wakes up |
| 37 | Real CI files | "Compare all", "What ours lacks", then each project's real lines |
| 40 | The sample prompt | Click the blurred box on the Classwork 2 slide |
| 41 | The prompt, part by part | Press next five times; **Copy** copies the whole prompt with its five labels |
| 43 | The short version | Press next: each part lights up; **Copy** copies the paragraph |

---

## The live build, step by step

You build Le Bistro v1.0 into v1.1. Do not type everything: **type** the config, the setup file, three small tests and `renderWithProviders`; **copy** the rest from `code/after-L37`.

Part 1 (before the break):

1. **Install** (slide 13; done before class), then **the config and `src/test/setup.ts`** (jest-dom, `cleanup`). `npm test`: "No test files found".
2. **`cartReducer.test.ts`** (slides 10, 14): the first test, then the `it.each`. Run it. Then **break the reducer on purpose** (delete the menu check), watch the report (slide 15), put it back.
3. **`QuantityStepper.test.tsx`** (slide 16): `render`, `getByRole`, `await user.click`, a spy. Try `getByText("+")` and see that it also works; explain why role and name are better.
4. **`LoginPage.test.tsx`** (slide 21): `MemoryRouter`, press "Sign in", find the two alerts.

**Checkpoint 1:** `git commit -am "L37: first tests"`.

Part 2 (after the break):

5. **The fake kitchen** (slide 28): `handlers.ts`, `server.ts`, and the three lines in `setup.ts` (with `onUnhandledFrame: "error"`). Add `createQueryClient()` to `lib/queryClient.ts` and `renderWithProviders` in `src/test/render.tsx` (copy).
6. **`MenuPage.test.tsx`** (slide 29): loading and dishes, then one `server.use(...)` for a 500 with `{ once: true }` and the retry, then 429.
7. **The clean table** (slide 30): run the login tests in order and see the pollution failure; add the `afterEach` resets to `setup.ts`.
8. **`useDebounce.test.ts`** (slide 31): fake timers, `act`, `advanceTimersByTime`.
9. **`CartSheet.test.tsx`** (slide 32): copy it; run the four keyboard tests.
10. **Coverage and the robot** (slides 34–36): `npm run coverage`; copy `.github/workflows/ci.yml`; push, open a pull request, watch the checks. Break something in the pull request: red. Fix it: green.

**Checkpoint 2:** your app equals `code/after-L37`. `git commit -am "L37: tests, a fake kitchen, a robot"`.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| `No test files found, exiting with code 1` (and the pattern it looked for: `**/*.{test,spec}.?(c|m)[jt]s?(x)`) | the file is not named `*.test.ts(x)`, or the filter you typed matches nothing | rename it; on purpose, the robot should be worried when there are no tests |
| `ReferenceError: describe is not defined` | the file does not import `describe`, `it`, `expect` from `"vitest"` (globals are off) | `import { describe, expect, it } from "vitest"` |
| `Error: Invalid Chai property: toBeInTheDocument` | the jest-dom matchers are not loaded | `import "@testing-library/jest-dom/vitest"` in `src/test/setup.ts`, and `setupFiles` in the config |
| `TestingLibraryElementError: Found multiple elements with the role "button" and name "Add"` in the **second** test | nothing empties the page between tests (no `cleanup()`, and globals are off) | `afterEach(() => cleanup())` in the setup file |
| the same message in **one** test | two elements really match (two steppers, two "Sign in" buttons) | a more exact name (`{ name: "Sign in" }`), `getAllByRole`, or `within` |
| `Unable to find an accessible element with the role "textbox" and name "Password"` | a password field has no `textbox` role | `getByLabelText("Password")` |
| `Unable to find an element with the text: …` right after `render` | the text arrives later | `await screen.findByText(…)` |
| `expected "vi.fn()" to be called 1 times, but got 0 times` | a `user.click` without `await` | `await user.click(…)` |
| `Test timed out in 4000ms` in the test **after** one that uses fake timers | `vi.useFakeTimers()` was never undone, and `findBy` waits with real time | `afterEach(() => vi.useRealTimers())` |
| `TypeError: Failed to parse URL from /api/v1/…` | the code fetches a relative URL and no fake server answers | start the MSW server in the setup file (`server.listen`) |
| `[MSW] Error: intercepted a request without a matching request handler: • GET /…` | a request nobody planned (that is what `onUnhandledFrame: "error"` is for) | add a handler, or `server.use(…)` in that test |
| nothing happens for an unplanned request, only a warning | `onUnhandledRequest` (the MSW 2 name) is ignored by MSW 3 | `onUnhandledFrame: "error"`; run `tsc -b` over the tests: `TS2353` |
| the page says "No connection. Try again." in a test | the fake answered with the wrong shape (a `204` with no body where the page reads JSON: `SyntaxError: Unexpected end of JSON input`) | copy the shape from the API's page |
| `ReferenceError: IntersectionObserver is not defined` | jsdom has none | a fake (`src/test/intersection.ts`) |
| `expected { token: … } to be null`: green alone, red in the suite | a store keeps the last test's state | reset it in `afterEach` |
| a test is red on the robot, green at home | letter case of an import, a date or number format, the order of the tests, a slow machine | read the log of the red step; reproduce with the same Node, with `npm ci` |
| `Test timed out in 5000ms` only on a slow or busy machine | the first test of a file pays for loading the code | `testTimeout: 15_000` in the config |
| a `findBy` fails with "Unable to find" only on a busy machine | one second is the default | `configure({ asyncUtilTimeout: 5000 })` in the setup file, once |
| the coverage artifact is empty when a test fails | Vitest writes no report on failure by default | `coverage: { reportOnFailure: true }` |
| `MISSING DEPENDENCY  Cannot find dependency 'jsdom'` (then `Failed to start forks worker`) | `jsdom` is not installed, but the config asks for it | `npm install -D jsdom` |
| `Error: Cannot find package '@testing-library/dom' imported from …/@testing-library/jest-dom/…` | `@testing-library/dom` is a peer dependency of the React package, and jest-dom needs it too | `npm install -D @testing-library/dom` |
| the pull request shows no checks | the workflow file is not in `.github/workflows/`, or the branch has no pull request | check the path and open the pull request |

---

## Questions students ask

- **"Do I test everything?"** No. Test what a wrong answer costs: the cart, the rules, login, every state the guest can meet. Not the library, not the look.
- **"Why `getByRole` and not a class?"** The class breaks when a designer renames it; the role and name break when the guest loses a button. And it makes you write accessible markup (L36).
- **"Why not `getByTestId` everywhere?"** The guest cannot see it, and the test passes while the page is unusable. It is the last resort, for things with no role and no text.
- **"Jest or Vitest?"** Look it up (slide 12). Vitest uses your Vite config, so there is nothing to translate; the API is nearly the same.
- **"What about snapshot tests?"** A snapshot says "it looks like it did"; it cannot say it is right, and it fails on every harmless change, so people press "update" without reading. Use them rarely, for small, stable output.
- **"Do mocks make the tests lie?"** A fake server is only as good as the shapes you copy into it, so copy them from the API's documentation, and keep a few real end-to-end checks (a different lecture).
- **"Can't the AI write all my tests?"** It can write them, and the checks are yours: break your code and see which one goes red. A test with no `expect` or one that mocks the thing it tests is green and worthless.
- **"Why is my test slow?"** Most of the time is jsdom being created for each file (we measured: about half), not your tests. Pure-function tests take milliseconds.
- **"Is 100% coverage the goal?"** No: it is a floor, and it can be reached with tests that check nothing.
- **"What is Playwright for, then?"** A real browser, from the outside: layout, colour, the whole journey. It is the top of the pyramid, and a different lecture.
- **"Why does the robot run `npm ci` and not `npm install`?"** `ci` installs exactly the lockfile and fails if it does not match: no surprise versions.
