# The Le Bistro track · React lectures L27–L31

Five React lectures (syllabus v2: L27–L31, from components to context), built for **lecturers who are new to React**. Each lecture comes with a deck, a lecturer guide that teaches the topic first, classwork and homework sheets, and a checked code snapshot.

- **The lecturer builds Le Bistro** live, the restaurant site of IT Step ([srms.stepacademy.ge](https://srms.stepacademy.ge)), on its real teaching API. One piece per lecture.
- **The students build their own shop** on the free DummyJSON API, one version per lecture, from the first React lecture to Demo Day (L42). See [`student-project.md`](student-project.md).
- **New to React or to these decks?** Read [`lecturer-handbook.md`](lecturer-handbook.md) once, then each lecture's `guide.md` before class.

| Lecture | Deck | Theme | Le Bistro gets | Students' shop | Slides |
|---|---|---|---|---|---|
| L27 | [Mise en place](L27-components/index.html) | Components, JSX, props, lists and keys | A home page and a menu from components and a data file | v0.1 · a catalog from a data file | 41 |
| L28 | [À la minute](L28-state/index.html) | `useState`, events, lifting state, derived values | A working cart, a stepper, filter chips, search | v0.2 · cart, filters, search | 41 |
| L29 | [Le marché](L29-effects/index.html) | `useEffect`, fetching, race conditions, custom hooks, `useRef` | The real menu from the API, skeletons, a debounced search, a cart that survives F5 | v0.3 · real API, saved cart | 42 |
| L30 | [La maison](L30-routing/index.html) | React Router, params, search params, login, guards | Pages, a page per dish, a login, staff-only doors | v0.4 · pages and a login | 38 |
| L31 | [Le passe](L31-context/index.html) | Context, `useReducer`, compound components | One cart and one session for the whole site, an FAQ | v0.5 · context and a reducer | 43 |

TypeScript (L26) comes before this track and is not part of it.

## Every lecture has the same shape

| Block | Time | What happens |
|---|---|---|
| Hello | 3′ | Bonjour, today's menu, the road map (Le Bistro and the students' shop), the goal behind a curtain |
| Questions | 9′ | Questions from last time (answers revealed on click), two students show their homework |
| Problem 1 | 6′ | Something hurts before the new tool appears: a dark photo slide, then an interactive demo of the problem, then "What would we need?" |
| Solution 1 | 24′ | The new tool as schemas you reveal step by step, then recipe slides: the steps on the left, the code growing on the right. Mistakes with their real error messages, a quick quiz |
| Classwork 1 | 15′ | On their own shop, in three tiers (Base, Plus, Pro), with a timer and a hidden hint |
| Break | 10′ | The "Start the break" button: countdown, music, "Welcome back" |
| Problem 2 → Solution 2 → Classwork 2 | 60′ | The same pattern for the second topic |
| Wrap-up | 8′ | Recap, flip cards, homework, and a teaser that plants the next lecture's problem |

The rail at the top of every slide shows where you are in this structure. Each lecture's problem is planted by the lecture before it: L30 ends with "count the props", and L31 starts by counting them.

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
  code/
    after-L27/ … after-L31/   Le Bistro at the end of each lecture: complete Vite projects (npm install && npm run dev)
  img/                    photos, screenshots, covers
  track.css, track.js     the Le Bistro look and the schema/wire engine shared by the five decks
  _shared/                the deck engine: deck.js, deck.css, icons, Prism, the break player, Le Bistro data and dish photos
```

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

## Credits

- **Le Bistro**: dish photos, data, screenshots and FAQ texts: IT Step Academy (srms.stepacademy.ge, srmsapi.stepacademy.ge).
- **Photo** of the stop button (L28): Unsplash, @hanswestbeek.
- **DummyJSON** ([dummyjson.com](https://dummyjson.com)) for the students' API.
- Icons: [Lucide](https://lucide.dev) (ISC). Syntax highlighting: [Prism](https://prismjs.com) (MIT). Fonts: Cormorant Garamond, Karla, JetBrains Mono (Google Fonts, OFL).
