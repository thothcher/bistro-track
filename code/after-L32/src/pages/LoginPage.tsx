import { useState, type SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../auth/authStore";
import { api } from "../lib/api";
import type { AuthResponse, Role, UserProfile } from "../types";

const ROLES: Role[] = ["admin", "waiter", "kitchen", "student"];

// The API sends roles like "Kitchen". Anything unknown is treated as a guest (student).
function toRole(value: string | null): Role {
  const role = (value ?? "").toLowerCase();
  return ROLES.find((r) => r === role) ?? "student";
}

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // RequireAuth sends guests here with the page they wanted: go back there after signing in
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const auth = await api<AuthResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const me = await api<UserProfile>("/api/v1/auth/me", {}, auth.accessToken);
      login({
        token: auth.accessToken,
        user: {
          email: me.email ?? email,
          displayName: me.displayName,
          role: toRole(me.role),
        },
      });
      navigate(from, { replace: true });
    } catch {
      setError("That email and password don't match. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit} className="form-card">
        <h1 className="form-card__title">Welcome back</h1>
        <p className="form-card__lede">Sign in to order and follow your dinner.</p>
        <label className="field">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field__input"
          />
        </label>
        <label className="field">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field__input"
          />
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button type="submit" className="btn" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="form-hint">Test accounts are listed on the API's Swagger page.</p>
      </form>
    </div>
  );
}
