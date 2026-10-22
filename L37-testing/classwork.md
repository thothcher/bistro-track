# L37 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The second one is done with an AI. The first needs a few packages: you install them once.

**Read this first.** A test you have never seen fail is a test you cannot trust. Whatever you write today, **break your code on purpose** (delete a line, change a number) and watch the test go red. Then put the line back.

---

## Classwork 1 · The first tests of your shop (by hand, slide 22)

### Step 0 · Set it up (everyone, 5 minutes)

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom msw @vitest/coverage-v8
```

`vite.config.ts`: take `defineConfig` from `"vitest/config"` (it was `"vite"`) and add a `test` block:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],   // what you already have
  test: {
    environment: "jsdom",                      // a pretend browser inside Node
    testTimeout: 15_000,                       // a slow machine needs more than 5 seconds
    setupFiles: ["./src/test/setup.ts"],       // runs before every test file
    coverage: { provider: "v8", reportOnFailure: true, include: ["src/**/*.{ts,tsx}"] },
  },
});
```

`src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest"; // toBeInTheDocument(), toBeDisabled(), toHaveFocus()…
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

configure({ asyncUtilTimeout: 5000 }); // findBy… waits up to 5 seconds instead of 1: a busy laptop needs it

afterEach(() => {
  cleanup(); // empty the page after every test
});
```

`package.json`, in `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest",
"coverage": "vitest run --coverage"
```

Run `npm test`. Vitest says `No test files found, exiting with code 1`. That is the right answer: the setup works, and there is nothing to run yet. Keep `npm run test:watch` open in a second terminal: it reruns what you change.

