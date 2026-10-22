import { Toaster as Sonner, type ToasterProps } from "sonner";

// The generated file asked next-themes for a light or dark theme. Le Bistro has no theme
// switcher, so those lines (and the package) are gone: the code is ours to cut.
const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
