# L27 · Mise en place — lecturer guide

**Components and props.** Le Bistro track, lecture 1 of 5 (syllabus v2: L27, React lecture 2).
**Deck:** [`index.html`](index.html), 41 slides. **Code after this lecture:** [`../code/after-L27`](../code/after-L27).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md), and the project brief [`../student-project.md`](../student-project.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | What a component is, JSX rules, props (inputs of a component), lists with `map` and `key`, `children` |
| **Le Bistro gets** | A static home page and menu: Header, Hero, Section, CategoryChips, DishGrid, DishCard, Footer, with 12 real dishes from a data file |
| **Students' project** | Starts today. They pick a shop theme and build v0.1: a static catalog from a data file, deployed on Vercel |
| **The two problems** | 1. 25 dishes as 25 copied cards: one change means 25 edits. 2. One DishCard component, but every card shows the same dish |
| **The two answers** | 1. Components. 2. Props, `map` with `key`, and `children` |

---

## Before class

- [ ] Node.js 20.19+ or 22.12+ (`node -v`), VS Code, Chrome or Edge.
- [ ] Open the deck once with internet, so the fonts and the break radio load. Press `?` for the keys.
- [ ] An empty folder for the live build. Keep [`../code/after-L27`](../code/after-L27) open in a second VS Code window: it is your safety net.
- [ ] Open [srms.stepacademy.ge](https://srms.stepacademy.ge) and [dummyjson.com/products/category-list](https://dummyjson.com/products/category-list) in two tabs.
- [ ] Put the link to [`../student-project.md`](../student-project.md) in the class chat.
- [ ] VS Code: font size up (`Ctrl` and `+`), the Tailwind CSS IntelliSense extension installed, and "Format on save" with Prettier on.
- [ ] Optional: press `P` in the deck. A presenter window opens with the speaker notes, the next slide and a timer. Drag it to your laptop screen.

---

## Learn it first (30 minutes, before class)

You do not need to know React to teach this lecture well. You need the five ideas below, and you need to have typed the live build once yourself. Do that at home with the slides open, and compare your result with `code/after-L27`.

### 1. A page is a tree of components

A React developer reads a design as boxes inside boxes. Every box that has a name (header, card, footer) becomes a **component**. The whole page is `App`, the root of the tree.

> **Say it like this:** "A chef cuts every ingredient into its own bowl before cooking: mise en place. We cut the page into components before we build it."

### 2. A component is a function that returns JSX

```tsx
export function Header() {
  return <header className="site-header">…</header>;
}
```

- The name starts with a **capital letter**. That is how React tells your component (`<Header />`) from an HTML tag (`<header>`).
- `export` makes it importable. `App` imports it and writes it like a tag: `<Header />`.
- It **returns** what it shows. A component with no `return` shows nothing.

### 3. JSX is HTML inside JavaScript, with six rules

`className` instead of `class` · every tag closed (`<img />`) · exactly one parent (or a fragment `<>…</>`) · braces `{}` for JavaScript values · camelCase attributes (`onClick`, `htmlFor`) · comments as `{/* … */}`.
Vite turns JSX into ordinary function calls; the browser never sees JSX.

### 4. Props are the inputs of a component

A component is a function, so it can take parameters. In React those parameters are called **props**, and you pass them like HTML attributes:

```tsx
<DishCard dish={coqAuVin} />                         // the parent sends a prop
export function DishCard({ dish }: DishCardProps)    // the child receives it
```

- **Quotes** pass text (`title="The menu"`). **Braces** pass any other value (`price={32}`, `isNew={false}`, `dish={dish}`).
- Props flow **down** only, from parent to child. A child never changes its props.
- A `type DishCardProps = { dish: Dish }` describes what the component needs. TypeScript then catches a missing or wrong prop before the browser does.

### 5. Lists: `map` with a `key`, and `children`

```tsx
{dishes.map((dish) => (
  <DishCard key={dish.id} dish={dish} />
))}
```

`map` turns every dish into a card (students know `map` from the JavaScript module). React needs a **key** on every item: a stable, unique id, never the position in the list. Lecture L28 shows the bug you get with an index as key.

`children` is the special prop that contains whatever you write between a component's tags: `<Section title="…">{children here}</Section>`. It makes "frame" components possible.

### Check yourself

1. Why does `function header()` not work as a component? → React treats lowercase names as HTML tags.
2. What is the difference between `price="32"` and `price={32}`? → text vs number.
3. Where does the `key` go: on the `<article>` inside DishCard, or on `<DishCard>` inside `map`? → on `<DishCard>` inside `map`.
4. Can DishCard change `dish.price`? → No. Props are read-only.
5. What is `children` in `<Section><DishGrid /></Section>`? → the `<DishGrid />`.

Further reading (react.dev, 10 minutes each): *Your First Component*, *Writing Markup with JSX*, *Passing Props to a Component*, *Rendering Lists*.

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–6 | Greeting, today's menu, the five-lecture route, Le Bistro, **the students' project brief** |
| 0:08 | Questions | 7–8 | TypeScript questions with backup answers, a warm-up quiz |
| 0:15 | Problem 1 | 9–11 | The copy-paste kitchen demo: 12 copies, 2 forgotten |
| 0:21 | Solution 1 | 12–20 | Boxes, the tree, anatomy, JSX rules, setup order, **live: Header, then App** |
| 0:45 | Classwork 1 | 21 | Students: Header, Hero, Footer in their own project |
| 1:00 | Break | 22 | Press "Start the break" |
| 1:10 | Problem 2 | 23–25 | Six identical cards; functions take parameters |
| 1:17 | Solution 2 | 26–36 | Props flow, both sides, **live: types, DishCard, data, DishGrid, Section** |
| 1:37 | Classwork 2 | 37 | Students: ProductCard and ProductGrid from a data file |
| 1:52 | Wrap-up | 38–41 | Recap, flip cards, homework, the next problem |

Running late? Skip slide 15 (JSX rules: point students to it), slide 30 (playground) and slide 36 (quiz). Never skip the classworks.

---

## The live build, step by step

The slides show every file you type, line by line (each press of → adds the next lines in green). The **Copy** button on a code slide copies exactly what is on screen. If something goes wrong, copy the file from `code/after-L27` and move on: the lesson is the idea, not your typing speed.

### Step 0 · Create the project (slide 16)

```bash
npm create vite@latest le-bistro -- --template react-ts
cd le-bistro
npm install
npm install tailwindcss @tailwindcss/vite
```

`vite.config.ts`:

```ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Then:
1. Delete `src/App.css` and the folder `src/assets` (template leftovers).
2. Replace `src/index.css` with the one from `code/after-L27/src/index.css` (the Le Bistro colours and the named classes; it is Tailwind, not React, so don't type it live).
3. In `index.html`, copy the two font `<link>` lines and the title from `code/after-L27/index.html`.
4. `npm run dev` and open http://localhost:5173.

**You should see:** an empty cream page (App.tsx still has the template code, which we replace next).

### Step 1 · Header (slide 17)

Create `src/components/Header.tsx` and type it in four steps: the function, the JSX root, the logo, the navigation. The full file is in `code/after-L27/src/components/Header.tsx`.

### Step 2 · App puts the page together (slide 18)

Replace everything in `src/App.tsx`:

```tsx
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
```

Copy `Hero.tsx` and `Footer.tsx` from `code/after-L27/src/components/` and `lib/images.ts` from `code/after-L27/src/lib/`.
**You should see:** the header, the dark hero with the duck photo, the footer.

> Break here (after Classwork 1).

### Step 3 · The Dish type (slide 28)

`src/types.ts`: the `Dish` type (8 fields, the same as the API) and the `Category` type. Copy `lib/format.ts` (the price helper).

### Step 4 · DishCard (slides 28–29)

`src/components/DishCard.tsx`, typed in steps: imports, the props type, the parameters, then the JSX (photo, name and price, description, the badge with `&&`, the button).
Quick test in App: `<DishCard dish={dishes[0]} />` after copying the data file in step 5, or with one dish object written inline.

### Step 5 · Data file and DishGrid (slide 32)

Copy `src/data/dishes.ts` and `src/data/categories.ts`. Type `src/components/DishGrid.tsx` (16 lines, the `map` with `key`).

### Step 6 · Section with children, CategoryChips, the final App (slides 33–34)

Type `src/components/Section.tsx`, copy `CategoryChips.tsx`, then give App its final shape:

```tsx
const favouriteIds = [5, 15, 21];

export default function App() {
  const favourites = dishes.filter((dish) => favouriteIds.includes(dish.id));

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Section id="favourites" eyebrow="From the kitchen" title="Today's favourites">
          <DishGrid dishes={favourites} />
        </Section>
        <Section id="menu" eyebrow="La carte" title="The menu">
          <CategoryChips categories={categories} />
          <DishGrid dishes={dishes} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
```

**Checkpoint:** your app now looks like `code/after-L27`. Commit it: `git add -A && git commit -m "L27: components and props"`. This is where L28 starts.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| Blank page, red error in the console: `… is not defined` | A component is used but not imported | Add the import at the top of the file (VS Code: `Ctrl` + `.` on the red word) |
| `has no exported member 'Hero'` | `export` is missing in Hero.tsx | `export function Hero()` |
| `JSX expressions must have one parent element` | Two elements returned side by side | Wrap them in `<>…</>` |
| `<dishCard /> is using incorrect casing` | Lowercase component name | Rename to `DishCard` (file, function and tag) |
| `Each child in a list should have a unique "key" prop` | `key` missing, or put inside DishCard | `key={dish.id}` on `<DishCard>` inside `map` |
| `Type 'string' is not assignable to type 'number'` | A number passed in quotes | Braces: `price={32}` |
| A card shows nothing, no error | Parameters written as `(dish)` instead of `({ dish })` | Destructure: `({ dish }: DishCardProps)` |
| No styles at all | Tailwind plugin missing in vite.config, or index.css not imported in main.tsx | Check both, then restart `npm run dev` |
| Photos missing | `IMAGE_BASE` not added, or no internet | `src={IMAGE_BASE + dish.imageUrl}`; the photos come from the API server |
| `npm create` asks questions | Newer create-vite versions | Choose React → TypeScript, decline extra options |

---

## Questions students ask

- **"Why `className`?"** `class` is a reserved word in JavaScript. JSX uses the DOM property name.
- **"Why not one big App.tsx?"** You can, until a second page needs the same header, or a teammate edits the same file. Small files with one job each are easier to find, test and reuse.
- **"Default export or named export?"** We use named exports for our components (`export function Header`), so the name is the same everywhere. The template's App keeps its default export.
- **"Is a component like a class?"** Not anymore. React components are plain functions since 2019. Old tutorials with `class X extends React.Component` are outdated.
- **"Why types for props, the code works without them?"** Because TypeScript finds the wrong prop while you type, not when a user clicks. It also documents what a component needs.
- **"Why does Le Bistro use a data file and not the API?"** One idea at a time. In L29 the file is replaced by a request to the API, and no component changes. That is the point of props.
- **"Can I use the index as key?"** Today nothing breaks. In L28, when the list changes, it does. Use the id.

---

## Speaker notes in the deck

Every slide has notes: **Say** (what to say), **Do** (what to click or type), **Ask / Expect** (a question for the room and the usual answers), **If asked** (likely questions). Press `N` to show them under the slide, or `P` for the presenter window.
