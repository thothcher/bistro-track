import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { signIn } from "../auth/signIn";
import { TextField } from "../components/TextField";
import { ApiError, api } from "../lib/api";
import { registerSchema, type RegisterValues } from "../schemas/auth";

export function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, validatingFields },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur", // check a field when the guest leaves it
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function onSubmit(values: RegisterValues) {
    try {
      await api("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          displayName: values.displayName,
        }),
      });
      await signIn(values.email, values.password);
      navigate("/", { replace: true });
    } catch (error) {
      // The server has the last word: show what it says, next to the right field
      if (error instanceof ApiError && error.status === 409) {
        setError("email", { message: error.message });
      } else {
        const message =
          error instanceof ApiError ? error.message : "No connection. Try again.";
        setError("root", { message });
      }
    }
  }

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-card">
        <h1 className="form-card__title">Join Le Bistro</h1>
        <p className="form-card__lede">
          An account lets you order and follow your dinner.
        </p>
        <TextField
          label="Your name"
          autoComplete="name"
          error={errors.displayName?.message}
          {...register("displayName")}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Mobile phone"
          type="tel"
          autoComplete="tel"
          placeholder="599 12 34 56"
          error={errors.phone?.message}
          hint={validatingFields.phone ? "Checking this number…" : undefined}
          {...register("phone")}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <TextField
          label="Repeat the password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <label className="check">
          <input type="checkbox" {...register("terms")} />
          <span>I accept the house rules</span>
        </label>
        <div className="field__slot">
          {errors.terms && (
            <p role="alert" className="form-error">
              {errors.terms.message}
            </p>
          )}
          {errors.root && (
            <p role="alert" className="form-error">
              {errors.root.message}
            </p>
          )}
        </div>
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Creating your account…" : "Create my account"}
        </button>
        <p className="form-hint">
          Already a guest? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
