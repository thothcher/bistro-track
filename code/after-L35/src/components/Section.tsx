import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="section">
      <div className="section__head">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
        <div className="section__rule" />
      </div>
      {children}
    </section>
  );
}
