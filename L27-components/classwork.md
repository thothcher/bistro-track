# L27 · Classwork

Two classworks, 15 minutes each, on **your own project** (the shop you picked from [`../student-project.md`](../student-project.md)).
Le Bistro is the lecturer's project: look at it for the pattern, don't copy it.

---

## Classwork 1 · Your project's skeleton (slide 21)

### Base (everyone)

1. Create your project, if you have not yet:
   ```bash
   npm create vite@latest my-shop -- --template react-ts
   cd my-shop
   npm install
   npm install tailwindcss @tailwindcss/vite
   ```
   Add `tailwindcss()` to the plugins in `vite.config.ts`, put `@import "tailwindcss";` at the top of `src/index.css`, delete `src/App.css` and `src/assets`.
2. Draw your home page on paper as boxes. Name every box.
3. Make three components in `src/components/`: `Header`, `Hero`, `Footer`. One file each, a capital letter, `export function`.
4. `App` only puts them together:
   ```tsx
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

### Plus

Your shop's colours and fonts in an `@theme` block in `index.css`, like Le Bistro's:

```css
@theme {
  --color-brand: #1f3a5f;
  --color-cream: #faf7f2;
  --font-display: "Playfair Display", serif;
}
```

Then `bg-brand`, `text-cream` and `font-display` work as Tailwind classes.

### Pro

One more component from your drawing, for example a "Why shop with us" strip with three short promises.

### Done when

- [ ] Three files in `src/components/`, one component each
- [ ] Every component name starts with a capital letter
- [ ] App only imports and places the components
- [ ] No errors in the browser console (F12)

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| The Vite counter and logos still on screen | App.tsx still has the template. Replace all of it |
| `<header>` instead of `<Header />` in App | Lowercase = the HTML tag. Use the component name |
| Component imported, nothing visible | It is imported but not written in the JSX |
| Styles missing | `tailwindcss()` not in vite.config.ts, or the dev server not restarted |

---

## Classwork 2 · Your catalog, from data (slide 37)

### Base (everyone)

1. Open your category on DummyJSON, for example
   [dummyjson.com/products/category/mens-watches](https://dummyjson.com/products/category/mens-watches).
2. Write a type with only the fields you need, in `src/types.ts`:
   ```ts
   export type Product = {
     id: number;
     title: string;
     description: string;
     category: string;
     price: number;
     rating: number;
     stock: number;
     brand?: string; // some products have no brand
     thumbnail: string;
   };
   ```
3. Copy 6 products into `src/data/products.ts`:
   ```ts
   import type { Product } from "../types";

   export const products: Product[] = [
     {
       id: 93,
       title: "Brown Leather Belt Watch",
       description: "The Brown Leather Belt Watch is a stylish timepiece…",
       category: "mens-watches",
       price: 89.99,
       rating: 4.19,
       stock: 32,
       brand: "Fashion Timepieces",
       thumbnail: "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp",
     },
     // … 5 more
   ];
   ```
4. `ProductCard` with a typed prop, and `ProductGrid` with `map` and `key`.

### Plus

- Wrap the grid in a `Section` component with a title, using `children`.
- A "Low stock" badge when `product.stock < 10`: `{product.stock < 10 && <p>Low stock</p>}`.

### Pro

A second grid, "Top rated", made from the same `ProductGrid`:
```tsx
const topRated = products.filter((p) => p.rating >= 4.5);
<ProductGrid products={topRated} />
```

### Done when

- [ ] The products come from one data file
- [ ] `ProductCard` and `ProductGrid` have props types
- [ ] No "key" warning in the console
- [ ] Changing a price in the data file changes the page

### A sample solution (for the lecturer)

```tsx
// src/components/ProductCard.tsx
import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col rounded-lg border bg-white p-4 shadow-sm">
      <img src={product.thumbnail} alt={product.title} className="aspect-square object-contain" />
      <h3 className="mt-3 font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-500">{product.brand ?? "No brand"}</p>
      <p className="mt-auto text-lg font-bold">${product.price}</p>
      {product.stock < 10 && <p className="text-sm text-red-600">Low stock</p>}
    </article>
  );
}
```

```tsx
// src/components/ProductGrid.tsx
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `id: string` in the type | DummyJSON ids are numbers |
| `price="89.99"` | A number needs braces. In the data file it must be a number, not a string |
| The key is on the `<article>` inside ProductCard | The key goes on `<ProductCard>` inside `map` |
| `products.map(...)` returns nothing | Curly braces after `=>` without `return`. Use parentheses: `(product) => ( … )` |
| Recipe-book students | Same exercise with a `Recipe` type: `name`, `cuisine`, `mealType`, `image`, `rating` |
