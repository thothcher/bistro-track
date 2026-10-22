# L36 · Homework: your shop, version 1.0

**Due:** before the next lecture. **Submit:** the GitHub link and the Vercel link.

This is the last version of the second five. The next lectures test it and make it faster, so keep the code tidy.

**Remember:** test with your hands. Put the mouse away and go through your whole shop with Tab, Enter and Esc. Then run the checks below.

## Base (required)

1. **shadcn/ui, set up properly:** the `@/` alias (both `tsconfig` files and `vite.config.ts`), `npx shadcn@latest init`, and the components you use in `src/components/ui/`. A `Button` with variants replaces your hand-made button classes.
2. **A cart for every guest:** your cart is a `Sheet` (or a `Dialog`). The four keyboard checks pass: the focus moves in, Tab stays inside, Esc closes it, the focus goes back to its button.
3. **A way past the header:** a skip link before the header, `<main id="main" tabIndex={-1}>` as its target, and one `h1` per page.
4. **Names:** every dialog has a `DialogTitle` (or `SheetTitle`) and a description. Every picture has an `alt` (or `alt=""` when the text beside it says it). No `div` or `span` with `onClick`.
5. **Sonner replaces your toaster:** one `<Toaster />` in the layout, the calls `toast.success(…)` and `toast.error(…)` unchanged.
6. **A keyboard-only run through the shop, written down** (in the README): your Tab order from page load to a placed order, and one thing you found and fixed.

## Plus

- A product quick look as a `Dialog`, your account links as a `DropdownMenu`, and an `AlertDialog` before every destructive action ("Empty the cart" asks first; the focus starts on the safe choice).

## Pro

- **Check it, do not hope:** your colours as role tokens in `index.css` (`--primary`, `--primary-foreground`, `--ring`, `--accent`…), with no hex colours inside components. Run axe (the browser extension, or the Lighthouse tab in Chrome) on three pages and fix every serious finding. Text needs **4.5:1**, the focus ring and the highlighted menu item **3:1**: put the ratios in the README.

## Before you submit

- [ ] The four keyboard checks pass on your cart
- [ ] `npx oxlint --jsx-a11y-plugin -D jsx-a11y src`: no warnings
- [ ] Search your project for `onClick` on a `div` or a `span`: none
- [ ] Search for `outline-none`: each one has a visible replacement (`focus-visible:ring-…`)
- [ ] Every `DialogContent` and `SheetContent` has a title
- [ ] `npm run build` passes, the Vercel link works

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | The cart is a `Sheet` or `Dialog` that passes the four keyboard checks; every dialog has a title and a description |
| 2 | shadcn/ui set up properly (alias, `init`, components in `ui/`), and a `Button` with variants used instead of hand-made button classes |
| 2 | A skip link, a `main` target, one `h1` per page; the accessibility lint is clean; no `div onClick` |
| 1 | Sonner replaces the toaster, with the calls unchanged |
| 1 | The keyboard-only run-through in the README |
| 1 | Deployed and working |
| +1 | Plus |
| +1 | Pro |

**Heads-up:** the next lecture tests what you have built. A test can press a key for you and ask "is there a dialog called *Your cart*?" (`getByRole("dialog", { name: "Your cart" })`): it only finds it if you gave it a name. Keep the titles.
