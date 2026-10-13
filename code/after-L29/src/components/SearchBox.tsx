import { useEffect, useRef } from "react";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBox({ value, onChange }: SearchBoxProps) {
  // A ref points at the real <input> in the page, so we can call .focus() on it
  const inputRef = useRef<HTMLInputElement>(null);

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
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search the menu…  ( / )"
      aria-label="Search the menu"
      className="search"
    />
  );
}
