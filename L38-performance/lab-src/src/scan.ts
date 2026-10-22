// A tiny React Scan: it listens to every commit through the React DevTools hook and tells a lab which
// components rendered, so the lab can count them and flash their boxes. It must be imported BEFORE react-dom.
export type Rendered = { name: string; node: Element | null; mount: boolean };
type Watcher = { root: Element; cb: (rendered: Rendered[]) => void };

// the fiber fields we read (React does not export a type for them)
type Fiber = {
  tag: number;
  type: unknown;
  flags: number;
  child: Fiber | null;
  sibling: Fiber | null;
  alternate: Fiber | null;
  stateNode: unknown;
};

const watchers = new Set<Watcher>();
const FUNCTION_TAGS = new Set([0, 11, 14, 15]); // function, forwardRef, memo, simple memo

function nameOf(f: Fiber): string | null {
  const t = f.type as { displayName?: string; name?: string; $$typeof?: unknown; type?: unknown; render?: unknown } | null;
  if (!t) return null;
  if (typeof t === "function") return t.displayName || t.name || null;
  if (t.$$typeof) {
    const inner = (t.type || t.render) as { displayName?: string; name?: string } | undefined;
    return (typeof inner === "function" && (inner.displayName || inner.name)) || t.displayName || null;
  }
  return null;
}

function hostNode(f: Fiber): Element | null {
  for (let c = f.child; c; c = c.sibling) {
    if (c.tag === 5) return c.stateNode as Element;
    const inner = hostNode(c);
    if (inner) return inner;
  }
  return null;
}

// The same walk the DevTools do: a fiber with no alternate is new (a mount); PerformedWork (flag 1) means it rendered;
// we only go down where the children were reconciled again, so a subtree that bailed out is left alone.
function collectMounted(f: Fiber, out: Rendered[]) {
  if (FUNCTION_TAGS.has(f.tag)) {
    const name = nameOf(f);
    if (name) out.push({ name, node: hostNode(f), mount: true });
  }
  for (let c = f.child; c; c = c.sibling) collectMounted(c, out);
}
function collectUpdated(f: Fiber, out: Rendered[]) {
  const prev = f.alternate as Fiber;
  if (FUNCTION_TAGS.has(f.tag) && (f.flags & 1) === 1) {
    const name = nameOf(f);
    if (name) out.push({ name, node: hostNode(f), mount: false });
  }
  if (f.child !== prev.child) {
    for (let c = f.child; c; c = c.sibling) {
      if (c.alternate === null) collectMounted(c, out);
      else collectUpdated(c, out);
    }
  }
}

function onCommit(_id: unknown, root: { current: Fiber; containerInfo: Element }) {
  if (!watchers.size) return;
  let list: Rendered[] | null = null;
  for (const w of watchers) {
    if (w.root === root.containerInfo || w.root.contains(root.containerInfo)) {
      if (!list) {
        list = [];
        if (root.current.alternate === null) collectMounted(root.current, list);
        else collectUpdated(root.current, list);
      }
      w.cb(list);
    }
  }
}

// If the DevTools extension is installed, its hook is already there: we listen next to it. Otherwise we make one.
const g = window as unknown as { __REACT_DEVTOOLS_GLOBAL_HOOK__?: Record<string, unknown> };
const existing = g.__REACT_DEVTOOLS_GLOBAL_HOOK__;
if (existing) {
  const original = existing.onCommitFiberRoot as ((...a: unknown[]) => unknown) | undefined;
  existing.onCommitFiberRoot = function (this: unknown, ...args: unknown[]) {
    onCommit(args[0], args[1] as never);
    return original?.apply(this, args);
  };
} else {
  const renderers = new Map<number, unknown>();
  g.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    renderers,
    supportsFiber: true,
    inject(renderer: unknown) {
      const id = renderers.size + 1;
      renderers.set(id, renderer);
      return id;
    },
    onCommitFiberRoot: onCommit,
    onCommitFiberUnmount() {},
    onPostCommitFiberRoot() {},
    checkDCE() {},
  };
}

export function watch(root: Element, cb: (rendered: Rendered[]) => void) {
  const w = { root, cb };
  watchers.add(w);
  return () => void watchers.delete(w);
}

// a short outline around a box that just rendered (React Scan's flash). The Web Animations API does not touch React's attributes.
export function flash(el: Element | null, color = "#ffb020") {
  if (!el || !(el as HTMLElement).animate) return;
  (el as HTMLElement).animate(
    [{ outline: `3px solid ${color}`, outlineOffset: "-3px", background: `${color}44` }, { outline: `3px solid ${color}00`, outlineOffset: "-3px", background: `${color}00` }],
    { duration: 650, easing: "ease-out" },
  );
}
