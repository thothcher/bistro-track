import { createContext, useContext, useId, useState, type ReactNode } from "react";

// A compound component: one accordion made of parts that share state through a small context.
//
// <Accordion>
//   <AccordionItem value="hours">
//     <AccordionTrigger>When does the kitchen close?</AccordionTrigger>
//     <AccordionPanel>At 22:30.</AccordionPanel>
//   </AccordionItem>
// </Accordion>

type AccordionContextValue = {
  openValue: string | null;
  toggle: (value: string) => void;
};
type ItemContextValue = { value: string; isOpen: boolean; panelId: string };

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<ItemContextValue | null>(null);

function useAccordion() {
  const accordion = useContext(AccordionContext);
  if (accordion === null) throw new Error("Accordion parts must be inside <Accordion>");
  return accordion;
}

function useItem() {
  const item = useContext(ItemContext);
  if (item === null) throw new Error("Trigger and Panel must be inside <AccordionItem>");
  return item;
}

type AccordionProps = { defaultValue?: string | null; children: ReactNode };

export function Accordion({ defaultValue = null, children }: AccordionProps) {
  const [openValue, setOpenValue] = useState<string | null>(defaultValue);
  const toggle = (value: string) =>
    setOpenValue((current) => (current === value ? null : value));

  return (
    <AccordionContext value={{ openValue, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext>
  );
}

export function AccordionItem({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const { openValue } = useAccordion();
  const panelId = useId();

  return (
    <ItemContext value={{ value, isOpen: openValue === value, panelId }}>
      <div className="accordion__item">{children}</div>
    </ItemContext>
  );
}

export function AccordionTrigger({ children }: { children: ReactNode }) {
  const { toggle } = useAccordion();
  const { value, isOpen, panelId } = useItem();

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={panelId}
      onClick={() => toggle(value)}
      className="accordion__trigger"
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={isOpen ? "accordion__icon rotate-180" : "accordion__icon"}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export function AccordionPanel({ children }: { children: ReactNode }) {
  const { isOpen, panelId } = useItem();

  return (
    <div id={panelId} hidden={!isOpen} className="accordion__panel">
      {children}
    </div>
  );
}
