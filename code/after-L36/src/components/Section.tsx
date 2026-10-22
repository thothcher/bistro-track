import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  as?: "h1" | "h2"; // the main heading of a page is an h1, a section inside a page is an h2
  children: ReactNode;
};

export function Section({
  id,
  eyebrow,
  title,
  as: Heading = "h2",
  children,
}: SectionProps) {
  return (
    <section id={id} className="section">
      <div className="section__head">
        <p className="eyebrow">{eyebrow}</p>
        <Heading className="title">{title}</Heading>
        <div className="section__rule" />
      </div>
      {children}
    </section>
  );
}
