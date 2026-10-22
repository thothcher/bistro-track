# L36 · Masterclass: Le Bistro after L36 in one prompt

**Where:** slides 38–40, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L36`](../code/after-L36), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Nothing to attach: the data comes from the API, and the prompt names the endpoints.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project (`npm install zustand react-hook-form zod @hookform/resolvers@5 @tanstack/react-query`) and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 38, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 39, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L36` next to it.
3. **The short version** (slide 40, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 38 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site. Vite + React 19 + TypeScript + Tailwind CSS 4,
react-router 8 (import from "react-router"), Zustand 5, react-hook-form 7, zod 4,
@tanstack/react-query 5, shadcn/ui (Radix, lucide-react, sonner). API at /api through a
Vite proxy: dishes, categories, search, login (2-minute token), profile, learning/cart,
enterprise/orders (POST, queue), profile/orders (paged), enterprise/orders/{id}/status.

ROLE
You are a senior React developer who writes code for beginners to read.

ACTION
Build the site as it is so far (pages, role guards, stores, forms, reading and changing
data with TanStack Query v5) and make it accessible with shadcn/ui:
- shadcn/ui set up (components.json, the "@/" alias): ui/button with variants, sheet,
  dialog, alert-dialog, dropdown-menu, sonner. Colours as design tokens in index.css
  (--background, --primary wine, --accent, --border, --ring): text 4.5:1, focus ring 3:1.
- A skip link before the header, <main id="main" tabIndex={-1}>, one h1 per page.
- CartSheet (a Sheet) instead of the cart panel; DishQuickLook (a Dialog with a title and
  a description); UserMenu (a DropdownMenu); "Empty the order" asks first (an AlertDialog,
  the focus on "Keep it"); Sonner instead of the hand-made toaster.

FORMAT
First a table: what replaced what, and the keyboard behaviour it gives.
Then every file in full with its path.

TARGET
Beginners will read it. Keyboard only must work: the focus moves into a dialog, Tab stays
inside, Esc closes, the focus goes back. Every dialog has a title. No div with onClick.
It must pass npm run build and npx oxlint --jsx-a11y-plugin.
```

## The short version

The Copy button on slide 40 copies exactly this:

```text
You're a senior React developer writing for beginners. Le Bistro is a Vite + React 19 + TypeScript + Tailwind 4 app with react-router 8, Zustand 5, react-hook-form 7, zod 4, @tanstack/react-query 5 and shadcn/ui (Radix, lucide-react, sonner), and an API at /api through a Vite proxy (dishes, categories, search, a 2-minute token login, the profile, the server's cart, orders with a paged history and the staff-only queue). Build the site as it is so far (pages, role guards, stores, forms, everything read and changed with TanStack Query v5) and make it accessible with shadcn/ui: a skip link and one h1 per page; design tokens for the colours (wine as --primary, text at 4.5:1, a focus ring at 3:1); the cart as a Sheet, a quick look at a dish as a Dialog with a title and a description, the account menu as a DropdownMenu, an AlertDialog before emptying the order (the focus on "Keep it"), and Sonner instead of the hand-made toaster. Answer with a table of what replaced what and the keyboard behaviour it gives, then every file in full with its path. Keep it simple for beginners: keyboard only must work (the focus moves in, Tab stays inside, Esc closes, the focus goes back), every dialog has a title, no div with onClick, and npm run build and oxlint --jsx-a11y-plugin pass.
```

## Check the answer with today's knowledge

- [ ] The components come from shadcn (`ui/button`, `sheet`, `dialog`, `alert-dialog`, `dropdown-menu`, `sonner`), not rewritten by hand
- [ ] Press the keys, before you read the code: Enter opens the cart, the focus moves in, Tab stays inside, Esc closes it, the focus returns
- [ ] Every `DialogContent` and `SheetContent` has a title (and a description)
- [ ] Colours are tokens (`bg-primary`), not hex values in components, and the focus ring is visible
- [ ] A skip link, one `h1` per page, no `div onClick`; `npx oxlint --jsx-a11y-plugin` is clean

**What AIs often get wrong here:** AIs write a `div onClick`, forget the `DialogTitle`, remove the focus ring with `outline-none`, put hex colours inside components, and write their own dialog instead of using shadcn's. All of them are on today's slides.

## When the AI goes off track

- **Its own dialog instead of shadcn's** (a `div` with `position: fixed` and a hand-written `useEffect` for Esc): point at the Context line that names shadcn/ui and ask for the components from `components/ui`.
- **Old or invented imports** (`@radix-ui/react-dialog` one by one, a package called `@shadcn/ui`, `react-router-dom`, Tailwind 3 syntax): the Context line names the versions and the setup; ask it to follow them. That's the lesson: the Context part exists for exactly this.
- **Colours inside the components** (`bg-[#5c1a23]`, `text-red-700`): ask for the tokens (`bg-primary`, `text-primary-foreground`) and for the values to live in `index.css` only.
- **Half an answer** ("the other files are similar"): ask for the missing files by name: "Give me CartSheet.tsx, CartContents.tsx and UserMenu.tsx in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once. Before you paste the files, run `npx shadcn@latest init -t vite -b radix -p nova` in the fresh project (it needs the `@/` alias first), so that the packages and the generated files are in place.
- **No internet or no time:** show `code/after-L36` and the answer you saved before class.