In `tsconfig.app.json` the `"include": ["src"]` already covers your tests. Every test file starts with `import { describe, expect, it } from "vitest"` (we do not switch Vitest's globals on).

### Base (everyone)

**Five tests for the logic of your cart.** Pick the shape of your own cart.

**If the rules are in a function** (a reducer, or helpers like `addToCart`). Next to the code, `cartLogic.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { addToCart, cartTotal, removeFromCart, type CartLine, type Product } from "./cartLogic";

const mascara: Product = { id: 1, title: "Essence Mascara Lash Princess", price: 9.99 };
const palette: Product = { id: 2, title: "Eyeshadow Palette with Mirror", price: 19.99 };

describe("addToCart", () => {
  it("adds a new product with quantity 1", () => {
    const cart = addToCart([], mascara);

    expect(cart).toEqual([{ product: mascara, qty: 1 }]);
  });

  it("raises the quantity of a product that is already in the cart, and adds no second line", () => {
    const once: CartLine[] = [{ product: mascara, qty: 1 }];

    const cart = addToCart(once, mascara);

    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(2);
  });

  it("does not change the cart it was given", () => {
    const once: CartLine[] = [{ product: mascara, qty: 1 }];
    const before = structuredClone(once);

    addToCart(once, mascara);

    expect(once).toEqual(before);
  });
});

describe("removeFromCart", () => {
  it("removes one product and keeps the others", () => {
    const cart: CartLine[] = [
      { product: mascara, qty: 1 },
      { product: palette, qty: 2 },
    ];

    expect(removeFromCart(cart, 1)).toEqual([{ product: palette, qty: 2 }]);
  });
});

describe("cartTotal", () => {
  // Money and floating point: 9.99 × 3 is not always exactly 29.97, so compare to two decimals
  it.each([
    { qty: 1, expected: 9.99 },
    { qty: 3, expected: 29.97 },
    { qty: 10, expected: 99.9 },
  ])("adds up $qty × the price of a mascara", ({ qty, expected }) => {
    expect(cartTotal([{ product: mascara, qty }])).toBeCloseTo(expected, 2);
  });

  it("is 0 for an empty cart", () => {
    expect(cartTotal([])).toBe(0);
  });
});
```

(That test file goes with this `cartLogic.ts`, which is the shape of the functions it tests. Your own file will have your own names.)

```ts
export type Product = { id: number; title: string; price: number };
export type CartLine = { product: Product; qty: number };

export function addToCart(cart: CartLine[], product: Product): CartLine[] {
  const found = cart.find((line) => line.product.id === product.id);
  if (found) {
    return cart.map((line) => (line.product.id === product.id ? { ...line, qty: line.qty + 1 } : line));
  }
  return [...cart, { product, qty: 1 }];
}

export function removeFromCart(cart: CartLine[], productId: number): CartLine[] {
  return cart.filter((line) => line.product.id !== productId);
}

export function cartTotal(cart: CartLine[]): number {
  return cart.reduce((sum, line) => sum + line.product.price * line.qty, 0);
}
```

**If the cart is a Zustand store.** A store lives in memory, outside React: it keeps its state from one test to the next. Give every test a clean one:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { useShopStore } from "./shopStore";

const mascara = { id: 1, title: "Essence Mascara Lash Princess", price: 9.99 };

describe("shopStore", () => {
  // A store is a variable in memory: it outlives a test. Give every test a clean cart.
  beforeEach(() => useShopStore.setState({ lines: [] }));

  it("starts empty", () => {
    expect(useShopStore.getState().lines).toEqual([]);
  });

  it("adds a product", () => {
    useShopStore.getState().add(mascara);

    expect(useShopStore.getState().lines).toHaveLength(1);
  });

  it("empties the cart", () => {
    useShopStore.getState().add(mascara);

    useShopStore.getState().clear();

    expect(useShopStore.getState().lines).toEqual([]);
  });
});
```

**If the rules live inside a component** (a `useState` with the logic in the click handler), you cannot test the rule without the page. Move it out into a function like `addToCart` above (a five-minute change), and test the function. That is the lesson: code that is hard to test is often telling you something.

### Plus

**A component, like a guest.** Render your "Add to cart" button (or your quantity stepper), find it by its **role and name**, press it with `userEvent`, and check what happened with a spy:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AddToCart } from "./AddToCart";

const mascara = { id: 1, title: "Essence Mascara Lash Princess", price: 9.99 };

describe("AddToCart", () => {
  it("tells its parent which product was added", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(); // a spy: it remembers every call
    render(<AddToCart product={mascara} onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "Add Essence Mascara Lash Princess to cart" }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(mascara);
  });
});
```

The component it tests (yours has its own look):

```tsx
export function AddToCart({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  return (
    <button type="button" onClick={() => onAdd(product)}>
      Add {product.title} to cart
    </button>
  );
}
```

Two rules: find things by **role, label or text**, never by a CSS class; and **always `await`** a `user.click`. If you do not know the accessible name of an element, write `screen.getByRole("button")` and read the error: it prints the names of everything it did find.

### Pro

**Break it on purpose.** For **three** of your tests: delete one line of the code (or change a `+` to a `-`), watch the test go red, read what it says, put the line back. Write down any test that **stayed green**: it is not checking what its name promises. Then test a hook with fake timers (your debounce, or this one):

```ts
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

beforeEach(() => vi.useFakeTimers()); // the clock stands still until the test moves it
afterEach(() => vi.useRealTimers()); // and the next test gets the real one back

it("changes only after the value has stopped changing", () => {
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
    initialProps: { value: "so" },
  });

  rerender({ value: "sou" });
  act(() => void vi.advanceTimersByTime(399));
  expect(result.current).toBe("so"); // one millisecond too early

  act(() => void vi.advanceTimersByTime(1));
  expect(result.current).toBe("sou");
});
```

### Done when

- [ ] `npm test` is green, with at least six tests
- [ ] Every test has a name that is a sentence
- [ ] You saw at least two of them fail on purpose
- [ ] No `getByTestId`, and every click is awaited

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `No test files found, exiting with code 1` after writing a test | The file is not named `*.test.ts` or `*.test.tsx`, or it is outside the folder Vitest looks in (the project root) |
| `ReferenceError: describe is not defined` | The file does not import `describe`, `it`, `expect` from `"vitest"` |
| `Error: Invalid Chai property: toBeInTheDocument` | The setup file does not import `@testing-library/jest-dom/vitest`, or `setupFiles` is missing from the config |
| `MISSING DEPENDENCY  Cannot find dependency 'jsdom'` | `npm install -D jsdom` |
| `Cannot find package '@testing-library/dom'` | `npm install -D @testing-library/dom` (a peer dependency of the React package) |
| The second test fails with `Found multiple elements with the role "button"` | No `cleanup()` after each test (the setup file) |
| `Unable to find an accessible element with the role "button" and name "…"` | Read the list of roles it prints. The name is the text of the button, or its `aria-label` |
| `expected "vi.fn()" to be called 1 times, but got 0 times` | A `user.click` without `await` |
| The store test passes alone and fails with the others | The store is not emptied in `beforeEach` |
| `Element type is invalid … but got: undefined` | A name imported from the wrong file. On Windows and macOS `./AddToCart` can open `addToCart.ts` (letter case is ignored); the robot's Linux would pick the other. Rename one of the files |
| The test passes and you do not know why | Break the code on purpose. If it stays green, the test checks nothing |
| `100%` coverage and a bug that no test caught | Coverage counts lines that ran, not lines that were checked |

---

## Classwork 2 · Prompt it: tests for your shop (with AI, slide 40)

The second classwork is done **with an AI**. You write the prompt, the AI writes the code, and you check it. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** tests for the logic of your cart and for one component, with Vitest and Testing Library. `npm test` is green.
- **Plus:** your product list with MSW: a loading message, an error with a retry, and an empty list. A `.github/workflows/ci.yml` that runs lint, build and the tests on every pull request.
- **Pro:** break your code in three ways (the Classwork 1 habit). Which of the AI's tests went red? For each break that no test noticed, ask the AI for a test that catches it.

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| **C** | **Context** | Your shop and its stack, with versions (Vite, React 19, TypeScript, Zustand or whatever you use for the cart, TanStack Query, DummyJSON). The test tools: Vitest 5, jsdom, Testing Library 16, user-event 14, jest-dom, MSW 3. **Paste** your cart code and one component |
| **R** | **Role** | "A React teacher who writes small tests a beginner can read." |
| **A** | **Action** | The Base task. Plus and Pro go in follow-up prompts, one at a time |
| **F** | **Format** | "Only the new files, complete, with their paths. Test names are sentences." |
| **T** | **Target** | "Find things by role or label. Await every click. No test ids, no snapshots. `npm test` is green." |

### A sample prompt (Tech store)

```text
CONTEXT
Shop "Volt". Vite + React 19 + TypeScript, a Zustand cart, DummyJSON
products (https://dummyjson.com/products → { products, total, skip, limit }).
Tests: Vitest 5, jsdom, Testing Library 16, user-event 14, jest-dom,
MSW 3 (http, HttpResponse). My cart store and my AddToCart component:
(pasted)
ROLE
A React teacher who writes small readable tests.
ACTION
Tests for the cart store (add, quantity, remove, clear) and for the
AddToCart button. Then the product list with MSW: loading, an error
with "Try again", an empty list.
FORMAT
Only the new files, complete, with paths. Test names are sentences.
TARGET
getByRole or getByLabelText, awaited user-event, no test ids, no
snapshots. npm test is green.
```

### The rules

1. **Read every line** before you run it. If you cannot explain a line, ask the AI, or delete it.
2. **Run it, one step at a time:** `npm test` after each new file, not after all of them.
3. **Break your code on purpose**, three times. A green test suite proves nothing until you have seen it go red.
4. **A mistake goes back into the chat**, word for word, with the file it is in.
5. **AI.md:** put your prompt in it, and one thing you changed in the AI's answer, and why.

### Done when

- [ ] `npm test` is green
- [ ] You broke the code three times, and you know which tests noticed
- [ ] No `getByTestId`, no snapshot, every click awaited
- [ ] AI.md: your prompt, and one thing you changed in its answer

### What the AI tends to get wrong here

| The AI writes | Follow-up prompt |
|---|---|
| **MSW 1 syntax:** `rest.get(url, (req, res, ctx) => res(ctx.json(…)))` | "I use MSW 3: `http.get(url, () => HttpResponse.json(…))`, imported from `msw`. `setupServer` comes from `msw/node`." |
| `jest.fn()`, `jest.mock(…)`, `jest.useFakeTimers()` | "I use Vitest: `vi.fn()`, `vi.mock`, `vi.useFakeTimers()`, imported from `vitest`." |
| `fireEvent.click(…)` | "Use `userEvent.setup()` and `await user.click(…)`." |
| `getByTestId` everywhere | "Find things by role, label or text. Use a test id only when nothing else works, and say why." |
| A click or a `type` **without `await`** | "Every `user` call must be awaited." |
| A **snapshot** (`toMatchSnapshot`) of a whole component | "No snapshots: write the three things a guest sees as `expect`s." |
| A test with **no `expect`**, or one that only renders | "Every test needs an `expect` that can fail. Name the behaviour it protects." |
| **The module under test mocked** (`vi.mock("./cartStore")`) | "Do not mock what you test. Use the real store, and empty it in `beforeEach`." |
| `waitFor` around a `getBy` for something that is there already | "Use `getBy` when it is there now, `findBy` when it will appear." |
| **Tests that depend on each other** (test 2 needs the cart that test 1 filled) | "Every test builds its own data and starts from an empty store." |
| `@testing-library/react-hooks` (the old package) | "Use `renderHook` from `@testing-library/react`." |
| `server.listen()` with no `onUnhandledFrame`, or the old name `onUnhandledRequest` | "In MSW 3 the option is `onUnhandledFrame: 'error'`." |
| Handlers with the wrong URL (the page asks DummyJSON by its full address) | "My page asks `https://dummyjson.com/products`: the handler uses that address." |
| A fake answer of the wrong shape (a bare array where DummyJSON sends `{ products, total, skip, limit }`) | "DummyJSON answers `{ products: [...], total, skip, limit }`: copy that shape." |

### What a good answer looks like

**Base.** The cart tests and the button test of Classwork 1, written by the AI, and checked by you. The part that is yours is the **break-it table**, in your README:

| I broke… | The line | The test that went red |
|---|---|---|
| `addToCart`: no longer raised the quantity | `if (found) { … }` deleted | "raises the quantity of a product that is already in the cart…" |
| `cartTotal`: forgot to multiply by the quantity | `* line.qty` deleted | "adds up 3 × the price of a mascara" |
| `AddToCart`: the button did nothing | `onClick={() => onAdd(product)}` deleted | "tells its parent which product was added" |

**Plus.** The product list, with MSW. Your shop's list component asks DummyJSON by its full address, so the handlers do too:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { ProductList } from "./ProductList";

const answer = (products: { id: number; title: string; price: number }[]) =>
  HttpResponse.json({ products, total: products.length, skip: 0, limit: 30 });

// Your shop asks DummyJSON by its full address, so the handlers use the full address too
const server = setupServer(
  http.get("https://dummyjson.com/products", () =>
    answer([
      { id: 1, title: "Essence Mascara Lash Princess", price: 9.99 },
      { id: 2, title: "Eyeshadow Palette with Mirror", price: 19.99 },
    ]),
  ),
);

beforeAll(() => server.listen({ onUnhandledFrame: "error" })); // a request nobody planned fails the test
afterEach(() => server.resetHandlers()); // forget what a test changed
afterAll(() => server.close());

// A new cache for every test, and no retries: a failing request must fail the test now
function renderList() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ProductList />
    </QueryClientProvider>,
  );
}

