# Lecturer handbook · the Le Bistro track

For lecturers who teach L27–L31 and are new to React, or new to these decks. Read it once; after that, each lecture's `guide.md` is all you need.

> The track now continues with **L32–L36** (Zustand, forms, TanStack Query, accessible UI) and **L37–** (testing and what follows). Everything below applies to them too; section 9 adds what is specific to the second five, and section 10 what is specific to the third.

---

## 1. Set up once

| Tool | Why | Notes |
|---|---|---|
| **Node.js 24 LTS** | Vite, npm | React Router 8 needs Node **22.22 or newer**; Vite 8 needs 20.19+. Check with `node --version` |
| **VS Code** | Live coding | Extensions: Tailwind CSS IntelliSense, Prettier (format on save), oxc (shows oxlint warnings). Font size 20+ for the projector |
| **Chrome or Edge** | The decks, DevTools | Install **React Developer Tools** (Components tab) |
| **Git + GitHub** | Checkpoints, the class repo | One repo for your Le Bistro, a commit at every checkpoint |
| **Vercel account** | Deploys | Sign in with GitHub. Students deploy every week |

Then, once:

1. Open `bistro-track/README.md` and click through one deck with `N` (notes) and `P` (presenter window).
2. Run one snapshot: `cd bistro-track/code/after-L31`, `npm install`, `npm run dev`. If the menu loads, your network can reach the Le Bistro API.
3. Open https://srms.stepacademy.ge and https://srmsapi.stepacademy.ge/swagger. The Swagger page lists the test accounts and the API's deliberate traps.

## 2. Before each lecture (about 1 hour)

- [ ] **Learn it first** in the lecture's `guide.md` (35–40 minutes). It explains the topic from zero, with the exact code you will write.
- [ ] Run the previous snapshot (`code/after-L<n-1>`), or make sure your own Le Bistro matches it.
- [ ] Click through the deck once with the notes open (`N`). Try every demo: the guide's "The demos" table says what to click.
- [ ] Read "The live build, step by step": it says what to type and what to copy.
- [ ] Open `code/after-L<n>` in a second VS Code window: it's the answer key for today.
- [ ] Skim the students' homework links from last time, and pick two to show in "Questions".

## 3. How a lecture runs

Every lecture is 120 minutes with the same shape, shown by the rail at the top of the slides:

**Hello (3′) → Questions (8′) → Problem 1 (5′) → Solution 1 (24′) → Classwork 1 (15′) → Break (10′) → Problem 2 → Solution 2 (27′) → Classwork 2 with AI (15′) → Masterclass (8′) → Wrap-up (5′)**

- **The problem comes first.** Let the room feel it in the demo before you name the tool. Ask "What would we need?" and let them answer before you reveal the chips.
- **Schemas before code.** Reveal them step by step with `→`; every step has a sentence in the notes.
- **Recipes:** the steps on the left light up one by one, the code on the right grows with them (new lines are green). Type along, or press **Copy**: it copies exactly the visible lines.
- **Mistakes slides** show the real error text. When a student hits one, point back to the slide.
- **Classwork:** start the timer, walk around. The "Common problems" table in `classwork.md` covers what you will see. The hint on the slide is blurred until clicked.
- **Break:** press "Start the break" on the break slide (or `B`). Music, a countdown, and "Welcome back" at the end.
- **Classwork 2 with AI:** the students build the task by prompting an AI, in five parts (CRAFT), and check what it wrote. See section 5.
- **Masterclass:** one prompt rebuilds Le Bistro so far. Run it once before class and keep the answer open.
- **Wrap-up:** the teaser plants the next lecture's problem. Don't skip it.

Running late? Each guide names the slides you can skip.

## 4. Live-coding without fear

- **Start clean.** Begin each lecture from the previous snapshot or a commit that matches it: `git tag L30-start`.
- **Commit at every checkpoint** the guide names (`git commit -am "L30: pages and routes"`). If the code gets into a mess, `git checkout .` takes you back to the last checkpoint in a second.
- **Copy long files, type the idea.** The guides say which files to copy from `code/after-LXX` (CSS, long JSX). Type the few lines that carry the lesson.
- **Let TypeScript lead.** After deleting a prop or renaming something, save and follow the red lines; say aloud what each error means.
- **If the network fails** (L29–L31 use the real API): the deck demos work offline. Show the snapshot you ran earlier, or switch to a phone hotspot. The search endpoint allows 10 requests a minute per IP, and a classroom shares one IP: a 429 in class is part of the lesson.
- **Tokens expire after 2 minutes** (L30). Sign in right before you show a protected page.

## 5. AI in class: Classwork 2 and the Masterclass

**CRAFT** is the prompt structure used in every lecture. A good prompt answers five questions:

