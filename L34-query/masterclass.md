# L34 · Masterclass: Le Bistro after L34 in one prompt

**Where:** slides 37–39, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L34`](../code/after-L34), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Nothing to attach: the data comes from the API, and the prompt names the endpoints.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project (`npm install zustand react-hook-form zod @hookform/resolvers@5 @tanstack/react-query`) and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 37, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 38, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L34` next to it.
3. **The short version** (slide 39, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 37 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site. Vite + React 19 + TypeScript + Tailwind CSS 4,
react-router 8 (import from "react-router"), Zustand 5, react-hook-form 7, zod 4,
@tanstack/react-query 5. API at /api through a Vite proxy: dishes?category= (main-courses
takes 3 s), categories, search?q= (10 a minute, then 429), login (2-minute token),
profile and the staff-only orders/queue.

ROLE
You are a senior React developer who writes code for beginners to read.

ACTION
Build the site as it is so far (pages, role guards, cart and session in Zustand stores, the
login, sign-up and table-notes forms), with ALL server data in TanStack Query v5:
- lib/queryClient.ts: staleTime 1 minute; no retry on a 4xx, two retries otherwise; the cache
  is cleared when the session ends (store subscribe).
- queries/dishes.ts, account.ts, kitchen.ts with queryOptions: every dish key starts with
  "dishes", the profile key holds the guest's email, the queue refetches every 5 seconds.
- Menu: keepPreviousData, enabled for the search, prefetch on hover and focus of a category,
  "Try again", a message for a 429. Home, Menu and the dish page share one entry. No useApi.

FORMAT
First a table: each piece of server data, its query key and its staleTime. Then every
file in full with its path.

TARGET
Beginners will read it: one queryClient module, keys in one place, no useState copies of
query data, v5 syntax only (one options object, gcTime, placeholderData). It must pass npm run build.
```

## The short version

The Copy button on slide 39 copies exactly this:

```text
You're a senior React developer writing for beginners. Le Bistro is a Vite + React 19 + TypeScript + Tailwind 4 app with react-router 8, Zustand 5, react-hook-form 7, zod 4 and @tanstack/react-query 5, and an API at /api through a Vite proxy (dishes by category, where the main courses take 3 seconds; categories; a search that allows 10 requests a minute and then answers 429; a login with a 2-minute token; the profile; and the staff-only order queue). Build the site as it is so far (pages, role guards, a cart and a session in Zustand stores, the login, sign-up and table-notes forms) with all server data in TanStack Query v5: a lib/queryClient.ts (staleTime one minute, no retry on a 4xx and two retries otherwise, the cache cleared when the session ends), queries/dishes.ts, account.ts and kitchen.ts with queryOptions (every dish key starts with "dishes", the profile key holds the guest's email, the queue refetches every 5 seconds), and a menu with keepPreviousData, enabled for the search, a prefetch on hover and focus of a category, a "Try again" button and a message for a 429; Home, Menu and the dish page share one entry, and there is no useApi. Answer with a table of each piece of server data, its query key and its staleTime, then every file in full with its path. Keep it simple for beginners, with keys in one place, no useState copies of query data and v5 syntax only, and make sure npm run build passes.
```

## Check the answer with today's knowledge

- [ ] Query v5 only: one options object, `gcTime`, `placeholderData`; no `cacheTime`, no `onSuccess`
- [ ] One `queryClient` in its own module; the provider is in `main.tsx`; the cache is never made inside a component
- [ ] Every key lists what its function uses; the profile key holds the guest
- [ ] No `useEffect` fetches and no `useState` copies query data
- [ ] A 4xx is not retried; the menu has `keepPreviousData` and a prefetch

**What AIs often get wrong here:** AIs love `useEffect` + `useState` around a fetch, even when you ask for TanStack Query, and they write Query v4. Both are on today's mistakes slides.

## When the AI goes off track

- **Old versions** (Query v4's `useQuery(["dishes"], fn)`, `cacheTime`, `keepPreviousData: true`, `onSuccess`, `react-router-dom`, a `tailwind.config.js`): point at the Context line that names the versions and ask it to follow it. That's the lesson: the Context part exists for exactly this.
- **Half an answer** ("the other files are similar"): ask for the missing files by name: "Give me kitchen.ts in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once.
- **No internet or no time:** show `code/after-L34` and the answer you saved before class.
