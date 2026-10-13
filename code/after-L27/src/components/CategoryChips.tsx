import type { Category } from "../types";

type CategoryChipsProps = {
  categories: Category[];
};

// Not clickable yet: lecture L28 (state) makes the chips filter the menu.
export function CategoryChips({ categories }: CategoryChipsProps) {
  return (
    <div className="chips">
      <button type="button" className="chip-on">
        Everything
      </button>
      {categories.map((category) => (
        <button key={category.slug} type="button" className="chip">
          {category.nameEn}
        </button>
      ))}
    </div>
  );
}
