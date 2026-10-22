import { useToastStore } from "./toastStore";

// Put it once, high in the page (SiteLayout). It shows whatever is in the toast store.
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="toaster">
      {toasts.map((t) => (
        // role="alert" makes a screen reader read an error at once; "status" waits politely
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className={t.kind === "error" ? "toast toast--error" : "toast"}
        >
          <span>{t.text}</span>
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
