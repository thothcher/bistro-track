# The Le Bistro track · React lectures L27–L31

Five React lectures (syllabus v2: L27–L31, from components to context), built for **lecturers who are new to React**. Each lecture comes with a deck, a lecturer guide that teaches the topic first, classwork and homework sheets, and a checked code snapshot.

> **Update: the track now has ten lectures.** L27–L31 are described below as they were written. The second five, **L32–L36** (Zustand, forms, TanStack Query, changing data, accessible UI with shadcn/ui), have [their own section](#the-second-five-l32-to-l36) and are built the same way. In the current master syllabus a new React introduction became L28, so the five lectures of the table below are **L29–L33** there, and the second five are **L34–L38**.

- **The lecturer builds Le Bistro** live, the restaurant site of IT Step ([srms.stepacademy.ge](https://srms.stepacademy.ge)), on its real teaching API. One piece per lecture.
- **The students build their own shop** on the free DummyJSON API, one version per lecture, from the first React lecture to Demo Day (L42). See [`student-project.md`](student-project.md).
- **New to React or to these decks?** Read [`lecturer-handbook.md`](lecturer-handbook.md) once, then each lecture's `guide.md` before class.

| Lecture | Deck | Theme | Le Bistro gets | Students' shop | Slides |
|---|---|---|---|---|---|
| L27 | [Mise en place](L27-components/index.html) | Components, JSX, props, lists and keys | A home page and a menu from components and a data file | v0.1 · a catalog from a data file | 45 |
| L28 | [À la minute](L28-state/index.html) | `useState`, events, lifting state, derived values | A working cart, a stepper, filter chips, search | v0.2 · cart, filters, search | 44 |
| L29 | [Le marché](L29-effects/index.html) | `useEffect`, fetching, race conditions, custom hooks, `useRef` | The real menu from the API, skeletons, a debounced search, a cart that survives F5 | v0.3 · real API, saved cart | 45 |
| L30 | [La maison](L30-routing/index.html) | React Router, params, search params, login, guards | Pages, a page per dish, a login, staff-only doors | v0.4 · pages and a login | 41 |
| L31 | [Le passe](L31-context/index.html) | Context, `useReducer`, compound components | One cart and one session for the whole site, an FAQ | v0.5 · context and a reducer | 46 |

TypeScript (L26) comes before this track and is not part of it.

## The second five: L32 to L36

| Lecture | Deck | Theme | Le Bistro gets | Students' shop | Slides | Syllabus |
|---|---|---|---|---|---|---|
| L32 | [Le garde-manger](L32-zustand/index.html) | Zustand: stores, selectors, `persist`, `getState`; where does this state live? | The cart and the session in stores, not providers | v0.6 · a store, not a provider | 44 | L34 |
| L33 | [Le bon de commande](L33-forms/index.html) | React Hook Form and Zod: schemas, errors, dynamic lists, steps | A sign-up, a login, table notes | v0.7 · forms with a schema | 44 | L35 |
| L34 | [La chambre froide](L34-query/index.html) | TanStack Query: reading, keys, fresh and stale, prefetch, polling | The menu fetched once, a cache in the DevTools | v0.8 · a cache for the API | 43 | L36 |
| L35 | [Le serveur](L35-mutations/index.html) | TanStack Query: mutations, invalidation, optimistic updates, infinite lists | "Send to the kitchen", "My orders", the kitchen's buttons | v0.9 · orders and optimistic UI | 41 | L37 |
| L36 | [Le couvert](L36-ui/index.html) | Accessible UI and shadcn/ui: focus, dialogs, tokens, Radix | A cart for the keyboard, dialogs, a menu, Sonner | v1.0 · accessible components | 45 | L38 |

The shape is the same as above (same blocks, same timings, same files), and `code/after-L31` is the starting point of L32. What is new:

- **The students' versions v0.6 to v1.0** are described in [`student-project.md`](student-project.md) (section 3b).
- **Demos with real keys.** In L36 the keyboard lab, the menu and the token checker react to the real keyboard; the deck ignores its own shortcuts inside them. Click once inside a demo before using the keys.
- **Authenticated flows were not tested on the live server.** Sign-in, the cart, orders, the kitchen queue and the profile are built from the API's Swagger description and checked against a local stand-in. Run each flow once with a test account before L32, L35 and L36 (the access token lives 2 minutes).
- **Dependencies to know:** `@hookform/resolvers` must be version 5 (version 6 fails to install with npm 11: `ERESOLVE`); the L36 live setup needs internet (the shadcn CLI contacts its registry).
- **Some documents of the first five still use the numbers from before the syllabus changed:** Demo Day L42 is now L45, and the Admin Dashboard L39–L42 is now L42–L45. The contents of the lectures are not affected.

## The third five: L37 to L41

| Lecture | Deck | Theme | Le Bistro gets | Students' shop | Slides | Syllabus |
|---|---|---|---|---|---|---|
| L37 | [Le goûteur](L37-testing/index.html) | Testing React: Vitest, Testing Library, MSW, what jsdom cannot see, coverage, a CI check | 115 tests, a fake kitchen, a GitHub Actions workflow | v1.1 · tests and a CI check | 48 | L39 |
| L38 | [Le coup de feu](L38-performance/index.html) | Speed and resilience: renders (React Scan, the Profiler), the React Compiler, `memo`, bundles, `lazy`, error boundaries, transitions, virtual lists, a size budget | A search box that does not lose letters, lazy pages, boundaries, a kitchen with 800 orders, a size check in CI | v1.2 · measured, faster, harder to break | 54 | L40 |

The shape, the timings and the files are the same. What is new:

- **Every deck has its own look.** The decks of the third five share the engine but not the paint: each one has its own colours, fonts, cover and motifs (L37 is a QA lab on graph paper). The shared part is [`_kit/kit.css`](_kit/kit.css) (the components of `track.css`, driven by tokens); each deck adds a `skin.css` that sets the tokens. `track.css` and `_shared/` were not changed.
- **Demos you work with, and real websites to compare.** Every deck has eight to ten hands-on demos (labs you type into, simulators, sorting and prediction tasks) and a comparison with real websites or projects, with the numbers, the date they were measured and instructions to open the same thing in class. Nothing is copied from those sites: the slides redraw a small version.
- **`code/after-L36` is the starting point of L37.** The snapshots `code/after-L37/ …` follow. L37 needs Node 22.12, 24 or 26 and newer (the `engines` of Vitest 5), and its CI workflow has not been run on GitHub: push it to a practice repository before class.
- **L38 is built from `code/after-L37`** and ends at `code/after-L38`. Five of its demos run real React inside the slide (`L38-performance/vendor/perf-lab.js`). Its numbers (renders, kilobytes, milliseconds) were measured on one laptop on 2026-10-22: the guide says how, and what was **not** measured (the time the photos take on a slow network). The staff kitchen page was not called on the live API.

## Every lecture has the same shape

| Block | Time | What happens |
|---|---|---|
| Hello | 3′ | Bonjour, today's menu, the road map (Le Bistro and the students' shop), the goal behind a curtain |
| Questions | 8′ | Questions from last time (answers revealed on click), two students show their homework |
| Problem 1 | 5′ | Something hurts before the new tool appears: a dark photo slide, then an interactive demo of the problem, then "What would we need?" |
| Solution 1 | 24′ | The new tool as schemas you reveal step by step, then recipe slides: the steps on the left, the code growing on the right. Mistakes with their real error messages, a quick quiz |
| Classwork 1 | 15′ | On their own shop, in three tiers (Base, Plus, Pro), with a timer and a hidden hint |
| Break | 10′ | The "Start the break" button: countdown, music, "Welcome back" |
| Problem 2 → Solution 2 | 27′ | The same pattern for the second topic |
| Classwork 2 with AI | 15′ | The same kind of task, but the students write a prompt in five parts (**CRAFT**: Context, Role, Action, Format, Target), the AI writes the code, and they check it |
| Masterclass | 8′ | One prompt rebuilds the whole Le Bistro so far: it opens part by part, gets run and checked against today's topics, then comes back as one short paragraph |
| Wrap-up | 5′ | Recap, flip cards, homework, and a teaser that plants the next lecture's problem |

L27 is the exception: a 7-minute hello (the students' project brief) and a short CRAFT introduction before its Classwork 2. The rail at the top of every slide shows where you are in this structure. Each lecture's problem is planted by the lecture before it: L30 ends with "count the props", and L31 starts by counting them.

## Folders

```
bistro-track/
  index.html              start page: the five decks and their documents
  README.md               this file
  lecturer-handbook.md    setup, how to run a lecture, live-coding safety, React cheat sheet
  student-project.md      the students' brief: themes, DummyJSON, milestones v0.1–v0.5, rules, grading
  L27-components/ … L31-context/
    index.html            the deck
    guide.md              the lecturer guide: learn it first, the 120 minutes, the demos, the live build, fixes
    classwork.md          the two classworks with code hints and common problems
    homework.md           the homework brief and grading
    masterclass.md        the Masterclass script: the prompt, the short version, what to check
  code/
    after-L27/ … after-L31/   Le Bistro at the end of each lecture: complete Vite projects (npm install && npm run dev)
  img/                    photos, screenshots, covers
  track.css, track.js     the Le Bistro look and the schema/wire engine shared by the five decks
  _shared/                the deck engine: deck.js, deck.css, icons, Prism, the break player, Le Bistro data and dish photos
```

The second five add the same files in `L32-zustand/ … L36-ui/` (deck, guide, classwork, homework, masterclass), the snapshots `code/after-L32/ … after-L36/`, and the covers `img/covers/L32.jpg … L36.jpg`. The third five do the same from `L37-testing/`, plus a `skin.css` in each deck folder and the shared `_kit/kit.css`.

The folder is self-contained: download or clone it, open `index.html` (or any deck) straight from the file system. No server and no install are needed for the decks; only the code snapshots need `npm install`.

## Presenting

Open a deck in **Chrome or Edge** and press `F` for fullscreen.

| Key | Action |
|---|---|
| `→` `Space` `PageDown` | Next step or slide (clickers work) |
| `←` `PageUp` | Previous |
| `N` | Speaker notes on the shared screen |
| `P` | Presenter window (notes, next slide, timer): drag it to your laptop screen |
| `O` | Overview of all slides |
| `B` | Coffee break (also the coffee button, and "Start the break" on the break slide) |
| `C` | Hide the chrome |
| `1`–`4` | Answer the quiz on the current slide |
| `?` | Help |

Things to click in the decks:

- **Copy** on a code block copies exactly the lines that are visible at that step: paste it into the editor while live-coding.
- **Copy** on a Masterclass prompt copies the whole prompt (with its CRAFT labels on the first slide, as one paragraph on the last). The sample prompt on the Classwork 2 slide is blurred until clicked.
- **"[ show answer ]"** on question cards, **"click for a hint"** on classwork slides, **flip cards** in the wrap-up.
- **Demos** (a fake browser, a route matcher, a ticket rail, …): every one is described in the guide's "The demos" table and in the slide's notes.
- **Timers** on classwork slides: press play.

The speaker notes (`N`, or the presenter window `P`) are labelled **Say**, **Do**, **Ask**, **Expect** and **If asked**.

## The code snapshots

`code/after-LXX` is Le Bistro exactly as it should be at the end of lecture LXX, and the starting point of the next one. Each folder has its own README (what's new, how to run, how to deploy). Use them to:

- prepare: run the snapshot before class and read the files the guide names;
- recover: if your live code breaks, copy the files from the previous snapshot and carry on;
- copy: the guide says which files to copy rather than type.

From L29 on, the menu comes from `https://srmsapi.stepacademy.ge` through the Vite proxy (`vite.config.ts`); from L30 on, `vercel.json` does the same on Vercel.

## How it was checked

- **Code:** every snapshot was type-checked (`tsc -b`), built (`vite build`) and linted with oxlint (react plugin, `only-export-components`) and eslint-plugin-react-hooks 7.1.1 (`recommended-latest`), with React 19.3.0, React Router 8.4.0, Vite 8.3.4, TypeScript 6.0.3 and Tailwind CSS 4.3.3. Zero errors, zero warnings. The apps were run in a browser against the live API through the proxy.
- **Students' code:** the code in the classwork sheets of L30 and L31 was compiled and linted the same way.
- **Decks:** every slide of the five decks was rendered at 1920×1080 at its last step, with no script errors and no content outside the slide.
- **Not tested live:** signing in to the Le Bistro API with the staff test accounts. The login flow follows the API's Swagger description; try it once before L30.

**The second five (L32–L36):**

- **Code:** every snapshot was type-checked, built and linted (oxlint and eslint-plugin-react-hooks 7.1.1), with React 19.3.1, React Router 8.5.0, Vite 8.3.4, TypeScript 6.0.3, Tailwind CSS 4.3.3, Zustand 5.0.15, React Hook Form 7.90.0, Zod 4.6.7, TanStack Query 5.104.5, Radix UI 1.8.1 and shadcn 4.22.1. The apps were run in a browser, with the keyboard where it matters, against a **local stand-in for the Le Bistro API** that follows its Swagger description. L36 was also audited with axe-core 4.14 (no violations on the pages and dialogs checked; the audit found and fixed four problems of the first version) and with `oxlint --jsx-a11y-plugin`.
- **Students' code:** the code in the classwork sheets was compiled and linted the same way (TypeScript 6, eslint-plugin-react-hooks 7.1.1), and the L35 snippets were also run in a browser, against a mock that returns the real DummyJSON shapes. The L36 snippets were compiled against the files shadcn generates; the same components run, with the keyboard, in the Le Bistro snapshot.
- **Decks:** every slide of the five decks was rendered at 1920×1080 at its last step with no script errors and no content outside the slide; every key press of a full run through each deck was checked; every interactive demo has a test script (real clicks and keys) that passes.
- **Not tested live:** everything that needs a signed-in Le Bistro account: sign-in, register, the server's cart, orders, the kitchen queue and its status changes, the profile. The numbers on the slides (54 ms against 800 ms, one order for a second press, 14 Tabs that never leave the sheet) were measured against the stand-in. Send one real order and open the kitchen page once before L35.

**The third five (L37–):**

- **L37, code:** `code/after-L37` was type-checked, built, linted and run on a clean `npm ci` copy: **115 tests in 17 files, about 12 seconds**, with Vitest 5.0.5, jsdom 30.1.3, Testing Library (react 16.3.3, dom 10.4.2, user-event 14.6.8, jest-dom 7.0.1) and MSW 3.0.3. The tests were tested by breaking the code (six single edits, each caught by exactly one test; five breaks of the reducer, alone and in eight combinations), and hunted for flakiness under load (four copies at once; twelve runs without a failure after two settings and a gate). The numbers on the slides come from those runs. **The CI workflow was checked with `actionlint` but has not run on GitHub.** The login, cart and order flows were tested against a fake API only.
- **L37, students' code:** the snippets of the classwork sheet were written as real files, type-checked, linted and run (16 passing tests).
- **L37, real sites:** three real login pages were measured with Testing Library's own queries in a browser (what a test could find by role, label or text), the weekly downloads come from api.npmjs.org, and the CI files of Zustand, Vite and TanStack Query were read with the GitHub API. All of it was collected in October 2026; the deck gives the date next to the numbers, and they will drift.
- **L37, deck:** 48 slides rendered at 1920×1080 at their last step with no script errors and no content outside the slide; 92 demo checks (real clicks and keys) pass.
- **L38, code:** `code/after-L38` was type-checked, built, linted (oxlint: exit 0), size-checked (160.3 kB against a 170 kB budget) and run on a clean `npm ci` copy: **151 tests in 26 files** pass (about 43 seconds with two workers on a laptop short of memory), with React 19, Vite 8.3.5, `babel-plugin-react-compiler` 1.0.0, `react-error-boundary` 6.1.6 and `@tanstack/react-virtual` 3.14. Four deliberate breakages (no card boundary, no `resetKeys`, no reload guard, no "follow the address" block) were each caught by 1 to 2 tests. **The CI workflow with its new `npm run size` step was checked with `actionlint` but has not run on GitHub.** The staff kitchen page and its queue were tested against a fake API only.
- **L38, students' code:** the snippets of the classwork sheet were written as real files, type-checked and linted with no warnings.
- **L38, numbers and real sites:** every number of the deck was measured on 2026-10-22 on the lecturer's laptop (Chrome, CPU slowed 4 or 6 times, local copies of the API, medians of several runs; four real pull requests against the budget, including one with `recharts` 3.10.1), and seven real public pages were loaded once, cold, with Playwright. **One thing was not measured:** the photos of the slow-network waterfall were served from disk by the test harness, so the deck shows only when they were asked for and gives the seconds as arithmetic. The Profiler needs a development or profiling build (it says "Profiling not supported" on a plain production build): the guide says so.
- **L38, deck:** 54 slides rendered at 1920×1080 at their last step with no script errors and no content outside the slide; every key press of a full run was checked; 72 demo checks (real clicks and keys, five labs running real React) pass.

## Credits

- **Le Bistro**: dish photos, data, screenshots and FAQ texts: IT Step Academy (srms.stepacademy.ge, srmsapi.stepacademy.ge).
- **Photo** of the stop button (L28): Unsplash, @hanswestbeek.
- **DummyJSON** ([dummyjson.com](https://dummyjson.com)) for the students' API.
- Icons: [Lucide](https://lucide.dev) (ISC). Syntax highlighting: [Prism](https://prismjs.com) (MIT). Fonts: Cormorant Garamond, Karla, JetBrains Mono (Google Fonts, OFL).
- The second five teach and use [Zustand](https://zustand.docs.pmnd.rs), [React Hook Form](https://react-hook-form.com), [Zod](https://zod.dev), [TanStack Query](https://tanstack.com/query), [Radix UI](https://www.radix-ui.com), [shadcn/ui](https://ui.shadcn.com) and [Sonner](https://sonner.emilkowal.ski); the L36 contrast and keyboard checks follow the [WCAG 2.2](https://www.w3.org/TR/WCAG22/) criteria and the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/). The problem and cover photos of the new decks are Le Bistro's own dish photos (IT Step Academy).
