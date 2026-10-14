# L28 · Masterclass: Le Bistro after L28 in one prompt

**Where:** slides 38–40, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L28`](../code/after-L28), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Attach `src/data/dishes.ts` and `src/data/categories.ts` from [`../code/after-L28/src/data/`](../code/after-L28/src/data) to the prompt: the AI writes the components, the data is ours.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 38, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 39, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L28` next to it.
3. **The short version** (slide 40, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 38 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site. Vite + React 19 + TypeScript + Tailwind CSS 4.
Attached: src/data/dishes.ts (12 dishes) and src/data/categories.ts.
Photos: https://srmsapi.stepacademy.ge + dish.imageUrl

ROLE
You are a senior React developer who writes code for beginners to read.

ACTION
Build the home page and the menu from components (Header, Hero, Section,
CategoryChips, DishCard, DishGrid, Footer), then make them work:
- Cart: useState<CartItem[]> in App: add, change quantity (1–10), remove.
  Updater functions, immutable updates. Count and total are derived.
- A quantity stepper on every card; the Header opens a cart panel.
- Category chips and a controlled search box filter the menu.
No effects and no libraries.

FORMAT
The component tree, then a table: each piece of state, where it lives, why.
Then every file in full with its path.

TARGET
Students in their second React week: plain names, short functions.
It must pass npm run build.
```

## The short version

The Copy button on slide 40 copies exactly this:

```text
You're a senior React developer writing for beginners. Build Le Bistro, a French restaurant site, as a Vite + React 19 + TypeScript + Tailwind 4 app from the attached data files (photos at https://srmsapi.stepacademy.ge + imageUrl). Make the menu work: a cart in App (useState, updater functions, immutable updates, quantities 1–10, count and total derived), a stepper on every card, a cart panel from the Header, and category chips plus a controlled search that filter a derived list; no effects, no libraries. Start with the component tree and a table of every piece of state, then give every file in full with its path. Keep it readable for second-week students; npm run build must pass.
```

## Check the answer with today's knowledge

- [ ] No `push`, `splice` or `sort` on state: `map`, `filter` and spread
- [ ] `setCart((current) => …)`: updater functions for the cart
- [ ] The count, the total and the visible dishes are not in `useState`
- [ ] `onClick={() => add(dish)}`, not `onClick={add(dish)}`
- [ ] The stepper stops at 10

**What AIs often get wrong here:** AIs often keep the total in its own `useState` and update it by hand. Today you know why that's a bug.

## When the AI goes off track

- **Old versions** (`react-router-dom`, a `tailwind.config.js` for Tailwind 3, React 18 patterns): point at the Context line that names the versions and ask it to follow it. That's the lesson: the Context part exists for exactly this.
- **Half an answer** ("the other components are similar"): ask for the missing files by name: "Give me DishCard.tsx in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once.
- **No internet or no time:** show `code/after-L28` and the answer you saved before class.
