import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/test/server";
import { loginSchema, registerSchema } from "./auth";

const valid = {
  displayName: "Mari",
  email: "mari@example.com",
  phone: "599 12 34 56",
  password: "correct-horse-1",
  confirmPassword: "correct-horse-1",
  terms: true,
};

// Which fields are wrong, and what do we tell the guest?
const problems = (error: { issues: { path: PropertyKey[]; message: string }[] } | undefined) =>
  Object.fromEntries(error?.issues.map((i) => [i.path.join("."), i.message]) ?? []);

describe("loginSchema", () => {
  it("wants an email and a password", () => {
    const result = loginSchema.safeParse({ email: "", password: "" });

    expect(problems(result.error)).toEqual({
      email: "Enter your email address",
      password: "Enter your password",
    });
  });
});

describe("registerSchema", () => {
  // The phone check calls the server. This default answer: "that number is free".
  function phoneIsFree(calls?: string[]) {
    server.use(
      http.get("/api/v1/enterprise/validation/check-phone", ({ request }) => {
        calls?.push(new URL(request.url).searchParams.get("number") ?? "");
        return HttpResponse.json({ isDuplicate: false });
      }),
    );
  }

  it("accepts a complete form", async () => {
    phoneIsFree();

    const result = await registerSchema.safeParseAsync(valid);

    expect(result.success).toBe(true);
  });

  it("shows the mismatch under the confirmation field, not under the password", async () => {
    phoneIsFree();

    const result = await registerSchema.safeParseAsync({ ...valid, confirmPassword: "different-1" });

    expect(problems(result.error)).toEqual({ confirmPassword: "The passwords don't match" });
  });

  it.each([
    { password: "short1", message: "At least 8 characters" },
    { password: "nodigitshere", message: "Add at least one digit" },
  ])("refuses the password $password", async ({ password, message }) => {
    phoneIsFree();

    const result = await registerSchema.safeParseAsync({ ...valid, password, confirmPassword: password });

    expect(problems(result.error)).toEqual({ password: message });
  });

  it("does not bother the server with a number that is the wrong shape", async () => {
    const asked: string[] = [];
    phoneIsFree(asked);

    const result = await registerSchema.safeParseAsync({ ...valid, phone: "12345" });

    expect(problems(result.error)).toEqual({ phone: "A Georgian mobile number, like 599 12 34 56" });
    expect(asked).toEqual([]); // abort: true stopped the schema before the second rule
  });

  it("accepts the same number written in different ways, and asks the server only once", async () => {
    const asked: string[] = [];
    phoneIsFree(asked);

    for (const phone of ["577 00 00 01", "+995 577-00-00-01", "995577000001"]) {
      expect((await registerSchema.safeParseAsync({ ...valid, phone })).success).toBe(true);
    }

    expect(asked).toEqual(["577000001"]); // only the digits count, and the answer is remembered
  });

  it("refuses a number that already has an account", async () => {
    server.use(
      http.get("/api/v1/enterprise/validation/check-phone", () =>
        HttpResponse.json({ isDuplicate: true }),
      ),
    );

    const result = await registerSchema.safeParseAsync({ ...valid, phone: "555 11 22 33" });

    expect(problems(result.error)).toEqual({ phone: "This number already has an account" });
  });

  it("lets the guest through when the server cannot be asked (it will check again on submit)", async () => {
    server.use(
      http.get("/api/v1/enterprise/validation/check-phone", () => HttpResponse.error()),
    );

    const result = await registerSchema.safeParseAsync({ ...valid, phone: "591 99 88 77" });

    expect(result.success).toBe(true);
  });

  it("wants the house rules accepted", async () => {
    phoneIsFree();

    const result = await registerSchema.safeParseAsync({ ...valid, terms: false });

    expect(problems(result.error)).toEqual({ terms: "Please accept the house rules" });
  });
});
