import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../components/Accordion";
import { Section } from "../components/Section";
import { faq } from "../data/faq";

export function FaqPage() {
  return (
    <Section eyebrow="Good to know" title="Questions we hear often">
      <div className="narrow">
        <Accordion defaultValue={faq[0].id}>
          {faq.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionPanel>{item.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
