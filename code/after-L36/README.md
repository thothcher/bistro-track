# Le Bistro after L36 · Le couvert

Le Bistro at the end of **L36 · accessible UI and shadcn/ui** (syllabus v2: L38): the last lecture of the second Le Bistro track.

Lecture: [`../../L36-ui/`](../../L36-ui/guide.md).

## New in this lecture

- The `@/` path alias (`tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`): `@/lib/format` means `src/lib/format`. shadcn needs it.
- shadcn/ui, set up with `npx shadcn@latest init -t vite -b radix -p nova` and `npx shadcn@latest add dialog sheet dropdown-menu alert-dialog sonner`. It created `components.json` and `src/components/ui/*`, and the code in them is ours: `button.tsx` now has the two Le Bistro button styles as `cva` variants (`default`, `outline`, `ghost`, `link`; sizes `default`, `sm`, `icon`), `sonner.tsx` lost its `next-themes` lines.
- **Design tokens** in `index.css`: the names the components use (`--background`, `--primary`, `--border`, `--ring`, `--radius`) point at Le Bistro's paper, wine, line, brass. `bg-primary` is wine; change a token and every component follows.
- `components/CartSheet.tsx` + `CartContents.tsx`: the cart is a Radix `Sheet` instead of a `div` under the header. The focus moves in, Tab stays inside, Esc closes, the focus returns to the button.
- `components/DishQuickLook.tsx`: a `Dialog` with a title and a description. `components/UserMenu.tsx`: a `DropdownMenu` (Enter, arrows, typeahead, Esc). "Empty the order" asks first, with an `AlertDialog` whose focus starts on "Keep it".
- Sonner replaces the hand-made toaster (`toast/` is deleted); the call sites `toast.success(…)` and `toast.error(…)` stay the same.
- A skip link ("Skip to the content") is the first Tab stop on every page.
- `examples/HandMadeDialog.tsx`: a dialog built by hand (portal, focus, trap, Esc, focus return), for comparison. The site does not use it.
- Version `1.0.0`. New dependencies: `radix-ui`, `class-variance-authority`, `cn`, `lucide-react`, `sonner`, `tw-animate-css`, `shadcn`.

## Found by an accessibility audit, and fixed

An automatic checker (axe-core 4.14, run in the browser) and a contrast calculation found things in the first L36 version that the code linter and the keyboard test did not:

- **The focus ring was too faint.** shadcn draws it as `ring-ring/50`, the brass at half strength: **1.66:1** against the paper, and WCAG asks for 3:1. Now `--ring` is a deeper brass (`#96702f`: 4.0:1 on paper, 3.5:1 on the dark wine) and the ring is drawn at full strength, in `button.tsx` and in the base layer of `index.css`.
- **The highlighted menu item was 1.19:1.** `--accent` (the colour of the item you are on, with the mouse or the keyboard) is now the wine, with paper text.
- **The small brass labels (`.eyebrow`) were 3.04:1,** under the 4.5:1 that 12px text needs. On paper they now use `brass-deep` (4.5:1); on the dark wine of the hero and the footer the lighter brass stays (4.6:1).
- **Pages had no `<h1>`,** and the dish cards skipped a heading level. `Section` takes `as="h1"` for the title of a page (menu, FAQ, kitchen, account), and the dish cards on the menu are `h2`.
- The accessibility lint (`npx oxlint --jsx-a11y-plugin -D jsx-a11y src`) is clean. Before L36 it was already clean, and the cart was still unusable with a keyboard: a linter reads code, it does not press keys.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

Put the mouse away and use Tab: skip link, logo, Menu, FAQ, "Your order", "Log in". Open the cart with Enter, press Tab ten times, press Esc.

The dish photos come from the Le Bistro API server, so the page needs internet, and so does the menu: `vite.config.ts` forwards `/api/...` to https://srmsapi.stepacademy.ge (the API accepts browser requests only from its own site and from localhost:4200, so the browser must not call it directly). Restart `npm run dev` after changing the config.

Test accounts are listed at the top of https://srmsapi.stepacademy.ge/swagger. Access tokens live 2 minutes.

## Deploy

Import the folder (or its git repo) in Vercel, or run `npx vercel`. `vercel.json` makes F5 work on every page and forwards `/api` to the real API.

## How it was checked

Type-checked, built and linted (oxlint, `eslint-plugin-react-hooks` 7.1.1): zero warnings. Run in a browser, with the keyboard: the skip link, the sheet's focus trap (14 Tabs, 6 Shift+Tabs), Esc and focus return, the alert dialog's safe default, the dialog's title and description, the menu's typeahead, the toast, and the hand-made dialog. The dialogs have accessible names (checked in the browser's accessibility tree: a dialog without a `DialogTitle` shows up as a nameless `dialog`, and Radix prints no warning). axe-core reports no violations on the home, menu, FAQ and login pages, with the cart sheet open, with the quick look dialog open and with the "Empty the order" dialog open (with the user menu open it reports `aria-hidden-focus` for the page behind: a known false alarm, because Radix keeps the focus inside the menu). The API was a local stand-in that follows the Swagger description; the authenticated endpoints were **not** called on the live server. shadcn's CLI was run against its live registry (shadcn 4.22.1): newer versions may generate slightly different files.
