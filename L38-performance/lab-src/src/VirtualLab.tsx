import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { sleep } from "./util";

type Mode = "all" | "cv" | "virtual";
const ROW_H = 56;

function Ticket({ i }: { i: number }) {
  return (
    <div className="pl-ticket">
      <strong>Guest {i + 1}</strong>
      <span>{1 + (i % 4)} items</span>
      <span className="pl-status">{["PENDING", "COOKING", "READY"][i % 3]}</span>
      <button type="button">Next</button>
    </div>
  );
}

function AllRows({ n, cv }: { n: number; cv: boolean }) {
  return (
    <ul className={cv ? "pl-rows is-cv" : "pl-rows"}>
      {Array.from({ length: n }, (_, i) => (
        <li key={i}><Ticket i={i} /></li>
      ))}
    </ul>
  );
}

function VirtualRows({ n }: { n: number }) {
  const box = useRef<HTMLDivElement>(null);
  const v = useVirtualizer({ count: n, getScrollElement: () => box.current, estimateSize: () => ROW_H, overscan: 6 });
  return (
    <div ref={box} className="pl-scroll" data-scroll="1">
      <ul className="pl-spacer" style={{ height: v.getTotalSize() }}>
        {v.getVirtualItems().map((r) => (
          <li key={r.key} className="pl-slot" style={{ height: r.size, transform: `translateY(${r.start}px)` }}>
            <Ticket i={r.index} />
          </li>
        ))}
      </ul>
    </div>
  );
}

type Result = { mode: Mode; n: number; renderMs: number; nodes: number; scrollMs: number | null };

export function VirtualLab() {
  const [mode, setMode] = useState<Mode>("virtual");
  const [n, setN] = useState(5000);
  const [result, setResult] = useState<Result | null>(null);
  const [working, setWorking] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);
  const cap = mode === "virtual" ? 100000 : 20000;
  const count = Math.min(n, cap);

  useEffect(() => () => rootRef.current?.unmount(), []);

  async function render() {
    const el = stage.current!;
    setWorking(true);
    setResult(null);
    await sleep(60); // let the "working" label show before the page freezes
    rootRef.current?.unmount();
    el.innerHTML = "";
    const host = document.createElement("div");
    host.className = "pl-host";
    el.appendChild(host);
    const root = createRoot(host);
    rootRef.current = root;
    const t0 = performance.now();
    flushSync(() => root.render(mode === "virtual" ? <VirtualRows n={count} /> : <AllRows n={count} cv={mode === "cv"} />));
    void host.offsetHeight; // force the layout now, so the time includes it
    const renderMs = Math.round(performance.now() - t0);
    const nodes = host.getElementsByTagName("*").length;
    setResult({ mode, n: count, renderMs, nodes, scrollMs: null });
    setWorking(false);
  }

  async function scrollToEnd() {
    const el = stage.current!;
    const scroller = (el.querySelector("[data-scroll]") as HTMLElement | null) ?? (el.querySelector(".pl-rows") as HTMLElement | null) ?? el;
    const t0 = performance.now();
    scroller.scrollTop = scroller.scrollHeight;
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const scrollMs = Math.round(performance.now() - t0);
    const nodes = el.getElementsByTagName("*").length;
    setResult((r) => (r ? { ...r, scrollMs, nodes } : r));
  }

  return (
    <div className="pl-lab pl-virtual">
      <div className="pl-controls">
        <div className="pl-group" role="group" aria-label="How the rows are drawn">
          <span className="pl-k">Draw</span>
          <button type="button" className={mode === "all" ? "is-on" : ""} onClick={() => setMode("all")}>all rows</button>
          <button type="button" className={mode === "cv" ? "is-on" : ""} onClick={() => setMode("cv")}>content-visibility</button>
          <button type="button" className={mode === "virtual" ? "is-on" : ""} onClick={() => setMode("virtual")}>only the visible ones</button>
        </div>
        <div className="pl-group" role="group" aria-label="Number of rows">
          <span className="pl-k">Rows</span>
          {[1000, 5000, 20000, 100000].map((v) => (
            <button key={v} type="button" className={n === v ? "is-on" : ""} disabled={mode !== "virtual" && v > 20000} onClick={() => setN(v)}>
              {v.toLocaleString("en-US")}
            </button>
          ))}
        </div>
        <button type="button" className="pl-go" disabled={working} onClick={() => void render()}>
          {working ? "Drawing…" : `Draw ${count.toLocaleString("en-US")} rows`}
        </button>
        <button type="button" className="pl-go is-quiet" disabled={!result || working} onClick={() => void scrollToEnd()}>
          Scroll to the end
        </button>
      </div>
      <div className="pl-stage pl-stage--virtual">
        <div ref={stage} className="pl-pane" aria-label="The list" />
        <div className="pl-readout" aria-live="polite">
          <p className="pl-k">Measured in your browser</p>
          {result ? (
            <dl>
              <div><dt>Time to draw</dt><dd className={result.renderMs > 300 ? "is-bad" : result.renderMs < 60 ? "is-good" : ""}>{result.renderMs} ms</dd></div>
              <div><dt>Elements in the page</dt><dd className={result.nodes > 5000 ? "is-bad" : result.nodes < 600 ? "is-good" : ""}>{result.nodes.toLocaleString("en-US")}</dd></div>
              <div><dt>Scroll to the end</dt><dd>{result.scrollMs === null ? "–" : result.scrollMs + " ms"}</dd></div>
            </dl>
          ) : (
            <p className="pl-fine">Choose how to draw, how many rows, and press the button.{mode !== "virtual" ? " Many rows can freeze the tab for a moment: that is the lesson." : ""}</p>
          )}
        </div>
      </div>
    </div>
  );
}