describe("ProductList", () => {
  it("shows a loading message, then the products", async () => {
    renderList();

    expect(screen.getByText("Loading the products…")).toBeInTheDocument();
    expect(await screen.findByText(/Essence Mascara Lash Princess/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("offers a retry after an error, and the retry works", async () => {
    const user = userEvent.setup();
    server.use(
      // { once: true }: this answer is used for the first request only
      http.get("https://dummyjson.com/products", () => new HttpResponse(null, { status: 500 }), { once: true }),
    );
    renderList();

    expect(await screen.findByText(/We couldn't load the products/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText(/Essence Mascara Lash Princess/)).toBeInTheDocument();
  });

  it("says so when there is nothing to show", async () => {
    server.use(http.get("https://dummyjson.com/products", () => answer([])));
    renderList();

    expect(await screen.findByText("No products today.")).toBeInTheDocument();
  });
});
```

(It tests this component, which uses TanStack Query as in L34. Yours has its own texts: use the sentences your page shows.)

```tsx
import { useQuery } from "@tanstack/react-query";
import type { Product } from "./cartLogic";

type ProductsAnswer = { products: Product[]; total: number; skip: number; limit: number };

export function ProductList() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("https://dummyjson.com/products?limit=30");
      if (!res.ok) throw new Error("HTTP " + res.status);
      return (await res.json()) as ProductsAnswer;
    },
  });

  if (isPending) return <p>Loading the products…</p>;
  if (isError) {
    return (
      <p>
        We couldn't load the products.{" "}
        <button type="button" onClick={() => void refetch()}>
          Try again
        </button>
      </p>
    );
  }
  if (data.products.length === 0) return <p>No products today.</p>;

  return (
    <ul>
      {data.products.map((p) => (
        <li key={p.id}>
          {p.title} · ${p.price}
        </li>
      ))}
    </ul>
  );
}
```

And the robot, `.github/workflows/ci.yml` (it needs a `package-lock.json` in the repository, which `npm install` makes):

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm run coverage
```

**Pro.** The break-it table has three more rows, and for each break that **no** test noticed there is a new test that does. Example follow-up prompt: *"I deleted the line `if (found) { … }` from `addToCart` and no test went red. Write one test that fails when that line is missing, and tell me why the others did not."*

### Common problems

| Problem | Fix |
|---|---|
| Everything is green, and a broken line changes nothing | The AI wrote tests with no `expect`, or tests that mock what they test. Ask it to list what each test protects, and read the weak ones |
| `[MSW] Error: intercepted a request without a matching request handler: • GET https://dummyjson.com/products/search?q=…` | A request the handlers do not cover (a different path: `/products/search`). Add a handler, or `server.use(…)` in that test |
| The handlers never answer | The handler path is relative (`/products`) while the page asks the full address, or the other way round |
| A `useQuery` test hangs, or the error test takes seconds | The test's `QueryClient` retries (the default is 3 times). `retry: false` |
| `TypeError: fetch failed` in the middle of a test | The request left the process: the fake server is not listening (`server.listen` in `beforeAll`) |
| The AI's test finds a product by `getByTestId("product-1")` | Ask for the text the guest sees: `getByText(/Essence Mascara/)` or `getByRole("listitem")` |
| `ci.yml` fails with `npm ci` can only install with an existing package-lock.json | The lock file is not committed: run `npm install` and commit `package-lock.json` |
| The pull request shows no checks | The file is not at `.github/workflows/ci.yml`, or there is no pull request yet |
