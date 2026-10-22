# L38 · Homework: your shop, version 1.2

**Due:** before the next lecture. **Submit:** the GitHub link and the Vercel link (and, for Pro, a link to a red check and a green check).

Version 1.2 changes **nothing you can see**. It makes your shop quicker, and harder to break, and above all it puts **numbers** next to your claims. The next lectures attack your shop and extend it: a fast, strong base makes both easier.

**Remember:** no change without a number before it. Write the "before" first.

## Base (required)

1. **A table in the README**, at least two rows, with real numbers: the action (type three letters in the search, click a category, add a product, open the cart), **before**, **after**, and what you changed. The numbers are renders (React Scan or the Profiler), kilobytes (the build report, or `npm run size`) or elements in the page. Say how you measured (a preview, CPU slowed 4×).
2. **Lazy pages:** every page except the first ones is `lazy(() => import(…))`, with **one** `Suspense` and a skeleton. `npm run build` prints a file per page: paste the list in the README.
3. **An error boundary around the page** (`react-error-boundary`, with `resetKeys` and an `onError` that logs): a message, and the header stays. Show it working: make one page throw on purpose, take a screenshot, and put it back.
4. `npm test` and `npm run build` pass.

## Plus

- **Photos and a boundary per card:** `loading="lazy"` and `decoding="async"` on the images below the fold, `fetchPriority="high"` on the biggest picture of the first screen, and a boundary around each product card (a product with a `null` price becomes one grey card). **A test** for the card boundary, like `DishGrid.test.tsx` of `code/after-L38`.
- **A budget:** `scripts/check-size.mjs` with a limit from your own build (about 6 per cent above it), `npm run size`, and the step in `ci.yml`. In the README: the number, and one sentence on what you would do if a pull request failed it.

## Pro

- **Draw less:** your 194 products in a **virtual list** (`@tanstack/react-virtual`, a box with a fixed height, `aria-posinset` and `aria-setsize`) or **paged** (24 at a time). In the README: the number of elements in the page before and after (`document.getElementsByTagName("*").length`).
- **Survive a deploy:** a `vite:preloadError` handler that reloads once and not twice within ten seconds, **with a test** (a fake `reload`, like `lib/preloadError.test.ts`).
- **The compiler:** turn it on, run `scripts/compiler-report.mjs`, and write in the README: how many components were compiled, which were left alone and why, what it did to your build time, and your main file's size.

## Before you submit

- [ ] The table in the README has numbers for **before** and **after**, and says how you measured
- [ ] `npm run build` prints one file per page
- [ ] You broke something on purpose and saw the boundary: the screenshot is in the README
- [ ] `npm test` and `npm run build` pass, the Vercel link works

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | The table: at least two rows, real numbers, and how you measured; the change really is the one the table says |
| 3 | Lazy pages with one skeleton, and a build that prints a file per page |
| 2 | The boundary around the page, with `resetKeys` and `onError`, and the screenshot |
| 1 | Tests and build pass |
| 1 | Deployed and working |
| +1 | Plus: lazy photos, a boundary per card with a test, and a size budget in CI |
| +1 | Pro: a virtual list or paging with the element count, a tested `vite:preloadError` handler, or the compiler with its report |

**Heads-up:** the next lecture is the first **Security Day**. A shop that is fast and strong can still be robbed: from the code it sends to every guest, from a library it installed, from a token left in the browser. You will look at your own shop the way an attacker does. Bring your project, with its tests green: the tests you wrote in L37 are what lets you fix what you find.
