import { useEffect, useEffectEvent, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

// A dialog built by hand, to see what a library does for us. It is not used by the site:
// the Sheet and the Dialog from shadcn replaced the idea. Compare the work this needs
// with the four lines of <Dialog> in DishQuickLook.tsx.
// (The browser has a native <dialog> with showModal() that does rules 1 to 4 by itself, and the
// accessibility linter suggests it below. It is also an option; this file shows what is behind it.)

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type HandMadeDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function HandMadeDialog({ open, title, onClose, children }: HandMadeDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // An effect event: the effect may call it, yet a new onClose does not restart the effect
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const opener = document.activeElement as HTMLElement | null; // where the focus was before
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // the page behind must not scroll
    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus(); // 1. the focus moves inside

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") return close(); // 3. Esc closes
      if (e.key !== "Tab" || !panel) return;
      // 2. Tab and Shift+Tab walk in a circle inside the dialog
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      opener?.focus(); // 4. the focus goes back to the button that opened the dialog
    };
  }, [open]);

  if (!open) return null;

  // A portal puts the dialog directly under <body>, out of the way of any overflow or z-index
  return createPortal(
    <div
      role="presentation" // the backdrop is a convenience for the mouse; the keyboard has Esc
      className="fixed inset-0 z-50 grid place-items-center bg-black/40"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(); // a click on the backdrop closes it too
      }}
    >
      <div
        ref={panelRef}
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- by hand on purpose, see the note at the top
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md bg-card p-6 shadow-xl"
      >
        <h2 id={titleId} className="font-display text-3xl text-primary">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  );
}
