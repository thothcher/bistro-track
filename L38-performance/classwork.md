# L38 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The first one you do by hand and it is about **numbers**. The second one is done with an AI.

**Read this first.** No change without a number before it. Write the "before" first, then change **one** thing, then write the "after". "It feels faster" is not a row in the table. Whatever you do today, measure a **preview** (a built site) or a profile, not your impression.

---

## Classwork 1 · Measure your shop (by hand, slide 23)

### Step 0 · Get ready (5 minutes)

1. Install the **React Developer Tools** extension in Chrome (it adds the tabs **Components** and **Profiler** to DevTools).
2. Build and preview your shop, so that React Scan sees the code your guests get:

```bash
npm run build
npm run preview          # http://localhost:4173
npx react-scan@latest http://localhost:4173
```

   React Scan opens its own browser on your page and outlines every component that renders, with a counter.
3. Slow your computer down to what a phone does: DevTools → **Performance** tab → the gear icon → **CPU: 4× slowdown**.
4. Put this table in your README (you will fill it in):

```md
## Performance v1.2

| Action | Before | After | What I changed |
|---|---|---|---|
| Type three letters in the search | … renders, the widest one: … | … | … |
| Click a category | … | … | … |
| Add a product to the cart | … | … | … |
```

### Base (everyone)

**See it, then write a number.**

1. In the React Scan window, do three things, one at a time: type three letters in the search; click a category (or a filter); add one product to the cart.
2. For each, look at the outlines: **how many components flash?** React Scan puts a small label on each outline with how many times it rendered. Write down the biggest count you see and the **name of the component**.
3. Fill the "Before" column. Be honest: if typing three letters flashes the whole product list, write that.

> **What to expect.** In most first versions of a shop, the text of the search box is state of the page. A key renders the page, the whole list of products, and every card. In Le Bistro that was 2,110 component renders for four letters.

### Plus

**Change one thing, measure again.**

