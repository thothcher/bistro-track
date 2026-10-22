import { useId, type ComponentProps } from "react";

type TextFieldProps = ComponentProps<"input"> & {
  label: string;
  error?: string; // the message from the schema, if the field is invalid
  hint?: string; // a line that wins while it is shown, for example "Checking this number…"
};

// A label, an input and its message, wired together for screen readers.
// React 19 passes `ref` like any other prop, so {...register("email")} can be spread onto it.
export function TextField({ label, error, hint, ...input }: TextFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const showError = !hint && !!error; // the old error would be stale while we re-check

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={showError ? true : undefined}
        aria-describedby={messageId}
        className="field__input"
        {...input}
      />
      {/* The slot is always there. A message that pushes the page down on blur
          moves the button away from under the mouse, and the click is lost. */}
      <div id={messageId} className="field__slot">
        {hint && <p className="field__hint">{hint}</p>}
        {showError && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
