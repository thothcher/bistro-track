# L33 · Classwork

Two classworks, 15 minutes each, on **your own shop**. The second one is done with an AI. Three new packages today: `npm install react-hook-form zod @hookform/resolvers@5`. The `@5` matters: the newest resolvers fails to install next to the other packages (an `ERESOLVE` error) and version 5 works with Zod 4.

---

## Classwork 1 · Your login with a schema (slide 21)

### Base (everyone)

1. Install the three packages, then write the rules once. DummyJSON logs in with a **username**:
   ```ts
   // src/schemas/auth.ts
   import { z } from "zod";

   export const loginSchema = z.object({
     username: z.string().min(1, "Enter your username"),
     password: z.string().min(1, "Enter your password"),
   });
   export type LoginValues = z.infer<typeof loginSchema>;
   ```
2. In your login page, delete the `useState`s for the fields and let the form hold them:
   ```tsx
   import { zodResolver } from "@hookform/resolvers/zod";
   import { useForm } from "react-hook-form";

   const {
     register, handleSubmit, setError,
     formState: { errors, isSubmitting },
   } = useForm<LoginValues>({
     resolver: zodResolver(loginSchema),
     defaultValues: { username: "", password: "" },
   });
   ```
3. `handleSubmit` is the gate. `onSubmit` receives the typed values, only when the schema accepts them:
   ```tsx
   <form onSubmit={handleSubmit(onSubmit)} noValidate>
     <label>
       Username
       <input {...register("username")} />
       <p role="alert">{errors.username?.message}</p>
     </label>
     {/* the same for password */}
     <button type="submit">Sign in</button>
   </form>
   ```
4. Send the request exactly as your L32 login did, from `onSubmit(values)`.
5. Test: press Send with both fields empty: two messages. Type in a field with React DevTools → **Highlight updates** on: the form does not flash.

### Plus

The server may still say no, and the button should know it is busy. Add a `TextField` (a label, an input, and a message line of fixed height):

```tsx
async function onSubmit(values: LoginValues) {
  try {
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Sign-in failed");
    login(data);                           // your authStore from L32
    navigate("/", { replace: true });
  } catch (error) {
    // "root" is for errors that belong to the whole form
    setError("root", { message: error instanceof Error ? error.message : "No connection. Try again." });
  }
}
```

and `<button type="submit" disabled={isSubmitting}>`, `{errors.root && <p role="alert">{errors.root.message}</p>}`.

### Pro

A sign-up form: first name, username, email, password, repeat it. A `refine` on the object for the match, with `path` so the message appears under the second password:

```ts
export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(2, "Tell us your first name"),
    username: z.string().trim().min(3, "At least 3 characters"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "At least 8 characters").regex(/\d/, "Add at least one digit"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    error: "The passwords don't match",
    path: ["confirmPassword"],
  });
```

Send `{ firstName, username, email, password }` to `POST https://dummyjson.com/users/add` and show the answer on the page. (DummyJSON answers with the new user as if it had saved it: it does not store it.)

### Done when

- [ ] No `useState` for the fields is left in the login (or the sign-up)
- [ ] The rules and their messages are in one schema file, and the type comes from `z.infer`
- [ ] React DevTools → Highlight updates: typing does not flash the form
- [ ] A wrong password shows a message under the form (Plus)

### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| `npm error ERESOLVE …` installing the resolvers | `npm install @hookform/resolvers@5` |
| Every field says "Invalid input: expected string, received undefined" | `defaultValues` is missing, or `register` was not called: `{...register("username")}` |
| `TS2322 … Type 'Resolver<…>' is not assignable …` | `useForm<typeof loginSchema>`: use `useForm<LoginValues>` |
| `TS18048 'errors.username' is possibly 'undefined'` | `errors.username?.message` |
| The message never shows | It is read from the wrong place: `errors.username?.message`, not `errors.message` |
| `required_error` / `message:` options have no effect | Zod 3 spelling. Zod 4: `{ error: "…" }` or the rule's own message |
| The browser's own bubble ("Please fill out this field") shows | The form has `required` on inputs or lacks `noValidate`. One judge: the schema |
| Pressing Send does nothing the first time | A message appears on blur and moves the button: give every message a fixed-height line |

