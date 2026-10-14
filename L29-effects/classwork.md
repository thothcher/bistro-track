# L29 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The second one is done with an AI. DummyJSON allows requests from any address: no proxy needed.

---

## Classwork 1 · Real products (slide 20)

### Base (everyone)

Replace your data file with a request:

```tsx
const [products, setProducts] = useState<Product[] | null>(null);
const [failed, setFailed] = useState(false);

useEffect(() => {
  fetch("https://dummyjson.com/products/category/mens-watches")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data: { products: Product[] }) => setProducts(data.products))
    .catch(() => setFailed(true));
}, []);

if (failed) return <p>We couldn't load the products.</p>;
if (products === null) return <p>Loading…</p>;
return <ProductGrid products={products} />;
```

DummyJSON wraps lists: `{ products: [...], total, skip, limit }`. Save `data.products`.

Recipe-book students: `https://dummyjson.com/recipes?limit=12` → `data.recipes`.

### Plus

Grey placeholder cards instead of "Loading…":

```tsx
<div className="grid grid-cols-3 gap-6">
  {Array.from({ length: 6 }, (_, i) => (
    <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
  ))}
</div>
```

### Pro

Category chips from `https://dummyjson.com/products/categories` (a list of `{ slug, name, url }`), filtered to your theme's slugs.

### Done when

- [ ] The data file is no longer imported
- [ ] DevTools → Network shows one request (two in development: StrictMode)
- [ ] DevTools → Network → Offline shows your error message
- [ ] No endless requests

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| Requests never stop | `useEffect` without `[]`, or the fetch is outside the effect |
| `products.map is not a function` | They saved the whole object: use `data.products` |
| `useEffect(async () => …)` | Keep the effect sync, use `.then` |
| The page is blank while loading | `products` starts as `null`: handle it before mapping |

---

## Classwork 2 · Prompt it: search and a saved cart (with AI, slide 38)

The second classwork is done **with an AI**. You write the prompt, the AI writes the code, and you check it. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** The cart survives F5 with a `useLocalStorage(key, initial)` hook.
- **Plus:** A debounced search with `dummyjson.com/products/search?q=` and an `AbortController` cleanup.
- **Pro:** Your own `useApi(url)` hook for the products and the categories.

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| C | **Context** | Your shop and stack. DummyJSON allows any origin: no proxy. Paste `App.tsx` and your search box. |
| R | **Role** | "A React teacher who explains every effect." |
| A | **Action** | The Base task, then Plus in a follow-up prompt. |
| F | **Format** | "Only the files that change, complete, with their paths. Hooks in src/hooks/." |
| T | **Target** | "Point out every cleanup and the reason it's there." |

### A sample prompt (Tech store)

```text
CONTEXT
My shop "Circuit" sells smartphones, laptops and
tablets. Vite + React 19 + TypeScript + Tailwind 4.
DummyJSON allows any origin. App.tsx: (pasted)
ROLE
A React teacher who explains every effect.
ACTION
Keep the cart after F5 with a useLocalStorage(key,
initial) hook in src/hooks/useLocalStorage.ts, and use
it in App for the cart.
FORMAT
Only the files that change, complete, with their paths.
TARGET
I'm learning effects: point out every cleanup and why
it's there.
```

### The rules

1. Read every line before it goes into your project. You must be able to explain it.
2. Run it. If something fails, the next prompt is the exact error message.
3. One step at a time: Base first, then Plus and Pro as follow-up prompts.
4. Log it in `AI.md`: your prompt, what you kept, what you changed and why.

### Done when

- [ ] F5 keeps the cart
- [ ] Typing six letters sends one request
- [ ] Every effect that starts something cleans it up
- [ ] AI.md: your prompt and one thing you changed

### What the AI tends to get wrong here (for the lecturer)

| The AI writes | The follow-up prompt |
|---|---|
| `useEffect(async () => …)` | "Keep the effect function synchronous; use .then or an inner function." |
| A fetch with no cleanup | "Abort the old request in the cleanup with an AbortController." |
| The effect depends on `query`, not the debounced value | "Search only when the debounced value changes." |
| A missing dependency, silenced with a comment | "List every value the effect uses; don't disable the lint rule." |

### What a good answer looks like

The hand-written solution, to check what the AI produced.

#### Base (everyone)

1. Copy `useLocalStorage` from `bistro-track/code/after-L29/src/hooks/useLocalStorage.ts` into your `src/hooks/`.
2. In App:
   ```tsx
   const [cart, setCart] = useLocalStorage<CartItem[]>("shop.cart", []);
   ```
3. Add products, press F5: the cart is still there. DevTools → Application → Local Storage shows it.

#### Plus

A debounced search with `https://dummyjson.com/products/search?q=…`:

```tsx
const [query, setQuery] = useState("");
const search = useDebounce(query.trim(), 400);
const [results, setResults] = useState<Product[] | null>(null);

useEffect(() => {
  if (search === "") return;
  const controller = new AbortController();
  fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`, {
    signal: controller.signal,
  })
    .then((res) => res.json())
    .then((data: { products: Product[] }) => setResults(data.products))
    .catch(() => {}); // aborted or failed: keep the old results
  return () => controller.abort();
}, [search]);
```

Copy `useDebounce` from `code/after-L29/src/hooks/useDebounce.ts`.

#### Pro

Move your fetch logic into your own `useApi(url)` hook, modelled on Le Bistro's (tag each answer with its URL, abort in the cleanup). Use it for the products and the categories.

#### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| A request per letter | The effect depends on `query`, not on the debounced value |
| Old results flash under a new query | No AbortController / no cleanup |
| The cart resets on refresh | Different keys in two places, or `useState` still used |
| `JSON.parse` error after changing the cart's shape | Old data in localStorage: clear it in DevTools → Application |
