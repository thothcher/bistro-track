# L33 · Le bon de commande — lecturer guide

**Forms with React Hook Form and Zod.** Le Bistro track, lecture 7 of 10 (syllabus v2: **L35**, React lecture 8).
**Deck:** [`index.html`](index.html), 44 slides. **Code:** starts from [`../code/after-L32`](../code/after-L32), ends at [`../code/after-L33`](../code/after-L33).
**Students' sheets:** [`classwork.md`](classwork.md), [`homework.md`](homework.md). **Masterclass script:** [`masterclass.md`](masterclass.md).

---

## In one minute

| | |
|---|---|
| **Students learn** | Why a form is its own kind of state; controlled and uncontrolled inputs; `useForm`, `register`, `handleSubmit`, `formState` (`errors`, `isSubmitting`, `validatingFields`) and `setError`; Zod schemas (`z.object`, `z.email`, `.min`, `.regex`, `refine` with `path`, `abort`, async rules, `z.infer`) and `zodResolver`; `mode` (when the first message shows); `Controller`, `useFieldArray`, `FormProvider` + `useFormContext` + `trigger`; the server's answers with `setError`; a `TextField` with a fixed-height message slot |
| **Le Bistro gets** | `schemas/auth.ts` and `schemas/tableNotes.ts`; the login rebuilt, a sign-up page (six fields, a confirm-password rule, a phone number the server checks), a three-step "table notes" form saved in the cart store; `TextField`; `auth/signIn.ts`. The login loses four `useState`s |
| **Students' project** | v0.7: login and sign-up with a Zod schema, no `useState` for field values, the server's answer with `setError`; Plus: a form in steps with a list |
| **The two problems** | 1. Seventeen letters, seventeen renders, and the same three lines six times. 2. A list that grows, steps that forget everything on Back, a server question asked at every key |
| **The two answers** | 1. A schema and a form that keeps the text in the input. 2. `useFieldArray`, `Controller`, one `FormProvider` above the steps with `trigger`, and `refine`, `abort` and a cache for the server |
| **AI** | Classwork 2 is done with an AI: a CRAFT prompt (Context, Role, Action, Format, Target), then the students check the code. The Masterclass rebuilds Le Bistro after L33 with one prompt |

**Numbers:** in the L32 app, 17 letters in the login's email field are 17 renders of the page (34 in development: StrictMode renders twice); with `register` they are 0 (measured with a render counter). The three packages add about 41 kB (gzip) to the app: 89.7 kB after L32, 131.1 kB now. The phone check on the real API takes about 0.9 seconds, and `555123456` is reserved as "taken".

---

## Before class

- [ ] Your Le Bistro from L32 runs (or copy `code/after-L32`, `npm install`).
- [ ] Do the measurement once: open the login page of `after-L32` with React DevTools → Components → ⚙ → **Highlight updates when components render**, and type an email. The whole card flashes at every key. That is the problem you will show.
- [ ] `code/after-L33` open in a second VS Code window. Install with `npm install react-hook-form zod @hookform/resolvers@5`: the `@5` matters (see "When something breaks").
- [ ] Register one test guest on the real API before class (use your own email) and watch what the server answers. The authenticated endpoints (`/auth/register`, `/auth/login`, `/auth/me`) were built from the API's Swagger description and run here against a local copy of it; they were **not** called on the live server. The public phone check was.
- [ ] Try the demos on slides 8, 16, 18, 24, 25 and 32 once. They run in the deck, no internet needed.
- [ ] Remind the students that their DummyJSON login takes a **username**, so their schema has `username`, not `email`.

---

## Learn it first (35 minutes)

### 1. A form is its own kind of state

A form has a draft (what the guest typed so far), rules (what is valid), messages (what is wrong, and where), and a life cycle (touched, submitting, sent, refused). With plain `useState` each of these is another variable, and every letter typed is a state change, so React renders the whole component for every key. That is fine for two fields and slow and noisy for six, an error under each, and a list.

