# L30 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The second one is done with an AI. Start with `npm install react-router` (not `react-router-dom`).

---

## Classwork 1 · Your pages (slide 20)

### Base (everyone)

1. Wrap the app in `main.tsx`:
   ```tsx
   import { BrowserRouter } from "react-router";

   <StrictMode>
     <BrowserRouter>
       <App />
     </BrowserRouter>
   </StrictMode>
   ```
2. A layout, `src/layouts/Layout.tsx`:
   ```tsx
   import { Outlet } from "react-router";

   export function Layout() {
     return (
       <>
         <Header />
         <main>
           <Outlet /> {/* the current page goes here */}
         </main>
         <Footer />
       </>
     );
   }
   ```
3. Move your sections into `src/pages/`: `HomePage.tsx`, `ProductsPage.tsx` (the grid, chips and search), `NotFoundPage.tsx`.
4. The routes, in `App.tsx`:
   ```tsx
   <Routes>
     <Route element={<Layout />}>
       <Route index element={<HomePage />} />
       <Route path="products" element={<ProductsPage />} />
       <Route path="*" element={<NotFoundPage />} />
     </Route>
   </Routes>
   ```
5. In the Header, `NavLink` instead of `<a>`:
   ```tsx
   <NavLink to="/products" className={({ isActive }) => (isActive ? "font-bold underline" : "")}>
     Products
   </NavLink>
   ```

### Plus

A product page at `/products/:id`:

```tsx
export function ProductPage() {
  const { id } = useParams(); // "/products/93" → "93"
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://dummyjson.com/products/${id}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) setNotFound(true);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Product) => setProduct(data))
      .catch(() => {}); // aborted, or the 404 above
    return () => controller.abort();
  }, [id]);

  if (notFound) return <NotFoundPage />;
  if (product === null) return <p>Loading…</p>;
  return <h1>{product.title}</h1>; // then the photo, price, rating, Add to cart
}
```

Route: `<Route path="products/:id" element={<ProductPage />} />`. In your card: `<Link to={`/products/${product.id}`}>`.

If you built your own `useApi` in v0.3, use it here instead.

### Pro

The category lives in the address, `/products?category=mens-watches`:

```tsx
const [params, setParams] = useSearchParams();
const category = params.get("category") ?? "all";

<button onClick={() => setParams(slug === "all" ? {} : { category: slug })}>…</button>
```

Delete the `useState` you had for the category.

### Done when

- [ ] Every page has its own address
- [ ] Back and Forward work
- [ ] No white flash when you click a link (no full reload)
- [ ] `/anything-else` shows your 404 page

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `useHref() may be used only in the context of a <Router> component` | `<BrowserRouter>` missing, or imports from `react-router-dom` |
| Header and Footer show, the page is empty | `<Outlet />` missing in the layout |
| `/` shows the 404 page | No `index` route |
| The product page always says "not found" | Comparing `id` (a string) to a number: use `Number(id)`, or fetch `/products/${id}` directly |
| The page reloads on a click | An `<a href>` is left in the Header or a card |

---

## Classwork 2 · Prompt it: a login and a guard (with AI, slide 34)

The second classwork is done **with an AI**. You write the prompt, the AI writes the code, and you check it. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** A `/login` page with DummyJSON (`/auth/login`, then `/auth/me` for the role); the session saved with `useLocalStorage`; the name in the Header.
- **Plus:** `RequireAuth` around `/profile`, and back to it after the login.
- **Pro:** An `/admin` page only for the admin role.

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| C | **Context** | Your shop, stack and react-router 8 ("import from react-router"). The two DummyJSON endpoints. Paste `App.tsx` and your layout. |
| R | **Role** | "A React teacher who writes simple, safe code." |
| A | **Action** | The Base task, then Plus in a follow-up prompt. |
| F | **Format** | "Only the files that change, complete, with their paths." |
| T | **Target** | "Tell me which part only hides a page and which part really protects it." |

### A sample prompt (Fashion street)

```text
CONTEXT
My shop "Atelier" sells clothes. Vite + React 19 +
TypeScript + Tailwind 4, react-router 8 (import from
"react-router"). DummyJSON: POST /auth/login
{ username, password } -> accessToken;
GET /auth/me (Bearer) -> the user.
ROLE
A React teacher who writes simple, safe code.
ACTION
A /login page that signs in and saves { token, user }
with useLocalStorage, and shows the first name and
"Sign out" in the Header.
FORMAT
Only the files that change, complete, with their paths.
TARGET
Tell me which part only hides a page and which part
really protects it.
```

