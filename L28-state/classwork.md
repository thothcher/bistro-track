# L28 · Classwork

Two classworks, 15 minutes each, on **your own shop**.

---

## Classwork 1 · Make it move (slide 20)

### Base (everyone)

In `ProductCard`:

1. `import { useState } from "react";`
2. `const [qty, setQty] = useState(0);` at the top of the component.
3. When `qty` is 0, show "Add to cart". Otherwise show − qty +.
4. Maximum 10: the + button is disabled at the limit.
5. Every `onClick` gets an arrow function.

```tsx
<div>
  {qty === 0 ? (
    <button type="button" onClick={() => setQty(1)}>
      Add to cart
    </button>
  ) : (
    <div className="flex items-center gap-2">
      <button onClick={() => setQty(qty - 1)}>−</button>
      <output>{qty}</output>
      <button onClick={() => setQty(qty + 1)} disabled={qty >= 10}>
        +
      </button>
    </div>
  )}
</div>
```

### Plus

A "Your cart" button in your Header that opens and closes an empty panel:

```tsx
const [isCartOpen, setIsCartOpen] = useState(false);
// …
<button onClick={() => setIsCartOpen(!isCartOpen)}>Your cart</button>
{isCartOpen && <div className="…">Your cart is empty.</div>}
```

### Pro

A ♡ on every card that toggles to ♥: one boolean state per card, `{isFavourite ? "♥" : "♡"}`.

### Done when

- [ ] Clicking changes the screen
- [ ] Each card counts on its own
- [ ] No "Too many re-renders"
- [ ] `useState` is at the top of the component, not in an `if`

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `onClick={setQty(1)}` → "Too many re-renders" | `onClick={() => setQty(1)}` |
| All cards show the same number | The state is in ProductGrid. Move it into ProductCard |
| `qty++` | `setQty(qty + 1)` |
| The number goes below 0 | The − button at 1 goes to 0, which shows "Add to cart" again. That's the design |

---

## Classwork 2 · Lift it, filter it (slide 37)

### Base (everyone)

1. In `types.ts`:
   ```ts
   export type CartItem = { product: Product; qty: number };
   ```
2. In `App`:
   ```tsx
   const [cart, setCart] = useState<CartItem[]>([]);

   function addToCart(product: Product) {
     setCart((current) => [...current, { product, qty: 1 }]);
   }

   function changeQty(productId: number, delta: number) {
     setCart((current) =>
       current
         .map((item) =>
           item.product.id === productId ? { ...item, qty: item.qty + delta } : item,
         )
         .filter((item) => item.qty > 0),
     );
   }
   ```
3. Pass `cart`, `addToCart` and `changeQty` down to `ProductGrid`. It gives each card its `qty` and two functions. Remove the `useState` from `ProductCard`.
4. Pass `cart` to `Header`. Show the count:
   ```tsx
   const count = cart.reduce((sum, item) => sum + item.qty, 0);
   ```

### Plus

Category chips that filter. The state lives in the parent of the chips and the grid:

```tsx
const [category, setCategory] = useState("all");
const visible = products.filter((p) => category === "all" || p.category === category);
```

### Pro

A controlled search box, combined with the category:

```tsx
const [query, setQuery] = useState("");
const visible = products.filter(
  (p) =>
    (category === "all" || p.category === category) &&
    p.title.toLowerCase().includes(query.trim().toLowerCase()),
);
// …
<input value={query} onChange={(e) => setQuery(e.target.value)} />
```

### Done when

- [ ] Adding a product changes the Header
- [ ] No `push`, `splice` or `sort` on state
- [ ] The count is calculated, not stored
- [ ] The filtered list is calculated, not stored

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| The card still has its own `useState` AND gets `qty` as a prop | Two truths. Delete the card's state |
| `onAdd={addToCart(product)}` | `onAdd={() => addToCart(product)}` |
| `const [visible, setVisible] = useState(products)` | Derived: compute it, don't store it |
| `setCart(cart.push(item))` | `push` returns a number and changes the old array. Use spread |
