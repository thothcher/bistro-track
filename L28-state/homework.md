# L28 · Homework: your shop, version 0.2

**Due:** before L29. **Submit:** the GitHub link and the Vercel link.

## Base (required)

1. **Cart state in App**: `CartItem[]`, with `addToCart`, `changeQty` and `removeFromCart`. Every update creates a new array.
2. **Cards**: "Add to cart" when the quantity is 0, a − qty + stepper otherwise (max 10). The quantity comes from App's cart.
3. **Header**: "Cart · 3", calculated with `reduce`.
4. **Cart panel**: opens and closes from the Header. Lists every item with − / + / remove, and the total (calculated).
5. **Category chips** filter the grid. The `category` state lives in the closest common parent of the chips and the grid. The visible list is calculated.

Recipe-book students: the cart is a **meal plan** (`PlanItem = { recipe: Recipe; servings: number }`), the chips filter by `mealType` or `cuisine`.

## Plus

- A controlled search box combined with the chips.
- "Nothing matches" when the visible list is empty.
- The cart panel shows "Your cart is empty" when there is nothing in it.

## Pro

- Sorting: a `<select>` with "Price ↑", "Price ↓", "Rating". The sorted list is derived: copy before sorting (`[...visible].sort(…)` or `visible.toSorted(…)`), never sort state in place.

## Before you submit

- [ ] Search your code for `.push(`, `.splice(`, `.sort(` on state: there should be none
- [ ] No `count`, `total` or filtered list in `useState`
- [ ] The same product shows the same quantity everywhere
- [ ] `npm run build` passes, the Vercel link works
- [ ] Optional: an entry in `AI.md`

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | Cart in App: add, change, remove, all immutable |
| 2 | Header count and panel total are derived |
| 2 | Category filter with the state in the right component |
| 1 | Steppers with a limit, disabled buttons |
| 1 | No state mutation anywhere |
| 1 | Deployed and working |
| +1 | Plus |
| +1 | Pro |

**Heads-up:** add products to your cart, then refresh the page. The cart is gone. That's the problem for L29.
