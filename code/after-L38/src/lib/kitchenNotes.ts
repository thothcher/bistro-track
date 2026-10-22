// A type-only import: it is erased in the build, so this file does not pull the schema (and Zod,
// 83 kB) into every page that sends an order. It used to live next to the schema, and it did.
import type { TableNotes } from "../schemas/tableNotes";

// The sentence the kitchen reads. Lecture L35 sends it with the order.
export function toKitchenNotes(notes: TableNotes) {
  const lines = [`Table of ${notes.seats}, arriving ${notes.arrival}.`];
  for (const guest of notes.special) lines.push(`${guest.name}: ${guest.need}.`);
  if (notes.note.trim()) lines.push(notes.note.trim());
  return lines.join(" ");
}