1. Record one key press with the **Profiler** (run `npm run dev` for it: the Profiler works in development, and the milliseconds are *not* your guests' milliseconds, so compare before and after, never against a number from `preview`): DevTools → **Profiler** → settings (gear) → tick **Record why each component rendered** → the round record button, type **one** letter, stop. The widest bar is where to look first.
2. Change **one** of these (the one the Profiler points at):

   **(a) The text of the search lives too high.** Give the search box its own state, and tell the page after a pause:

```tsx
// SearchBox.tsx
export function SearchBox({ onSearch }: { onSearch: (text: string) => void }) {
  const [text, setText] = useState("");
  const pause = useDebounce(text.trim(), 400); // the hook from L29
  // An Effect Event always calls the latest onSearch, without making the effect run again
  // when the page hands the box a new function (React 19.2 and later)
  const report = useEffectEvent((paused: string) => onSearch(paused));
  useEffect(() => {
    report(pause);
  }, [pause]); // the effect runs when the pause changes, and only then
  return <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search…" />;
}
```

   **(b) A list row renders again although nothing about it changed.** `memo` on the row, and a function that never changes:

```tsx
const ProductCard = memo(function ProductCard({ product, onAdd }: Props) {
  /* … */
});

// in the page: the same function at every render
const onAdd = useCallback((p: Product) => addToCart(p), [addToCart]);
```

   `memo` with `onAdd={() => addToCart(p)}` written inside `.map()` does **nothing**: a new function at every render is a new prop. That is the point of the lab on slide 12.

3. Record again, and fill the "After" column. `npm test` must still be green. Commit with the numbers: `git commit -am "perf: the search box keeps its own text (2,110 → 48 renders)"` with *your* numbers.

### Pro

**The compiler, and a budget.**

1. Turn the React Compiler on (Vite 8, what we use):

```bash
npm install -D @rolldown/plugin-babel @babel/core babel-plugin-react-compiler @types/babel__core
```

```ts
// vite.config.ts
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
```

   If your shop is on an older Vite, follow the "Vite" tab of the installation page on react.dev for your version. Build again: note the new build time and the size of your main file (before and after).
2. Copy `scripts/compiler-report.mjs` from `code/after-L38` and run `node scripts/compiler-report.mjs`. How many components were compiled, and which were **left alone**, with which reason? (Le Bistro: 102 and 2.) Measure your three actions again: what did the compiler change, and what did it not?
3. Copy `scripts/check-size.mjs`, run it after the build, and set `BUDGET_KB` to your own number plus about 6 per cent. Add the step to your `ci.yml`:

```yaml
      - run: npm run build
      - run: npm run size   # the budget: a pull request that makes the site heavier turns red
```

### Done when

- [ ] A table in the README with **at least two rows** and numbers before and after
- [ ] You measured a **preview** (React Scan) or a **profile**, not a guess
- [ ] You can say which bar was the widest, and why
- [ ] `npm test` and `npm run build` pass

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `npx react-scan@latest …` does nothing or cannot connect | the preview is not running (`npm run preview`), or the address is wrong (the port is printed by `vite preview`); the Profiler always works as a fallback |
| React Scan shows nothing flashing | the page was not interacted with; or the build is old: build again |
| The Profiler says **Profiling not supported** | the page is a plain production build: use `npm run dev` for the Profiler |
| "My numbers are different from the slide" | your machine, your shop; compare before and after on *your* setup |
| The "after" is not better | read the Profiler again: the widest bar may be a different component; or the state moved, and a parent still renders everything; or the function you pass down changes at every render and `memo` cannot help |
| `memo` did nothing | the function (or object, or array) handed to the row is new at every render: `useCallback`, or the compiler |
| The search box loses the Back-button behaviour after moving the text down | the box must follow the address when something else changes it: see `SearchBox.tsx` of `code/after-L38` (the "adjust state while rendering" block) |
| `Error: Cannot find package '@babel/core'` | install all four packages of the compiler |
| The build is slower after the compiler | normal: 1.1 → 2.4 s on Le Bistro. The build also prints a notice about slow plugin callbacks: it is not an error |
| The compiler report says "left alone" for a component | read the reason: a `try/catch` with a condition inside, a library whose functions are not safe to remember, a rule broken. Nothing to fix unless you want to |
| `npm run size` says `ENOENT … dist/index.html` | run `npm run build` first |
| The size check is red on the first run | your number is above 170 kB: set `BUDGET_KB` from *your* build, not ours |
| `npm test` got much slower with the compiler | normal: the compiled code is what runs |

---

## Classwork 2 · Prompt it: a faster shop (with AI, slide 46)

The second classwork is done **with an AI**. You write the prompt, the AI changes the code, and **you measure**. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** an AI review of your shop: the three biggest costs on a phone, how to measure each, and **one** change applied. You write the number before and after.
- **Plus:** every page except the first ones with `lazy()` and one `Suspense` skeleton, an error boundary around the page (with `resetKeys` and `onError`), and the size budget (`scripts/check-size.mjs`, `npm run size`) in `ci.yml`.
- **Pro:** your 194 products (`https://dummyjson.com/products?limit=0`): lazy photos below the fold, a high-priority hero image, and a list that draws only what is on the screen (or paging). The number of **elements in the page**, before and after (DevTools → Console: `document.getElementsByTagName("*").length`).

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| **C** | **Context** | Your shop and its stack, with versions (Vite 8, React 19, TypeScript, react-router 8, your cart, DummyJSON, the compiler on or off). **Paste** `vite.config.ts` and the component of your product list |
| **R** | **Role** | "A performance reviewer who measures before changing anything." |
| **A** | **Action** | "Find the three biggest costs on a phone. For each: how I measure it, the smallest fix, the risk. Apply only the first one." Plus and Pro go in follow-up prompts, one at a time |
| **F** | **Format** | "A table: cost · how to measure · fix · risk. Then only the changed files, complete, with their paths." |
| **T** | **Target** | "No `memo`, `useMemo` or `useCallback` unless a measurement says so. Tests and the build pass. Tell me what to measure afterwards." |

### A sample prompt (Tech store)

```text
CONTEXT
Shop "Volt". Vite 8 + React 19 + TypeScript, react-router 8,
Zustand cart, DummyJSON products (194). React Compiler on.
Tests: Vitest. I pasted vite.config.ts and ProductList.tsx.
ROLE
A performance reviewer who measures before changing anything.
ACTION
Find the three biggest costs on a phone. For each: how I
measure it (React Scan, Profiler, Network tab), the smallest
fix, the risk. Then apply only the first one.
FORMAT
A table: cost · how to measure · fix · risk. Then only the
changed files, complete, with paths.
TARGET
No memo or useCallback unless a measurement says so. Tests
and build pass. Tell me what to measure afterwards.
```

### The rules

1. **Measure before you paste.** The first number is yours: React Scan, the Profiler, the Network tab, or the number of elements.
2. **Read every line** before you run it. If you cannot explain a line, ask the AI, or delete it.
3. **One change at a time:** run, measure, then ask for the next.
4. **A claim is a question.** "This reduces the bundle by 40 per cent" means: measure it.
5. **A mistake goes back into the chat**, word for word, with the file it is in.
6. **AI.md:** your prompt, and one claim of the AI that you checked (and what the measurement said).

### Done when

- [ ] You measured **before** you pasted anything, and **after**
- [ ] A number after: renders, kilobytes or elements
- [ ] `npm test` and `npm run build` pass
- [ ] AI.md: your prompt, and one claim you checked

### What the AI tends to get wrong here

| The AI writes | Follow-up prompt |
|---|---|
| **`useMemo` and `useCallback` around everything** | "Remove them. Keep one only where a measurement (the Profiler) shows it helps, and show me the measurement." |
| **`React.lazy` with a named export and no `.then`** (the page never opens; `Element type is invalid. Received a promise that resolves to: undefined`) | "My pages use named exports: `lazy(() => import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })))`." |
| **`next/dynamic`** (a Next.js function) in a Vite project | "This is Vite and react-router 8, not Next.js: use `React.lazy` and `Suspense`." |
| **`loading="lazy"` on the first image of the page** | "The biggest image of the first screen must not be lazy: give it `fetchPriority=\"high\"`. Lazy only below the fold." |
| A **virtual list in a box with no fixed height** (it draws every row) | "The scrolling box needs a fixed height, for example `h-[65vh]`, and an `estimateSize` close to the real row height." |
| **`memo` on cheap components**, or on a component whose parent passes a new function | "Do not wrap anything in `memo` unless the Profiler shows the row rendering for no reason, and pass it a function that never changes." |
| **Invented numbers** ("this cuts the bundle by 40 per cent") | "I will measure it myself: tell me how, and what number to compare." |
| **The state moved into a context** to "avoid prop drilling", which makes everything render | "Context makes every consumer render when the value changes. Keep the text in the search box, and tell the page after a pause." |
| **An error boundary around the whole app only** | "Add one around each product card and one around the page, with `resetKeys`; keep the one at the top as the last net." |
| A **`useEffect` that sets state from props** (to follow the address) | "Adjust state while rendering instead: `if (value !== seen) { setSeen(value); setText(value); }`" |
| **`React.memo` plus an inline object** (`style={{ … }}`, `options={{ … }}`) | "An inline object is new at every render. Move it outside the component, or let the compiler handle it." |
| A new dependency for something the browser does (a lazy-image or virtual-list library for 30 items) | "Do not add a dependency for a list this short." |

### What a good answer looks like

**Base.** One change, with the numbers. The part that is yours is the table in your README:

| Action | Before | After | What I changed |
|---|---|---|---|
| Type three letters | the whole product list flashes, 2,000+ renders | only the search box, about 50 | the text moved into `SearchBox`, reported after a pause |

**Plus.** Lazy pages and a boundary around the page:

```tsx
// App.tsx
const ProductPage = lazy(() =>
  import("./pages/ProductPage").then((m) => ({ default: m.ProductPage })),
);

// the layout: the boundary outside, the Suspense inside
<PageBoundary>
  <Suspense fallback={<p role="status">Loading the page…</p>}>
    <Outlet />
  </Suspense>
</PageBoundary>
```

```tsx
// PageBoundary.tsx
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useLocation } from "react-router";

function PageCrash({ resetErrorBoundary }: FallbackProps) {
  return (
    <section role="alert">
      <h1>Something went wrong</h1>
      <p>This page stopped working. The rest of the shop is fine.</p>
      <button type="button" onClick={resetErrorBoundary}>Try again</button>
    </section>
  );
}

export function PageBoundary({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary
      FallbackComponent={PageCrash}
      resetKeys={[pathname]} // another page clears the error
      onError={(error, info) => console.error("A page crashed:", error, info.componentStack)}
    >
      {children}
    </ErrorBoundary>
  );
}
```

The budget is the `check-size.mjs` of `code/after-L38` and the `npm run size` step of the Pro tier of Classwork 1. **Check:** put a heavy import (a chart, a date library) at the top of your home page, push, and the check must go red. Then `lazy()` it, and it goes green.

**Pro.** Photos and a long list:

```tsx
// a card below the fold
<img src={product.thumbnail} alt={product.title} loading="lazy" decoding="async" />

// the biggest picture of the first screen
<img src={hero} alt="" fetchPriority="high" />
```

For 194 cards, the first thing to try is the cheapest: **paging** (24 at a time, a "Show more" button), which also keeps the browser's "find in page" working. If the list must scroll as one, `@tanstack/react-virtual` in a box with a fixed height:

```tsx
const box = useRef<HTMLDivElement>(null);
// The compiler skips a component that calls this hook (its functions are not safe to remember):
// that is fine here, so the linter's notice is switched off for this one line, on purpose.
// oxlint-disable-next-line react/incompatible-library
const virtualizer = useVirtualizer({
  count: products.length,
  getScrollElement: () => box.current,
  estimateSize: () => 96, // px: close to the real height of a row
  overscan: 6,
});

<div ref={box} className="h-[65vh] overflow-y-auto" tabIndex={0} aria-label="Products">
  <ul style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
    {virtualizer.getVirtualItems().map((row) => (
      <li
        key={products[row.index].id}
        aria-posinset={row.index + 1}
        aria-setsize={products.length}
        style={{ position: "absolute", top: 0, width: "100%", height: row.size, transform: `translateY(${row.start}px)` }}
      >
        <ProductRow product={products[row.index]} />
      </li>
    ))}
  </ul>
</div>
```

**Check:** the number of elements in the page (Console: `document.getElementsByTagName("*").length`) before (with 194 cards: several thousand) and after (a few hundred), and that scrolling still shows every product.

### Common problems

| Problem | Fix |
|---|---|
| The AI's change makes the page slower | measure again; undo it; ask for the smallest change |
| `Element type is invalid. Received a promise that resolves to: undefined` | a lazy page without a default export: the `.then((m) => ({ default: m.Page }))` |
| The lazy page shows nothing | no `Suspense` above it |
| The boundary shows the message but "Try again" fails again | the cause is still there (the same data); `resetKeys` clears it when the data or the address changes |
| A virtual list draws no rows (in a test) | jsdom has no layout: give the elements a size, as `src/test/layout.ts` does |
| A virtual list draws every row | the box has no fixed height |
| Photos jump when they load | give the box its shape: `width` and `height`, or an `aspect-ratio` |
| `npm run size` is red on a clean project | your `BUDGET_KB` is below your own number |