### The rules

1. Read every line before it goes into your project. You must be able to explain it.
2. Run it. If something fails, the next prompt is the exact error message.
3. One step at a time: Base first, then Plus and Pro as follow-up prompts.
4. Log it in `AI.md`: your prompt, what you kept, what you changed and why.

### Done when

- [ ] Log in, F5: still signed in
- [ ] A guest on /profile lands on /login, then comes back
- [ ] No password stored, imports from `react-router`
- [ ] AI.md: your prompt and one thing you changed

### What the AI tends to get wrong here (for the lecturer)

| The AI writes | The follow-up prompt |
|---|---|
| `import … from "react-router-dom"` and version 6 code | "React Router 8: import everything from react-router." |
| The password saved in localStorage | "Save only the token and the user, never the password." |
| `<Navigate to="/login" />` without `replace` | "Use replace, and pass state.from to come back." |
| A hard-coded admin check (`if (password === …)`) | "Roles come from /auth/me; no secrets in the code." |

### What a good answer looks like

The hand-written solution, to check what the AI produced.

DummyJSON has test users. **emilys / emilyspass** is an admin, **averyp / averyppass** is a normal user.

#### Base (everyone)

1. A session that survives F5, in `App.tsx` (copy `useLocalStorage` from L29 if you don't have it):
   ```tsx
   type Session = { token: string; user: { id: number; firstName: string; role: string } };

   const [session, setSession] = useLocalStorage<Session | null>("shop.session", null);
   ```
2. A `/login` page with two controlled inputs (`username`, `password`) and this submit handler:
   ```tsx
   async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
     e.preventDefault();
     setError("");
     try {
       const res = await fetch("https://dummyjson.com/auth/login", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ username, password }),
       });
       if (!res.ok) throw new Error(`HTTP ${res.status}`);
       const auth: { accessToken: string } = await res.json();

       // who are we? /auth/me knows the role
       const meRes = await fetch("https://dummyjson.com/auth/me", {
         headers: { Authorization: `Bearer ${auth.accessToken}` },
       });
       if (!meRes.ok) throw new Error(`HTTP ${meRes.status}`);
       const me: { id: number; firstName: string; role: string } = await meRes.json();

       onLogin({
         token: auth.accessToken,
         user: { id: me.id, firstName: me.firstName, role: me.role },
       });
       navigate(from, { replace: true });
     } catch {
       setError("That username and password don't match.");
     }
   }
   ```
   `from` comes from the guard (Plus): `const from = (useLocation().state as { from?: string } | null)?.from ?? "/";`
3. The Header shows "Log in" for guests, and the first name plus a "Sign out" button (`setSession(null)`) for users.

#### Plus

A guard, `src/routes/RequireAuth.tsx`:

```tsx
type RequireAuthProps = { session: Session | null; roles?: string[] };

export function RequireAuth({ session, roles }: RequireAuthProps) {
  const location = useLocation();
  if (session === null) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(session.user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
```

```tsx
<Route element={<RequireAuth session={session} />}>
  <Route path="profile" element={session && <ProfilePage session={session} />} />
</Route>
```

`ProfilePage` loads `https://dummyjson.com/auth/me` with the `Authorization` header and shows the name, email and photo (`image`).

#### Pro

An `/admin` page only for `role === "admin"`: `<RequireAuth session={session} roles={["admin"]} />`. Test it with emilys (admin) and averyp (user).

#### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `400` from `/auth/login` with the right password | Missing `Content-Type: application/json`, or `email` sent instead of `username` |
| `401` from `/auth/me` | The header must be exactly `Authorization: Bearer <token>` |
| `role` is `undefined` | It comes from `/auth/me`, not from the login answer |
| Back from `/login` returns to `/login` | `<Navigate>` without `replace` |
| They land on `/` after the login | `state={{ from: location.pathname }}` missing in the guard, or `from` not read in the login page |
| `SubmitEvent` is not exported by React | Old `@types/react`: update it, or use `FormEvent` |