The first fix is old and simple: **do not hold the text in React.** A native `<input>` already keeps what you type. Read it when you need it, at submit time. This is an **uncontrolled** input. React Hook Form is built around it.

### 2. `useForm` and `register`

```tsx
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: "", password: "" },
});

<form onSubmit={handleSubmit(onSubmit)} noValidate>
  <input {...register("email")} />
  <p>{errors.email?.message}</p>
</form>
```

- `register("email")` returns `{ name, onChange, onBlur, ref }`. Spreading it on the input hands the form a reference to the element: the form reads and listens to it without React re-rendering while the guest types. **Typing renders nothing.**
- `handleSubmit(onSubmit)` is the gate: it reads every field once, asks the schema, and calls `onSubmit(values)` **only if everything is valid**. Otherwise it fills `errors` and focuses the first invalid field.
- `formState` is a proxy: the form re-renders for a property **only if you read it**. Read `errors`, `isSubmitting`, `validatingFields`; do not read what the screen does not show.
- `defaultValues` gives every field a starting value. Without it a field starts as `undefined`, and the schema says "expected string, received undefined".
- `noValidate` on the `<form>` switches off the browser's own message bubbles, so the schema is the only judge and the messages are ours.
- `setError("root", { message })` puts a message on the **whole form** (a wrong password); `setError("email", { message })` puts it on a field (the server says that email exists).

> **Say it like this:** "The order slip is filled in at the table, on paper, by the guest. Nobody photographs every letter. When the slip comes back to the kitchen, one person reads all of it and says: complete, or what is missing."

### 3. Zod: one schema, three jobs

```ts
export const loginSchema = z.object({
  email: z.email("Enter your email address"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginValues = z.infer<typeof loginSchema>;
```

A schema is data about data. It **validates** (the rules), it **explains** (every rule carries its message), and it **types** (`z.infer` reads the TypeScript type out of it, so there is no second definition to keep in sync).

Zod 4 (the version in this course) spells some things differently from the tutorials you will find:

| Zod 3 (old tutorials, and many AIs) | Zod 4 |
|---|---|
| `z.string().email("…")` | `z.email("…")` (the old form still works but is deprecated) |
| `{ message: "…" }`, `required_error`, `invalid_type_error` | one option, `error: "…"` (a TypeScript error for the removed ones; **silently ignored** in plain JavaScript) |
| a `refine` runs only if the object is otherwise valid | an object-level `refine` runs **even when other fields failed** |

Rules between fields and with the server:

- `refine((v) => v.password === v.confirmPassword, { error: "…", path: ["confirmPassword"] })` on the object. `path` chooses the field that shows the message; without it the message belongs to the form and no field shows it.
- `refine(check, { error: "…", abort: true })`: if this rule fails, skip the ones after it. Our phone rule checks the format first with `abort: true`, so a typo is never sent to the server.
- `refine(async (v) => …)` may await the server. `zodResolver` awaits it for us.

### 4. When does the first message show? (`mode`)

`mode` says when the form first asks the schema. We verified the rules against the real library in Chrome, and the deck's demo follows them exactly:

| `mode` | Before the first Send | After the first Send |
|---|---|---|
| `onSubmit` (default) | nothing is checked until Send | every change re-checks |
| `onBlur` | checked when the guest leaves the field; the message **stays while they type** until the next blur | every change re-checks |
| `onChange` | checked at **every key** (the message shows while the guest is still typing; a render per key) | every change re-checks |
| `onTouched` | first check on blur; after that, every key | every change re-checks |

(`reValidateMode` is `onChange` by default, which is why a message disappears the moment it is fixed once the guest has pressed Send.) A login: the default. A long form with a server check: `onBlur`. A short form with live help: `onTouched`.

### 5. A field that shows its message

`TextField` takes a `label`, an `error` and every attribute an `<input>` takes (`ComponentProps<"input">`). It wires the label to the input with `useId` and `htmlFor`, marks the input `aria-invalid` and shows the message with `role="alert"`. Two details matter:

