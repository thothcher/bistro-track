import { create } from "zustand";

type Toast = { id: number; kind: "success" | "error"; text: string };

type ToastState = {
  toasts: Toast[];
  show: (kind: Toast["kind"], text: string) => void;
  dismiss: (id: number) => void;
};

let nextId = 1;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (kind, text) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, kind, text }] }));
    setTimeout(() => get().dismiss(id), 5000); // errors need a little more time than a click
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// The store is outside React, so "toast.error(…)" works anywhere:
// in an event handler, in a mutation's onError, in the QueryClient's global handler.
export const toast = {
  success: (text: string) => useToastStore.getState().show("success", text),
  error: (text: string) => useToastStore.getState().show("error", text),
};
