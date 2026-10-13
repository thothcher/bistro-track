# L29 · Homework: your shop, version 0.3

**Due:** before L30. **Submit:** the GitHub link and the Vercel link.

## Base (required)

1. **Real data:** products come from DummyJSON. Your `data/products.ts` is deleted.
2. **Four endings:** loading (grey skeleton cards), data, empty ("No products"), error (a friendly message).
3. **Categories:** the chips load their products from the API (`/products/category/<slug>`), with an `AbortController` in the cleanup so a slow answer never overwrites a newer one.
4. **Saved cart:** `useLocalStorage` keeps the cart after F5.
5. **No warnings:** no "missing dependency" warnings, no endless requests.

## Plus

- A debounced search (`/products/search?q=`, 400 ms).
- Press "/" to focus the search box (`useRef` + a keydown listener with a cleanup).

## Pro

- Your own `useApi(url)` hook, used for the products, the categories and the search.
- Pagination with DummyJSON's `limit` and `skip`: a "Load more" button.

## Before you submit

- [ ] DevTools → Network: one request per category click, one per search
- [ ] DevTools → Network → Offline: your error message, not a blank page
- [ ] F5 keeps the cart
- [ ] `npm run build` passes, the Vercel link works

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | Products and categories from DummyJSON, in effects with correct dependencies |
| 2 | Loading, empty and error states |
| 2 | Cart saved with useLocalStorage |
| 1 | Cleanup: aborted requests, removed listeners |
| 1 | No lint warnings, no endless requests |
| 1 | Deployed and working |
| +1 | Plus |
| +1 | Pro |

**Heads-up:** try to send someone a link to one product. You can't: every product lives on the same page. That's L30.
