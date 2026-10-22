# L36 · Le couvert: lecturer guide

**Accessible UI and shadcn/ui.** Le Bistro track, lecture 10 of 10 (syllabus v2: **L38**, React lecture 11). The last lecture of the second five.
**Deck:** [`index.html`](index.html), 45 slides. **Code:** starts from [`../code/after-L35`](../code/after-L35), ends at [`../code/after-L36`](../code/after-L36).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md). **Masterclass script:** [`masterclass.md`](masterclass.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | The four rules of every dialog (the focus moves in, Tab stays inside, Esc closes it, the focus goes back) and its role and name; native elements first (`button`, `<dialog>` with `showModal()`); a skip link, a `tabIndex={-1}` target, a focus ring you can see; reading the browser's accessibility tree; the keyboard test as a method; what a linter, axe and a person each find; three kinds of UI libraries; shadcn/ui (alias, `init`, `add`, files you own); Radix's `Sheet`, `Dialog`, `AlertDialog`, `DropdownMenu`; `asChild`, `cva`, `cn`; design tokens in two layers; WCAG contrast (4.5:1 for text, 3:1 for the visible state of a control); Sonner |
| **Le Bistro gets** | `components.json`, `src/components/ui/*` (button, sheet, dialog, alert-dialog, dropdown-menu, sonner), role tokens in `index.css`, `CartSheet` + `CartContents`, `DishQuickLook`, `UserMenu`, an `AlertDialog` for "Empty the order", Sonner (the `toast/` folder is deleted), a skip link, one `h1` per page, and `examples/HandMadeDialog.tsx` for comparison. Version 1.0.0. New packages: `radix-ui`, `class-variance-authority`, `cn`, `lucide-react`, `sonner`, `tw-animate-css`, `shadcn` |
| **Students' project** | v1.0: the cart as a `Sheet`, a skip link and `h1`s, titles on every dialog, Sonner; Plus: a quick look, an account menu, a confirmation; Pro: role tokens, axe and measured contrast |
| **The two problems** | 1. A cart that a keyboard cannot use. 2. Three more widgets with their own rules, which must all look like Le Bistro |
| **The two answers** | 1. Four rules and a name, by hand first. 2. shadcn/ui on Radix: the behaviour done once, in files we own, with our tokens on top |
| **AI** | Classwork 2 is done with an AI: a CRAFT prompt, then the students press the keys before they read the code. The Masterclass rebuilds Le Bistro v1.0 with one prompt |

**Numbers** (all measured, on the real code, against our local copy of the API): the L35 cart fails the four keyboard checks (0/4) and the L36 cart passes them (4/4); the first dish on the menu page is 15 Tab presses away on L35, and 17 on L36 without using the skip link (the skip link and the "Quick look" button each add a stop) or 13 with it (Tab, Enter, then 11 more); the accessibility linter reports **0** warnings on every snapshot from L31 to L36; axe-core reports **2** rules on L35 (`color-contrast`, `page-has-heading-one`) and **0** on L36; the hand-made dialog is 81 lines; shadcn generated 805 lines for six components; the production bundle grows from 142.1 to 196.6 kB gzipped JavaScript (+54.5 kB) and from 5.2 to 9.0 kB of CSS.

---

## Before class

- [ ] Your Le Bistro from L35 runs (or copy `code/after-L35`, `npm install`). The L35 version is the "problem": the cart is a `div` under the header.
- [ ] **Rehearse the first demo on your own app with the mouse unplugged:** Tab until "Your order" has the focus, Enter, Tab ten times, Esc. Say aloud where the focus is each time. Slide 7 asks you to do this live.
- [ ] **The order, cart, kitchen and menu flows were not called on the live server.** They were built from the API's Swagger description and run against a local copy. Before class, sign in as the student, add a dish, open the cart sheet and send an order; sign in as the kitchen account and open the user menu. Note anything that differs. The access token lives **2 minutes**.
- [ ] Try the demos on slides 8, 15, 16, 22, 27 and 32 once. They run in the deck, no internet needed. **Click once inside a demo before you use the keys**, so that the keys go there; Tab and Esc then behave like on a real page. Click outside, or Tab out of it, to leave.
- [ ] In Chrome: the **axe DevTools** extension (or the Lighthouse tab) for the audit moment on slide 9. `npx oxlint --jsx-a11y-plugin -D jsx-a11y src` needs no install.
- [ ] The shadcn CLI contacts its registry: you need internet for the live setup (slide 26). It takes about a minute. We used **shadcn 4.22.1**; a newer CLI may generate slightly different files.
- [ ] Optional, and not tested for this lecture: if you have **NVDA** (Windows, free) or **VoiceOver** (macOS, Cmd+F5), open the L36 cart with it for three minutes. Hearing "Your order, dialog" does more than any slide.
- [ ] Run the Masterclass prompt once (a minute or two, and it varies) and keep the answer open.
- [ ] `code/after-L36` open in a second VS Code window.
- [ ] Remind the students: DummyJSON keeps no changes, so they test their dialogs and cart with the keyboard, not with the server.

---

## Learn it first (40 minutes)

### 1. Who this is for

Accessibility is not only about blind users. A broken wrist, a dead trackpad, a laptop on a train, a screen that is hard to read in the sun, a tremor, a screen reader: **everyone is a keyboard user on some day.** The checks of this lecture (can I do it with Tab, Enter and Esc? can I read it? does it have a name?) cover most of what these guests meet. (In the EU, the European Accessibility Act has applied to many consumer services, e-commerce included, since June 2025: check what applies where your students will work.)

The standards behind the numbers: **WCAG 2.2** (the success criteria: 2.4.7 Focus Visible, 1.4.3 Contrast for text, 1.4.11 Non-text Contrast) and the **WAI-ARIA Authoring Practices Guide** (the keyboard contract of every widget).

### 2. The four rules of a dialog, and a name

A dialog is a window on top of the page that takes the keyboard until it closes. Four rules:

1. **The focus moves in** when it opens. Otherwise the guest is still on the button, outside.
2. **Tab stays inside.** Everything behind is out of reach.
3. **Esc closes it.**
4. **The focus goes back** to the button that opened it. Otherwise it is lost to `<body>` and the guest starts from the top of the page.

And for a screen reader: `role="dialog"` and a **name** (`aria-labelledby` pointing at the title). Without a name it says "dialog". Without the role it reads the content as plain text and never says that a window opened. `aria-modal="true"` tells assistive technology that the content outside is not available; it does **not** move or trap the keyboard focus. That is still your job.

The deck makes these four rules a **test**. The keyboard lab on slide 8 turns each check green or red the first time you try it.

### 3. Native elements first

- A `<button>` takes the focus, answers Enter and Space, has a role and a name. A `<div onClick>` has none of it. With `--jsx-a11y-plugin`, oxlint reports `click-events-have-key-events` ("Visible, non-interactive elements with click handlers must have one of keyup, keydown, or keypress listener") and `no-static-element-interactions` ("Static HTML elements with event handlers require a role").
- A `<dialog>` opened with `showModal()` does the four rules for you. We tried it in Chrome: the focus moves to the first control, Tab cycles inside, Esc closes it, the focus returns to the button that opened it, and clicks on the page behind are blocked. A button inside `<form method="dialog">` closes it too. A click on the **backdrop** does not close it. In React you need a ref (`ref.current?.showModal()`). The linter even suggests it: write `role="dialog"` on a `div` and it says "Prefer `dialog` over role attribute `dialog`".
- Elements with the `inert` attribute are skipped by Tab.
- So why a library? Styling and animating the backdrop takes care, a menu or a toast is not a dialog, and Radix does more: arrow keys, typeahead, nesting, the same behaviour in every browser.

### 4. Focus basics

- The Tab order is the **order of the elements in the DOM**. Write them in the order people read. `tabIndex={0}` puts an element in the order, `tabIndex={-1}` makes it focusable by code but not a Tab stop (a skip link's target), and a **positive** `tabIndex` is a bug (`tabindex-no-positive`: "Avoid positive integer values for tabIndex").
- **A skip link** is the first Tab stop: "Skip to the content". Hidden with `sr-only` (not `display: none`: a hidden element cannot take the focus), shown on focus, pointing at `<main id="main" tabIndex={-1}>`. On Le Bistro's menu page the first "Add to cart" is 17 presses away, and 13 with the skip link.
- **The focus ring.** The browser draws one for keyboard users (`:focus-visible`: a mouse click on a button does not show it). Never remove it (`outline-none`) without a replacement. It must be visible: WCAG asks 3:1 against what is behind it.

### 5. Names, roles and the accessibility tree

The browser builds a second tree for assistive technology: roles, names, states. You can see it in Chrome's DevTools (Elements → Accessibility), and in tests with Playwright's `ariaSnapshot()`. We used it for the slides:

| Markup | The tree |
|---|---|
| a plain `div` with a heading and a button | `heading "Your order"`, `button "One less"` (the `div` is not in the tree) |
| `aria-labelledby` only | the same: a name needs a role to name |
| `role="dialog"` | `dialog:` (no name) |
| `role="dialog"` + `aria-labelledby` | `dialog "Your order":` |

The old cart, a plain `aside`, came out as `complementary` with no name, and its button as `button "Your order · 1"`, with no `aria-expanded`: open or closed, it does not say. A panel that only shows and hides (not a dialog) should have `aria-expanded` and `aria-controls` on its button. Live regions: `role="status"` is read politely, `role="alert"` at once (L35's toast).

### 6. Three tools, three kinds of problems

| Tool | What it sees | The L35 cart |
|---|---|---|
| `npx oxlint --jsx-a11y-plugin -D jsx-a11y src` | static mistakes in the code: `div onClick`, a missing `alt`, a positive `tabIndex`. The rules are **off** in `npm run lint` | 0 warnings |
| **axe-core** (the axe DevTools extension, Lighthouse) | what a browser can measure on the rendered page: contrast, names, headings, landmarks | 2 rules: `color-contrast` (serious, the brass labels at 3.04:1) and `page-has-heading-one` (moderate) |
| **You**, with the keyboard (and, if you can, a screen reader) | behaviour: focus, order, traps, what is announced | 4 of 4 checks fail |

Each sees what the others cannot. Automatic tools find only part of the problems; the keyboard test is free and takes ten minutes.

### 7. Contrast

The ratio of two colours' relative luminance, from 1:1 to 21:1. WCAG AA: **4.5:1** for normal text, **3:1** for large text and for the visible parts of controls (the focus ring, a highlighted item). The slide's checker computes it live with the WCAG formula. Le Bistro's pairs (against the paper `#f6f1e7`): body text 12.64, wine 11.47, muted text 5.13, tomato 5.57; and the three we found **in our own first version**: the focus ring (brass at half strength) 1.66, the pale highlight of a menu item 1.19, the small brass labels (`.eyebrow`) 3.04.

### 8. Three kinds of UI libraries

| Kind | Examples | You get | You own | The catch |
|---|---|---|---|---|
| Ready-made kits | MUI, Mantine, Ant Design | finished components, their look | nothing: it is in `node_modules` | bending the look takes effort; an upgrade can change your UI |
| Headless primitives | Radix UI, React Aria | behaviour and accessibility, no style | your markup and your CSS | you style and assemble every part |
| Copy-in components | shadcn/ui | components generated into your project, on a headless base and Tailwind | the files | you maintain them: no automatic updates |

There is no best one. We use the third because Le Bistro has its own look and we want to read every line. The CLI's `-b` option chooses what is under shadcn's components: `radix` (what we use), `base` (Base UI) or `aria` (React Aria).

### 9. shadcn/ui in Le Bistro

```bash
# 1 · the alias, in tsconfig.json AND tsconfig.app.json: "paths": { "@/*": ["./src/*"] }
#     and in vite.config.ts: resolve.alias "@" → ./src
npx shadcn@latest init -t vite -b radix -p nova
npx shadcn@latest add dialog sheet dropdown-menu alert-dialog sonner
```

- It creates `components.json`, `src/lib/utils.ts` (`export { cn } from "cn"`), the six files in `src/components/ui/`, and rewrites `index.css` with its own colours. **The code in those files is ours:** `button.tsx` got Le Bistro's two button styles as `cva` variants; `sonner.tsx` lost its `next-themes` lines (we do not use Next.js).
- `npx shadcn@latest add button --diff` shows what a newer version would change. `add` does not overwrite an existing file unless you pass `--overwrite` (commit first). `--dry-run` previews.
- **The alias.** The CLI refuses to start without one ("Could not find valid path aliases or package imports for init"). TypeScript needs it in both `tsconfig` files (TS2307 otherwise), and the **dev server** needs it in `vite.config.ts` ("Failed to resolve import … Does the file exist?"). The production build alone passes without the Vite alias (it reads `paths`), which is why it can surprise.
- `asChild` (Radix's `Slot`): the component renders **your child** with its own props and classes. `<Button asChild><Link to="/login">Log in</Link></Button>` is an `<a>` that looks like a button. Without it you get an `<a>` inside a `<button>`: two Tab stops, invalid HTML (React says nothing).
- `cva` returns the classes of the chosen `variant` and `size`. `cn()` joins classes and lets the last Tailwind class win (the new CLI uses a small package called `cn`, a drop-in for `clsx` + `tailwind-merge`).

### 10. The components we use (all tested in a real browser)

| Component | In Le Bistro | What it does for you |
|---|---|---|
| `Sheet` | `CartSheet` | `role="dialog"` named by `SheetTitle`, described by `SheetDescription`; the focus moves to the first control; 14 Tabs and 6 Shift+Tabs never left it; the root of the page is `aria-hidden`; Esc closes it and the focus is back on "Your order"; the `Close` button is last in the DOM |
| `Dialog` | `DishQuickLook` | the same, with a title and a description; Esc returns the focus to the "Quick look" link |
| `AlertDialog` | "Empty the order" | needs an answer: the focus starts on the **safe choice**, "Keep it"; a click outside does **not** close it; Esc cancels |
| `DropdownMenu` | `UserMenu` | Enter, Space or ↓ opens it (↑ does not), the focus goes to the first item; ↑/↓ move and stop at the ends (no wrap); Home/End; a letter jumps (letters typed quickly make a longer prefix); Tab does nothing; Esc closes it and the focus goes back to the button |
| `Sonner` | the toasts | a live region (`aria-live`) for screen readers; our calls `toast.success(…)` and `toast.error(…)` stay, only the import changes |

**Two silent traps.** A `DialogContent` with no `DialogTitle` prints no warning in this version: the tree just says `dialog`. A controlled `<Dialog open={open}>` with no `onOpenChange` cannot be closed by Esc, the ✕ or a click outside: nothing calls the missing handler.

### 11. Tokens: two layers

Le Bistro's colours have been tokens since L27: `--color-wine`, `--color-paper`: names for what a colour **is**. A library cannot know them, so the second layer names what a colour is **for**: `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--accent`, `--border`, `--ring`. A component says `bg-primary`; one line says that primary is wine. In Tailwind 4 the roles are mapped with `@theme inline { --color-primary: var(--primary); … }`, and the values live in `:root`. Change `--primary` and every component follows.

### 12. We audited our own work

The first version of this lecture's snapshot passed every check we had written: the keyboard tests, the linter, the build. Then we ran axe-core and a contrast calculator, and they found real problems, which the final snapshot fixes (and the README of `code/after-L36` lists):

| Finding | Number | Fix |
|---|---|---|
| The focus ring, drawn by shadcn as `ring-ring/50` in brass | 1.66:1 (3:1 needed) | `--ring: #96702f` (4.0:1 on paper, 3.5:1 on the dark wine), at full strength |
| The highlighted menu item (`--accent`, a pale brass) | 1.19:1 | `--accent` is wine, with paper text |
| The small brass labels (`.eyebrow`, 12px) | 3.04:1 (4.5:1 needed) | `brass-deep #876a2f` on paper; the lighter brass stays on the dark wine of the hero and the footer |
| No `h1` on the menu, FAQ, kitchen and account pages; dish cards skipped a heading level | axe: `page-has-heading-one`, `heading-order` | `Section as="h1"`; the cards on the menu are `h2` |

Tell this story: it is the best argument for "test, do not hope".

### 13. The cost

`+54.5 kB` of gzipped JavaScript (142.1 → 196.6 kB) and +3.8 kB of CSS. It is a fair price for a dialog, a menu and a toast that work for everybody, and L40 (performance) will show how to load the heavy parts only when needed.

### Check yourself

1. Which four rules does every dialog follow? → The focus moves in, Tab stays inside, Esc closes it, the focus goes back to the button that opened it.
2. Why `<button>` and not `<div onClick>`? → Focus, Enter and Space, a role and a name come free.
3. What does a screen reader say for a dialog with no name? → "dialog" and nothing more.
4. Does `aria-modal="true"` trap the focus? → No: it hides the page for assistive technology; the keyboard is still yours.
5. What does `asChild` do? → Renders the child with the component's props and classes, so a `Link` can look like a `Button`.
6. Which tool finds a focus ring at 1.66:1? → A contrast check (axe, or the formula), not the linter and not the keyboard test.
7. What is a role token, and why do components use them? → A name for what a colour is for (`--primary`); components say `bg-primary`, so changing one value changes them all.
8. Where must the `@/` alias be written, and why in three places? → Both `tsconfig` files (TypeScript) and `vite.config.ts` (the dev server).

Further reading: the WAI-ARIA Authoring Practices Guide (w3.org/WAI/ARIA/apg → Patterns), the WCAG 2.2 Quick Reference, MDN's `<dialog>` page, the Radix Primitives and shadcn/ui documentation, and the axe-core rules list.

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting, menu, the last stop of the route, the blind rolls up on the cart |
| 0:03 | Questions | 5–6 | Backup questions; two v0.9 demos, each ending with "could someone without a mouse do this?" |
| 0:11 | Problem 1 | 7–10 | **Put the mouse away**; **the cart, by keyboard** (the lab); three tools, three kinds of problems; "What would we need?" |
| 0:16 | Solution 1 | 11–18 | The four rules (diagram); **native first**; the skip link and the ring (live); a dialog by hand (read it); **a role and a name**; **leave one out** (the build lab); mistakes; quiz |
| 0:40 | Classwork 1 | 19 | Their shop without a mouse |
| 0:55 | Break | 20 | |
| 1:05 | Problem 2 | 21–23 | Three more requests; **each request is a widget with its own rules**; "What would we need now?" |
| 1:10 | Solution 2 | 24–36 | Three kinds of libraries; shadcn is not a package; set it up (live); **two layers of names** (tokens and contrast); one Button, many looks; the Sheet (live); **what Radix did for the cart**; the dialogs; the menu (live); Sonner; the numbers; mistakes; quiz |
| 1:32 | Classwork 2 with AI | 37 | Students prompt an AI for a UI kit, then press the keys |
| 1:47 | Masterclass | 38–40 | One prompt rebuilds Le Bistro v1.0 |
| 1:55 | Wrap-up | 41–45 | Recap, flip cards, homework, ten lectures one restaurant, next time |

**Solution 2 is the densest block: 13 slides in 22 minutes. Running late?** Say slides 24 (the three kinds) and 33 (Sonner) in a sentence each; skip 28 (the Button's anatomy), 34 (the numbers) and 36 (the quiz); in 22 click only the dialog and the menu. In the first half skip 12 (native first: say it in a sentence), 17 and 18 (the mistakes and the quiz). **Never skip** 8 (the lab), 16 (leave one out), 27 (tokens), 29–32 (the sheet, the dialogs, the menu) or the classworks. In the Masterclass, show the parts (slide 38) and the short version (slide 40), and skip the live run.

---

## Classwork 2 with AI and the Masterclass

**Classwork 2 with AI** (slide 37, 15 minutes). The task is shadcn/ui set up, a `Button` with variants and the cart as a `Sheet` (Base); a quick look as a `Dialog`, the account as a `DropdownMenu` and Sonner (Plus); an `AlertDialog` and brand colours as role tokens at 4.5:1 (Pro). The students write a five-part prompt (**CRAFT**) and the AI writes the code.
- They set up the alias first (the CLI will not start without it); `classwork.md` has the exact lines.
- The check: **press the keys before you read the code.** Enter opens the cart and the focus is inside; Tab ten times stays inside; Esc closes it; the focus is back on the button. Then ask them to explain one line the AI wrote.
- The AI's usual mistakes (a `div onClick`, its own modal, a dialog with no title, `outline-none`, hex colours in components, `<Button><Link/></Button>`) and the follow-up prompts are in [`classwork.md`](classwork.md).

**Masterclass** (slides 38–40, 8 minutes). One prompt rebuilds Le Bistro as it is after today:
1. **The prompt, part by part.** Each press opens one part; for each, one sentence: what would the AI do without it?
2. **Run it, then check it.** Show the answer and go through the five checks.
3. **The short version.** The same five parts as one paragraph; each part lights up.

**Before class:** run the Masterclass prompt once and keep the answer open. The exact texts are in [`masterclass.md`](masterclass.md).

---

## The demos

All of them use real keys. **Click once inside the demo first.**

| Slide | Demo | How |
|---|---|---|
| 8 | The cart, by keyboard | "A div under the header (today)": Tab to **Your order · 1**, Enter. Four checks start grey and turn red or green the first time you test them. Tab ten times (to "Log in", through the cart's seven controls, then out into the page behind it), Esc, Tab to "Close" and Enter (the focus is lost). Switch to **"A dialog (the goal)"** (it resets) and repeat: all four turn green |
| 15 | A role and a name | Switch the three attributes on and off: the tree and what a screen reader says change |
| 16 | Leave one out | All four rules start off. Open it with Enter, press Tab: the focus is on the page behind. Switch the rules on one at a time and test again. "All four on" then switch one off: the dialog breaks in exactly one way |
| 22 | Each request has its own rules | Click through six widgets: their keyboard rules (from the WAI-ARIA Authoring Practices Guide) and the number of rules in each list |
| 27 | Two layers of names | Click a palette: the page and the `:root` block change together, and five contrast ratios are computed live. "Le Bistro, first version" fails the ring (1.66) and the menu highlight (1.19); Rosé fails four of five; Brass passes as a ring and fails as text |
| 32 | The menu | After the three parts of the file appear, try the demo: Enter, arrows (no wrap), Home/End, a letter (one at a time), Esc, Tab (nothing) |
| 37 | The sample prompt | Click the blurred box on the Classwork 2 slide |
| 38 | The prompt, part by part | Press next five times; **Copy** copies the whole prompt with its five labels |
| 40 | The short version | Press next: each part lights up; **Copy** copies the paragraph |

---

## The live build, step by step

You build Le Bistro v0.9 into v1.0. Do not type everything: **type** the skip link, the alias, `CartSheet` and one `Dialog`; **copy** the rest from `code/after-L36`.

Part 1 (before the break): by hand.

1. **The skip link and the target** (slide 13): `SiteLayout.tsx` and the `.skip-link` rule in `index.css`. Reload, press Tab once, then Enter.
2. **One `h1` per page:** `Section` takes `as="h1"` for the page title (menu, FAQ, kitchen, account).
3. **The audit** (slide 9): `npx oxlint --jsx-a11y-plugin -D jsx-a11y src` (nothing), axe on the menu page (two rules), then your own hands on the cart (four reds).
4. **Read `HandMadeDialog`** (slide 14), do not type it.

**Checkpoint 1:** `git commit -am "L36: skip link and headings"`.

Part 2 (after the break): the kit.

5. **The alias** (slide 26): `paths` in both `tsconfig` files, the alias in `vite.config.ts`.
6. **`npx shadcn@latest init -t vite -b radix -p nova`**, then `add dialog sheet dropdown-menu alert-dialog sonner`. Open `src/components/ui/`.
7. **Tokens** (slide 27): in `index.css`, the `:root` block: `--primary`, `--primary-foreground`, `--accent` (wine), `--ring` (`#96702f`), and the rest as in `code/after-L36`. Reload: the new components are Le Bistro's.
8. **`button.tsx`** (slide 28): the variants `default`, `outline`, `ghost`, `link`.
9. **`CartSheet.tsx`** (slide 29): type it. Move the old panel's lines into `CartContents.tsx` (copy), and render `<CartSheet />` in `Header.tsx`. Run the four checks.
10. **`DishQuickLook.tsx`, `UserMenu.tsx` and the `AlertDialog` in `CartContents`** (slides 31–32): copy, and explain the title, the safe choice and `asChild`.
11. **Sonner** (slide 33): delete `src/toast/`, put `<Toaster position="bottom-right" />` from `ui/sonner` in `SiteLayout`, change the import in `orders.ts` and `queryClient.ts`. Remove the `next-themes` lines from the generated `sonner.tsx`.
12. **Test:** the keyboard test on the cart, the quick look and the menu; axe on the menu page.

**Checkpoint 2:** your app equals `code/after-L36`. `git commit -am "L36: shadcn/ui, accessible dialogs"`. This is the last version of the track.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| `✖ Validating import alias. Could not find valid path aliases or package imports for init.` | `init` before the alias | `paths` in `tsconfig.json` and `tsconfig.app.json`, the alias in `vite.config.ts`, then run it again |
| `TS2307 · Cannot find module '@/cart/cartStore' or its corresponding type declarations.` | `paths` missing from a `tsconfig` file | Add it to **both** `tsconfig.json` and `tsconfig.app.json` |
| `Failed to resolve import "@/cart/cartStore" from "src/components/AddToCart.tsx". Does the file exist?` | the alias is missing from `vite.config.ts` (the dev server) | Add `resolve.alias`; restart `npm run dev` |
| The build passes but the dev server fails on `@/` | the production build reads `paths`, the dev server needs the alias | Same fix |
| A dialog works but a screen reader says only "dialog" | no `DialogTitle` / `SheetTitle` (there is no warning) | Add the title; `sr-only` hides it from the eye |
| Esc, ✕ and a click outside do nothing | a controlled `open` without `onOpenChange` | `open={open} onOpenChange={setOpen}` |
| The sheet stays open after "Send to the kitchen" | `onDone` is not called | `sendOrder.mutate(undefined, { onSuccess: onDone })`, and `onDone` closes the sheet |
| The focus ring is faint after `init` | shadcn draws it at half strength (`ring-ring/50`) in your `--ring` colour | A darker `--ring`, and `focus-visible:ring-ring` without `/50`; measure 3:1 |
| The menu highlight is barely visible | `--accent` is a pale colour | A stronger `--accent` with an `--accent-foreground` that reads on it |
| A `Link` inside a `Button` | two Tab stops, invalid HTML (no warning) | `<Button asChild><Link …/></Button>` |
| Toasts do not appear | no `<Toaster />` in the layout | One `<Toaster />` from `@/components/ui/sonner` in `SiteLayout` |
| The generated `sonner.tsx` imports `next-themes` | the CLI adds it with Sonner, for Next.js apps | We do not use Next.js or its theme provider: the snapshot removes those lines, and the toaster uses the default theme |
| `useEffectEvent` is missing from `react` (in `HandMadeDialog`) | React older than 19.2 | Update React, or use the shortened version of slide 14 |
| `oxlint` finds nothing on a `div onClick` | the a11y rules are off by default | `--jsx-a11y-plugin -D jsx-a11y` |
| axe reports `aria-hidden-focus` while a Radix menu is open | a known false alarm: the page behind is hidden, and Tab does nothing inside the menu (we checked) | Ignore it for the open menu; run axe with the menu closed |

---

## Questions students ask

- **"Do I have to do all this on every project?"** The cheap part always: real `button`s and links, labels, `alt`, one `h1`, a skip link, a ring you can see, and ten minutes with the keyboard. For dialogs, menus and selects, a kit is better than writing it yourself.
- **"Why not `aria-label` everywhere?"** The first rule of ARIA: if a native element does the job, use it. ARIA adds a name or a role; it does not add behaviour.
- **"Can't I use `<dialog>` and skip Radix?"** For a dialog, yes, and it is a good choice. Radix adds menus with typeahead, nesting, and the same behaviour in every browser.
- **"Why does shadcn put code in my project?"** So you can read it and change it. You own the files, and you update them yourself (`add --diff`).
- **"Is MUI bad?"** No. It is a different trade: finished components, their look, nothing to maintain.
- **"Why 4.5:1?"** It is the WCAG AA level for normal text. Large text and the visible parts of controls (a focus ring) need 3:1.
- **"Will a screen reader read the Sonner toast?"** It has a live region (`aria-live`): we checked that it exists. How each screen reader announces it differs: test with one if you can.
- **"What about dark mode and reduced motion?"** `shadcn init` writes a `.dark` set of tokens: dark mode is the same tokens with other values. Not covered today, and not tested. Tailwind has a `motion-reduce:` variant for animations.
- **"Can I skip the skip link on a small header?"** It costs four lines, and it is the first thing a keyboard user checks. Keep it.
- **"Does axe find everything?"** No. It finds what a browser can measure. Today it found two things the linter missed, and neither it nor the linter found the lost focus: only the keyboard did.
