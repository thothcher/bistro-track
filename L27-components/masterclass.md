# L27 · Masterclass: Le Bistro after L27 in one prompt

**Where:** slides 39–41, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L27`](../code/after-L27), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Attach `src/data/dishes.ts` and `src/data/categories.ts` from [`../code/after-L27/src/data/`](../code/after-L27/src/data) to the prompt: the AI writes the components, the data is ours.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 39, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 40, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L27` next to it.
3. **The short version** (slide 41, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 39 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site (srms.stepacademy.ge).
New Vite project: React 19, TypeScript, Tailwind CSS 4.
Attached: src/data/dishes.ts (12 dishes) and src/data/categories.ts.
A dish: { id, name, description, price, categorySlug, categoryName,
          imageUrl: "/images/coq-au-vin.jpg", isAvailable }
Photos: https://srmsapi.stepacademy.ge + imageUrl

ROLE
You are a senior React developer who writes code for beginners to read.

ACTION
Build the static home page and menu from components:
Header, Hero, Section (title + children), CategoryChips, DishCard, DishGrid, Footer.
- DishGrid maps the dishes with key={dish.id}.
- DishCard: photo, name, price in ₾, description,
  "Off the menu today" when isAvailable is false.
- "Today's favourites" (3 dishes), then the whole menu.
No state and no effects yet: the buttons do nothing.

FORMAT
First the component tree, then every file in full with its path.
Named exports and a props type for every component. Then the commands.

TARGET
Students in their first React week: short components, plain names.
It must pass npm run build.
```

## The short version

The Copy button on slide 41 copies exactly this:

```text
You're a senior React developer writing for beginners. Create a Vite + React 19 + TypeScript + Tailwind 4 app for Le Bistro, a French restaurant: the dishes are in the attached data files, the photos at https://srmsapi.stepacademy.ge + imageUrl. Build the static home page and menu from Header, Hero, Section (with children), CategoryChips, DishCard, DishGrid (map with key={dish.id}) and Footer: prices in ₾, an "Off the menu today" badge, 3 favourites, no state yet. Answer with the component tree, then every file in full with its path, then the commands. Keep it simple enough for first-week students, and make sure npm run build passes.
```

## Check the answer with today's knowledge

- [ ] Every component has a props type, no `any`
- [ ] `key={dish.id}` on the component inside `map`, not the index
- [ ] The dishes come from the data file, nothing hard-coded in JSX
- [ ] No `useState` or `useEffect` sneaked in
- [ ] Photos use the API address + `imageUrl`

**What AIs often get wrong here:** AIs love `key={index}` and invented fields. Today you can spot both.

## When the AI goes off track

- **Old versions** (`react-router-dom`, a `tailwind.config.js` for Tailwind 3, React 18 patterns): point at the Context line that names the versions and ask it to follow it. That's the lesson: the Context part exists for exactly this.
- **Half an answer** ("the other components are similar"): ask for the missing files by name: "Give me DishCard.tsx in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once.
- **No internet or no time:** show `code/after-L27` and the answer you saved before class.
