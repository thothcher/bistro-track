import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { signIn } from "../auth/signIn";
import { TextField } from "../components/TextField";
import { loginSchema, type LoginValues } from "../schemas/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // RequireAuth sends guests here with the page they wanted: go back there after signing in
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // handleSubmit calls this only when the schema says every field is valid
  async function onSubmit(values: LoginValues) {
    try {
      await signIn(values.email, values.password);
      navigate(from, { replace: true });
    } catch {
      // "root" is for errors that belong to the whole form, not to one field
      setError("root", { message: "That email and password don't match. Try again." });
    }
  }

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-card">
        <h1 className="form-card__title">Welcome back</h1>
        <p className="form-card__lede">Sign in to order and follow your dinner.</p>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="field__slot">
          {errors.root && (
            <p role="alert" className="form-error">
              {errors.root.message}
            </p>
          )}
        </div>
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
        <p className="form-hint">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
