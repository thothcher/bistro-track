import { z } from "zod";

// Half-hour slots while the kitchen is open: "12:00", "12:30" … "22:30"
export const SLOTS = Array.from({ length: 22 }, (_, i) => {
  const minutes = 12 * 60 + i * 30;
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  return `${hh}:${minutes % 60 === 0 ? "00" : "30"}`;
}) as [string, ...string[]];

export const tableNotesSchema = z.object({
  seats: z.number().int().min(1, "At least one seat").max(8, "Up to eight seats"),
  arrival: z.enum(SLOTS, { error: "Pick an arrival time" }),
  // a list that grows: anyone at the table with an allergy or a diet
  special: z
    .array(
      z.object({
        name: z.string().trim().min(2, "Who is it for?"),
        need: z.string().trim().min(2, "What do they need?").max(60, "Keep it short"),
      }),
    )
    .max(6, "Up to six, please"),
  note: z.string().max(200, "Under 200 characters, please"),
});
export type TableNotes = z.infer<typeof tableNotesSchema>;

// The sentence the kitchen reads. Lecture L35 sends it with the order.
export function toKitchenNotes(notes: TableNotes) {
  const lines = [`Table of ${notes.seats}, arriving ${notes.arrival}.`];
  for (const guest of notes.special) lines.push(`${guest.name}: ${guest.need}.`);
  if (notes.note.trim()) lines.push(notes.note.trim());
  return lines.join(" ");
}
