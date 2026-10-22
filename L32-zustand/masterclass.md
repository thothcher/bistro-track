# L32 · Masterclass: Le Bistro after L32 in one prompt

**Where:** slides 38–40, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L32`](../code/after-L32), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Nothing to attach: the data comes from the API, and the prompt names the endpoints.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project (`npm install zustand`) and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 38, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 39, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L32` next to it.
3. **The short version** (slide 40, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 38 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site. Vite + React 19 + TypeScript + Tailwind CSS 4,
react-router 8 (import from "react-router"), Zustand 5. API at /api through a Vite
proxy: dishes, categories, search; POST /api/v1/auth/login { email, password } ->
accessToken (lives 2 minutes); GET /api/v1/auth/me -> the role.

ROLE
You are a senior React developer who writes code for beginners to read.

ACTION
Build the site as it is so far (real menu, search, pages, login, role guards), with no providers:
- cartStore (Zustand, persist, key "bistro.cart"): items, add, changeQty, remove, clear.
  Every rule in a pure cartReducer (no duplicates, max 10, nothing off the menu).
- authStore (persist, key "bistro.session"): session, login, logout.
- selectCount, selectTotal, selectQtyOf(id). Components select only what they use;
  several actions together use useShallow.
- api.ts calls useAuthStore.getState().logout() on 401 with X-Token-Expired.
- The menu, the profile and the queue stay in a useApi hook, NOT in a store.

FORMAT
First a table: each piece of state and where it lives. Then every file in full with its
path. Selectors are named selectX and live in the store file.

TARGET
Beginners will read it: small stores, no providers, App.tsx only lists routes.
It must pass npm run build.
```

## The short version

The Copy button on slide 40 copies exactly this:

```text
You're a senior React developer writing for beginners. Le Bistro is a Vite + React 19 + TypeScript + Tailwind 4 app with react-router 8, Zustand 5 and an API at /api through a Vite proxy (dishes, categories, search, a 2-minute token login, /auth/me for the role). Build the site as it is so far with no providers: a cartStore (persist, key bistro.cart, every rule in a pure cartReducer: no duplicates, max 10, nothing off the menu), an authStore (persist, key bistro.session), selectors (selectCount, selectTotal, selectQtyOf) that components use instead of reading the whole store, useShallow for several actions, and api.ts signing the guest out on a 401 with X-Token-Expired; the menu, the profile and the queue stay in a useApi hook, not in a store. Answer with a table of where each piece of state lives, then every file in full with its path. Keep it simple for beginners, App.tsx only lists routes, and make sure npm run build passes.
```

## Check the answer with today's knowledge

- [ ] No `Provider` for the cart or the session; `main.tsx` has only the router
- [ ] Every `useCartStore(…)` has a selector: no `useCartStore()` alone
- [ ] No selector returns a new object or array (or it uses `useShallow`)
- [ ] The reducer is still pure; `persist` does the saving, with `partialize`
- [ ] The menu is **not** in a store

**What AIs often get wrong here:** AIs like to put everything in one store, fetched data and loading flags included, and to write `const { items, add } = useCartStore()`. Both are on today's mistakes slides.

## When the AI goes off track

- **Old versions** (Zustand 4's `useStore(selector, shallow)` and `create((set) => …)`, `react-router-dom`, a `tailwind.config.js`): point at the Context line that names the versions and ask it to follow it. That's the lesson: the Context part exists for exactly this.
- **Half an answer** ("the other components are similar"): ask for the missing files by name: "Give me DishCard.tsx in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once.
- **No internet or no time:** show `code/after-L32` and the answer you saved before class.
