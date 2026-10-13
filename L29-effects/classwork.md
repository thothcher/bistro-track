# L29 · Classwork

Two classworks, 15 minutes each, on **your own shop**. DummyJSON allows requests from any address: no proxy needed.

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

## Classwork 2 · Search and a saved cart (slide 38)

### Base (everyone)

1. Copy `useLocalStorage` from `bistro-track/code/after-L29/src/hooks/useLocalStorage.ts` into your `src/hooks/`.
2. In App:
   ```tsx
   const [cart, setCart] = useLocalStorage<CartItem[]>("shop.cart", []);
   ```
3. Add products, press F5: the cart is still there. DevTools → Application → Local Storage shows it.

### Plus

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

### Pro

Move your fetch logic into your own `useApi(url)` hook, modelled on Le Bistro's (tag each answer with its URL, abort in the cleanup). Use it for the products and the categories.

### Done when

- [ ] F5 keeps the cart
- [ ] Typing six letters sends one search request
- [ ] Every listener and timer has a cleanup
- [ ] No "missing dependency" warning

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| A request per letter | The effect depends on `query`, not on the debounced value |
| Old results flash under a new query | No AbortController / no cleanup |
| The cart resets on refresh | Different keys in two places, or `useState` still used |
| `JSON.parse` error after changing the cart's shape | Old data in localStorage: clear it in DevTools → Application |
