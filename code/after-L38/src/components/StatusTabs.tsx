import { STATUS_FILTERS, type StatusFilter } from "../lib/orders";

type StatusTabsProps = {
  value: StatusFilter;
  counts: Record<StatusFilter, number>;
  onChange: (value: StatusFilter) => void;
};

// The same chips as the menu's categories, with the number of orders on each
export function StatusTabs({ value, counts, onChange }: StatusTabsProps) {
  return (
    <div className="chips" role="group" aria-label="Show orders">
      {STATUS_FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          className={f.value === value ? "chip-on" : "chip"}
          aria-pressed={f.value === value}
          onClick={() => onChange(f.value)}
        >
          {f.label} · {counts[f.value]}
        </button>
      ))}
    </div>
  );
}
