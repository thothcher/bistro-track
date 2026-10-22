# L33 · Masterclass: Le Bistro after L33 in one prompt

**Where:** slides 38–40, right after Classwork 2 (8 minutes). **What it builds:** Le Bistro as it is at the end of this lecture, the same app as [`../code/after-L33`](../code/after-L33), from one prompt.

The prompt has five parts, **CRAFT**: **C**ontext (what exists and what we use), **R**ole (who answers), **A**ction (what to build, step by step), **F**ormat (what the answer looks like) and **T**arget (who reads it, when it's done). On the first slide the parts open one by one. On the last slide the same prompt comes back as one short paragraph, to show that the labels were scaffolding.

## Before class (10 minutes)

- Run the prompt once in the AI tool you'll use in class (Claude, ChatGPT, Copilot Chat, …). Nothing to attach: the data comes from the API, and the prompt names the endpoints.
- Keep the answer open in a tab. Answers take a minute or two and differ a little every time, so the Masterclass never waits for one.
- Better still: paste the answer into a fresh Vite project (`npm install zustand react-hook-form zod @hookform/resolvers@5`) and run it, so you can show it working.

## How to run it (8 minutes)

1. **The prompt, part by part** (slide 38, 2′). Press next five times. For each part, one sentence: what would the AI do without it?
2. **Run it, then check it** (slide 39, 4′). Show the answer and go through the checks in its code, one per press. Then open `code/after-L33` next to it.
3. **The short version** (slide 40, 2′). Read it aloud, then press next: each part lights up in its colour.

## The prompt

The Copy button on slide 38 copies exactly this:

```text
CONTEXT
Le Bistro, a French restaurant site. Vite + React 19 + TypeScript + Tailwind CSS 4,
react-router 8 (import from "react-router"), Zustand 5, react-hook-form 7, zod 4
(z.email(), the option is error), @hookform/resolvers 5. API at /api through a Vite
proxy: dishes, categories, search, /auth/login, /auth/register, /auth/me, and
/enterprise/validation/check-phone?number= -> { isDuplicate } (1 second; 555123456 is taken).

ROLE
You are a senior React developer who writes code for beginners to read.

ACTION
Build the site as it is so far (menu, search, pages, Zustand stores, role guards) and its
forms with React Hook Form and Zod, with no useState for field values:
- schemas/auth.ts: loginSchema, and registerSchema (name, email, Georgian mobile phone,
  password with a digit, confirm with refine + path, terms). The phone rule has abort:
  true, then an async check-phone call whose answers are remembered.
- TextField (label, input, message slot of fixed height), LoginPage and RegisterPage:
  useForm + zodResolver, sign-up on mode onBlur, server errors with setError.
- /notes: 3 steps in ONE form (FormProvider, trigger per step): seats (Controller + stepper),
  arrival time, guests (useFieldArray, key = field.id), a note; saved in the cart store.

FORMAT
First a table: each form, its fields and the rule that guards each. Then every file in
full with its path. Each schema exports its z.infer type.

TARGET
Beginners will read it: small components, messages live in the schemas, App.tsx only
lists routes. It must pass npm run build.
```

## The short version

The Copy button on slide 40 copies exactly this:

```text
You're a senior React developer writing for beginners. Le Bistro is a Vite + React 19 + TypeScript + Tailwind 4 app with react-router 8, Zustand 5, react-hook-form 7, zod 4 and @hookform/resolvers 5, and an API at /api through a Vite proxy (login, register, /auth/me, and a check-phone endpoint that takes a second and says 555123456 is taken). Build the site as it is so far (menu, search, pages, a cart and a session in Zustand stores, role guards) and its forms: a schemas/auth.ts with loginSchema and a registerSchema (name, email, Georgian mobile phone with abort: true before an async, remembered server check, password with a digit, a refine with path for the matching passwords, terms), a TextField with a fixed-height message slot, a LoginPage and a RegisterPage on useForm + zodResolver (the sign-up on mode onBlur, server errors with setError), and a /notes page with three steps in one form (FormProvider, trigger per step): seats with Controller, arrival time, guests with useFieldArray keyed by field.id, a free note, saved in the cart store; no useState for field values. Answer with a table of each form, its fields and the rules that guard them, then every file in full with its path. Keep it simple for beginners, put every message in the schemas, and make sure npm run build passes.
```

## Check the answer with today's knowledge

- [ ] No `useState` holds a field's value: `register` or `Controller` does
- [ ] Every `useForm` is typed with `z.infer`, with `zodResolver(schema)` as its resolver
- [ ] Zod 4 syntax: `z.email()` and `error:`, no `required_error`
- [ ] One `useForm` above the steps; guest rows use `key={field.id}`; Next and Save have different keys
- [ ] The phone rule has `abort: true` before the server call

**What AIs often get wrong here:** AIs write a `useState` for every field "to be safe", one `useForm` per step and Zod 3 options. All three are on today's mistakes slides.

## When the AI goes off track

- **Old versions** (Zod 3's `z.string().email()` and `required_error`, react-hook-form 6's `ref={register}`, `react-router-dom`, a `tailwind.config.js`): point at the Context line that names the versions and ask it to follow it. That's the lesson: the Context part exists for exactly this.
- **Half an answer** ("the other steps are similar"): ask for the missing files by name: "Give me SpecialStep.tsx in full."
- **It doesn't build:** paste the exact error message as the next prompt. Students should see this loop once. (An `ERESOLVE` error on `@hookform/resolvers`: `npm install @hookform/resolvers@5`.)
- **No internet or no time:** show `code/after-L33` and the answer you saved before class.
