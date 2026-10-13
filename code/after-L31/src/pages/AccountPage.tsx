import { useAuth } from "../auth/AuthContext";
import { Section } from "../components/Section";
import { useApi } from "../hooks/useApi";
import type { UserProfile } from "../types";

export function AccountPage() {
  const { session, logout } = useAuth();
  // A protected endpoint: without a valid token the API answers 401
  const { data, error, loading } = useApi<UserProfile>("/api/v1/profile", session?.token);

  return (
    <Section eyebrow="Your table" title="My account">
      {loading && <p className="note">Loading…</p>}

      {error?.status === 401 && (
        <div className="notice">
          <p>{error.message}</p>
          {/* Clearing the session is enough: RequireAuth then sends the guest to /login */}
          <button type="button" className="btn" onClick={logout}>
            Sign in again
          </button>
        </div>
      )}
      {error && error.status !== 401 && <p className="error">{error.message}</p>}

      {data && (
        <dl className="profile">
          <dt className="eyebrow">Name</dt>
          <dd>{data.displayName ?? "—"}</dd>
          <dt className="eyebrow">Email</dt>
          <dd>{data.email}</dd>
          <dt className="eyebrow">Role</dt>
          <dd>{data.role}</dd>
          <dt className="eyebrow">Language</dt>
          <dd>{data.preferredLanguage}</dd>
          <dt className="eyebrow">Guest since</dt>
          <dd>{new Date(data.createdAt).toLocaleDateString()}</dd>
        </dl>
      )}
    </Section>
  );
}
