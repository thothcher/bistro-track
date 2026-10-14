# L30 · Masterclass: Le Bistro after L30 in one prompt

**Where:** slides 35–37, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L30`](../code/after-L30), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Nothing to attach: the data comes from the API, and the prompt names the endpoints.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 35, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 36, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L30` next to it.
3. **The short version** (slide 37, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 35 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site. Vite + React 19 + TypeScript + Tailwind CSS 4,
react-router 8 (import from "react-router"). API at /api through a Vite proxy:
dishes, categories, search; POST /api/v1/auth/login { email, password } ->
accessToken (lives 2 minutes); GET /api/v1/auth/me -> the role.

ROLE
You are a senior React developer who writes code for beginners to read.

ACTION
Build the site as it is so far (real menu, saved cart, debounced search), now as pages:
- A layout with <Outlet />: /, /menu (?category= and ?q= in the URL), /menu/:id,
  /login, /account, /kitchen, /forbidden and a 404.
- Login saves { token, user } with useLocalStorage; the Header shows the name.
- RequireAuth: guests go to /login and come back after it; /kitchen is only for
  the kitchen and waiter roles. A 401 shows "Sign in again".
- vercel.json: /api to the API, every other address to index.html.

FORMAT
The route table first, then every file in full with its path.

TARGET
Beginners will read it: one component per file. The guard is a sign, not
a lock: no secrets in the code. It must pass npm run build.
```

## The short version

The Copy button on slide 37 copies exactly this:

```text
You're a senior React developer writing for beginners. Le Bistro is a Vite + React 19 + TypeScript + Tailwind 4 app with react-router 8 (import from "react-router") and an API at /api through a Vite proxy: dishes, categories, search, POST /api/v1/auth/login (a 2-minute token) and GET /api/v1/auth/me for the role. Build the real menu, the saved cart and the debounced search as pages in a layout with <Outlet />: home, /menu with its filters in the URL, /menu/:id, login, /account, /kitchen for the kitchen and waiter roles only, /forbidden and a 404; RequireAuth sends guests to /login and back, a 401 shows "Sign in again", and vercel.json rewrites /api and every other address. Give the route table first, then every file in full with its path. Keep one component per file and no secrets in the code, and make sure npm run build passes.
```

## Check the answer with today's knowledge

- [ ] Imports from `react-router`, not `react-router-dom`
- [ ] `<Link>` inside the app, no `<a href>`
- [ ] `Number(id)` before comparing a param
- [ ] `<Navigate … replace />` in the guard, `state.from` for the way back
- [ ] The token is stored, never the password

**What AIs often get wrong here:** Most AIs still answer with `react-router-dom` and version 6 code. One look at the imports tells you.

## When the AI goes off track

- **Old versions** (`react-router-dom`, a `tailwind.config.js` for Tailwind 3, React 18 patterns): point at the Context line that names the versions and ask it to follow it. That's the lesson: the Context part exists for exactly this.
- **Half an answer** ("the other components are similar"): ask for the missing files by name: "Give me DishCard.tsx in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once.
- **No internet or no time:** show `code/after-L30` and the answer you saved before class.
