# Lecturer handbook · the Le Bistro track

For lecturers who teach L27–L31 and are new to React, or new to these decks. Read it once; after that, each lecture's `guide.md` is all you need.

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

**Hello (3′) → Questions (9′) → Problem 1 (6′) → Solution 1 (24′) → Classwork 1 (15′) → Break (10′) → Problem 2 → Solution 2 (30′) → Classwork 2 (15′) → Wrap-up (8′)**

- **The problem comes first.** Let the room feel it in the demo before you name the tool. Ask "What would we need?" and let them answer before you reveal the chips.
- **Schemas before code.** Reveal them step by step with `→`; every step has a sentence in the notes.
- **Recipes:** the steps on the left light up one by one, the code on the right grows with them (new lines are green). Type along, or press **Copy**: it copies exactly the visible lines.
- **Mistakes slides** show the real error text. When a student hits one, point back to the slide.
- **Classwork:** start the timer, walk around. The "Common problems" table in `classwork.md` covers what you will see. The hint on the slide is blurred until clicked.
- **Break:** press "Start the break" on the break slide (or `B`). Music, a countdown, and "Welcome back" at the end.
- **Wrap-up:** the teaser plants the next lecture's problem. Don't skip it.

Running late? Each guide names the slides you can skip.

## 4. Live-coding without fear

- **Start clean.** Begin each lecture from the previous snapshot or a commit that matches it: `git tag L30-start`.
- **Commit at every checkpoint** the guide names (`git commit -am "L30: pages and routes"`). If the code gets into a mess, `git checkout .` takes you back to the last checkpoint in a second.
- **Copy long files, type the idea.** The guides say which files to copy from `code/after-LXX` (CSS, long JSX). Type the few lines that carry the lesson.
- **Let TypeScript lead.** After deleting a prop or renaming something, save and follow the red lines; say aloud what each error means.
- **If the network fails** (L29–L31 use the real API): the deck demos work offline. Show the snapshot you ran earlier, or switch to a phone hotspot. The search endpoint allows 10 requests a minute per IP, and a classroom shares one IP: a 429 in class is part of the lesson.
- **Tokens expire after 2 minutes** (L30). Sign in right before you show a protected page.

## 5. Keys

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

## 6. Students' projects

- The brief is [`student-project.md`](student-project.md). Put the link in the class chat at L27.
- **Check the live link, not screenshots.** Open the Vercel link, click through, press F5 on an inner page, open DevTools → Console.
- Grade with the table at the end of each `homework.md` (10 points + 2 bonus).
- Read AI.md. Ask a student to explain one function they wrote. Code they can't explain doesn't count.
- In "Questions", show two homeworks: one strong, one with a common mistake (with the student's permission).

## 7. React in one page

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
