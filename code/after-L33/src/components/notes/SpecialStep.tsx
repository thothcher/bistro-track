import { useFieldArray, useFormContext } from "react-hook-form";
import type { TableNotes } from "../../schemas/tableNotes";
import { TextField } from "../TextField";

// Step 2. A list of fields that can grow and shrink.
export function SpecialStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TableNotes>();
  const { fields, append, remove } = useFieldArray({ control, name: "special" });

  return (
    <>
      <p className="form-card__lede">
        Anyone with an allergy or a diet? The kitchen reads this before it cooks.
      </p>
      {fields.length === 0 && <p className="note">Nobody yet — and that's fine.</p>}
      {fields.map((field, index) => (
        // field.id is made by the form: stable, and it stays with the row when another row goes
        <div key={field.id} className="guest-row">
          <TextField
            label="Name"
            error={errors.special?.[index]?.name?.message}
            {...register(`special.${index}.name`)}
          />
          <TextField
            label="Needs"
            placeholder="no nuts, vegetarian…"
            error={errors.special?.[index]?.need?.message}
            {...register(`special.${index}.need`)}
          />
          <button
            type="button"
            className="guest-row__remove"
            onClick={() => remove(index)}
            aria-label={`Remove guest ${index + 1}`}
          >
            ✕
          </button>
        </div>
      ))}
      {errors.special?.message && (
        <p role="alert" className="form-error">
          {errors.special.message}
        </p>
      )}
      <button
        type="button"
        className="btn-outline"
        onClick={() => append({ name: "", need: "" })}
        disabled={fields.length >= 6}
      >
        Add a guest
      </button>
    </>
  );
}