- **`ref` is an ordinary prop in React 19.** That is why `{...register("email")}` works on our own component with no `forwardRef`: the `ref` travels inside the rest props to the real input. (React 18 needed `forwardRef`; older tutorials show it.)
- **Reserve the message line.** The component always renders a `div.field__slot` with a fixed height. If the message is inserted on blur and pushes the page down, the submit button moves away from under the mouse while the guest is pressing it: the press and the release land on different elements and the **click is never fired**. We hit this in our own tests. The slide 18 demo uses real mouse events to show it.

### 6. Forms that grow

- **`useFieldArray({ control, name: "special" })`** gives `fields` (one per row) plus `append` and `remove`. Key each row with **`field.id`**, which the form invents for exactly this. Register each input by its path, `` register(`special.${index}.name`) ``, and read each message by the same path, `errors.special?.[index]?.name?.message`. With `key={index}` the typed text still looks right (the form writes the values back, we tested it), but anything the **row remembers itself** (an open panel, the focus, an animation) jumps to the wrong guest after a removal.
- **`Controller`** connects a component that is not a native input (our `QuantityStepper`, a date picker, Radix's `Select` in L36). It gives `field.value` and `field.onChange(newValue)`. Native elements use `register`.
- **One form above the steps.** Call `useForm` once in the page, wrap the steps in `<FormProvider {...form}>`, and let each step call `useFormContext()`. A step may leave the screen and its values stay in the form. Next calls `form.trigger(["seats", "arrival"])`, which validates just those fields and says whether they are fine.
- **Different `key`s on Next and Save.** On the last step Next becomes Save at the same place in the JSX; React keeps one `<button>` and changes its `type` to `submit` in the middle of the click, and the browser sends the form. A `key` makes React build a new button.

### 7. The server has the last word

Validation in the browser is a courtesy to the guest, not security: the server checks everything again, and it knows things the browser cannot (the email exists, the phone is taken). So `onSubmit` has a `try`/`catch`, and `setError` puts the server's words where the schema's would be: a 409 under the email, anything else on the whole form (`"root"`).

For a rule that needs the server (the phone number), three small decisions keep it civil: **format first** (`abort: true`), **ask when the guest has finished** (`mode: "onBlur"`), and **never ask twice** (a `Map` of answers). While a request is out, `formState.validatingFields.phone` is true, and we show "Checking this number…". Without these, a hand-written check asks at every key and the answers arrive out of order: the slide 25 demo ends with the screen saying "free" about a number that has an account.

### Check yourself

1. Why does `register` cause 0 renders while typing and `useState` 17? → With `register` the browser holds the text and the form reads it later; with `useState` every letter is a state change.
2. Where is a wrong email stopped? → In `handleSubmit`: the schema runs first, `onSubmit` is never called.
3. What are the three jobs of a Zod schema? → Rules, messages, and the type (`z.infer`).
4. How do you show "The passwords don't match" under the second password field? → A `refine` on the object with `path: ["confirmPassword"]`.
5. Why `key={field.id}` and not `key={index}`? → The id follows the row; the index follows the place, so what the row remembers jumps to another guest.
6. When do you need `Controller`? → For your own components and library components; native elements use `register`.
7. Why do Next and Save need different `key`s? → Otherwise React reuses one button and turns it into a submit button during the click.
8. Why `abort: true` on the phone format? → A wrong format must never reach the server.

Further reading: the React Hook Form docs (react-hook-form.com → *Get started*, *useForm*, *useFieldArray*, *Controller*, *FormProvider*), the Zod docs (zod.dev → *Basic usage*, *Customizing errors*, *Refinements*), and react.dev → *Reacting to Input with State* (for the controlled/uncontrolled idea).

---

## The 120 minutes

| Time | Block | Slides | What happens |
|---|---|---|---|
| 0:00 | Hello | 1–4 | Greeting, menu, the second five-lecture route, the blind rolls up on the login page |
| 0:03 | Questions | 5–6 | Backup questions; two v0.6 demos, each ending with "Highlight updates" on the login form |
| 0:11 | Problem 1 | 7–10 | **Type an email, count the renders**; a sign-up by hand; "What would we need?" |
| 0:16 | Solution 1 | 11–20 | The form keeps the values, one schema three jobs, `useForm` in one picture, **the schema first (live)**, **the login (live)**, **when does the error show?**, **TextField (live)**, **the click that disappears**, mistakes, quiz |
| 0:40 | Classwork 1 | 21 | Their login with a schema |
| 0:55 | Break | 22 | |
| 1:05 | Problem 2 | 23–26 | **Three steps, and Back loses everything**; **ask the server at every key**; "What would we need now?" |
| 1:10 | Solution 2 | 27–36 | One form above the steps, **the steps (live)**, **useFieldArray (live)**, Controller, rules between fields, **ask the server once**, the server has the last word, the page at the end, mistakes, quiz |
| 1:32 | Classwork 2 with AI | 37 | Students prompt an AI for a form in steps, then check it |
| 1:47 | Masterclass | 38–40 | One prompt rebuilds Le Bistro after L33: part by part, run and check, the short version |
| 1:55 | Wrap-up | 41–44 | Recap, flip cards, homework, next time (the cache) |

Running late? Skip slides 13 (`useForm` in one picture: say "four things"), 16 (the `mode` demo: say "the sign-up uses `onBlur`"), 18 (the click: tell the story in thirty seconds), 20 and 36 (quizzes) and 30 (`Controller`: show it in the code). In the second half, copy `schemas/auth.ts` instead of typing slide 31. Never skip the classworks. In the Masterclass, show the parts (slide 38) and the short version (slide 40), and skip the live run.

---

## Classwork 2 with AI and the Masterclass

**Classwork 2 with AI** (slide 37, 15 minutes). The task is a three-step form with one `useForm` above the steps and `trigger` on Next (Base), a list of gift notes with `useFieldArray` and a stepper with `Controller` (Plus), and a sign-up with a `refine` and an async username check that skips the server on a wrong format (Pro). The students write a five-part prompt (**CRAFT**), the AI writes the code, and they check it against "Done when".
- Any AI tool works: Claude, ChatGPT, Copilot Chat. Students who have none can pair up.
- Forms are where AIs make the most small mistakes (Zod 3 syntax, one `useForm` per step, `key={index}`, a `useState` for every field "to be safe"): ask students to explain one line the AI wrote. Code they can't explain doesn't count.
- When the answer doesn't work, the next prompt is the exact error message.
- The template, a sample prompt (blurred on the slide until clicked) and the follow-up prompts for the AI's usual mistakes are in [`classwork.md`](classwork.md).

**Masterclass** (slides 38–40, 8 minutes). One prompt rebuilds Le Bistro as it is after today:
1. **The prompt, part by part.** Each press opens one part. For each, one sentence: what would the AI do without it?
2. **Run it, then check it.** Show the answer and go through the checks: each one is something from today.
3. **The short version.** The same five parts as one paragraph; press next and each part lights up.

**Before class:** run the Masterclass prompt once and keep the answer open (a minute or two, and it varies). The exact texts are in [`masterclass.md`](masterclass.md).

---

## The demos

| Slide | Demo | How |
|---|---|---|
| 8 | Type an email, count the renders | **Type for me** types `maia.k@example.ge` into both forms letter by letter: A (one `useState` per field) goes to 17 and its card flashes, B (`register`) stays at 0. Type by hand into either one. Reset |
| 16 | When does the error show? | Pick a mode (it resets). Type a wrong email (`maia@exa`), click outside the field, then finish the email, then press Send. The right panel shows `formState`; the log says what ran. `onBlur`: the message stays while you fix it, until the next blur. `onChange`: it shows at the first letter |
| 18 | The click that disappears | **Real mouse events.** "The message appears": click the field, type a few letters, press **Send with the mouse**: the message pushes the button down, the release lands on empty space, the log says "no click", **clicks lost** goes to 1. "The line is reserved": the first press works. Reset between tries |
| 24 | Three steps, and Back loses everything | "Each step keeps its own state": set 4 seats and 20:30, Next, add a guest, Next (the review says "Table of ?, arriving ?"), Back, Back (the seats are 2 again). "One form above the steps": the same path keeps everything and the review reads it |
| 25 | Ask the server at every key | **Type 555123456**: nine digits send nine requests; the answers return out of order and the last one wins, "free", for a number that has an account |
| 32 | Ask the server once | The same demo with three switches: **Format first** (`abort`), **Only when leaving the field** (`mode: "onBlur"`), **Remember the answers** (a `Map`). Each switch resets; try each alone, then press **Send** twice with the cache on and off |
| 37 | The sample prompt | Click the blurred box on the Classwork 2 slide: a complete CRAFT prompt for one shop theme |
| 38 | The prompt, part by part | Press next five times; **Copy** copies the whole prompt with its five labels |
| 40 | The short version | Press next: each part lights up in its colour; **Copy** copies the paragraph |

---

## The live build, step by step

Part 1 (before the break): the login.

1. **Install:** `npm install react-hook-form zod @hookform/resolvers@5`.
2. **`src/schemas/auth.ts`** (slide 14): `loginSchema` and `LoginValues`.
3. **`src/auth/signIn.ts`:** move the sign-in steps (login, `/auth/me`, `login(...)`) out of `LoginPage` into one function, copied from `code/after-L33`: the sign-up ends with the same steps.
4. **`src/components/TextField.tsx`** (slide 17), and the "Forms with React Hook Form" block of `src/index.css` (`.field__slot`, `.form-error`, `.check`, `.guest-row`…), both copied from `code/after-L33`.
5. **`src/pages/LoginPage.tsx`** (slide 15): delete the four `useState`s and the `preventDefault`, busy and error bookkeeping; add `useForm`, `handleSubmit(onSubmit)`, two `TextField`s with `register`, `setError("root", …)` and `isSubmitting`. For your own shop's DummyJSON login the fields are `username` and `password`.
6. **Test:** press Send with both fields empty: two messages, one under each field. A wrong password: the message for the whole form. A right one: you land on the page you wanted. With "Highlight updates" on, type: nothing flashes.

**Checkpoint 1:** `git commit -am "L33: the login with useForm and Zod"`.

Part 2 (after the break): the sign-up and the table notes.

7. **`registerSchema`** in `schemas/auth.ts` (slide 31): the six fields, the `refine` with `path`, the phone rule with `abort: true` and `isPhoneTaken` (copy the helper and explain the `Map`).
8. **`src/pages/RegisterPage.tsx`** (slides 31 and 33) and the route `/register`; a "Create an account" link on the login page. `mode: "onBlur"`, the `validatingFields.phone` hint, and the `onSubmit` with a 409 under the email and any other failure on the whole form.
9. **`schemas/tableNotes.ts`, `pages/TableNotesPage.tsx` and `components/notes/`** (slides 27–30) and the route `/notes`: one form above the steps, `trigger`, `useFieldArray`, `Controller`. `cartStore.ts` gains `notes` and `saveNotes` (copy), and the cart panel links to `/notes`.
10. **Test:** register with the phone `555 12 34 56`: after about a second, "This number already has an account". Then `599 12 34 56`. On `/notes`: add three guests, remove the first (the others keep their text), press Next with an empty name (the message appears and you stay on the step), and Back (nothing is lost).

**Checkpoint 2:** your app equals `code/after-L33`. `git commit -am "L33: sign-up and table notes with React Hook Form and Zod"`. This is where L34 starts.

---

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| `npm error ERESOLVE … peerOptional effect@"^4.0.0"` when installing `@hookform/resolvers` | The newest resolvers (6.0.0, October 2026) conflict with the other packages on npm 11 | `npm install @hookform/resolvers@5`; `zodResolver` is imported the same way |
| Every field says "Invalid input: expected string, received undefined" | No `defaultValues`, or the field was never registered | `defaultValues` for every field; `{...register("email")}` |
| A field is invalid however much you type, and the editor shows nothing | `<input {...register} />`: `register` was not called | `{...register("email")}` |
| `TS2769 · 'required_error' does not exist in type '$ZodStringParams'` (or `'invalid_type_error' … '$ZodNumberParams'`) | A Zod 3 option | `{ error: "…" }`, or a rule message such as `.min(1, "…")`. In plain JS it is silently ignored |
| `TS2322 · Type 'Resolver<{ email: string; … }>' is not assignable to type 'Resolver<ZodObject<…>>'` | `useForm<typeof schema>` | `useForm<z.infer<typeof schema>>`, or an exported `LoginValues` |
| `TS18048 · 'errors.email' is possibly 'undefined'` | `errors.email.message` | `errors.email?.message` |
| `TS2345 · Argument of type '"emial"' is not assignable to parameter of type '"seats" \| "email"'` | A typo in a field name | The message lists the valid names |
| `TS2739 · Type '{ onChange: ChangeHandler; onBlur: …; ref: …; name: "seats" }' is missing the following properties … qty, onDecrease, onIncrease` | `register` on your own component | `Controller` with `field.value` and `field.onChange` |
| "Invalid input: expected number, received string" (or "…received NaN") | A number input gives text | `register("seats", { valueAsNumber: true })`, or a `Controller` with real numbers |
| Pressing Send does nothing the first time, and works the second | A message appears on blur and pushes the button away from the mouse | A message slot of fixed height on every field |
| "Checking this number…" never shows | The old error hides the hint, or `validatingFields` is not read | Read `formState.validatingFields.phone`; let the hint win while it is set |
| "The passwords don't match" shows nowhere | The `refine` has no `path` | `path: ["confirmPassword"]` |
| "The passwords don't match" shows while the email is also wrong | In Zod 4 an object-level `refine` runs even when other fields failed | Expected: it is a rule about two fields |
| The phone is asked at every key | `mode: "onChange"` or no `abort` | `mode: "onBlur"`, `abort: true`, a cache |
| Next saves the form | Next and Save share one button | `key="next"` and `key="save"` |
| A guest's open panel (or focus) jumps to another guest after a removal | `key={index}` on the rows | `key={field.id}` |
| A 409 text from the register endpoint is not what the slide says | The real API's wording | `error.message` is shown as the server wrote it: read it once on the live server |

---

## Questions students ask

- **"React Hook Form or Formik?"** Formik keeps the values in React state and re-renders on every key; RHF keeps them in the inputs. RHF is the current default, and it is the one with a good TypeScript story.
- **"Is an uncontrolled input safe?"** Yes. It is how HTML always worked. React just does not mirror every letter any more.
- **"Can I still read a value while the guest types?"** `watch("email")` subscribes the whole form and re-renders it on every key. Prefer `useWatch` in a small leaf component, or read the value at submit time.
- **"Zod, Yup or Valibot?"** Same idea. Zod has the best TypeScript inference and is what the next modules (and the Next.js server actions) use.
- **"Do I still validate on the server?"** Always. The browser's check is a courtesy to the guest, not security.
- **"Why `noValidate`?"** So the browser's own message bubbles do not compete with ours: one judge, one wording.
- **"How do I clear the form after sending?"** `reset()` (or `reset(newValues)`), usually inside `onSubmit`'s success path.
- **"How do I fill a form from the server, an edit-profile page?"** Pass the data as `defaultValues` once it has arrived (or call `reset(data)`). With TanStack Query (L34) the data arrives through `useQuery`.
- **"Can the server use the same schema?"** In the Next.js module, yes: the same Zod schema validates a Server Action. That is the payoff of keeping it in its own file.
- **"Why is the form 'dirty' and what is 'touched'?"** `touched` = the guest has been in the field; `dirty` = the value differs from the default. Read them from `formState` only when the screen needs them.
- **"My AI wrote `useState` for every field."** Show them slide 9: that is the by-hand version. Ask for `useForm` explicitly (the CRAFT prompt does).
