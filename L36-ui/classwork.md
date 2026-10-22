# L36 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The second one is done with an AI. The first needs no new package. The second sets up shadcn/ui: it installs several packages for you.

**Read this first.** Test with your hands. Put the mouse away, and press **Tab**, **Enter** and **Esc**. A page can pass every linter and still trap a guest.

---

## Classwork 1 · Your shop without a mouse (by hand, slide 19)

### Base (everyone)

1. A **skip link** before your header, and a target for it. In your layout (the component that holds the header and the page):
   ```tsx
   <a
     href="#main"
     className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-black"
   >
     Skip to the content
   </a>
   <Header />
   <main id="main" tabIndex={-1} className="outline-none">
     <Outlet />
   </main>
   ```
   `sr-only` hides it from the eye but not from the keyboard, and `focus:not-sr-only` shows it when it has the focus. `tabIndex={-1}` makes `main` a target that code and links can focus, without making it a Tab stop.
2. Run the accessibility linter on your project (no install: `npx` fetches it):
   ```bash
   npx oxlint --jsx-a11y-plugin -D jsx-a11y src
   ```
   Fix every warning. The usual ones: a `div` or `span` with `onClick` becomes a `<button type="button">`; an `<img>` gets an `alt` (the product's name, or `alt=""` when the text beside it already says it); `tabIndex` greater than 0 goes.
3. Test: reload, press **Tab** once. The skip link appears at the corner. Press **Enter**: the next Tab goes to the first control of the page, not to the header. If your editor uses ESLint, `eslint-plugin-jsx-a11y` has the same rules.

### Plus

Your cart panel closes with Esc, and the focus goes back to the button that opened it. Keep the button in a `ref`:

```tsx
import { useEffect, useRef, useState } from "react";

export function CartPanelWithEsc() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        openerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        aria-expanded={open}
        aria-controls="cart-panel"
        onClick={() => setOpen(!open)}
      >
        Your cart
      </button>
      {open && (
        <aside id="cart-panel" aria-label="Your cart">
          …
        </aside>
      )}
    </>
  );
}
```

`aria-expanded` tells a screen reader whether the panel is open, and `aria-controls` says which one. (This is a panel that shows and hides, not a dialog: it does not take over the keyboard. The Pro step makes it a dialog.)

### Pro

The focus moves **into** the cart, and Tab **stays inside**. Two ways:

- **Copy `HandMadeDialog`** from `code/after-L36/src/examples/HandMadeDialog.tsx` (it needs React 19.2 or newer, for `useEffectEvent`) and wrap your cart:
  ```tsx
  <HandMadeDialog open={open} title="Your cart" onClose={() => setOpen(false)}>
    <CartContents />
  </HandMadeDialog>
  ```
- **Or the browser's own `<dialog>`:**
  ```tsx
  import { useRef } from "react";

  export function CartDialog() {
    const ref = useRef<HTMLDialogElement>(null);

    return (
      <>
        <button type="button" onClick={() => ref.current?.showModal()}>
          Your cart
        </button>
        <dialog ref={ref} aria-labelledby="cart-title">
          <h2 id="cart-title">Your cart</h2>
          …
          <form method="dialog">
            <button>Close</button>
          </form>
        </dialog>
      </>
    );
  }
  ```
  `showModal()` moves the focus in, keeps Tab inside, closes on Esc and returns the focus. A button inside a `<form method="dialog">` closes it too. A click on the dark backdrop does **not** close a native dialog: add that yourself if you want it.

### Done when

- [ ] The skip link is the first Tab stop, and Enter moves you into the content
- [ ] Enter opens the cart, and the focus is inside it
- [ ] Esc closes it, and the focus is back on its button
- [ ] `npx oxlint --jsx-a11y-plugin -D jsx-a11y src`: no warnings

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| The skip link never appears | It is `display: none` or `hidden`: such an element cannot take the focus. Use `sr-only` |
| The skip link appears, and Enter does nothing visible | `main` has no `id="main"`, or the `href` and the `id` differ |
| A ring appears around the whole page after Enter | Add `outline-none` to `main` (it is a target, not a control) |
| `tabIndex={0}` on `main` | It becomes a Tab stop: use `-1` |
| Esc closes the cart, but the focus is lost | The `ref` was not set on the button, or the button is re-created on every render |
| Esc does nothing while the cart is open | The listener is on the button, not on `document`; the keys go to wherever the focus is |
| The focus goes back to the wrong button | The opener `ref` is shared by two buttons |
| Tab leaves the cart (Pro) | The hand-made version has no Tab wrap; use `HandMadeDialog`, or the native `<dialog>` with `showModal()` (`show()` is not modal) |
| `oxlint` finds no rule | Add `--jsx-a11y-plugin`: the rules are off by default |

---

## Classwork 2 · Prompt it: a UI kit for your shop (with AI, slide 37)

The second classwork is done **with an AI**. You write the prompt, the AI writes the code, and you check it. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** shadcn/ui set up, a `Button` with variants, and your cart as a `Sheet`.
- **Plus:** A product quick look as a `Dialog`, the account as a `DropdownMenu`, `Sonner` for the toasts.
- **Pro:** An `AlertDialog` before emptying the cart, and your brand colours as role tokens, checked at 4.5:1.

Before you prompt, set up the alias (the CLI refuses to start without it): in `tsconfig.json` **and** `tsconfig.app.json`, inside `compilerOptions`:

```json
"paths": { "@/*": ["./src/*"] }
```

and in `vite.config.ts`:

```ts
import { fileURLToPath } from "node:url";

// inside defineConfig({ … })
resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
```

Then, in your project:

```bash
npx shadcn@latest init -t vite -b radix -p nova
npx shadcn@latest add dialog sheet dropdown-menu alert-dialog sonner
```

(shadcn 4.22 was used for the lecture; a newer CLI may generate slightly different files.) Look in `src/components/ui/`: these files are yours now.

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| C | **Context** | Your shop and stack, with versions: shadcn/ui on Radix, Tailwind 4. Paste your Header and your cart. |
| R | **Role** | "A React teacher who writes small accessible components for a beginner." |
| A | **Action** | The Base task. Plus and Pro in follow-up prompts. |
| F | **Format** | "Only the files that change, complete, with paths. Use the shadcn components." |
| T | **Target** | "Keyboard only works. Every dialog has a DialogTitle. No div with onClick." |

### A sample prompt (Tech store)

```text
CONTEXT
Shop "Volt". Vite + React 19 + TypeScript + Tailwind 4,
shadcn/ui (radix), a Zustand cart, a Header (pasted).
ROLE
A React teacher who writes small accessible components.
ACTION
Run the shadcn setup for me (the files, not the CLI).
Replace the cart panel with a Sheet; keep CartContents.
Add a Button with variants (default, outline, ghost).
FORMAT
Only changed files, complete, with paths.
TARGET
Keyboard only: focus in, Tab inside, Esc, focus back.
Every dialog has a DialogTitle. No div with onClick.
```

### The rules

1. **Press the keys first.** Before you read a line of the AI's code, run the four checks on its cart: Enter opens it and the focus is inside; Tab ten times stays inside; Esc closes it; the focus is back on the button.
2. Then read every line before it goes into your project. You must be able to explain it.
3. Run it. If something fails, the next prompt is the exact error message.
4. One step at a time: Base first, then Plus and Pro as follow-up prompts.
5. Log it in `AI.md`: your prompt, what you kept, what you changed and why.

### Done when

- [ ] The cart opens with Enter, the focus moves in, Tab stays inside, Esc closes it
- [ ] The focus is back on the button
- [ ] Every dialog has a `DialogTitle`
- [ ] AI.md: your prompt and one thing you changed

### What the AI tends to get wrong here (for the lecturer)

| The AI writes | The follow-up prompt |
|---|---|
| A `div` with `onClick`, or `role="button"` on a `div` | "Use a real `<button type="button">`." |
| Its own modal: a `div` with `position: fixed` and a `useEffect` for Esc | "Use the shadcn `Sheet` from `@/components/ui/sheet`. Do not write focus code." |
| A `DialogContent` or `SheetContent` without a title | "Every `DialogContent` and `SheetContent` needs a `DialogTitle` or `SheetTitle` (hide it with `className="sr-only"` if the design has none) and a description." |
| `outline-none` with nothing in its place | "Keep a visible focus ring: `focus-visible:ring-3 focus-visible:ring-ring`." |
| Hex colours inside components: `bg-[#1f4d3a]` | "Use the tokens: `bg-primary text-primary-foreground`. The values live in `index.css`." |
| `<Button><Link to="/login">Log in</Link></Button>` | "Use `<Button asChild><Link to="/login">Log in</Link></Button>`." |
| `<Dialog open={open}>` without `onOpenChange` | "Add `onOpenChange={setOpen}`: without it Esc and the backdrop cannot close the dialog." |
| Imports from `@radix-ui/react-dialog`, or from a package called `@shadcn/ui` | "Import from `@/components/ui/dialog`. shadcn copies the files into the project; it is not a package you import." |
| `react-router-dom`, a `tailwind.config.js`, Tailwind 3 syntax | "I use react-router 8 (`import … from "react-router"`) and Tailwind 4, with no config file." |
| A pale brand colour for text or for the focus ring | "Check the contrast: 4.5:1 for text, 3:1 for the focus ring. Darken the token." |
| A `<Toaster />` inside a page, or none | "One `<Toaster />` in the layout, from `@/components/ui/sonner`." |

### What a good answer looks like

The hand-written solution, to check what the AI produced. The code below was compiled with TypeScript 6 against the files shadcn generates, and passes the accessibility lint.

#### Base (everyone)

`src/components/CartSheet.tsx`, with your own cart store and your old cart panel as `CartContents`:

```tsx
import { useState } from "react";
import { selectCount, useCartStore } from "@/cart/cartStore";
import { CartContents } from "@/components/CartContents";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// The frame knows the four rules: the focus moves in, Tab stays inside, Esc closes,
// the focus goes back to the button. The title is the dialog's name.
export function CartSheet() {
  const [open, setOpen] = useState(false);
  const count = useCartStore(selectCount);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Your cart · {count}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>Check your products, then place your order.</SheetDescription>
        </SheetHeader>
        <CartContents onDone={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
```

In your header, delete the cart's `useState`, the old button and the panel, and render `<CartSheet />` instead. `CartContents` is your old panel's lines, total and buttons, with an `onDone` that closes the sheet after "Place order".

#### Plus

```tsx
// src/components/ProductQuickLook.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@/types";

// A closer look at a product without leaving the list. The title is the accessible name.
export function ProductQuickLook({ product }: { product: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" aria-label={`Quick look at ${product.title}`}>
          Quick look
        </Button>
      </DialogTrigger>
      <DialogContent>
        <img src={product.thumbnail} alt="" className="w-full" />
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>
        <p className="text-2xl">${product.price}</p>
      </DialogContent>
    </Dialog>
  );
}
```

```tsx
// src/components/AccountMenu.tsx
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AccountMenuProps = { name: string; email: string; onSignOut: () => void };

// One button instead of several links. Enter opens it, the arrows move, a letter jumps,
// Esc closes it and the focus goes back to the button.
export function AccountMenu({ name, email, onSignOut }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {name}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/account">My account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

Sonner: put **one** `<Toaster />` in your layout, and import `toast` from `"sonner"` where you had your own toaster. The calls (`toast.success("…")`) stay.

```tsx
import { toast } from "sonner";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

// in the layout, after the page:
<Toaster position="bottom-right" />
// anywhere: toast.success("Your order is on its way.");
```

#### Pro

```tsx
// src/components/EmptyCartButton.tsx
import { useCartStore } from "@/cart/cartStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// Emptying the cart cannot be undone: ask first. The focus starts on "Keep it".
export function EmptyCartButton() {
  const clear = useCartStore((s) => s.clear);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Empty the cart
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Empty the cart?</AlertDialogTitle>
          <AlertDialogDescription>Every product will be removed.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction onClick={clear}>Empty it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Your brand as role tokens.** `shadcn init` rewrote `src/index.css` with its own colours. Find the `:root { … }` block and set the ones that carry your brand; the components never say "green" or "wine", they say `bg-primary`:

```css
:root {
  --primary: #1f4d3a; /* your brand colour */
  --primary-foreground: #fdfaf2; /* the text on it */
  --ring: #1f4d3a; /* the focus ring */
  --accent: #1f4d3a; /* the highlighted item in a menu */
  --accent-foreground: #fdfaf2;
}
```

Then **measure**. In Chrome's DevTools, click a colour swatch in the Styles panel: the picker shows the contrast ratio and whether it passes AA. Text needs **4.5:1**; the focus ring and the highlighted menu item need **3:1** against what is behind them. The Lighthouse tab (Accessibility) and the axe extension find the rest. Write the numbers in your README.

#### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `Could not find valid path aliases or package imports for init` | The alias is missing. Add `paths` to `tsconfig.json` and `tsconfig.app.json`, and the alias to `vite.config.ts` |
| `TS2307 · Cannot find module '@/components/ui/button' or its corresponding type declarations` | The `paths` are missing from one of the two `tsconfig` files, or the file does not exist: run `add button` |
| `Failed to resolve import "@/…" … Does the file exist?` in the dev server | The alias is missing from `vite.config.ts`. Restart `npm run dev` after changing the config |
| The dialog works, but a screen reader says only "dialog" | No `DialogTitle`. There is no warning: check by hand |
| The button's text is hard to read after changing `--primary` | The text token (`--primary-foreground`) was not changed with it. Check the ratio |
| I want a newer version of a component | `npx shadcn@latest add button --diff` shows what changed. `add` does not overwrite an existing file unless you pass `--overwrite`: commit first, then compare |
| A `Link` inside a `Button` gives two Tab stops | `<Button asChild><Link …/></Button>` |
| Toasts do not appear | There is no `<Toaster />` in the layout, or it is inside a page that unmounts |
| An icon is huge | `lucide-react` icons are 24px by default. Inside a shadcn `Button` they shrink to 16px; elsewhere give the icon `className="size-4"` |
