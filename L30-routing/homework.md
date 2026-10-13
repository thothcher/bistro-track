# L30 · Homework: your shop, version 0.4

**Due:** before L31. **Submit:** the GitHub link and the Vercel link.

## Base (required)

1. **Pages:** `/`, `/products`, `/products/:id`, `/login`, `/profile` and a 404 for everything else, inside one layout (Header, `<Outlet />`, Footer). The Header uses `NavLink`; there is no `<a href>` pointing inside your app.
2. **Product page:** `/products/:id` loads `https://dummyjson.com/products/{id}`. Every card links to it. An unknown id (`/products/9999`) shows your 404 page.
3. **Login:** `POST https://dummyjson.com/auth/login` with `{ username, password }`, then `GET /auth/me` with the token for the role. The session (`{ token, user }`) is saved with `useLocalStorage`. The Header shows the user's first name and a "Sign out" button.
4. **A locked page:** `RequireAuth` around `/profile`. A guest is sent to `/login` and, after signing in, back to `/profile`.
5. **Refresh works on Vercel:** a `vercel.json` in the project root:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```

## Plus

- The category and the search live in the address: `/products?category=mens-watches&q=leather`. Typing uses `setParams(…, { replace: true })`.
- An `/admin` page only for `role === "admin"` (emilys is an admin, averyp is not).

## Pro

Handle an expired token. Log in with `expiresInMins: 1` in the body. When `/auth/me` answers 401, call `POST https://dummyjson.com/auth/refresh` with `{ refreshToken }`, save the new tokens and retry once. If that fails too, sign the user out with a friendly message.

## Before you submit

- [ ] Send someone the link to one product: it opens that product
- [ ] F5 on every page of the Vercel link: no 404
- [ ] Back and Forward work everywhere, also after the login
- [ ] DevTools → Application → Local Storage: no password anywhere
- [ ] `package.json` has `react-router`, not `react-router-dom`
- [ ] `npm run build` passes

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | Routes, a layout with `<Outlet />`, `NavLink`s, a 404 page |
| 2 | Product page with `useParams`, cards link to it |
| 2 | Login, a session that survives F5, sign out |
| 1 | `RequireAuth` that sends the guest back after the login |
| 1 | `vercel.json`: refresh works on every page |
| 1 | Clean: no full reloads, no stored password, no lint warnings |
| +1 | Plus |
| +1 | Pro |

**Heads-up:** count how many components receive `cart` or `session` only to pass them on to a child. That's L31.
