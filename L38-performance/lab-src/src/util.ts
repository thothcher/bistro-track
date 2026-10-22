// A render that really takes time: the labs need slow components, and "slow" must be real milliseconds.
export function busy(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    /* spin */
  }
}

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Types text into a real <input> the way a keyboard does: every letter is added to whatever the box shows at that moment.
// If the page has not drawn the previous letter yet, the new letter lands on the old text. That is how letters get lost.
export async function typeInto(input: HTMLInputElement, text: string, everyMs: number, onKey?: (i: number) => void) {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  input.focus();
  for (let i = 0; i < text.length; i++) {
    setValue.call(input, input.value + text[i]);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    onKey?.(i);
    await sleep(everyMs);
  }
}

export const DISH_NAMES = [
  "French onion soup", "Escargots de Bourgogne", "Salade niçoise", "Coq au vin", "Boeuf bourguignon", "Duck confit",
  "Steak frites", "Bouillabaisse", "Ratatouille", "Quiche lorraine", "Croque monsieur", "Moules marinières",
  "Crème brûlée", "Tarte tatin", "Profiteroles", "Mousse au chocolat", "Crêpes Suzette", "Éclair",
  "Pain au chocolat", "Brioche", "Baguette", "Café au lait", "Espresso", "Bordeaux rouge",
  "Chablis", "Champagne", "Sauternes", "Cassoulet", "Gratin dauphinois", "Soupe de poisson",
  "Tartare de boeuf", "Foie gras", "Pot-au-feu", "Blanquette de veau", "Sole meunière", "Magret de canard",
  "Raclette", "Fondue savoyarde", "Tartiflette", "Clafoutis", "Madeleines", "Macarons",
  "Financier", "Kouign-amann", "Paris-Brest", "Soufflé au fromage", "Gougères", "Pissaladière",
];
