# L28 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The second one is done with an AI.

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

## Classwork 2 · Prompt it: lift it, filter it (with AI, slide 37)

The second classwork is done **with an AI**. You write the prompt, the AI writes the code, and you check it. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** The cart in `App` (`useState`, add, change quantity, immutable updates); the count in the `Header`.
- **Plus:** Category chips that filter: the state in the parent, the visible list derived.
- **Pro:** A controlled search box, combined with the category.

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| C | **Context** | Your shop and stack. Paste `types.ts`, `App.tsx`, `ProductGrid.tsx`, `ProductCard.tsx`. |
| R | **Role** | "A React teacher who writes simple code for a beginner." |
| A | **Action** | The Base task in your words: where the cart lives, what each button does. |
| F | **Format** | "Only the files that change, complete, with their paths." |
| T | **Target** | "Second React week: one sentence per useState on why it lives there." |

### A sample prompt (Beauty bar)

```text
CONTEXT
My shop "Glow" sells beauty products. Vite + React 19
+ TypeScript + Tailwind 4. My files (pasted): types.ts,
App.tsx, ProductGrid.tsx, ProductCard.tsx.
ROLE
A React teacher who writes simple code for a beginner.
ACTION
Lift the cart into App with useState<CartItem[]>: add
a product, change its quantity, remove it at 0, with
immutable updates. Show the count in the Header.
FORMAT
Only the files that change, complete, with their paths.
TARGET
Second React week: one sentence per useState on why it
lives there.
```

### The rules

1. Read every line before it goes into your project. You must be able to explain it.
2. Run it. If something fails, the next prompt is the exact error message.
3. One step at a time: Base first, then Plus and Pro as follow-up prompts.
4. Log it in `AI.md`: your prompt, what you kept, what you changed and why.

### Done when

- [ ] Adding a product changes the Header
- [ ] No `push`, `splice` or `sort` on state
- [ ] You can explain every `useState`
- [ ] AI.md: your prompt and one thing you changed

### What the AI tends to get wrong here (for the lecturer)

| The AI writes | The follow-up prompt |
|---|---|
| `cart.push(item); setCart(cart)` | "Immutable updates only: map, filter and spread." |
| The count or the total in their own `useState` | "Calculate the count during render, don't store it." |
| `onClick={addToCart(product)}` | "Pass the handler, don't call it: onClick={() => …}." |
| A context or a store library for the cart | "Lift the state to App; no libraries." |

### What a good answer looks like

The hand-written solution, to check what the AI produced.

#### Base (everyone)

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

#### Plus

Category chips that filter. The state lives in the parent of the chips and the grid:

```tsx
const [category, setCategory] = useState("all");
const visible = products.filter((p) => category === "all" || p.category === category);
```

#### Pro

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

#### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| The card still has its own `useState` AND gets `qty` as a prop | Two truths. Delete the card's state |
| `onAdd={addToCart(product)}` | `onAdd={() => addToCart(product)}` |
| `const [visible, setVisible] = useState(products)` | Derived: compute it, don't store it |
| `setCart(cart.push(item))` | `push` returns a number and changes the old array. Use spread |
