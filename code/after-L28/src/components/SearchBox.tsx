type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

// A controlled input: React state holds the text, the input only shows it.
export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search the menu…"
      aria-label="Search the menu"
      className="search"
    />
  );
}
