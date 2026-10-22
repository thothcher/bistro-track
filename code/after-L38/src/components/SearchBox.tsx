import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

type SearchBoxProps = {
  value: string; // what the address says
  onChange: (value: string) => void; // called when the guest pauses, with the whole text
};

export function SearchBox({ value, onChange }: SearchBoxProps) {
  // A ref points at the real <input> in the page, so we can call .focus() on it
  const inputRef = useRef<HTMLInputElement>(null);

  // The text lives HERE, next to the box, because it changes at every key and the box must show it at
  // once. The page (and the address) hear about it only after a pause. Typing re-renders this one
  // component, not the page. (An address change is a router update, which React Router runs as a
  // transition: a box controlled by the address can lose letters when the page is busy.)
  const [text, setText] = useState(value);
  const pause = useDebounce(text.trim(), 400); // the text, once it has stopped changing for 400 ms
  const [seen, setSeen] = useState(value); // the address as we last saw it

  // The address changed, and it was not us (the Back button, a link): show it in the box.
  // When it is us, the address now says what the pause said, and there is nothing to do.
  if (value !== seen) {
    setSeen(value);
    if (value !== pause) setText(value);
  }

  // The pause is the signal; the page's function is not. An Effect Event always calls the latest
  // function and reads the latest address, but does not make the effect run again when they change.
  const report = useEffectEvent((paused: string) => {
    if (paused !== value) onChange(paused);
  });
  useEffect(() => {
    report(pause);
  }, [pause]);

  // Press "/" anywhere on the page to jump into the search box
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown); // cleanup
  }, []);

  return (
    <input
      ref={inputRef}
      type="search"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search the menu…  ( / )"
      aria-label="Search the menu"
      className="search"
    />
  );
}
