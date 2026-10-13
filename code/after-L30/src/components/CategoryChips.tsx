import type { Category } from "../types";

type CategoryChipsProps = {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
};

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
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
        >
          {chip.nameEn}
        </button>
      ))}
    </div>
  );
}