---

## Classwork 2 · Prompt it: a form in steps (with AI, slide 37)

The second classwork is done **with an AI**. You write the prompt, the AI writes the code, and you check it. Any AI tool works: Claude, ChatGPT, Copilot Chat.

### The task

- **Base:** A **checkout in three steps** (contact, delivery, review) with **one** `useForm` above the steps, a Zod schema, and `trigger` on Next.
- **Plus:** A list of gift notes (`useFieldArray`: who it is for, a short message; add and remove) and a stepper with `Controller` (for example, how many gift cards).
- **Pro:** A sign-up with a `refine` for the matching passwords and an **async** username check (`GET https://dummyjson.com/users/filter?key=username&value=…`) that skips the server when the format is wrong.

### Your prompt, in five parts (CRAFT)

| | Part | What to write |
|---|---|---|
| C | **Context** | Your shop and stack, with versions: react-hook-form 7, zod 4, @hookform/resolvers 5. Paste `types.ts` and your cart store. |
| R | **Role** | "A React teacher who writes small forms for a beginner." |
| A | **Action** | The Base task. Plus and Pro in follow-up prompts. |
| F | **Format** | "Only the files that change, complete, with paths." |
| T | **Target** | "No useState for field values. The schema holds every rule and message." |

### A sample prompt (Tech store)

```text
CONTEXT
Shop "Volt" (phones, laptops). Vite + React 19 + TypeScript
+ Tailwind 4, react-hook-form 7, zod 4 (z.email(), error:),
@hookform/resolvers 5. Cart in a Zustand store (pasted).
ROLE
A React teacher who writes small forms for a beginner.
ACTION
A 3-step Checkout page: contact, delivery + a list of gift
notes (name, message; add and remove), review. Save in
the cart store.
FORMAT
Only changed files, complete, with paths.
TARGET
One useForm above the steps, no useState for fields.
```

### The rules

1. Read every line before it goes into your project. You must be able to explain it.
2. Run it. If something fails, the next prompt is the exact error message.
3. One step at a time: Base first, then Plus and Pro as follow-up prompts.
4. Log it in `AI.md`: your prompt, what you kept, what you changed and why.

### Done when

- [ ] One `useForm`, above the steps; no `useState` holds a field's value
- [ ] Next validates only its own step
- [ ] Zod 4 syntax: `z.email()` and `error:`, no `required_error`
- [ ] AI.md: your prompt and one thing you changed

### What the AI tends to get wrong here (for the lecturer)

| The AI writes | The follow-up prompt |
|---|---|
| `z.string().email("…")`, `required_error`, `invalid_type_error`, `{ message: "…" }` (Zod 3) | "Use Zod 4: `z.email()` and the `error` option." |
| `useForm<typeof schema>` | "Type the form with `z.infer<typeof schema>`." |
| A `useState` for every field "to be safe", or `value={…}` together with `register` | "No useState for field values: `register`, or `Controller` for my own components." |
| One `useForm` per step, and the values passed down as props | "One `useForm` above the steps with `FormProvider`; each step uses `useFormContext`." |
| `key={index}` in the gift rows | "Use `key={field.id}`." |
| `watch()` at the top of the page | "No `watch()` in the page: read the values at submit, or `useWatch` in a small component." |
| `<input type="number" {...register("copies")} />` with `z.number()` | "Use `valueAsNumber: true`, or a `Controller` with real numbers." |
| Next and Save in the same JSX place with no keys | "Give Next and Save different keys." |
| Only browser-side checks | "The server may refuse: show its answer with `setError`." |
| An async rule that asks at every key | "Check the format first (`abort: true`) and remember the answers." |

### What a good answer looks like

The hand-written solution, to check what the AI produced.

#### Base (everyone)

```ts
// src/schemas/checkout.ts
import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name"),
  email: z.email("Enter a valid email address"),
  city: z.string().trim().min(2, "Where do we deliver?"),
  address: z.string().trim().min(5, "Street and number, please"),
  note: z.string().max(200, "Under 200 characters, please"),
});
export type Checkout = z.infer<typeof checkoutSchema>;

// which fields belong to which step: Next checks only these
export const STEPS = [["name", "email"], ["city", "address"], ["note"]] as const;
```

