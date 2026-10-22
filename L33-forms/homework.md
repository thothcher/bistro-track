# L33 · Homework: your shop, version 0.7

**Due:** before L34. **Submit:** the GitHub link and the Vercel link.

## Base (required)

1. **Schemas:** a `schemas/` folder with a Zod schema for the login (`username`, `password`) and one for a sign-up (first name, username, email, password and its repetition). Every rule carries its message. The types come from `z.infer`: no hand-written type for form values.
2. **Two forms with React Hook Form:** the login (rebuilt) and a sign-up page (`/register`), both with `useForm` + `zodResolver`, `defaultValues`, `register` and `handleSubmit`. **No `useState` holds a field's value** anywhere.
3. **A rule about two fields:** the repeated password, as a `refine` on the object with `path: ["confirmPassword"]`.
4. **A `TextField` component:** a label, an input and a message line of fixed height, used by every text field of both forms.
5. **The server's answer:** the login shows a wrong-password message with `setError("root", …)`; the sign-up sends the values to `POST https://dummyjson.com/users/add` and shows the answer on the page. The submit button is disabled while sending (`isSubmitting`).

## Plus

- **A form in steps:** a checkout (or "delivery details") in three steps with **one** `useForm` above them (`FormProvider` + `useFormContext`), `trigger` on Next, and different `key`s on Next and Save. Back loses nothing.
- Inside it, a list of rows with `useFieldArray` (gift notes, extra addresses…) keyed by `field.id`, and one field built with `Controller` (your `QuantityStepper`, for example).

## Pro

- **Ask the server, once:** "is this username taken?" with `GET https://dummyjson.com/users/filter?key=username&value=…` (`total` is 1 when it is). The format rule has `abort: true`, answers are remembered in a `Map`, and the form uses `mode: "onTouched"` or `"onBlur"`. Show "Checking…" while it waits (`formState.validatingFields`).
- Save the checkout form's values in a Zustand store (L32) so a refresh keeps the draft.

## Before you submit

- [ ] React DevTools → Highlight updates: typing in a field does not flash the form
- [ ] Search your form files for `useState`: none holds a field's value
- [ ] Every message comes from a schema, none is written in the JSX
- [ ] `useForm` is typed with `z.infer` (or an exported type), never with `typeof schema`
- [ ] The repeated-password message appears under the second password field
- [ ] `npm run build` passes, the Vercel link works

## Grading (10 points)

| Points | Criterion |
|---|---|
| 3 | Login and sign-up on `useForm` + `zodResolver`; no `useState` for values; types from `z.infer` |
| 2 | The schemas: rules and messages in one place, the `refine` with `path` |
| 2 | `TextField` with a fixed message slot, used everywhere; messages next to their fields |
| 1 | The server's answer shown (`setError`), a busy button |
| 1 | Clean: no Zod 3 syntax, no `register` without the call, no browser bubbles (`noValidate`) |
| 1 | Deployed and working |
| +1 | Plus |
| +1 | Pro |

**Heads-up:** in L34 you give the server's data a cache with TanStack Query. Open your shop, click a product, go back, open the product list again and watch the Network tab: the same list is fetched every time. Keep your `useApi` hook for now: it is the starting point.
