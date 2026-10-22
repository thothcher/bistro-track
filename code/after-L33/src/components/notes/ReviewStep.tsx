import { useFormContext } from "react-hook-form";
import { toKitchenNotes, type TableNotes } from "../../schemas/tableNotes";

// Step 3. Read-only: the kitchen's sentence, built from what the guest typed.
export function ReviewStep() {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<TableNotes>();
  const values = getValues();

  return (
    <>
      <label className="field">
        Anything else for the kitchen? (optional)
        <textarea rows={3} className="field__input" {...register("note")} />
        {errors.note && (
          <span role="alert" className="form-error">
            {errors.note.message}
          </span>
        )}
      </label>
      <div className="review">
        <p className="eyebrow">What the kitchen will read</p>
        <p>{toKitchenNotes(values)}</p>
      </div>
    </>
  );
}
