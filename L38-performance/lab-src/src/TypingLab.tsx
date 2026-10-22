import { startTransition, useDeferredValue, useRef, useState, type RefObject } from "react";
import { busy, DISH_NAMES, sleep, typeInto } from "./util";

const SENTENCE = "french onion soup";
const ROW_MS = 0.2; // the cost of one row at normal CPU speed; the slowdown multiplies it

function Row({ name, cost }: { name: string; cost: number }) {
  busy(cost); // a row that takes real time to render
  return <li>{name}</li>;
}

function Results({ text, cost }: { text: string; cost: number }) {
  const needle = text.trim().toLowerCase();
  return (
    <ul className="pl-list">
      {DISH_NAMES.map((n) => (
        <Row key={n} name={needle && !n.toLowerCase().includes(needle) ? "·" : n} cost={cost} />
      ))}
    </ul>
  );
}

type BoxProps = { cost: number; inputRef: RefObject<HTMLInputElement | null> };

// The box of React Router 8: the text IS the address, and the address changes in a transition (not urgent).
function RouterBox({ cost, inputRef }: BoxProps) {
  const [value, setValue] = useState("");
  return (
    <>
      <input
        ref={inputRef}
        className="pl-input"
        value={value}
        placeholder="Type here…"
        aria-label="Search the menu (controlled by the address)"
        onChange={(e) => {
          const next = e.target.value;
          startTransition(() => setValue(next));
        }}
      />
      <Results text={value} cost={cost} />
    </>
  );
}

// The fixed box: the text lives next to the input (urgent). Only the list may run late.
function OwnBox({ cost, inputRef }: BoxProps) {
  const [text, setText] = useState("");
  const lateText = useDeferredValue(text);
  return (
    <>
      <input
        ref={inputRef}
        className="pl-input"
        value={text}
        placeholder="Type here…"
        aria-label="Search the menu (own state)"
        onChange={(e) => setText(e.target.value)}
      />
      <Results text={lateText} cost={cost} />
    </>
  );
}

// Which letters of the sentence are still in the box (in order), and which are lost
function align(expected: string, got: string) {
  let j = 0;
  return [...expected].map((ch) => {
    if (j < got.length && got[j] === ch) {
      j++;
      return { ch, kept: true };
    }
    return { ch, kept: false };
  });
}

export function TypingLab() {
  const [mode, setMode] = useState<"router" | "own">("router");
  const [slow, setSlow] = useState(6);
  const [every, setEvery] = useState(30);
  const [run, setRun] = useState(0); // a new number = a new, empty box
  const [busyTyping, setBusyTyping] = useState(false);
  const [result, setResult] = useState<{ got: string; lost: number; mode: string; slow: number; every: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cost = ROW_MS * slow;

  async function typeForMe() {
    setResult(null);
    setRun((n) => n + 1);
    setBusyTyping(true);
    await sleep(120); // the new, empty box appears
    const input = inputRef.current;
    if (!input) return;
    await typeInto(input, SENTENCE, every);
    await sleep(900); // let every transition finish
    const got = input.value;
    setResult({ got, lost: SENTENCE.length - got.length, mode, slow, every });
    setBusyTyping(false);
  }

  return (
    <div className="pl-lab pl-typing">
      <div className="pl-controls">
        <div className="pl-group" role="group" aria-label="Where does the text live?">
          <span className="pl-k">The text lives</span>
          <button type="button" className={mode === "router" ? "is-on" : ""} onClick={() => setMode("router")}>in the address (as in L37)</button>
          <button type="button" className={mode === "own" ? "is-on" : ""} onClick={() => setMode("own")}>next to the box (L38)</button>
        </div>
        <div className="pl-group" role="group" aria-label="CPU slowdown">
          <span className="pl-k">CPU</span>
          {[1, 4, 6].map((s) => (
            <button key={s} type="button" className={slow === s ? "is-on" : ""} onClick={() => setSlow(s)}>×{s} slower</button>
          ))}
        </div>
        <div className="pl-group" role="group" aria-label="Typing speed">
          <span className="pl-k">A key every</span>
          {[120, 60, 30].map((s) => (
            <button key={s} type="button" className={every === s ? "is-on" : ""} onClick={() => setEvery(s)}>{s} ms</button>
          ))}
        </div>
        <button type="button" className="pl-go" disabled={busyTyping} onClick={() => void typeForMe()}>
          {busyTyping ? "Typing…" : `Type “${SENTENCE}” for me`}
        </button>
      </div>
      <div className="pl-stage">
        <div key={run} className="pl-box">
          {mode === "router" ? <RouterBox cost={cost} inputRef={inputRef} /> : <OwnBox cost={cost} inputRef={inputRef} />}
        </div>
        <div className="pl-readout" aria-live="polite">
          <p className="pl-k">The sentence</p>
          <p className="pl-sentence" aria-hidden={!result}>
            {result
              ? align(SENTENCE, result.got).map((c, i) => (
                  <span key={i} className={c.kept ? "" : "is-lost"}>{c.ch === " " ? " " : c.ch}</span>
                ))
              : SENTENCE}
          </p>
          {result ? (
            <>
              <p className="pl-k">The box ended with</p>
              <p className="pl-got">“{result.got}”</p>
              <p className={result.lost === 0 ? "pl-verdict is-good" : "pl-verdict is-bad"}>
                {result.lost === 0 ? "Every letter arrived." : `${result.lost} letter${result.lost === 1 ? "" : "s"} lost.`}
              </p>
              <p className="pl-fine">
                {result.mode === "router" ? "address" : "own state"} · ×{result.slow} CPU · a key every {result.every} ms
              </p>
            </>
          ) : (
            <p className="pl-fine">Press the button, or click the box and type fast yourself.</p>
          )}
        </div>
      </div>
    </div>
  );
}
