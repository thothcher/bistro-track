import { useEffect, useRef, useState, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { PageL37 as PageCompiled } from "./gen/parts.compiled";
import { PageL37, PageMemo, PageMemoCallback, PageStateDown } from "./parts";
import { flash, watch } from "./scan";
import { sleep, typeInto } from "./util";

type ModeId = "l37" | "memo" | "memocb" | "compiler" | "down";
const MODES: { id: ModeId; label: string; page: ComponentType; note: string }[] = [
  { id: "l37", label: "As in L37", page: PageL37, note: "The text is state of the page. Every key renders the page, and the page renders every card." },
  { id: "memo", label: "memo(Card)", page: PageMemo, note: "Cards are wrapped in memo, but the page hands each one a NEW function at every render. memo sees a new prop and renders anyway." },
  { id: "memocb", label: "memo + useCallback", page: PageMemoCallback, note: "The function stays the same, so memo can skip the cards. This is the manual way, and you must remember both." },
  { id: "compiler", label: "The compiler", page: PageCompiled, note: "The same code as the first mode, no memo, no useCallback, compiled. The grid is one cached value: its cards are skipped." },
  { id: "down", label: "State moved down", page: PageStateDown, note: "The text lives in the box. A key renders the box and nothing else, with no memo and no compiler." },
];

type Counts = { page: number; box: number; grid: number; cards: number; lastCards: number; keys: number };
const ZERO: Counts = { page: 0, box: 0, grid: 0, cards: 0, lastCards: 0, keys: 0 };

export function RenderLab() {
  const [mode, setMode] = useState<ModeId>("l37");
  const [counts, setCounts] = useState<Counts>(ZERO);
  const [typing, setTyping] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const armed = useRef(false); // the first commit is the mount: it is not counted
  const current = MODES.find((m) => m.id === mode)!;

  useEffect(() => {
    const el = stage.current!;
    const root = createRoot(el);
    const Page = current.page;
    setCounts(ZERO);
    armed.current = false;
    const stop = watch(el, (rendered) => {
      if (!armed.current) return;
      let cards = 0;
      let page = 0;
      let box = 0;
      let grid = 0;
      for (const r of rendered) {
        if (r.name === "Card" || r.name === "MemoCard") { cards++; flash(r.node, "#ffb020"); }
        else if (r.name.startsWith("Page")) { page++; flash(r.node, "#5cc8ff"); }
        else if (r.name === "SearchBox") box++;
        else if (r.name === "Grid") grid++;
      }
      setCounts((c) => ({ page: c.page + page, box: c.box + box, grid: c.grid + grid, cards: c.cards + cards, lastCards: cards, keys: c.keys + 1 }));
    });
    root.render(<Page />);
    const t = setTimeout(() => { armed.current = true; }, 150);
    return () => { clearTimeout(t); stop(); root.unmount(); };
  }, [current]);

  async function typeSoup() {
    const input = stage.current?.querySelector("input");
    if (!input) return;
    setTyping(true);
    setCounts(ZERO);
    (input as HTMLInputElement).value = "";
    await typeInto(input as HTMLInputElement, "soup", 220);
    await sleep(200);
    setTyping(false);
  }

  return (
    <div className="pl-lab pl-render">
      <div className="pl-controls">
        <div className="pl-group" role="group" aria-label="Version of the page">
          <span className="pl-k">Version</span>
          {MODES.map((m) => (
            <button key={m.id} type="button" className={m.id === mode ? "is-on" : ""} onClick={() => setMode(m.id)}>{m.label}</button>
          ))}
        </div>
        <button type="button" className="pl-go" disabled={typing} onClick={() => void typeSoup()}>
          {typing ? "Typing…" : "Type “soup” for me"}
        </button>
      </div>
      <p className="pl-note">{current.note}</p>
      <div className="pl-stage pl-stage--render">
        <div ref={stage} className="pl-scan" aria-label="The measured page" />
        <div className="pl-meter" aria-live="polite">
          <p className="pl-k">Renders since you started typing</p>
          <dl>
            <div><dt>Page</dt><dd>{counts.page}</dd></div>
            <div><dt>Search box</dt><dd>{counts.box}</dd></div>
            <div><dt>Grid</dt><dd>{counts.grid}</dd></div>
            <div className="is-big"><dt>Cards</dt><dd>{counts.cards}</dd></div>
          </dl>
          <p className="pl-fine">The last key rendered <b>{counts.lastCards}</b> of 12 cards. Amber flash = a card rendered. Blue flash = the page rendered.</p>
        </div>
      </div>
    </div>
  );
}
