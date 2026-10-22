import { Controller, useFormContext } from "react-hook-form";
import { SLOTS, type TableNotes } from "../../schemas/tableNotes";
import { QuantityStepper } from "../QuantityStepper";

// Step 1. Every step reads the same form through context: no props.
export function TableStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TableNotes>();

  return (
    <>
      <div className="field">
        <span>How many seats?</span>
        {/* Our own stepper is not a native input. Controller connects it to the form. */}
        <Controller
          control={control}
          name="seats"
          render={({ field }) => (
            <QuantityStepper
              qty={field.value}
              onDecrease={() => field.onChange(Math.max(1, field.value - 1))}
              onIncrease={() => field.onChange(Math.min(8, field.value + 1))}
            />
          )}
        />
        {errors.seats && (
          <p role="alert" className="form-error">
            {errors.seats.message}
          </p>
        )}
      </div>
      <label className="field">
        Arriving at
        <select className="field__input" {...register("arrival")}>
          {SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
