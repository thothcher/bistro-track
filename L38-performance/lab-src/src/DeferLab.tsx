import { memo, useDeferredValue, useLayoutEffect, useRef, useState } from "react";
import { busy, DISH_NAMES, sleep, typeInto } from "./util";

const SENTENCE = "french onion soup";

function Row({ name, cost }: { name: string; cost: number }) {
  busy(cost);
  return <li>{name}</li>;
}

function Results({ text, rows, cost }: { text: string; rows: number; cost: number }) {
  const needle = text.trim().toLowerCase();
  const names = Array.from({ length: rows }, (_, i) => DISH_NAMES[i % DISH_NAMES.length] + (i >= DISH_NAMES.length ? " " + Math.floor(i / DISH_NAMES.length) : ""));
  return (
    <ul className="pl-list pl-list--small">
      {names.map((n) => (
        <Row key={n} name={needle && !n.toLowerCase().includes(needle) ? "·" : n} cost={cost} />
      ))}
    </ul>
  );
}

// The same list, wrapped in memo: it renders again only when its own props change
const ResultsMemo = memo(function ResultsMemo(props: { text: string; rows: number; cost: number }) {
  return <Results {...props} />;
});

type Sample = { key: number; ms: number };

export function DeferLab() {
  const [how, setHow] = useState<"plain" | "late" | "late-memo">("plain");
  const [rows, setRows] = useState(120);
  const [slow, setSlow] = useState(4);
  const [text, setText] = useState("");
  const [samples, setSamples] = useState<Sample[]>([]);
  const [typing, setTyping] = useState(false);
  const [run, setRun] = useState(0);
  const lateText = useDeferredValue(text);
  const shownText = how === "plain" ? text : lateText;
  const cost = 0.1 * slow;

  const inputRef = useRef<HTMLInputElement>(null);
  const pending = useRef<{ t0: number; value: string } | null>(null);

  // The letter is "on screen" when the frame that paints the commit that put it in the box starts (the first animation frame after the commit)
  useLayoutEffect(() => {
    const p = pending.current;
    if (!p || p.value !== text) return;
    pending.current = null;
    requestAnimationFrame(() => {
      const ms = Math.round(performance.now() - p.t0); // read the clock now: a state updater would run later, when React gets to it
      setSamples((s) => [...s, { key: s.length + 1, ms }]);
    });
  }, [text]);

  async function typeForMe() {
    setSamples([]);
    setText("");
    setRun((n) => n + 1);
    setTyping(true);
    await sleep(150);
    const input = inputRef.current;
    if (!input) return;
    await typeInto(input, SENTENCE, 220);
    await sleep(900);
    setTyping(false);
  }

  const max = samples.length ? Math.max(...samples.map((s) => s.ms)) : 0;
  const avg = samples.length ? Math.round(samples.reduce((a, s) => a + s.ms, 0) / samples.length) : 0;

  return (
    <div className="pl-lab pl-defer">
      <div className="pl-controls">
        <div className="pl-group" role="group" aria-label="The list uses">
          <span className="pl-k">The list reads</span>
          <button type="button" className={how === "plain" ? "is-on" : ""} onClick={() => setHow("plain")}>the text</button>
          <button type="button" className={how === "late" ? "is-on" : ""} onClick={() => setHow("late")}>useDeferredValue</button>
          <button type="button" className={how === "late-memo" ? "is-on" : ""} onClick={() => setHow("late-memo")}>useDeferredValue + memo</button>
        </div>
        <div className="pl-group" role="group" aria-label="Rows">
          <span className="pl-k">Rows</span>
          {[60, 120, 240].map((n) => (
            <button key={n} type="button" className={rows === n ? "is-on" : ""} onClick={() => setRows(n)}>{n}</button>
          ))}
        </div>
        <div className="pl-group" role="group" aria-label="CPU slowdown">
          <span className="pl-k">CPU</span>
          {[1, 4, 6].map((s) => (
            <button key={s} type="button" className={slow === s ? "is-on" : ""} onClick={() => setSlow(s)}>×{s}</button>
          ))}
        </div>
        <button type="button" className="pl-go" disabled={typing} onClick={() => void typeForMe()}>
          {typing ? "Typing…" : "Type it for me"}
        </button>
      </div>
      <div className="pl-stage pl-stage--defer">
        <div key={run} className="pl-box">
          <input
            ref={inputRef}
            className="pl-input"
            value={text}
            placeholder="Type here…"
            aria-label="Filter the dishes"
            onChange={(e) => {
              pending.current = { t0: performance.now(), value: e.target.value };
              setText(e.target.value);
            }}
          />
          {how === "late-memo" ? <ResultsMemo text={shownText} rows={rows} cost={cost} /> : <Results text={shownText} rows={rows} cost={cost} />}
        </div>
        <div className="pl-readout" aria-live="polite">
          <p className="pl-k">Time until each letter is on the screen</p>
          <div className="pl-bars" role="img" aria-label="Milliseconds for each letter">
            {samples.map((s) => (
              <i key={s.key} style={{ height: Math.min(100, (s.ms / 400) * 100) + "%" }} className={s.ms > 100 ? "is-slow" : s.ms > 50 ? "is-mid" : ""} title={s.ms + " ms"} />
            ))}
          </div>
          <p className="pl-verdict">{samples.length ? <>worst <b>{max} ms</b> · average <b>{avg} ms</b></> : "Press the button, or type in the box."}</p>
          <p className="pl-fine">Under 100 ms feels instant. Each bar is one letter; the tall ones are letters you waited for.</p>
        </div>
      </div>
    </div>
  );
}
