# L29 · Masterclass: Le Bistro after L29 in one prompt

**Where:** slides 39–41, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L29`](../code/after-L29), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Nothing to attach: the data comes from the API, and the prompt names the endpoints.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 39, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 40, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L29` next to it.
3. **The short version** (slide 41, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 39 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site. Vite + React 19 + TypeScript + Tailwind CSS 4.
API: https://srmsapi.stepacademy.ge. It only accepts its own site, so call
/api/... through a Vite proxy. GET /api/v1/enterprise/dishes, /categories,
/search?q= (10 requests a minute, then 429 with Retry-After).

ROLE
You are a senior React developer who writes code for beginners to read.

ACTION
Build the home page and the menu with a working cart, now on real data:
- A useApi(path) hook: loading, error and empty states, an AbortController in
  the cleanup, every answer tagged with its path.
- Grey skeleton cards while loading. Categories and dishes from the API.
- A search debounced by 400 ms (useDebounce), with a friendly 429 message.
- The cart survives F5: useLocalStorage("bistro.cart"). "/" focuses the search.

FORMAT
The file tree first, then every file in full with its path, vite.config.ts too.

TARGET
Students learning effects: no setState during render, complete dependency
arrays, one comment per cleanup. It must pass npm run build.
```

## The short version

The Copy button on slide 41 copies exactly this:

```text
You're a senior React developer writing for beginners who are learning effects. Build Le Bistro as a Vite + React 19 + TypeScript + Tailwind 4 app on the real API at https://srmsapi.stepacademy.ge, called as /api/... through a Vite proxy (dishes, categories, and a search limited to 10 requests a minute). Make the menu, the cart and the search work with a useApi(path) hook (loading, error, empty, AbortController cleanup, answers tagged by path), skeleton cards, a 400 ms debounced search with a kind 429 message, a cart saved with useLocalStorage("bistro.cart"), and "/" to focus the search. Show the file tree, then every file in full with its path, vite.config.ts included. Keep the dependency arrays complete, never set state during render, comment each cleanup, and make sure npm run build passes.
```

## Check the answer with today's knowledge

- [ ] Every fetch is in an effect, with a cleanup that aborts it
- [ ] The dependency arrays list everything the effect uses
- [ ] No `useEffect(async () => …)`
- [ ] Relative `/api/...` paths and the proxy, no absolute API address
- [ ] The search waits 400 ms and handles 429

**What AIs often get wrong here:** AIs often forget the cleanup, so a slow answer overwrites a newer one. You saw that race today.

## When the AI goes off track

- **Old versions** (`react-router-dom`, a `tailwind.config.js` for Tailwind 3, React 18 patterns): point at the Context line that names the versions and ask it to follow it. That's the lesson: the Context part exists for exactly this.
- **Half an answer** ("the other components are similar"): ask for the missing files by name: "Give me DishCard.tsx in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once.
- **No internet or no time:** show `code/after-L29` and the answer you saved before class.