| | Part | The question | Example |
|---|---|---|---|
| C | Context | What exists already? | Vite + React 19 + TypeScript. My shop sells watches. Two products: (pasted) |
| R | Role | Who should answer? | A React teacher who writes code for beginners |
| A | Action | What exactly to do? | A ProductCard with a typed prop and a ProductGrid with map and key |
| F | Format | What should the answer look like? | Only new files, complete, with their paths |
| T | Target | Who is it for, when is it done? | For me, first React week. It must pass npm run build |

- **Classwork 2 with AI.** Same task as a normal classwork, but the students write the prompt and check the AI's code. The rules: read every line before it goes into the project; run it; a failing answer gets the exact error message as the next prompt; log everything in `AI.md`. Ask students to explain a line the AI wrote. Code they can't explain doesn't count.
- **The Masterclass.** One CRAFT prompt rebuilds the whole Le Bistro so far. Slide 1: the parts open one by one. Slide 2: run it, then check the answer with what the lecture taught. Slide 3: the short version, the same five parts as one paragraph. Each lecture's `masterclass.md` has the exact texts.
- **Why it works:** the students can only judge the AI's code because they learned the topic first. Every Masterclass check is something from the lecture.
- **Tools:** any AI chat works (Claude, ChatGPT, Copilot Chat). Students without access pair up.

## 6. Keys

