import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router";
import { useCartStore } from "../cart/cartStore";
import { ReviewStep } from "../components/notes/ReviewStep";
import { SpecialStep } from "../components/notes/SpecialStep";
import { TableStep } from "../components/notes/TableStep";
import { tableNotesSchema, type TableNotes } from "../schemas/tableNotes";

// Which fields belong to which step: Next checks only these
const STEPS = [
  { title: "Your table", fields: ["seats", "arrival"] },
  { title: "Special needs", fields: ["special"] },
  { title: "Check it", fields: [] },
] as const;
const LAST = STEPS.length - 1;

export function TableNotesPage() {
  const saved = useCartStore((s) => s.notes);
  const saveNotes = useCartStore((s) => s.saveNotes);
  const [step, setStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // One form for all three steps, so going Back never loses what was typed
  const form = useForm<TableNotes>({
    resolver: zodResolver(tableNotesSchema),
    mode: "onTouched",
    defaultValues: saved ?? { seats: 2, arrival: "19:00", special: [], note: "" },
  });

  async function goNext() {
    const ok = await form.trigger([...STEPS[step].fields]); // validate this step only
    if (ok) setStep(step + 1);
  }

  function onSubmit(values: TableNotes) {
    if (step < LAST) return void goNext(); // Enter inside a field is not "save"
    saveNotes(values);
    setIsSaved(true);
  }

  if (isSaved) {
    return (
      <div className="form-page">
        <div className="form-card">
          <h1 className="form-card__title">Noted</h1>
          <p className="form-card__lede">
            The kitchen will read your notes with your order.
          </p>
          <Link to="/menu" className="btn">
            Back to the menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="form-card form-card--wide"
        >
          <p className="eyebrow">
            Step {step + 1} of {STEPS.length} · {STEPS[step].title}
          </p>
          <h1 className="form-card__title">Table notes</h1>
          {step === 0 && <TableStep />}
          {step === 1 && <SpecialStep />}
          {step === 2 && <ReviewStep />}
          <div className="form-actions">
            {step > 0 && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            {/* The keys matter: without them React reuses one button and flips its type to
                "submit" during the click on Next, and the browser submits the form. */}
            {step < LAST ? (
              <button key="next" type="button" className="btn" onClick={goNext}>
                Next
              </button>
            ) : (
              <button key="save" type="submit" className="btn">
                Save the notes
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
