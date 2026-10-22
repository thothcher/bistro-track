# L37 · Homework: your shop, version 1.1

**Due:** before the next lecture. **Submit:** the GitHub link and the Vercel link (and, for Pro, the links to a red check and a green check).

Version 1.1 adds nothing to look at. It puts a **net** under your shop, so that you can change it without fear. The next lectures measure it, attack it and extend it: each of them is safer with tests.

**Remember:** a test you have never seen fail is a test you cannot trust. Break your code on purpose, and write down what happened.

## Base (required)

1. **The tools, set up:** Vitest, jsdom, Testing Library, user-event and jest-dom installed; `test` in `vite.config.ts`; a `src/test/setup.ts` that loads the jest-dom matchers and calls `cleanup()` after each test; the scripts `npm test` and `npm run test:watch`.
2. **At least six tests, all green:** three for your cart logic (add, change the quantity or remove, the total), two for components (found by **role, label or text**, pressed with an **awaited** `userEvent`), one for a form or a hook (your search box's debounce with fake timers, or a form's error messages).
3. **Tests a stranger can read:** every test has a name that is a sentence; **no** `getByTestId`, **no** snapshot, every click and `type` awaited; no test needs another to run first (empty your stores in `beforeEach` or `afterEach`).
4. **A break-it table in the README:** three rows. Each says what you broke (which line you deleted or changed), and **which test went red**. If a test stayed green, say so, and add one that does not.
5. **The README says** how to run the tests (`npm test`) and, in a few lines, what they protect.

## Plus

- **A fake kitchen:** MSW for your product list (or whatever your shop fetches): a loading message, an error with a "Try again" that works (`{ once: true }`), and an empty list. The handlers use the **full address** of the API (`https://dummyjson.com/...`), the server is started with `onUnhandledFrame: "error"`, and each test gets its own `QueryClient` with `retry: false`.

## Pro

- **A robot:** a `.github/workflows/ci.yml` that runs `npm ci`, lint, build and the tests on every pull request. Open a pull request with a bug in it: the check is **red**. Fix it: **green**. Put both links in the README. Add `npm run coverage` and say, in one sentence, one thing the report shows that you did not know.

## Before you submit

- [ ] `npm test` is green, with six tests or more
- [ ] You saw three tests fail on purpose, and the table in the README says which
- [ ] Search your tests for `getByTestId` and `toMatchSnapshot`: none
- [ ] Every `user.click` and `user.type` has `await` in front of it
- [ ] `npm run build` passes (it type-checks your tests too), the Vercel link works

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | The tools are set up, and at least six tests pass (three logic, two components, one form or hook) |
| 3 | The tests are good: sentence names, found by role, label or text, awaited, independent of each other, no test ids, no snapshots |
| 2 | The break-it table: three rows, each one true (you can show the red test) |
| 1 | The README: how to run the tests, and what they protect |
| 1 | Deployed and working |
| +1 | Plus: MSW, with loading, error with retry, and empty |
| +1 | Pro: a CI file, and a red and a green check |

**Heads-up:** the next lecture is about **speed**. It will measure your shop: how often a page renders, how big it is, how long a very long list takes. Every change it suggests is one that a test can protect, and one that a test can catch you breaking. Keep your tests green.
