import type { Category } from "../types";

type CategoryChipsProps = {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
  onHover?: (slug: string) => void; // called when the pointer or the keyboard reaches a chip
};

export function CategoryChips({
  categories,
  selected,
  onSelect,
  onHover,
}: CategoryChipsProps) {
  const chips = [{ slug: "all", nameEn: "Everything" }, ...categories];

  return (
    <div className="chips">
      {chips.map((chip) => (
        <button
          key={chip.slug}
          type="button"
          className={chip.slug === selected ? "chip-on" : "chip"}
          aria-pressed={chip.slug === selected}
          onClick={() => onSelect(chip.slug)}
          onMouseEnter={() => onHover?.(chip.slug)}
          onFocus={() => onHover?.(chip.slug)}
        >
          {chip.nameEn}
        </button>
      ))}
    </div>
  );
}
