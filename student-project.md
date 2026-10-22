# Your project: a shop of your own

While the lecturer builds **Le Bistro** on screen, you build **your own shop** at home: the same React ideas, different products. You start at the first React lecture (L27) and add one version after every lecture. From L39 the module's final project, the **Admin Dashboard**, is the back office of this shop, and you present everything at **Demo Day (L42)**.

## 1. Pick a theme

| Theme | DummyJSON categories | Your twist |
|---|---|---|
| Watch boutique | `mens-watches`, `womens-watches` | Cart, wishlist, sizes |
| Beauty bar | `beauty`, `skin-care`, `fragrances` | Cart, filter by brand |
| Furniture house | `furniture`, `home-decoration` | Cart, room filters |
| Tech store | `smartphones`, `laptops`, `tablets` | Cart, a compare list |
| Fashion street | `tops`, `womens-dresses`, `mens-shoes` | Cart, a size filter |
| Recipe book | `/recipes` (cuisine, meal type, tags) | A meal plan instead of a cart |

- **Not a restaurant.** Le Bistro is the lecturer's; the shop is yours.
- Two students may pick the same theme; the code will still be your own.
- Another idea or another free API (no key, CORS open)? Show it to your lecturer first.

## 2. The API: DummyJSON

[dummyjson.com](https://dummyjson.com) is free, needs no key, and allows requests from any website. All addresses start with `https://dummyjson.com`.

### Products

| Request | Answer |
|---|---|
| `GET /products` | `{ products, total, skip, limit }` (30 by default; `?limit=0` gives all 194) |
| `GET /products?limit=12&skip=12` | the second page of 12 |
| `GET /products?select=title,price,thumbnail` | only these fields |
| `GET /products?sortBy=price&order=asc` | sorted |
| `GET /products/{id}` | one product, or `404 { message }` |
| `GET /products/search?q=watch` | `{ products, … }` |
| `GET /products/categories` | `[{ slug, name, url }]` |
| `GET /products/category-list` | `["beauty", "fragrances", …]` |
| `GET /products/category/{slug}` | `{ products, … }` for one category |

A product has `id`, `title`, `description`, `category`, `price` (in US dollars), `discountPercentage`, `rating`, `stock`, `brand`, `tags`, `images`, `thumbnail`, `availabilityStatus`, `minimumOrderQuantity`, `shippingInformation`, `warrantyInformation`, `returnPolicy` and `reviews`. Example: `GET /products/93` is the "Brown Leather Belt Watch", $89.99, 32 in stock.

### Recipes (Recipe book only)

`GET /recipes`, `/recipes/{id}`, `/recipes/search?q=`, `/recipes/tags`, `/recipes/tag/{tag}`, `/recipes/meal-type/{type}` (for example `snack`). Lists come as `{ recipes, total, skip, limit }`.

### Login

| Request | Answer |
|---|---|
| `POST /auth/login` with `{ username, password }` (optional `expiresInMins`) | `{ id, username, firstName, lastName, email, image, accessToken, refreshToken }` |
| `GET /auth/me` with `Authorization: Bearer <accessToken>` | the user, including `role`: `"admin"`, `"moderator"` or `"user"` |
| `POST /auth/refresh` with `{ refreshToken }` | new tokens |

Test users: **emilys / emilyspass** (admin), **averyp / averyppass** (user). More in `GET /users?select=username,password,role`.

### Writing

`POST /products/add`, `PUT` / `PATCH /products/{id}` and `DELETE /products/{id}` answer as if they worked, but **nothing is saved**: the next `GET` returns the old data. That's enough for the Admin Dashboard's forms; your UI updates its own copy.

## 3. One version after every lecture

| After | Version | What your shop can do | Le Bistro on screen |
|---|---|---|---|
| L27 | **v0.1** | Header, hero, a product grid from a typed data file (8–12 real products), footer. Every component in its own file with a props type. Live on Vercel | Home page and menu from components |
| L28 | **v0.2** | A cart (or meal plan) with quantities, a category filter, a search box. Totals are calculated, not stored | Cart, stepper, chips, search |
| L29 | **v0.3** | Products from DummyJSON with loading, empty and error states; the cart survives F5; a debounced search | Real API, skeletons, saved cart |
| L30 | **v0.4** | Pages: home, products, a product page per id, login, a protected profile, 404. F5 works on Vercel | Pages, dish page, login, guards |
| L31 | **v0.5** | An auth context and a cart reducer in a provider: no cart or session props | One cart and one session everywhere |
| L32–L38 | v0.6 → v1.0 | Zustand, forms with React Hook Form and Zod, TanStack Query, accessible UI, tests, performance: each lecture's homework says how they apply to your shop | |
| L39–L42 | **Admin Dashboard** | The back office of your shop (or of your pair's shop): admin login, a products table (sort, filter, pages), create / edit / delete dialogs, toasts, charts, dark mode. Presented at Demo Day | |

The exact tasks and grading of each version are in the lecture's `homework.md`.

### 3b. The second five: v0.6 to v1.0

The row "L32–L38" above is spelled out here, one version after every lecture of the second five (L32 to L36 in the track):

| After | Version | What your shop can do | Le Bistro on screen |
|---|---|---|---|
| L32 | **v0.6** | The cart and the session live in Zustand stores (with `persist`), every component reads them with a selector, and the context providers are gone | One store, no provider |
| L33 | **v0.7** | A login and a sign-up with React Hook Form and Zod schemas, error messages from the schema, and a form in steps or a dynamic list (Plus) | A sign-up, a login, table notes |
| L34 | **v0.8** | All server data on TanStack Query: one `queryClient`, `queryOptions`, keys that list what their functions use, a smooth category change, prefetch on hover, a retry rule | The menu fetched once |
| L35 | **v0.9** | A "Place order" mutation (`POST /carts/add`) with a guard, `invalidateQueries` and one global error toast; an optimistic heart (Plus); an infinite list (Pro) | Orders, "My orders", the kitchen's buttons |
| L36 | **v1.0** | shadcn/ui, the cart as a `Sheet` you can use with a keyboard, a skip link, titles on every dialog, Sonner; Plus: a quick look, an account menu, a confirmation; Pro: role tokens and measured contrast | An accessible UI |

v1.0 is the version the next lectures test and speed up, so keep it tidy. (The numbers in the main table and in sections 1 to 6 use the older syllabus numbering: in the current syllabus the Admin Dashboard is L42–L45 and Demo Day is L45.)

### 3c. The third five: v1.1 and on

| After | Version | What your shop can do | Le Bistro on screen |
|---|---|---|---|
| L37 | **v1.1** | A net under the shop: Vitest, jsdom, Testing Library and user-event set up; at least six tests (three for the cart logic, two for components found by role, label or text, one for a form or a hook), a table in the README of three things you broke on purpose and which test went red; Plus: a fake kitchen with MSW (loading, error with retry, empty); Pro: a GitHub Actions workflow with a red check and a green check | 115 tests and a robot |
| L38 | **v1.2** | Faster and harder to break, with numbers: a before/after table in the README (at least two rows: the action, renders or kilobytes before and after, what you changed, how you measured); every page except the first ones with `lazy()`, one `Suspense` skeleton, and `npm run build` printing a file per page; an error boundary around the page (`resetKeys`, `onError`); Plus: lazy photos and a high-priority hero, a boundary around each product card with a test, a size budget in CI; Pro: a virtual list or paging for the 194 products with the element count before and after, a `vite:preloadError` handler with a test, the compiler with its report | a search box that keeps its text, a kitchen with 800 orders, a size check |

## 4. Rules

**Tools:** Node.js 24 LTS (React Router 8 needs 22.22 or newer), VS Code, Git, a GitHub and a Vercel account. Start with `npm create vite@latest my-shop -- --template react-ts`.

1. **One GitHub repository** from L27 to Demo Day. Commit often, with messages that say what changed.
2. **A live Vercel link, every week.** Lecturers check the deployed version, not screenshots. From v0.4 on, `vercel.json` makes refresh work on every page.
3. **README.md**: the shop's name, a screenshot, the live link, and what works in this version.
4. **AI is a teacher, not a ghostwriter.** You may ask an AI to explain, review or debug, and the second classwork of every lecture is done with an AI on purpose: you write a prompt in five parts (**CRAFT**: Context, Role, Action, Format, Target) and check what comes back. Write it all down in **AI.md**: what you asked, what you kept, what you threw away and why. Code you can't explain doesn't count.
5. **Le Bistro is for ideas, not for copying.** Read its code (`bistro-track/code/after-LXX`), then write your own for your products.
6. **No secrets in the code.** DummyJSON needs no key; never commit a password or a token.

## 5. Grading

- Every version is graded out of **10 points**, plus up to 2 bonus points for the Plus and Pro tasks (see each `homework.md`).
- **Demo Day (L42):** a 3-minute demo of the live site, followed by a short peer code review. Show the flow (login, the shop, the cart, the dashboard), one piece of code you are proud of, and one bug you fixed and how.

## 6. Before you submit a version

- [ ] `npm run build` passes, and `npm run lint` shows no warnings
- [ ] The Vercel link works, also after F5 on an inner page
- [ ] The README is up to date
- [ ] AI.md has an entry for this week (if you used AI)
- [ ] You can explain every file you changed
