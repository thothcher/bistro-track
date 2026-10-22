# L32 · Le garde-manger — lecturer guide

**Zustand and "where does this state live?"** Le Bistro track, lecture 6 of 10 (syllabus v2: **L34**, React lecture 7).
**Deck:** [`index.html`](index.html), 44 slides. **Code:** starts from [`../code/after-L31`](../code/after-L31), ends at [`../code/after-L32`](../code/after-L32).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md). **Masterclass script:** [`masterclass.md`](masterclass.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | What a store is, `create`, selectors (a selector is a question), why no selector means everybody re-renders, `useShallow`, `persist` with `partialize`, `getState()` and `subscribe()` outside components, the five homes of state (local, URL, form, store, server) and the four questions that pick one, client state vs server state, Redux Toolkit in one slide |
| **Le Bistro gets** | `cartStore` (Zustand + `persist`, the same `cartReducer` inside) and `authStore`; no providers; `api.ts` signs the guest out when the token expires. `main.tsx` goes from 2 wrappers to 0 |
| **Students' project** | v0.6: stores for the cart and the session, selectors everywhere, a "where does it live?" table in the README |
| **The two problems** | 1. One click on "Add to cart" re-renders every card (25 on the real menu), and a context needs a provider. 2. Server data copied into a client store goes stale |
| **The two answers** | 1. A store with selectors. 2. The state map: ask whose state it is first |
| **AI** | Classwork 2 is done with an AI: a CRAFT prompt (Context, Role, Action, Format, Target), then the students check the code. The Masterclass rebuilds Le Bistro after L32 with one prompt |

**Numbers:** the L31 app re-renders 25 `DishCard`s for one click; the L32 app re-renders 1 (measured on the production build with a render counter). The slides show 12 cards and say "25 on the real menu".

---

## Before class

- [ ] Your Le Bistro from L31 runs (or copy `code/after-L31`, `npm install`).
- [ ] Do the measurement once: in `code/after-L31`, open the menu, switch on React DevTools → Components → ⚙ → **Highlight updates when components render**, and add one dish. Every card flashes. That is the problem you will show.
- [ ] `code/after-L32` open in a second VS Code window.
- [ ] The API's test accounts at hand (listed on https://srmsapi.stepacademy.ge/swagger): you sign in once in the second half, and the token lives 2 minutes.
- [ ] Try the demos on slides 8, 14, 17, 24, 29 and 32 once. They run in the deck, no internet needed.
- [ ] Put the link to [`../student-project.md`](../student-project.md) in the class chat again: v0.6 has a new table to write.

---

## Learn it first (35 minutes)

### 1. The cost of a context

A context re-renders **every component that reads it** when its value changes. In L31, `DishCard` calls `useCart()` to ask "how many of me?", so adding one dish wakes all of them. For twelve cards it is unnoticeable. For a long list, or a value that changes many times a second (a timer, a text field), it matters. Splitting contexts (as L31 did) helps; a store with selectors fixes it at the root.

### 2. A store

```ts
export const useCartStore = create<CartState>()((set) => ({
  items: [],
  add: (dish) => set((s) => ({ items: cartReducer(s.items, { type: "added", dish }) })),
}));
```

- `create` builds a **store**: one object holding the state and the actions. It lives in a module, **outside React**. No provider.
- `set` merges what you return into the state (shallowly). `set((s) => ({ … }))` reads the old state `s`.
- `create<CartState>()(…)` has two pairs of parentheses on purpose: it is how TypeScript infers the state type once you add middleware.
- `create` returns a **hook**: `useCartStore(selector)`.
- Our rules did not change: the actions call the same pure `cartReducer` from L31. Only where they live changed. (This is what L31's homework said: "keep your reducer".)

> **Say it like this:** "The pass handed finished plates from person to person. The pantry is a room: any cook walks in and takes exactly the one thing they need."

### 3. Selectors

```ts
const qty = useCartStore((s) => s.items.find((i) => i.dish.id === dish.id)?.qty ?? 0);
```

A **selector** is a function from the whole state to the piece you need. After every change Zustand runs every selector again and compares the result with the previous one using `Object.is`. Only components whose result **changed** re-render.

- Return **primitives** (numbers, strings, booleans) or an existing object (`s.items`, `s.add`). A selector may calculate (`s.items.reduce(…)`): the number is what counts.
- **Actions** never change, so `useCartStore((s) => s.add)` never causes a render. Select them one by one.
- **No selector** (`const { items, add } = useCartStore()`) subscribes to the whole store: everybody re-renders on every change. It works, which makes it a silent bug.
- **A selector that builds a new object or array** (`(s) => ({ a: s.a, b: s.b })`) returns a new value every time. React sees "changed" on each check and loops: `The result of getSnapshot should be cached to avoid an infinite loop`, then `Maximum update depth exceeded`. Fix: one selector per value, or `useShallow` (`import { useShallow } from "zustand/react/shallow"`), which compares the pieces instead of the object.
- Name selectors `selectX` and keep them with the store (`selectCount`, `selectTotal`, `selectQtyOf(id)`).

### 4. `persist`

```ts
create<CartState>()(
  persist((set) => ({ … }), { name: "bistro.cart", partialize: (s) => ({ items: s.items }) }),
)
```

A **middleware** wraps the creator and adds a behaviour. `persist` saves the state to localStorage after every change and reads it back when the app starts. `name` is the key; `partialize` picks what to save (the data, not the functions, and not temporary flags). It writes `{ "state": { … }, "version": 0 }`, so a cart saved by L31 (a bare array under the same key) is ignored once and the cart starts empty. If you change the shape later, bump `version` and write `migrate`. This replaces `loadCart` and the saving `useEffect` of L31's provider (about 20 lines).

### 5. Outside React

The store is a plain object with a hook on top:

| Call | Use |
|---|---|
| `useCartStore(selector)` | in components: subscribes |
| `useAuthStore.getState()` | anywhere: reads once, no subscription |
| `useAuthStore.setState(…)` | anywhere: changes the state |
| `useAuthStore.subscribe((state, before) => …)` | anywhere: runs on every change (L34 uses it to empty a cache on sign-out) |

`api.ts` is not a component, yet it can call `useAuthStore.getState().logout()` when the API answers 401 with `X-Token-Expired: true`. `RequireAuth` then sees `session === null` and redirects. **Never** use `getState()` in a component body for something shown on screen: it will not update.

### 6. The state map

| Home | Tool | Le Bistro example |
|---|---|---|
| Local | `useState` | is the cart panel open? |
| URL | `useSearchParams`, route params | category, search text, dish id |
| Form | React Hook Form (L33) | the sign-up fields |
| Store | Zustand | the cart, the session |
| Server | TanStack Query (L34, L35) | the menu, the profile, the order queue |

Ask **in this order**: Does the server own it? → Must it survive F5 or be shared in a link? → Is it the draft of a form? → Do far-apart components need it? → otherwise it is local. **Client state** (ours, never old, always there) and **server state** (the server's, can get old, arrives later, can fail) need different tools. A store is a good home for the first and a bad one for the second: that is Problem 2.

### 7. Redux Toolkit

The older, bigger sibling. One store for the whole app, `createSlice` (state + reducers + actions), `configureStore`, a `<Provider>`, `useSelector` and `dispatch`. Reducers may "mutate" because Immer turns it into an immutable update. RTK Query is its answer to TanStack Query. Students meet it in job ads; the slide gives them the words, and `redux-toolkit.js.org` the tutorial for the day they need it.

### Check yourself

1. Why does adding one dish re-render 25 cards with a context and 1 with a store? → The context wakes every reader; a selector wakes only components whose answer changed.
2. What is wrong with `useCartStore((s) => ({ count: s.items.length }))`? → It builds a new object on every check: an infinite loop. Select the number, or use `useShallow`.
3. What does `partialize` do? → Chooses what `persist` saves: the data, not the functions.
4. Why can `api.ts` read the session but could not with a context? → A store is a plain object; a context exists only inside the component tree.
5. Where should the menu from the API live? → Not in a store: it is the server's. TanStack Query (L34).
6. Where should the search text live? → The URL: shareable, survives F5, Back works.

Further reading: the Zustand docs (zustand.docs.pmnd.rs → "Getting started", "Persisting store data", "Prevent rerenders with useShallow"), react.dev → *Choosing the State Structure* and *Sharing State Between Components*, and the Redux Toolkit "Essentials" tutorial (redux-toolkit.js.org).

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting, menu, the second five-lecture route, the blind rolls up on `main.tsx` |
| 0:03 | Questions | 5–6 | Backup questions; two v0.5 demos, each ending with "Highlight updates" |
| 0:11 | Problem 1 | 7–9 | **Add one espresso, count the renders**, and "What would we need?" |
| 0:16 | Solution 1 | 10–20 | A store lives outside React, `create` in one picture, **the cart store (live)**, **components read the store (live)**, three ways to read the cart, **remove the providers (live)**, persist, watch it save, outside React, mistakes, quiz |
| 0:40 | Classwork 1 | 21 | A cart store with persist in their shop |
| 0:55 | Break | 22 | |
| 1:05 | Problem 2 | 23–25 | **A copy of the server, going stale**; "What would we need now?" |
| 1:10 | Solution 2 | 26–36 | Five homes, four questions, client vs server state, **the sorting game**, **the session store (live)**, **api.ts signs out (live)**, the token expires, Redux Toolkit, the page at the end, mistakes, quiz |
| 1:32 | Classwork 2 with AI | 37 | Students prompt an AI for a cart store and a state map, then check it |
| 1:47 | Masterclass | 38–40 | One prompt rebuilds Le Bistro after L32: part by part, run and check, the short version |
| 1:55 | Wrap-up | 41–44 | Recap, flip cards, homework, next time (forms) |

Running late? Skip slides 11 (anatomy: say "four ideas"), 18 (outside React: it returns on slide 31), 20 and 36 (quizzes) and 33 (Redux: one sentence). In the second half, copy `authStore.ts` instead of typing slide 30. Never skip the classworks. In the Masterclass, show the parts (slide 38) and the short version (slide 40), and skip the live run.

---

## Classwork 2 with AI and the Masterclass

**Classwork 2 with AI** (slide 37, 15 minutes). The task is a cart store (Base), a session store and a self-signing-out `api.ts` (Plus), and a state-map table in the README (Pro). The students write a five-part prompt (**CRAFT**), the AI writes the code, and they check it against "Done when".
- Any AI tool works: Claude, ChatGPT, Copilot Chat. Students who have none can pair up.
- Walk around and ask students to explain one line the AI wrote. Code they can't explain doesn't count.
- When the answer doesn't work, the next prompt is the exact error message.
- The template, a sample prompt (blurred on the slide until clicked) and the follow-up prompts for the AI's usual mistakes are in [`classwork.md`](classwork.md).

**Masterclass** (slides 38–40, 8 minutes). One prompt rebuilds Le Bistro as it is after today:
1. **The prompt, part by part.** Each press opens one part. For each, one sentence: what would the AI do without it?
2. **Run it, then check it.** Show the answer and go through the checks: each one is something from today.
3. **The short version.** The same five parts as one paragraph; press next and each part lights up.

**Before class:** run the Masterclass prompt once and keep the answer open (a minute or two, and it varies). The exact texts are in [`masterclass.md`](masterclass.md).

---

## The demos

| Slide | Demo | How |
|---|---|---|
| 8 | Add one espresso, count the renders | Click any card's button: the header and all 12 cards flash and their counters go up. The big number is the total. Reset |
| 14 | Three ways to read the cart | "Store + selector": click → 2 renders. "Context (L31)": 13. "Store, no selector": 13. Switching resets |
| 17 | Watch it save | Add a dish: the JSON under `bistro.cart` changes. **Press F5**: the page empties, then the order is rebuilt from the JSON. **Clear storage**, then F5: empty |
| 24 | A copy of the server, going stale | `loadDishes()` fills the store (flags flip by hand). "Kitchen: switch it off": the store's card turns **stale**. "A second page loads it too": a second request |
| 29 | Where does it live? | Click a card, then a home. A wrong home shows the question to ask; after two wrong tries the card places itself. The first-try score counts at the end |
| 32 | The token expires | Sign in → fast-forward → `GET /profile`: 401, `api.ts` signs out, the Header and the guard follow. The console lists the steps |
| 37 | The sample prompt | Click the blurred box on the Classwork 2 slide: a complete CRAFT prompt for one shop theme |
| 38 | The prompt, part by part | Press next five times; **Copy** copies the whole prompt with its five labels |
| 40 | The short version | Press next: each part lights up in its colour; **Copy** copies the paragraph |

---

## The live build, step by step

Part 1 (before the break): the cart.

1. **Install:** `npm install zustand`.
2. **`src/cart/cartStore.ts`** (slide 12): type it with the room: imports, `CartState`, `create`, the four actions calling `cartReducer`. Copy the three selectors (`selectCount`, `selectTotal`, `selectQtyOf`) from `code/after-L32/src/cart/cartStore.ts`.
3. **Readers** (slide 13): replace `useCart()` in `DishCard` (selector for the quantity, two action selectors), `Header` (the count), `CartPanel` (`items`, `selectTotal`, `useShallow` for the actions) and `Favourites` (`add`). In `DishPage` the hook must run before the early `return`s: read the id with `useParams()` first and call `useCartStore(selectQtyOf(Number(id)))` at the top. Follow TypeScript's red lines.
4. **Remove the providers** (slide 15): delete `CartContext.ts` and `CartProvider.tsx`; remove `<CartProvider>` from `main.tsx`.
5. **persist** (slide 16): wrap the creator, give it `name: "bistro.cart"` and `partialize`. Delete nothing else: the cart panel and cards are unchanged.
6. **Test:** add two dishes, F5 (still there), "Empty the order". With "Highlight updates" on, add a dish: one card flashes.

**Checkpoint 1:** `git commit -am "L32: the cart in a store"`.

Part 2 (after the break): the session.

7. **`src/auth/authStore.ts`** (slide 30).
8. **Readers:** `Header` (`session`, `logout`), `LoginPage` (`login`), `RequireAuth` (`session`), `AccountPage` and `KitchenPage` (`token` from `useAuthStore((s) => s.session?.token)`).
9. **Delete** `AuthContext.ts` and `AuthProvider.tsx`; `main.tsx` now has only `<StrictMode>` and `<BrowserRouter>`.
10. **`src/lib/api.ts`** (slide 31): `import { useAuthStore } from "../auth/authStore";` and `if (expired) useAuthStore.getState().logout();`. In `AccountPage` and `KitchenPage` delete the "sign in again" notice and keep the generic error line.
11. **Test:** sign in, F5 (still signed in), wait two minutes, click "My account": you land on `/login`.

**Checkpoint 2:** your app equals `code/after-L32`. `git commit -am "L32: stores, no providers"`. This is where L33 starts.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| `The result of getSnapshot should be cached to avoid an infinite loop`, then `Maximum update depth exceeded` | A selector returns a new object or array every time | One selector per value, or `useShallow(...)` |
| Every card flashes in "Highlight updates" | `useCartStore()` with no selector, or the whole store destructured | `useCartStore((s) => s.add)`, `useCartStore(selectQtyOf(id))` |
| The header count never changes | `useCartStore.getState()` read in a component body | Use the hook with a selector |
| Add to cart does nothing, no error | The action changed the old array in place and returned it | Return a new array (the reducer does) |
| `React has detected a change in the order of Hooks` in `DishPage` | The selector hook was placed after an early `return` | Read the id from `useParams()` at the top, then call the hook |
| `Expected 0-1 arguments, but got 2` (and `'items' is of type 'unknown'`) on `useCartStore(selector, shallow)` | Zustand 4's second argument, an equality function. Zustand 5 removed it | Wrap the selector: `useCartStore(useShallow(selector))`, with `import { useShallow } from "zustand/react/shallow"` |
| The cart is empty after moving from L31 | The saved shape is now `{ state, version }`; the old array is ignored once | Expected. Add dishes again |
| Signed in, F5 sends you to /login | The token lives 2 minutes (an API trap) | Sign in again, right before you show it |
| `Cannot find module '../auth/AuthContext'` | A file still imports the deleted context | Replace it with `useAuthStore` and follow the red lines |

---

## Questions students ask

- **"Zustand or Context?"** Context for a few values that rarely change and belong to a part of the tree (a theme, a language). A store for app data that is used far apart or changes often. Both are fine for the session; this course uses a store.
- **"Why no provider?"** The store is a module, not part of the tree. The hook subscribes to it directly (React's `useSyncExternalStore`).
- **"Do I have to write selectors?"** Always pass one, even a one-liner. A bare `useCartStore()` is a context with extra steps.
- **"Is the reducer needed? I can write `set` directly."** Yes, you can. We keep the reducer because it is pure, testable (L39) and already written; `set` is just the doorway.
- **"Where do the selectors live?"** Next to the store, named `selectX`, so a component imports them and never repeats the logic.
- **"Can one store read another?"** `useOtherStore.getState()` inside an action, sparingly. Prefer two independent stores.
- **"Does Zustand have devtools?"** The `devtools` middleware plugs into the Redux DevTools browser extension. Optional (Pro task).
- **"Is a token in localStorage safe?"** No: any script on the page can read it. We keep it there in this course; Security Day I (L41) shows the risk, and the Next.js module moves the session into an httpOnly cookie.
- **"Redux, then?"** Same ideas, more ceremony. Know the words; learn it when a project needs it.