```tsx
// src/pages/CheckoutPage.tsx
const form = useForm<Checkout>({
  resolver: zodResolver(checkoutSchema),
  mode: "onTouched",
  defaultValues: { name: "", email: "", city: "", address: "", note: "" },
});

async function goNext() {
  const ok = await form.trigger([...STEPS[step]]); // this step's fields only
  if (ok) setStep(step + 1);
}

<FormProvider {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
    {step === 0 && <ContactStep />}
    {step === 1 && <DeliveryStep />}
    {step === 2 && <ReviewStep />}
    {step < STEPS.length - 1 ? (
      <button key="next" type="button" onClick={goNext}>Next</button>
    ) : (
      <button key="place" type="submit">Place the order</button>
    )}
  </form>
</FormProvider>
```

```tsx
// src/components/checkout/ContactStep.tsx: no props, the same form through context
const { register, formState: { errors } } = useFormContext<Checkout>();
// <TextField label="Name" error={errors.name?.message} {...register("name")} />
```

#### Plus

```ts
// in the schema
gifts: z
  .array(
    z.object({
      to: z.string().trim().min(2, "Who is it for?"),
      text: z.string().trim().min(2, "Write a few words").max(80, "Keep it short"),
    }),
  )
  .max(5, "Up to five, please"),
cards: z.number().int().min(0).max(5),
```

```tsx
const { fields, append, remove } = useFieldArray({ control, name: "gifts" });

{fields.map((field, index) => (
  <div key={field.id}>
    <TextField label="For" error={errors.gifts?.[index]?.to?.message} {...register(`gifts.${index}.to`)} />
    <TextField label="Message" error={errors.gifts?.[index]?.text?.message} {...register(`gifts.${index}.text`)} />
    <button type="button" onClick={() => remove(index)}>✕</button>
  </div>
))}
<button type="button" onClick={() => append({ to: "", text: "" })}>Add a gift note</button>

<Controller
  control={control}
  name="cards"
  render={({ field }) => (
    <QuantityStepper
      qty={field.value}
      onDecrease={() => field.onChange(Math.max(0, field.value - 1))}
      onIncrease={() => field.onChange(Math.min(5, field.value + 1))}
    />
  )}
/>
```

#### Pro

```ts
const taken = new Map<string, Promise<boolean>>();
function isUsernameTaken(name: string) {
  if (!taken.has(name)) {
    taken.set(
      name,
      fetch(`https://dummyjson.com/users/filter?key=username&value=${encodeURIComponent(name)}&select=username`)
        .then((r) => r.json())
        .then((d: { total: number }) => d.total > 0)
        .catch(() => false), // can't ask? A later step may still refuse it
    );
  }
  return taken.get(name)!;
}

username: z
  .string()
  .refine((v) => /^[a-z0-9_]{3,20}$/.test(v), {
    error: "3 to 20 letters, digits or _",
    abort: true, // wrong format: never ask the server
  })
  .refine(async (v) => !(await isUsernameTaken(v)), { error: "This username is taken" }),
```

(`GET /users/filter?key=username&value=emilys` answers `{ "total": 1, … }` when the username exists and `{ "total": 0, … }` when it does not.) Use `mode: "onBlur"` so it asks when the guest leaves the field, and show `formState.validatingFields.username` as "Checking…".

#### Common problems (for the lecturer)

| Problem | Fix |
|---|---|
| The review step is empty | Each step has its own `useForm`. One `useForm` above, `FormProvider`, `useFormContext` in the steps |
| Pressing Next sends the form | Next and Save share one button: give them different keys |
| Back loses what was typed | The form lives inside a step. Move `useForm` to the page |
| The gift row's text is right but an open panel is on the wrong row | `key={index}`: use `key={field.id}` |
| `Invalid input: expected number, received string` | A number input: `valueAsNumber: true`, or a `Controller` |
| The username is asked at every key | `mode` is `onChange`, or there is no `abort` and no cache |
| The AI's `useForm` has no `defaultValues` | Every field needs a starting value, or the schema says "received undefined" |
