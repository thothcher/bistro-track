# Le Bistro after L30 · La maison

Le Bistro at the end of **L30 · routing, login and guards**. Start L31 from here.

Lecture: [`../../L30-routing/`](../../L30-routing/guide.md).

## New in this lecture

- React Router 8: `SiteLayout` with `<Outlet />`, pages for `/`, `/menu` (filters in the URL), `/menu/:id`, `/login`, `/account`, `/kitchen`, `/forbidden` and a 404
- `LoginPage`: token login and `/auth/me`; the session is saved under `bistro.session`
- `RequireAuth` with roles (the kitchen is for waiters and the kitchen only); a 401 shows "Sign in again"
- `vercel.json`: `/api` goes to the real API, every other address to `index.html`
- The cart and the session are still passed as props, on purpose: that's L31's problem

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

The dish photos come from the Le Bistro API server, so the page needs internet, and so does the menu: `vite.config.ts` forwards `/api/...` to https://srmsapi.stepacademy.ge (the API accepts browser requests only from its own site and from localhost:4200, so the browser must not call it directly). Restart `npm run dev` after changing the config.

Test accounts are listed at the top of https://srmsapi.stepacademy.ge/swagger. Access tokens live 2 minutes.

## Deploy

Import the folder (or its git repo) in Vercel, or run `npx vercel`. `vercel.json` makes F5 work on every page and forwards `/api` to the real API.
