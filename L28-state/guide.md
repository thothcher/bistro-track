# L28 · À la minute — lecturer guide

**State and events.** Le Bistro track, lecture 2 of 5 (syllabus v2: L28, React lecture 3).
**Deck:** [`index.html`](index.html), 44 slides. **Code:** starts from [`../code/after-L27`](../code/after-L27), ends at [`../code/after-L28`](../code/after-L28).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md). **Masterclass script:** [`masterclass.md`](masterclass.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | `useState`, event handlers, the render cycle (trigger, render, commit), state as a snapshot, conditional rendering, lifting state up, immutable updates, derived values, controlled inputs |
| **Le Bistro gets** | "Add to cart" turns into a quantity stepper, "Your order · 3" counts, a cart panel with a total, category chips that filter, a search box |
| **Students' project** | v0.2: a working cart (or meal plan), category filter, search |
| **The two problems** | 1. A click changes a variable, but the screen stays the same. 2. Each card counts its own dishes, but the Header can't see them |
| **The two answers** | 1. `useState`. 2. Lift the state to the closest common parent: data down, events up |
| **AI** | Classwork 2 is done with an AI: a CRAFT prompt (Context, Role, Action, Format, Target), then the students check the code. The Masterclass rebuilds Le Bistro after L28 with one prompt |

---

## Before class

- [ ] Your Le Bistro from L27 runs (`npm run dev`). If not, copy `code/after-L27` and run `npm install`.
- [ ] `code/after-L28` open in a second VS Code window.
- [ ] Open the deck once with internet (fonts, radio).
- [ ] Pick two students for the homework demo (slide 6), ideally with different themes.

---

## Learn it first (30 minutes)

### 1. State is memory that triggers a new render

A component is a function. React calls it, takes the JSX, shows it. Local variables die when the function ends, and React has no reason to call the function again. **State** fixes both:

```tsx
const [qty, setQty] = useState(0);
```

- `qty` is the value **for this render**.
- `setQty(5)` means: "remember 5, and render me again".
- `useState(0)` is the starting value, used once.

### 2. The render cycle: trigger, render, commit

1. **Trigger**: an event handler calls a setter.
2. **Render**: React calls the component function again; `useState` returns the new value.
3. **Commit**: React compares the new JSX with the old one and changes only what differs in the page.

"Render" does **not** mean "repaint the whole page". It means "React called your function".

### 3. Every render is a snapshot

Inside one render, `qty` is a constant. The setter does not change it; it asks for the next render.
That's why `setQty(qty + 1); console.log(qty)` prints the old value, and why three `setQty(qty + 1)` in one click add only 1.
When the next value depends on the previous one, use the **updater form**: `setQty((q) => q + 1)`.

### 4. Events take a function

```tsx
<button onClick={() => setQty(qty + 1)}>+</button>   // ✓ a function to call later
<button onClick={setQty(qty + 1)}>+</button>         // ✗ calls it during render → "Too many re-renders"
```

### 5. Lifting state up: data down, events up

Two components need the same data (the Header and the cards both need the cart). Put the state in their **closest common parent** (App). Pass the data **down** as props. Pass **functions** down too, so a child can ask the parent to change its state (**events up**):

```tsx
// App
const [cart, setCart] = useState<CartItem[]>([]);
<DishGrid cart={cart} onAdd={addToCart} />
// DishCard
<button onClick={onAdd}>Add to cart</button>
```

### 6. New arrays, not changed arrays

React decides whether to re-render by comparing the old and new state with `===`. If you `push` into the old array and set it again, it's the same array, so nothing happens. Always create a new one:

| To… | ✗ Don't | ✓ Do |
|---|---|---|
| add | `cart.push(item)` | `[...cart, item]` |
| change one | `cart[0].qty = 2` | `cart.map((i) => (i.dish.id === id ? { ...i, qty: 2 } : i))` |
| remove | `cart.splice(k, 1)` | `cart.filter((i) => i.dish.id !== id)` |

### 7. Derived values are calculated, not stored

`count`, `total` and the filtered list can all be computed from `cart`, `category` and `query`. Compute them in the component body on every render. Storing them in state means two copies that will one day disagree.

### 8. Controlled inputs

```tsx
<input value={query} onChange={(e) => setQuery(e.target.value)} />
```

State holds the text; the input only displays it. Typing calls `onChange`, the state changes, React renders the new value back into the input.

### Check yourself

1. Why doesn't `let qty = 0; qty++` update the screen? → React isn't told, and `let qty = 0` runs again on the next render.
2. What does `onClick={setQty(1)}` do? → calls the setter during render: an infinite loop.
3. `qty` is 0. After `setQty(qty + 1)` three times in one handler, what is it? → 1.
4. Where does state live if the Header and the cards both need it? → their closest common parent, App.
5. Why `[...cart, item]` and not `cart.push(item)`? → React needs a new array to see a change.
6. Should `total` be state? → No, it's derived from the cart.

Further reading (react.dev): *State: A Component's Memory*, *Render and Commit*, *State as a Snapshot*, *Updating Arrays in State*, *Sharing State Between Components*.

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting, menu, route, before and after (the curtain wipes) |
| 0:03 | Questions | 5–6 | Backup questions, two students show their v0.1 |
| 0:11 | Problem 1 | 7–10 | The `let qty` demo: the console counts, the button doesn't |
| 0:16 | Solution 1 | 11–19 | useState, the cycle demo, order a click, snapshots, **live: the stepper, the panel toggle** |
| 0:40 | Classwork 1 | 20 | Steppers in their own cards |
| 0:55 | Break | 21 |  |
| 1:05 | Problem 2 | 22–24 | Cards count, the badge stays at 0. The tree |
| 1:10 | Solution 2 | 25–36 | Lifting, **live: cart in App, data down / events up, Header count, MenuSection filters** |
| 1:32 | Classwork 2 with AI | 37 | Students prompt an AI to lift their cart and filter their products, then check it |
| 1:47 | Masterclass | 38–40 | One prompt rebuilds Le Bistro after L28: part by part, run and check, the short version |
| 1:55 | Wrap-up | 41–44 | Recap, flip cards, homework, the next problem |

Running late? Skip slides 13 (order a click), 19 (three clicks quiz) and 36 (category quiz). In the Masterclass, show the parts (slide 38) and the short version (slide 40), and skip the live run.

---

## Classwork 2 with AI and the Masterclass

From this track on, the second classwork is done with an AI, and the lecture ends with a Masterclass.

**Classwork 2 with AI** (slide 37, 15 minutes). The task is a lifted cart, category chips and a search box, but the students don't type the code: they write a prompt in five parts (**CRAFT**: Context, Role, Action, Format, Target), the AI writes the code, and they check it against "Done when".
- Any AI tool works: Claude, ChatGPT, Copilot Chat. Students who have none can pair up.
- Walk around and ask students to explain one line the AI wrote. Code they can't explain doesn't count.
- When the answer doesn't work, the next prompt is the exact error message.
- The template, a sample prompt (blurred on the slide until clicked) and the follow-up prompts for the AI's usual mistakes are in [`classwork.md`](classwork.md).

**Masterclass** (slides 38–40, 8 minutes). One prompt rebuilds Le Bistro as it is after today:
1. **The prompt, part by part.** Each press opens one part. For each, one sentence: what would the AI do without it?
2. **Run it, then check it.** Show the answer, then go through the checks on the slide: each one is something from today.
3. **The short version.** The same five parts as one paragraph; press next and each part lights up in its colour.

**Before class:** run the Masterclass prompt once in the AI tool you'll use and keep the answer open: answers take a minute or two and vary a little. The full script, with the exact prompt texts, is [`masterclass.md`](masterclass.md).

---

## The live build, step by step

### Part 1 · Local state (slides 15 and 17)

**DishCard gets its own quantity.** At the top: `import { useState } from "react";`. Inside the component: `const [qty, setQty] = useState(0);`. Replace the button area at the bottom of the card:

```tsx
<div className="card__actions">
  {qty === 0 ? (
    <button type="button" className="btn-outline" onClick={() => setQty(1)}>
      Add to cart
    </button>
  ) : (
    <div className="stepper">
      <button onClick={() => setQty(qty - 1)}>−</button>
      <output>{qty}</output>
      <button onClick={() => setQty(qty + 1)} disabled={qty >= 10}>+</button>
    </div>
  )}
</div>
```

**You should see:** every card counts on its own. The Header still says 0.

**Header opens and closes a panel.** In Header: `const [isCartOpen, setIsCartOpen] = useState(false);`, the button gets `onClick={() => setIsCartOpen(!isCartOpen)}`, and below the bar:

```tsx
{isCartOpen && <CartPanel items={[]} onClose={() => setIsCartOpen(false)} />}
```

Copy a first `CartPanel.tsx` from `code/after-L28` and trim it to `items` and `onClose` (or use the full file and pass empty functions for now).

> Part 1 is a stepping stone. The final code (after the break) moves the quantity into App and the stepper into its own component.

### Part 2 · Lift the cart to App (slides 26–33)

1. **types.ts**: add `CartItem = { dish: Dish; qty: number }`.
2. **App.tsx**: the cart state and three functions (slide 26):
   ```tsx
   const [cart, setCart] = useState<CartItem[]>([]);

   function addToCart(dish: Dish) {
     setCart((current) => [...current, { dish, qty: 1 }]);
   }
   function changeQty(dishId: number, delta: number) {
     setCart((current) =>
       current
         .map((item) => (item.dish.id === dishId ? { ...item, qty: item.qty + delta } : item))
         .filter((item) => item.qty > 0),
     );
   }
   function removeFromCart(dishId: number) {
     setCart((current) => current.filter((item) => item.dish.id !== dishId));
   }
   ```
3. **QuantityStepper.tsx**: copy it from `code/after-L28`. It has no state: it shows `qty` and calls `onDecrease` / `onIncrease`.
4. **DishGrid and DishCard** (slide 28): DishGrid gets `cart`, `onAdd`, `onChangeQty` and gives each card its `qty` and two small functions. DishCard loses its `useState`.
5. **Header and CartPanel** (slide 29): Header gets `cart`, calculates `count` with `reduce`, and passes the items and the two functions to CartPanel. Copy the final `CartPanel.tsx`.
6. **MenuSection** (slide 32): move the menu Section out of App into `MenuSection.tsx` with `category` and `query` state and the derived `visible` list. Copy `CategoryChips.tsx` and `SearchBox.tsx`.

**Checkpoint:** your app equals `code/after-L28`. Commit: `git commit -am "L28: state, lifted cart, filters"`.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| `Too many re-renders. React limits the number of renders…` | A setter called in the JSX: `onClick={setQty(1)}` or `onAdd={onAdd(dish)}` | Wrap it: `onClick={() => setQty(1)}` |
| `useState is not defined` | Missing import | `import { useState } from "react";` |
| `React Hook "useState" is called conditionally` | useState inside an `if` or after an early `return` | Move it to the top of the component |
| The cart changes in the console but not on screen | `push` / `splice` / direct assignment on state | Make a new array (see the table above) |
| Badge and panel disagree | A `count` or `total` stored in state | Delete that state; calculate it |
| `You provided a value prop to a form field without an onChange handler` | Controlled input without `onChange` | Add `onChange={(e) => setQuery(e.target.value)}` |
| All cards share one number | The state was put in DishGrid (part 1) | In part 1 it belongs in DishCard; in part 2 the cart is in App and each card gets its own `qty` |
| `Property 'cart' is missing in type…` | A new prop added to the type but not passed | Pass it from the parent, or check the spelling |

---

## Questions students ask

- **"Why not a global variable outside the component?"** React wouldn't know it changed, and it would be shared by every copy of the component.
- **"Why `const` if the value changes?"** It doesn't change inside a render. A new render gets a new `const`.
- **"Is setState asynchronous?"** It schedules a render; the new value appears in the next render. Use the updater form when you chain updates.
- **"Why not keep the cart in the Header?"** The cards need to change it too. The closest common parent of the Header and the cards is App.
- **"Isn't it slow to filter on every render?"** Not for hundreds of items. Measure before optimizing (lecture L37 covers performance).
- **"Redux?"** Later: Context and useReducer in L31, Zustand in L32. Today's tool is enough for one page.
