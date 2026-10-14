# L31 · Masterclass: Le Bistro after L31 in one prompt

**Where:** slides 39–41, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L31`](../code/after-L31), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Nothing to attach: the data comes from the API, and the prompt names the endpoints.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 39, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 40, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L31` next to it.
3. **The short version** (slide 41, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 39 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site. Vite + React 19 + TypeScript + Tailwind CSS 4,
react-router 8 (import from "react-router"). API at /api through a Vite proxy:
dishes, categories, search; POST /api/v1/auth/login { email, password } ->
accessToken (lives 2 minutes); GET /api/v1/auth/me -> the role.

ROLE
You are a senior React developer who writes code for beginners to read.

ACTION
Build the site as it is so far (real menu, saved cart, search, pages, login,
RequireAuth with roles), with no prop drilling:
- AuthContext + AuthProvider + useAuth() for the session, login and logout.
- cartReducer (added, qtyChanged, removed, cleared: no duplicates, max 10,
  nothing off the menu) in a CartProvider + useCart(), saved to localStorage.
- "Order all three" on the favourites, "Empty the order" in the cart panel.
- An FAQ page from a compound Accordion (Accordion, AccordionItem,
  AccordionTrigger, AccordionPanel sharing a small context).

FORMAT
The provider tree first, then every file in full with its path.
Contexts and hooks in .ts files, providers in .tsx files.

TARGET
Beginners will read it: a pure reducer, App.tsx only lists routes.
It must pass npm run build.
```

## The short version

The Copy button on slide 41 copies exactly this:

```text
You're a senior React developer writing for beginners. Le Bistro is a Vite + React 19 + TypeScript + Tailwind 4 app with react-router 8 and an API at /api through a Vite proxy (dishes, categories, search, a 2-minute token login, /auth/me for the role). Build the real menu, saved cart, search, pages, login and role guards with no prop drilling: AuthProvider with useAuth(), a pure cartReducer (no duplicates, max 10, nothing off the menu) in a CartProvider with useCart() saved to localStorage, "Order all three" and "Empty the order", and an FAQ page from a compound Accordion. Show the provider tree, then every file in full with its path, with contexts and hooks in .ts files and providers in .tsx files. Keep App.tsx to the routes only, and make sure npm run build passes.
```

## Check the answer with today's knowledge

- [ ] The reducer returns new arrays and never touches `localStorage`
- [ ] Two contexts (auth and cart), not one for everything
- [ ] `useAuth()` and `useCart()` throw outside their provider
- [ ] No `cart=` or `session=` props left
- [ ] Contexts and hooks in `.ts`, providers in `.tsx`

**What AIs often get wrong here:** AIs often save to `localStorage` inside the reducer, or put the whole app in one context. Both are on today's mistakes slides.

## When the AI goes off track

- **Old versions** (`react-router-dom`, a `tailwind.config.js` for Tailwind 3, React 18 patterns): point at the Context line that names the versions and ask it to follow it. That's the lesson: the Context part exists for exactly this.
- **Half an answer** ("the other components are similar"): ask for the missing files by name: "Give me DishCard.tsx in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once.
- **No internet or no time:** show `code/after-L31` and the answer you saved before class.
