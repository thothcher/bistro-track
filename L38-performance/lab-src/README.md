# The five labs of the L38 deck

`../vendor/perf-lab.js` (about 340 kB) is built from these files. It is **real React 19** (the production build) with a few small components, so that a slide can count renders and measure milliseconds in the browser that shows it. You do not need to rebuild it to teach: the deck loads the finished file.

| Lab | Slide | What it does |
|---|---|---|
| `TypingLab.tsx` | 8 | a search box controlled by a transition (as React Router 8 does) or by its own state, a list that is slow to render, and a script that types "french onion soup" at the speed you choose: the letters that are lost are real |
| `RenderLab.tsx` + `parts.tsx` + `scan.ts` | 12 | one page in five versions (`memo` with a new function, `memo` and `useCallback`, the same code through the React Compiler, the state moved down). `scan.ts` listens to the React DevTools hook, the signal that React Scan and the DevTools use, and flashes the components that rendered |
| `BoundaryLab.tsx` | 35 | a small site in its own React root, with no boundary, a boundary around the page, or one around each card (`react-error-boundary`), and a dish whose price is `null` |
| `DeferLab.tsx` | 39 | `useDeferredValue` with and without `memo`, and the time from each key to the painted letter |
| `VirtualLab.tsx` | 41 | all rows, `content-visibility`, or `@tanstack/react-virtual`: the time to draw and the number of elements |

`src/gen/parts.compiled.tsx` is `src/parts.tsx` after the real compiler (`babel-plugin-react-compiler` 1.0.0), made by `compile.mjs`: both versions of the page sit side by side in the lab.

## Rebuild it

You need a folder whose `node_modules` has `react`, `react-dom`, `@tanstack/react-virtual`, `react-error-boundary`, `vite`, `@vitejs/plugin-react`, `@babel/core` and `babel-plugin-react-compiler`. A copy of [`../../code/after-L38`](../../code/after-L38) after `npm install` has them all.

```bash
cd code/after-L38 && npm install
cp -r ../../L38-performance/lab-src ./lab && cd lab
# Windows: mklink /J node_modules ..\node_modules      Linux and macOS: ln -s ../node_modules node_modules
node compile.mjs          # writes src/gen/parts.compiled.tsx
npx vite build            # writes dist/perf-lab.js
cp dist/perf-lab.js ../../../L38-performance/vendor/perf-lab.js
```

Then delete the `lab` folder from `code/after-L38` (it is not part of the snapshot).

The licenses of what is inside the bundle are in [`../vendor/perf-lab.LICENSE.txt`](../vendor/perf-lab.LICENSE.txt). Names must survive the minifier (`keepNames` in `vite.config.ts`): the scan counts renders by the name of the component.
