# L27 · Homework: your shop, version 0.1

**Due:** before L28. **Submit:** the GitHub repository link and the Vercel link.
The brief for the whole project is in [`../student-project.md`](../student-project.md).

## Base (required)

Build the home page of your shop as a static catalog.

1. **Components**, each in its own file in `src/components/`:
   `Header`, `Hero`, `Section`, `ProductCard`, `ProductGrid`, `Footer`.
2. **Data:** 8–12 real products from DummyJSON in `src/data/products.ts`, typed with your `Product` type from `src/types.ts`.
3. **Props:** every component that receives data has a props type. No `any`.
4. **Lists:** `ProductGrid` uses `map` with `key={product.id}`.
5. **children:** `Section` frames its content with `children` (a title, then whatever is inside).
6. **Deployed:** the project is live on Vercel. The link is in the README.

## Plus

- Category chips from `src/data/categories.ts` (static for now, they start filtering in L28).
- Badges with `&&`: "Low stock" when `stock < 10`, "-15%" when `discountPercentage > 10`.

## Pro

- A product's rating as stars: a `Rating` component that takes `value: number` and shows ★★★★☆.
- A second section, "Top rated", reusing the same `ProductGrid`.

## Before you submit

- [ ] `npm run build` passes with no errors
- [ ] No warnings in the browser console
- [ ] The live Vercel link works
- [ ] README: the name of your shop, a screenshot, the live link
- [ ] Optional: `AI.md` with what you asked an AI, what you kept and what you changed

## Deploy on Vercel (reminder from the Tailwind module)

1. Push the project to GitHub.
2. vercel.com → Add New → Project → import the repository.
3. The defaults are right for Vite: build `npm run build`, output `dist`. Deploy.
4. Every push to `main` deploys again.

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | Six components, one per file, used from App |
| 2 | Typed props everywhere, no `any` |
| 2 | Products from one data file, `map` with a stable key |
| 1 | `Section` uses `children` |
| 1 | Deployed and working |
| 1 | README with screenshot and link |
| +1 | Plus tasks |
| +1 | Pro tasks |
