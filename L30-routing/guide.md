# L30 · La maison — lecturer guide

**React Router, login and protected pages.** Le Bistro track, lecture 4 of 5 (syllabus v2: L30, React lecture 5).
**Deck:** [`index.html`](index.html), 41 slides. **Code:** starts from [`../code/after-L29`](../code/after-L29), ends at [`../code/after-L30`](../code/after-L30).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md). **Masterclass script:** [`masterclass.md`](masterclass.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | Client-side routing, `BrowserRouter`, `Routes` / `Route`, layout routes with `<Outlet />`, `index` and `*`, `Link` / `NavLink` vs `<a>`, `useParams`, `useSearchParams`, `useNavigate` and `<Navigate>`, the hosting rewrite, token login, a session that survives F5, `RequireAuth` with roles, 401 handling, "a guard is a sign, not a lock" |
| **Le Bistro gets** | Home, menu, a page per dish (`/menu/5`), filters in the address, a login, My account, a staff-only kitchen page, 404 and 403 pages, `vercel.json` |
| **Students' project** | v0.4: pages, a product page, a DummyJSON login, a locked `/profile` |
| **The two problems** | 1. One address for everything: no link to a dish, Back leaves the site. 2. Anyone can type `/kitchen` or `/account` |
| **The two answers** | 1. React Router. 2. A token login and a guard component |
| **AI** | Classwork 2 is done with an AI: a CRAFT prompt (Context, Role, Action, Format, Target), then the students check the code. The Masterclass rebuilds Le Bistro after L30 with one prompt |

---

## Before class

- [ ] Your Le Bistro from L29 runs. If not, copy `code/after-L29` and run `npm install`.
- [ ] Internet works (the API is real). Open https://srmsapi.stepacademy.ge/swagger. The test accounts are written at the top of that page; you need **kitchen@itstep.ge / Kitchen123!** and **student@itstep.ge / Student123!**.
- [ ] Try one login on the real site, https://srms.stepacademy.ge, so you have seen the flow once.
- [ ] `code/after-L30` open in a second VS Code window. Today you copy more than you type: there are 8 new files.
- [ ] Optional: a Vercel account, to show the refresh 404 and its fix (slide 17). A screenshot is enough.

---

## Learn it first (35 minutes)

### 1. One HTML page, many "pages"

A React app is a single HTML page. A "page" is just a component that we choose to show. Before today we chose with state, and the address bar never changed. A **router** chooses by the address instead:

- clicking a `<Link>` changes the address **without reloading** (the History API) and re-renders;
- Back and Forward change the address, and the router re-renders the matching page;
- typing an address or pressing F5 loads the app, and the router reads the address once on start.

So every screen gets a real address that can be shared, bookmarked and refreshed.

### 2. Install and wrap

```bash
npm install react-router
```

```tsx
// main.tsx
<StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</StrictMode>
```

Since version 7 the package is called `react-router`. Old tutorials use `react-router-dom`. There is no `react-router-dom` for version 8: installing it adds a second, older router, and its Links don't see our `BrowserRouter` (error: `useHref() may be used only in the context of a <Router> component`).

### 3. Routes: the map of the house

```tsx
<Routes>
  <Route element={<SiteLayout />}>                 {/* a layout route: no path */}
    <Route index element={<HomePage />} />          {/* "/" */}
    <Route path="menu" element={<MenuPage />} />    {/* "/menu" */}
    <Route path="menu/:id" element={<DishPage />} />{/* "/menu/5", "/menu/anything" */}
    <Route path="*" element={<NotFoundPage />} />   {/* everything else */}
  </Route>
</Routes>
```

- **Layout route**: a route without a path that wraps its children. `SiteLayout` renders Header, `<Outlet />`, Footer. `<Outlet />` is the hole where the matched child page appears.
- **`index`**: the child shown at the parent's own address.
- **Paths inside a parent** have no leading slash: `menu`, not `/menu`.
- **`:id`** matches one segment and gives it to the page as a param. **`*`** matches anything: the 404.
- The router picks the **best** match, not the first one: `/menu/5` never opens `MenuPage`.

### 4. Links

| | What happens |
|---|---|
| `<a href="/menu">` | The browser reloads the whole site. White flash, all state in memory is lost (the cart survives only because it's in localStorage) |
| `<Link to="/menu">` | The router changes the address and swaps the page. No reload |
| `<NavLink to="/menu" className={({ isActive }) => …}>` | A Link that knows whether it points at the current page, to underline the active menu item |

Inside the app, always `Link`. For other websites, `<a href="https://…">` is right.

### 5. Params and search params

```tsx
const { id } = useParams();              // "/menu/5" → { id: "5" }. Always a string!
const dish = dishes.find((d) => d.id === Number(id));
```

```tsx
const [params, setParams] = useSearchParams();   // "/menu?category=drinks&q=wine"
const category = params.get("category") ?? "all";
setParams({ category: "drinks" });               // a new history entry: Back undoes it
setParams({ q: text }, { replace: true });       // typing: replace, don't add entries
```

Filters in the URL survive F5, can be shared, and Back undoes them. Today the `useState` for category and query in the menu is **deleted**: the URL is the state.

### 6. Moving the user

- **In an event handler** (after a login, a "Sign out" click): `const navigate = useNavigate(); navigate("/");`
- **While rendering** (a guard): `return <Navigate to="/login" replace />;`
- `replace` swaps the current history entry instead of adding one. Without it, Back from the login goes to the locked page, which redirects to the login again.
- `state` travels with the navigation without showing in the address: `<Navigate to="/login" state={{ from: "/kitchen" }} />`, read with `useLocation().state`.

### 7. Hosting: the refresh 404

Vite's dev server answers `index.html` for every address. Vercel serves **files**: on F5 at `/menu/5` it looks for a file called `/menu/5`, finds nothing, and answers 404. The fix is a rewrite: "if there is no such file, send `index.html`", and the router takes over in the browser:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Le Bistro's `vercel.json` has one more rule before it: `/api/:path*` → the real API. It's the production twin of Vite's proxy (the API only allows its own origin, see L29). Students on DummyJSON need only the second rule.

### 8. How a token login works

1. `POST /api/v1/auth/login` with `{ email, password }`. The API checks the password and answers `{ accessToken, refreshToken, expiresIn }`.
2. The access token is a signed "wristband". Every protected request shows it: `Authorization: Bearer <token>`.
3. `GET /api/v1/auth/me` with the token answers who we are, including the **role**: `"Admin"`, `"Waiter"`, `"Kitchen"` or `"Student"`.
4. We save `{ token, user }` as the **session** with `useLocalStorage` (L29), so it survives F5. `null` means a guest. We never store the password.

The API's trap: **access tokens live 2 minutes**. After that every protected endpoint answers `401` with the header `X-Token-Expired: true`. Our `api()` turns that into the message "Your session has ended — please sign in again." Real apps exchange the refresh token for a new access token silently (`POST /api/v1/auth/refresh`); that's out of scope today.

Where to keep a token is a real debate: localStorage is readable by any script on the page. For this course it's fine; the Next.js module moves sessions into httpOnly cookies.

### 9. Guards

```tsx
export function RequireAuth({ session, roles }: RequireAuthProps) {
  const location = useLocation();
  if (session === null) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(session.user.role)) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
```

It's a layout route, so it wraps any number of pages:

```tsx
<Route element={<RequireAuth session={session} roles={["kitchen", "waiter"]} />}>
  <Route path="kitchen" element={…} />
</Route>
```

After the login, `LoginPage` reads `from` and navigates there with `replace`.

Which roles may open the kitchen? The same ones the API lets into the order queue: **Waiter and Kitchen** (the real site guards its kitchen page the same way). An admin is sent to /forbidden; admins have their own pages on the real site, which we don't build.

### 10. A sign on the door, not a lock

The guard runs in the user's browser. Anyone can edit localStorage and give themselves the "kitchen" role: the kitchen page then opens, but the API answers the queue request with **403**, because the token (signed by the API) still says "Student". The API is the lock; the guard only keeps honest users out of pages they can't use. Consequences:

- never put a secret in React code (passwords, API keys, "staff codes"): the bundle is public;
- roles come from the API (`/auth/me`), never from a form field.

### 11. The problem we plant for L31

Look at `App.tsx` at the end of today: `cart`, `onAdd`, `onChangeQty` go to three pages; `cart`, `session`, `onChangeQty`, `onRemove`, `onLogout` go to `SiteLayout`, which passes all five to `Header` without using any of them. That's **prop drilling**, on purpose. Don't fix it today; the teaser slide counts it, and L31 (Context) removes it.

### Check yourself

1. What does `<Outlet />` do? → Marks where a layout shows the current child page.
2. Why `Link` and not `<a>`? → `<a>` reloads the whole app and loses in-memory state.
3. What type is `useParams().id`? → A string (or `undefined`). Convert with `Number(id)`.
4. Which page opens `/menu/drinks`? → `DishPage` with `id = "drinks"`, which then shows the 404.
5. Why does F5 give a 404 on Vercel but not on localhost? → Vercel serves files; the rewrite sends `index.html`.
6. `<Navigate>` or `navigate()`? → `<Navigate>` while rendering, `navigate()` in event handlers.
7. Is the guard security? → No. The API's 401/403 is.

Further reading: reactrouter.com, *Declarative mode* → Installation, Routing, Navigating, URL values. react.dev has no routing pages: routing is not part of React itself.

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting, menu, route, the blind rolls up on `/menu/5` |
| 0:03 | Questions | 5–6 | Backup questions; two v0.3 demos, each ending with "send me the link to one product" |
| 0:11 | Problem 1 | 7–9 | The one-address demo: View dish, copy the link, Back, refresh |
| 0:16 | Solution 1 | 10–19 | Route matcher, layout + Outlet, **install + routes (live)**, Link vs `<a>`, **DishPage (live)**, useSearchParams, Vercel rewrite, mistakes, quiz |
| 0:40 | Classwork 1 | 20 | Routes, a layout, a product page |
| 0:55 | Break | 21 |  |
| 1:05 | Problem 2 | 22–23 | Staff only; who may open which door |
| 1:08 | Solution 2 | 24–33 | Login sequence, **LoginPage + session (live)**, the doorman demo, **RequireAuth (live)**, the 2-minute token, sign vs lock, result, mistakes, quiz |
| 1:32 | Classwork 2 with AI | 34 | Students prompt an AI for a DummyJSON login and a locked `/profile`, then check it |
| 1:47 | Masterclass | 35–37 | One prompt rebuilds Le Bistro after L30: part by part, run and check, the short version |
| 1:55 | Wrap-up | 38–41 | Recap, flip cards, homework, "count the props" |

Running late? Skip slides 16 (search params: say "filters can live in the URL, see the code"), 19 and 33 (quizzes). Copy `LoginPage.tsx` instead of typing it. In the Masterclass, show the parts (slide 35) and the short version (slide 37), and skip the live run.

---

## Classwork 2 with AI and the Masterclass

From this track on, the second classwork is done with an AI, and the lecture ends with a Masterclass.

**Classwork 2 with AI** (slide 34, 15 minutes). The task is a DummyJSON login and a locked `/profile`, but the students don't type the code: they write a prompt in five parts (**CRAFT**: Context, Role, Action, Format, Target), the AI writes the code, and they check it against "Done when".
- Any AI tool works: Claude, ChatGPT, Copilot Chat. Students who have none can pair up.
- Walk around and ask students to explain one line the AI wrote. Code they can't explain doesn't count.
- When the answer doesn't work, the next prompt is the exact error message.
- The template, a sample prompt (blurred on the slide until clicked) and the follow-up prompts for the AI's usual mistakes are in [`classwork.md`](classwork.md).

**Masterclass** (slides 35–37, 8 minutes). One prompt rebuilds Le Bistro as it is after today:
1. **The prompt, part by part.** Each press opens one part. For each, one sentence: what would the AI do without it?
2. **Run it, then check it.** Show the answer, then go through the checks on the slide: each one is something from today.
3. **The short version.** The same five parts as one paragraph; press next and each part lights up in its colour.

**Before class:** run the Masterclass prompt once in the AI tool you'll use and keep the answer open: answers take a minute or two and vary a little. The full script, with the exact prompt texts, is [`masterclass.md`](masterclass.md).

---

## The demos

| Slide | Demo | How |
|---|---|---|
| 8 | One address | Click "View dish" on Coq au Vin: the content changes, the address doesn't. The copy icon copies the home page. Back leaves the site (click Back again to return) |
| 10 | Route matcher | Type an address and press Enter or Go. Rows are checked one by one; the match turns green; params and search params appear on the right. Try the four buttons, especially `/pizza` (→ 404) |
| 11 | Layout + Outlet | Click Home / Menu / Coq au Vin inside the frame. Only the dashed area changes. The frame's Back arrow works |
| 14 | `<a>` vs `<Link>` | Add two dishes on both sides, then "Go to /menu". The left flashes white and its order resets to 0; the right keeps it |
| 16 | Search params | Click Drinks, then Desserts, then the frame's Back. The copy icon shows the shareable link |
| 24 | Login sequence | Press next five times: each message slides in from the side that sends it |
| 27 | The doorman | Pick a visitor and a door, press Knock. Guest + /account → login. Student + /kitchen → forbidden. Kitchen + /kitchen → the page |
| 30 | Sign vs lock | Steps 3–5 can be done live, see "The live build", step 13 |
| 34 | The sample prompt | Click the blurred box on the Classwork 2 slide: a complete CRAFT prompt for one shop theme |
| 35 | The prompt, part by part | Press next five times; **Copy** copies the whole prompt with its five labels |
| 37 | The short version | Press next: each part lights up in its colour; **Copy** copies the paragraph |

---

## The live build, step by step

Part 1 (before the break):

1. **Install** (slide 12): `npm install react-router`. In `main.tsx`, wrap `<App />` in `<BrowserRouter>`.
2. **Copy the plumbing** from `code/after-L30`: `types.ts` (adds `Role`, `Session`, `AuthResponse`, `UserProfile`, the queue types), `lib/api.ts` (a third parameter: the token) and `hooks/useApi.ts` (a second parameter: the token), and `index.css` (new classes for the pages, the form and the status pages).
3. **Pages folder** (slide 12): `pages/HomePage.tsx` = Hero + Favourites (cut from App). `pages/MenuPage.tsx` = the old `MenuSection`, renamed. Delete `components/MenuSection.tsx`. Copy `pages/StatusPages.tsx` (NotFound and Forbidden).
4. **The layout** (slides 11, 13): `layouts/SiteLayout.tsx` with Header, `<main><Outlet /></main>`, Footer. It takes the cart and session props for the Header.
5. **The routes** (slide 13): write the structure first (layout, index, menu, `*`), run it, then add the props. Let the room notice how many props there are.
6. **Links**: in `Header.tsx`, `NavLink` for Menu (copy the final Header later, in step 11). In `Hero.tsx`, the `<a href="#menu">` becomes `<Link to="/menu">`. Show slide 14 if someone asks why.
7. **DishPage** (slide 15): type the top part (useParams, useApi, find, NotFound), copy the JSX. In `DishCard.tsx`, the photo and the name become `<Link to={`/menu/${dish.id}`}>`. Click a dish, copy the address, open it in a new tab: Problem 1 solved.
8. **Filters in the URL** (slide 16): in `MenuPage`, replace the two `useState`s with `useSearchParams` (copy from `code/after-L30/src/pages/MenuPage.tsx`).
9. **vercel.json** (slide 17): copy it to the project root.

**Checkpoint 1:** `git commit -am "L30: pages and routes"`.

Part 2 (after the break):

10. **LoginPage** (slide 25): copy `pages/LoginPage.tsx` and walk through `handleSubmit`. In App: `const [session, setSession] = useLocalStorage<Session | null>("bistro.session", null);` and `<Route path="login" element={<LoginPage onLogin={setSession} />} />`.
11. **Header** (slide 26): copy the final `components/Header.tsx` (the name, Sign out, the Kitchen link for staff). Pass `session` and `onLogout` through `SiteLayout`. Sign in as **kitchen@itstep.ge**: the Header changes.
12. **RequireAuth** (slide 28): `routes/RequireAuth.tsx`, then copy `pages/AccountPage.tsx` and `pages/KitchenPage.tsx` and wrap their routes, plus `<Route path="forbidden" element={<ForbiddenPage />} />`. Test: sign out, open `/kitchen` → the login → sign in as kitchen → back on `/kitchen`. Sign in as **student@itstep.ge**, open `/kitchen` → "Staff only".
13. **Optional, slide 30:** signed in as the student, run in the Console:
    ```js
    const s = JSON.parse(localStorage["bistro.session"]);
    s.user.role = "kitchen"; localStorage["bistro.session"] = JSON.stringify(s);
    ```
    F5 on `/kitchen`: the page opens, but the queue shows `Request failed (HTTP 403)`. The sign let you in; the lock held.
14. **The 2-minute token** (slide 29): open My account, wait two minutes, reload it: the "Sign in again" message.

**Checkpoint 2:** your app equals `code/after-L30`. `git commit -am "L30: login and guards"`.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| `npm warn EBADENGINE Unsupported engine { package: 'react-router@8.4.0', required: { node: '>=22.22.0' } }` | Node.js is too old for React Router 8 | Install Node 24 LTS, then `npm install` again |
| `useHref() may be used only in the context of a <Router> component` | No `<BrowserRouter>` in main.tsx, or `react-router-dom` installed next to `react-router` | Wrap App; import everything from `react-router`; `npm uninstall react-router-dom` |
| Header and Footer, but every page is empty | The layout has no `<Outlet />` | `<main><Outlet /></main>` |
| `/` shows the 404 page | No `index` route, so `*` catches `/` too (without a `*` route: a blank page and `No routes matched location "/"` in the Console) | `<Route index element={<HomePage />} />` |
| Every dish is "not found" | `d.id === id` compares a number to a string | `Number(id)` |
| The page reloads (white flash) on a click | `<a href>` inside the app | `<Link to>` |
| 404 after F5 on Vercel | No rewrite | `vercel.json` with `"/(.*)" → "/index.html"` |
| Back from the login lands on the login again | `<Navigate>` without `replace` | Add `replace` |
| After the login the user lands on `/`, not the page they wanted | `from` not passed or not read | `state={{ from: location.pathname }}` in the guard, `location.state?.from` in LoginPage |
| `401` on `/api/v1/profile` right after the login | The token wasn't passed | `useApi(path, session.token)` |
| `401` a few minutes later | The 2-minute token | Expected. "Sign in again" |
| `403` on the kitchen queue | A student or admin account | Sign in as kitchen@itstep.ge or waiter@itstep.ge |
| `blocked by CORS policy` on the login | The absolute `https://srmsapi…` URL | Use `/api/v1/auth/login` through the proxy |
| `Cannot read properties of null (reading 'user')` | A page used `session.user` when the session is `null` | Pages behind the guard receive `session` only when it exists: `element={session && <AccountPage session={session} />}` |
| `SubmitEvent` is not exported by React | Older `@types/react` (before 19.2) | `npm i -D @types/react@latest`, or use `FormEvent` (deprecated in new versions) |

---

## Questions students ask

- **"Why not keep everything on one page with state?"** You can't share or bookmark state, Back doesn't work, and a refresh forgets where you were.
- **"HashRouter? URLs with #?"** An old trick for hosts without rewrites. With Vercel or Netlify, use `BrowserRouter` and a rewrite.
- **"What are loaders and actions in the React Router docs?"** "Data" and "framework" modes: the router loads data before showing a page. We use declarative mode; Next.js does loading on the server later in the course.
- **"Why does the API give tokens that expire after 2 minutes?"** To make you handle expiry. Real access tokens live 5 to 60 minutes and are refreshed silently.
- **"Is localStorage safe for the token?"** Not perfectly: any script on the page can read it. httpOnly cookies are safer; the Next.js module uses them.
- **"Can the guard check the password?"** No. Never compare passwords or secret codes in the browser: the API does.
- **"Why can't the admin open the kitchen?"** Because the API doesn't let admins read the order queue. The guard mirrors the API's rule.
