# Le Bistro after L28 · À la minute

Le Bistro at the end of **L28 · state and events**: the cart works, the chips filter and the search finds. Start L29 from here.

Lecture: [`../../L28-state/`](../../L28-state/guide.md).

## New in this lecture

- The cart in `App` (`useState`, updater functions, immutable updates), `QuantityStepper` (max 10)
- `Header` opens a `CartPanel`; the count and the total are derived, never stored
- `MenuSection`: category and search state, the visible dishes derived from them; a controlled `SearchBox`

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

The dish photos come from the Le Bistro API server, so the page needs internet.
