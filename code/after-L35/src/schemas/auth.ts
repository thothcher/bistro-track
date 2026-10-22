import { z } from "zod";
import { api } from "../lib/api";

// One schema = the rules, the error messages and the TypeScript type of the form.
export const loginSchema = z.object({
  email: z.email("Enter your email address"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginValues = z.infer<typeof loginSchema>;

// "599 12 34 56" and "+995 599-12-34-56" are both fine: only the digits count
const digitsOf = (value: string) => value.replace(/\D/g, "").replace(/^995/, "");

// The server knows which numbers already have an account (it answers after about a second).
// Remember every answer, so the same number is asked only once, however often the form validates.
const phoneAnswers = new Map<string, Promise<boolean>>();
function isPhoneTaken(digits: string) {
  let answer = phoneAnswers.get(digits);
  if (!answer) {
    answer = api<{ isDuplicate: boolean }>(
      `/api/v1/enterprise/validation/check-phone?number=${digits}`,
    )
      .then((r) => r.isDuplicate)
      .catch(() => false); // can't ask? The server still refuses a duplicate on submit
    phoneAnswers.set(digits, answer);
  }
  return answer;
}

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, "Tell us your name (2 letters or more)"),
    email: z.email("Enter a valid email address"),
    phone: z
      .string()
      // abort: true stops here when the format is wrong, so the server is never asked
      .refine((v) => /^5\d{8}$/.test(digitsOf(v)), {
        error: "A Georgian mobile number, like 599 12 34 56",
        abort: true,
      })
      .refine(async (v) => !(await isPhoneTaken(digitsOf(v))), {
        error: "This number already has an account",
      }),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/\d/, "Add at least one digit"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v, { error: "Please accept the house rules" }),
  })
  // A rule about two fields at once: the error is shown under confirmPassword
  .refine((v) => v.password === v.confirmPassword, {
    error: "The passwords don't match",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;
