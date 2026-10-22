// The measured page of the render lab. Written once; compile.mjs makes a second copy that went through the React Compiler.
// Nothing here counts renders by itself: the scan (scan.ts) watches from outside, like the real React Scan.
import { memo, useCallback, useState } from "react";
import { DISH_NAMES } from "./util";

const DISHES = DISH_NAMES.slice(0, 12);

export function SearchBox({ value, onChange }: { value: string; onChange: (text: string) => void }) {
  return (
    <input className="pl-input" value={value} placeholder="Type here…" aria-label="Search" onChange={(e) => onChange(e.target.value)} />
  );
}

// The box that keeps its own text: the page above it never hears about a key
export function SearchOwn() {
  const [text, setText] = useState("");
  return <SearchBox value={text} onChange={setText} />;
}

export function Card({ name, onAdd }: { name: string; onAdd: () => void }) {
  return (
    <article className="pl-card">
      <b>{name}</b>
      <button type="button" onClick={onAdd}>Add</button>
    </article>
  );
}

export const MemoCard = memo(function MemoCard({ name, onAdd }: { name: string; onAdd: () => void }) {
  return (
    <article className="pl-card">
      <b>{name}</b>
      <button type="button" onClick={onAdd}>Add</button>
    </article>
  );
});

function Grid({ onAdd, memoCards }: { onAdd: () => void; memoCards: boolean }) {
  return (
    <div className="pl-grid">
      {DISHES.map((n) => (memoCards ? <MemoCard key={n} name={n} onAdd={onAdd} /> : <Card key={n} name={n} onAdd={onAdd} />))}
    </div>
  );
}

// 1. As in L37: the text is state of the page, and the page hands a new function down at every render
export function PageL37() {
  const [text, setText] = useState("");
  const [added, setAdded] = useState(0);
  const add = () => setAdded((n) => n + 1);
  return (
    <div>
      <SearchBox value={text} onChange={setText} />
      <Grid onAdd={add} memoCards={false} />
      <p className="pl-added">Added: {added}</p>
    </div>
  );
}

// 2. memo on the card, and the same new function at every render: memo compares the props, sees a new function, renders anyway
export function PageMemo() {
  const [text, setText] = useState("");
  const [added, setAdded] = useState(0);
  const add = () => setAdded((n) => n + 1);
  return (
    <div>
      <SearchBox value={text} onChange={setText} />
      <Grid onAdd={add} memoCards />
      <p className="pl-added">Added: {added}</p>
    </div>
  );
}

// 3. memo and a function that stays the same (useCallback): now the cards are skipped
export function PageMemoCallback() {
  const [text, setText] = useState("");
  const [added, setAdded] = useState(0);
  const add = useCallback(() => setAdded((n) => n + 1), []);
  return (
    <div>
      <SearchBox value={text} onChange={setText} />
      <Grid onAdd={add} memoCards />
      <p className="pl-added">Added: {added}</p>
    </div>
  );
}

// 4. The text moves down into the box: typing renders the box and nothing else
export function PageStateDown() {
  const [added, setAdded] = useState(0);
  const add = () => setAdded((n) => n + 1);
  return (
    <div>
      <SearchOwn />
      <Grid onAdd={add} memoCards={false} />
      <p className="pl-added">Added: {added}</p>
    </div>
  );
}
