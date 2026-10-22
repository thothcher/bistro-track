# Le Bistro after L33 · Le bon de commande

Le Bistro at the end of **L33 · forms with React Hook Form and Zod** (syllabus v2: L35). Start L34 from here.

Lecture: [`../../L33-forms/`](../../L33-forms/guide.md).

## New in this lecture

- `schemas/auth.ts`: `loginSchema` and `registerSchema` (name, email, phone, password and its repetition, house rules) with their `z.infer` types. The password rule that looks at two fields at once is a `refine` with `path: ["confirmPassword"]`. The phone is also checked on the server (`/api/v1/enterprise/validation/check-phone`, about a second): `abort: true` keeps the server out when the format is wrong, and every answer is remembered, so a number is asked once.
- `pages/LoginPage.tsx`, rebuilt with `useForm` + `zodResolver`; `pages/RegisterPage.tsx` ("Join Le Bistro"): `register`, `handleSubmit`, `formState` (`errors`, `isSubmitting`, `validatingFields`) and `setError` for the server's answers (409 under the email, anything else as a form error).
- `components/TextField.tsx`: label, input and message wired with `aria-invalid` and `aria-describedby`. The message slot is always there, so nothing moves when an error appears (a layout shift under the mouse swallows the click).
- `schemas/tableNotes.ts` + `pages/TableNotesPage.tsx` + `components/notes/*`: a three-step form. One form for all steps (`FormProvider`, `useFormContext`), `trigger()` checks only the current step, `useFieldArray` for the list of special needs (`field.id` as the key), `Controller` for our own `QuantityStepper` (the seats). The Next and Save buttons have different `key`s: without them React reuses one button and flips its `type` to `submit` during the click.
- `auth/signIn.ts`: the login steps, shared by both pages.
- `cart/cartStore.ts` remembers the table notes (`saveNotes`), and the cart panel links to `/notes`. L35 sends them to the kitchen with the order.
- `lib/api.ts`: for 400, 409 and 422 answers the error message is the API's own sentence.
- Version `0.7.0`. New dependencies: `react-hook-form`, `zod`, `@hookform/resolvers`.

## Install the forms libraries

```bash
npm install react-hook-form zod @hookform/resolvers@5
```

`@hookform/resolvers@6.0.0` (the newest, October 2026) fails to install with npm 11: `ERESOLVE … peerOptional effect@"^4.0.0"`. Version 5 works with Zod 4, and `zodResolver` is imported the same way. Drop the `@5` once a newer release installs cleanly.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

The dish photos come from the Le Bistro API server, so the page needs internet, and so does the menu: `vite.config.ts` forwards `/api/...` to https://srmsapi.stepacademy.ge (the API accepts browser requests only from its own site and from localhost:4200, so the browser must not call it directly). Restart `npm run dev` after changing the config.

Try the forms: `/login`, `/register` (the phone `555 12 34 56` already has an account, `599 12 34 56` does not), `/notes`. Test accounts are listed at the top of https://srmsapi.stepacademy.ge/swagger. Access tokens live 2 minutes.

## Deploy

Import the folder (or its git repo) in Vercel, or run `npx vercel`. `vercel.json` makes F5 work on every page and forwards `/api` to the real API.

## How it was checked

Type-checked, built and linted (oxlint, `eslint-plugin-react-hooks` 7.1.1): zero warnings. The three forms were run in a browser against a local stand-in for the API that follows its Swagger description. The phone check was also probed on the live server (public endpoint). The authenticated endpoints (`/auth/register`, `/auth/login`, `/auth/me`) were **not** called on the live server: register one test guest before class and watch what the real API answers.
