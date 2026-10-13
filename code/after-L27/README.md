# Le Bistro after L27 · Mise en place

Le Bistro at the end of **L27 · components and props**: a static home page and menu built from components and a data file. Start L28 from here.

Lecture: [`../../L27-components/`](../../L27-components/guide.md).

## New in this lecture

- `Header`, `Hero`, `Footer`, `Section` (with `children`)
- `CategoryChips` (static for now), `DishCard` (one dish as props), `DishGrid` (`map` + `key`)
- `data/dishes.ts` (12 real dishes from the API, Bouillabaisse off the menu), `data/categories.ts`
- `lib/format.ts` (prices in lari), `lib/images.ts` (where the photos live)

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

The dish photos come from the Le Bistro API server, so the page needs internet.