| In a deck | | In VS Code | |
|---|---|---|---|
| `→` `Space` | next step | `Ctrl` `P` | open a file by name |
| `←` | previous | `Ctrl` `.` | quick fix (adds a missing import) |
| `N` | notes | `F2` | rename everywhere |
| `P` | presenter window | `F12` | go to definition |
| `O` | overview | `Ctrl` `` ` `` | terminal |
| `B` | break | `Ctrl` `Shift` `F` | search the project (e.g. `cart={`) |
| `F` | fullscreen | `Alt` `↑` `↓` | move a line |
| `1`–`4` | answer a quiz | `Ctrl` `+` | bigger font |

## 7. Students' projects

- The brief is [`student-project.md`](student-project.md). Put the link in the class chat at L27.
- **Check the live link, not screenshots.** Open the Vercel link, click through, press F5 on an inner page, open DevTools → Console.
- Grade with the table at the end of each `homework.md` (10 points + 2 bonus).
- Read AI.md. Ask a student to explain one function they wrote. Code they can't explain doesn't count.
- In "Questions", show two homeworks: one strong, one with a common mistake (with the student's permission).

## 8. React in one page

**Components.** A component is a function that returns JSX; React calls it. Names start with a capital letter. Props are its arguments: read-only, passed by the parent.

**Rendering.** Rendering = React calling your function to get the UI. It happens on the first show, and again whenever the component's state, its props or a context it reads change. React then updates only what changed on the page.

**State.** `const [value, setValue] = useState(initial)`. The setter stores the new value and schedules a re-render. Never change state in place: hand React a new array or object (`[...cart, item]`, `{ ...item, qty: 2 }`). Anything you can calculate from state (totals, filtered lists) is calculated during render, not stored.

**Events.** `onClick={handleClick}` or `onClick={() => add(dish)}`. Never `onClick={add(dish)}`: that runs during render.

**Lists.** `items.map((item) => <Card key={item.id} … />)`. The key is a stable id, not the index.

**Effects.** `useEffect(fn, [deps])` runs after render to sync with the outside world (fetch, timers, listeners, localStorage). The cleanup cancels what the effect started. `[]` = once; no array = after every render (usually a bug).

**Hooks rules.** Call hooks at the top level of a component or a custom hook, never inside conditions or loops. A custom hook (`useApi`, `useCart`) shares logic; every caller gets its own state.

**Where does this state live?**

| Kind | Example | Where |
|---|---|---|
| UI of one component | Is the cart panel open? | `useState` in that component |
| Shared by nearby components | Selected category and the list | Lifted to the closest common parent |
| Should survive F5 or be shareable | `?category=drinks`, `/menu/5` | The URL (router) |
| App-wide, changes now and then | Session, cart, theme | Context (+ `useReducer` for rules) |
| Data from a server | The menu | An effect today, TanStack Query from L34 |

**The errors you will meet most**

| Message | Cause |
|---|---|
| `Too many re-renders` | A setter called during render: `onClick={setQty(1)}` |
| `Each child in a list should have a unique "key" prop` | `map` without `key` |
| `Objects are not valid as a React child` | Rendering an object instead of a field: `{dish}` instead of `{dish.name}` |
| Hundreds of requests in Network | `fetch` in the component body, or an effect without dependencies |
| `has been blocked by CORS policy` | Calling the Le Bistro API directly instead of `/api` through the proxy |
| `React Hook useEffect has a missing dependency` | A value used inside the effect and not listed |
| `useHref() may be used only in the context of a <Router> component` | No `BrowserRouter`, or `react-router-dom` installed next to `react-router` |
| `useCart() must be used inside <CartProvider>` | The provider doesn't wrap the component |
| `npm warn EBADENGINE … react-router … node: '>=22.22.0'` | Node is too old: install Node 24 LTS |

Further reading: [react.dev/learn](https://react.dev/learn) (the official tutorial, chapters "Describing the UI" to "Escape Hatches") and [reactrouter.com](https://reactrouter.com) (declarative mode).

---

## 9. The second five (L32–L36) in one page

**What each lecture adds to Le Bistro.** L32 Zustand stores for the cart and the session. L33 forms with React Hook Form and Zod. L34 TanStack Query for reading data. L35 TanStack Query for changing data: mutations, optimistic updates, infinite lists. L36 accessible UI with shadcn/ui. The students' versions are v0.6 to v1.0.

**Versions the snapshots were checked with** (npm, October 2026): React 19.3.1, React Router 8.5.0, Vite 8.3.4, TypeScript 6.0.3 (TypeScript 7 exists; the snapshots stay on 6.0), Tailwind CSS 4.3.3, Zustand 5.0.15, React Hook Form 7.90.0, Zod 4.6.7, `@hookform/resolvers` **5.9.2**, TanStack Query 5.104.5, Radix UI 1.8.1, shadcn CLI 4.22.1, Sonner 2.0.8. Install `@hookform/resolvers@5`: version 6 fails with `ERESOLVE` on npm 11. Node 24 and npm 11 were used.

**Where does this state live? (the full table)**

| Kind | Example | Where |
|---|---|---|
| UI of one component | Is the cart panel open? | `useState` in that component |
| Shared by nearby components | Selected category and the list | Lifted to the closest common parent |
| Should survive F5 or be shareable | `?category=drinks`, `/menu/5` | The URL (router) |
| Many readers, changes now and then | The cart, the session | A Zustand store, read with selectors (L32); Context is fine for rare changes |
| A form while it is being filled | A sign-up | React Hook Form, with a Zod schema (L33) |
| Data from a server | The menu, my orders | TanStack Query: reading (L34), changing (L35) |

**Errors you will meet in the second five**

| Message | Cause |
|---|---|
| `npm error ERESOLVE … @hookform/resolvers` | version 6 of the resolvers: install `@hookform/resolvers@5` |
| `TS2769 · Property 'queryKey' is missing in type 'string[]'` | TanStack Query v4 syntax: `useQuery` takes one options object |
| `No QueryClient set, use QueryClientProvider to set one` | the provider is missing from `main.tsx` |
| `TS2559 · … has no properties in common with type 'UseMutationOptions<…>'` | `useMutation(fn, { … })`: v4 syntax; one options object |
| `Uncaught (in promise) ApiError` | `mutateAsync` without a `try`/`catch` |
| `✖ Validating import alias. Could not find valid path aliases…` | `shadcn init` before the `@/` alias exists (L36) |
| `TS2307 · Cannot find module '@/…'` | the alias `paths` are missing from a `tsconfig` file |

**Practical notes**

- **The API's account endpoints were not tested live.** Sign-in, the server's cart, orders, the kitchen queue and the profile are built from the Swagger description. Run the flow once with a test account before L32, L35 and L36. Tokens live 2 minutes.
- **L36 needs internet** for the live shadcn setup (the CLI contacts its registry) and, for the audit moment, the axe DevTools extension (or Lighthouse) in Chrome.
- **Accessibility lint:** `npx oxlint --jsx-a11y-plugin -D jsx-a11y src` (the rules are off in `npm run lint`).
- **Keyboard demos** in L36 use real keys: click once inside a demo before you press them.

---

## 10. The third five (L37–L41) in one page

**What each lecture adds to Le Bistro.** L37 (syllabus L39) tests: a net of 115 tests, a fake kitchen and a CI workflow. The students' version is v1.1.

**Every deck has its own look, on purpose.** The decks of the third five share the engine (`_shared/`), the track's component styles (through `_kit/kit.css`) and the lecture flow, but each has its own colours, fonts, cover and motifs, so that a lecture is recognised from the other side of the room. The look lives in the deck's `skin.css`; if a slide looks different from L27–L36, that is not a bug.

**Hands-on demos and real websites.** Each deck has eight to ten demos you or the students work with (the guide's "The demos" table says what to do in each) and one or two slides that compare with a real website or project. The numbers on those slides were measured on a given day (the date is on the slide); pages change, so open the real thing before you promise what it shows.

**Versions the L37 snapshot was checked with** (npm, October 2026): Vitest 5.0.5 and `@vitest/coverage-v8` 5.0.5, jsdom 30.1.3, `@testing-library/react` 16.3.3, `@testing-library/dom` 10.4.2, `@testing-library/user-event` 14.6.8, `@testing-library/jest-dom` 7.0.1, MSW 3.0.3 (React and the rest as in section 9). Vitest 5 needs Node 22.12, 24 or 26 and newer; React Router 8 needs 22.22 or newer. Node 24 was used.

**Errors you will meet in L37**

| Message | Cause |
|---|---|
| `No test files found, exiting with code 1` | the file is not called `*.test.ts(x)` (or the filter matches nothing) |
| `ReferenceError: describe is not defined` | globals are off: import `describe`, `it`, `expect` from `"vitest"` |
| `Invalid Chai property: toBeInTheDocument` | the jest-dom matchers are not loaded in `src/test/setup.ts` |
| `Found multiple elements with the role "button"` in the second test | no `cleanup()` after each test |
| `expected "vi.fn()" to be called 1 times, but got 0 times` | a `user.click` without `await` |
| `[MSW] Error: intercepted a request without a matching request handler` | a request nobody planned (that is what `onUnhandledFrame: "error"` is for): add a handler |
| `MISSING DEPENDENCY  Cannot find dependency 'jsdom'` | `npm install -D jsdom` |

The guide's "When something breaks" has the full table.

**Practical notes**

- **The tests never call the real API.** They run against a fake (MSW), so they need no internet. The login, cart and order shapes come from the Swagger description and were not checked on the live server.
- **The search endpoint of the Le Bistro API answers `429` after ten requests a minute** (with `Retry-After: 60`): do not run live searches in a loop during class.
- **The CI workflow has not been run on GitHub.** Push `code/after-L37` to a practice repository, open a pull request and watch the checks once before class; slide 36 (a pull-request simulator) is the fallback.
- **`npm audit` reports seven high-severity findings** in the L37 snapshot, all through the `shadcn` command-line tool (a dependency chain down to `braces`). They never reach the browser bundle; the Security Day uses them as a practice case.

**L38 (syllabus L40) adds speed and resilience.** Le Bistro gets the React Compiler, lazy pages, three levels of error boundary, a search box that does not lose letters, a kitchen page that stays light with 800 orders, and a size budget that the L37 robot enforces. The students' version is v1.2: a before/after table of numbers in the README.

**Versions the L38 snapshot was checked with** (npm, October 2026): `babel-plugin-react-compiler` 1.0.0, `@rolldown/plugin-babel` 0.2.4, `@babel/core` 7.29, `react-error-boundary` 6.1.6, `@tanstack/react-virtual` 3.14, Vite 8.3.5 (React and the rest as in sections 9 and 10).

**Errors you will meet in L38**

| Message | Cause |
|---|---|
| `Error: Cannot find package '@babel/core'` | the compiler needs all four packages installed |
| `lazy: Expected the result of a dynamic import() call` then `Element type is invalid. Received a promise that resolves to: undefined` | a lazy page with no default export: `.then((m) => ({ default: m.Page }))` |
| the Profiler says **Profiling not supported** | the page is a plain production build: use `npm run dev` for the Profiler, or a profiling build |
| `TypeError: Failed to fetch dynamically imported module` | the file is gone after a deploy: the `vite:preloadError` handler |
| `Cannot access refs during render` | the compiler's (and the linter's) message for a render counter written with a ref |
| `Over budget by … kB` (from `npm run size`) | something got heavier: read the treemap, `lazy()` it, or raise the budget with a reason |
| a virtual list shows no rows in a test | jsdom has no layout: `giveElementsASize()` in `src/test/layout.ts` |

The guide's "When something breaks" has the full table.

**Practical notes**

- **Measure on a preview, not on `npm run dev`.** React Scan works on `npm run build && npm run preview`; the React Developer Tools Profiler works with `npm run dev` (and its milliseconds are not the guests'). The numbers on the slides come from one laptop on 2026-10-22: tell the students that theirs will differ and that the proportions will not.
- **Five demos run real React** inside the slides (`L38-performance/vendor/perf-lab.js`, 340 kB). They count renders and milliseconds in the browser that shows them.
- **The photos are not part of the measured waterfall.** The test harness served them from disk, outside the network throttle: the slide gives only when they were asked for, and the seconds are arithmetic. Say so if someone asks.
- **The staff kitchen page** (`/kitchen`, `kitchen@itstep.ge` or `waiter@itstep.ge`) and its order queue were **not** called on the live server. `/kitchen?rush=800` (development only) adds 800 pretend orders. If the live login fails, `npm test -- KitchenPage` runs the page against a fake kitchen, and the slides do not need it.
- **The CI workflow has a new step, `npm run size`, and has still not run on GitHub.**
- **The build prints a Rolldown notice about slow plugin callbacks** after the compiler is on. It is not an error.
