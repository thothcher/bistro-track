// The scan must come first: it installs its hook before react-dom starts.
import "./scan";
import { createRoot, type Root } from "react-dom/client";
import { BoundaryLab } from "./BoundaryLab";
import { DeferLab } from "./DeferLab";
import { RenderLab } from "./RenderLab";
import { TypingLab } from "./TypingLab";
import { VirtualLab } from "./VirtualLab";

const LABS = { typing: TypingLab, render: RenderLab, boundary: BoundaryLab, defer: DeferLab, virtual: VirtualLab } as const;
export type LabName = keyof typeof LABS;

const mounted = new Map<Element, Root>();

// PerfLab.mount("typing", element): draws the lab into the element. PerfLab.unmount(element): removes it again.
export function mount(name: LabName, el: Element) {
  unmount(el);
  const Lab = LABS[name];
  const root = createRoot(el);
  root.render(<Lab />);
  mounted.set(el, root);
}

export function unmount(el: Element) {
  mounted.get(el)?.unmount();
  mounted.delete(el);
}

export const names = Object.keys(LABS) as LabName[];
