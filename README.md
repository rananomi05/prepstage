# PrepStage — AI Interview Rehearsal Coach

Paste a job description, get interview questions built specifically for
that role (not a generic bank), then practice your answers out loud and
get direct feedback. Built with **Next.js 14 (App Router)**,
**TypeScript**, and **Tailwind CSS** — powered by the **free tier of
Google's Gemini API** (no credit card, no billing account required).

## The market gap

Interview prep tools split into two camps: free generic question banks
(the same 50 questions everyone has seen) or paid coaching platforms
(Yoodli, Pramp) that charge monthly for personalized feedback. There's
little in between — a free tool that reads an *actual* job posting and
builds role-specific questions, then lets you rehearse and get told
honestly what's working.

## Design concept

A rehearsal-room aesthetic instead of a generic dashboard: a near-black
"stage" background with a soft spotlight glow at the top, and questions
rendered as warm cream index cards with a dotted perforated edge — like
cue cards you'd actually hold before walking into an interview. Category
badges use distinct colors (amber/teal/violet) so you can see your prep
balance across Behavioral, Technical, and Culture Fit at a glance.

## What's inside

```
prepstage/
├── app/
│   ├── page.tsx                 # Main UI (client component)
│   ├── layout.tsx               # Fonts + metadata
│   ├── globals.css              # Tailwind + stage/cue-card visual details
│   ├── api/questions/route.ts   # Generates role-specific questions (Gemini)
│   └── api/feedback/route.ts    # Reviews a practice answer (Gemini)
├── components/
│   ├── IntakeForm.tsx           # Job description + optional background input
│   └── QuestionCard.tsx         # Cue-card with expandable practice + feedback
├── lib/
│   ├── gemini.ts                # Shared fetch wrapper for the Gemini API
│   └── types.ts                 # Shared TypeScript types
└── .env.example                 # Copy to .env.local and add your free API key
```

## Setup (5 minutes)

1. **Install Node.js 18.17+** if you don't have it: https://nodejs.org

2. **Install dependencies**
   ```bash
   cd prepstage
   npm install
   ```

3. **Get a free Gemini API key** — no credit card needed:
   - Go to https://aistudio.google.com/apikey
   - Sign in with any Google account
   - Click "Create API key"

4. **Add your key**
   ```bash
   cp .env.example .env.local
   ```
   Paste your key into `.env.local`.

5. **Run it**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser.

## How it works

1. The user pastes a job description (and optionally their background)
   into the intake form.
2. The frontend calls `POST /api/questions` — a Next.js Route Handler
   (the API key never reaches the browser).
3. The route sends one prompt to Gemini asking for structured JSON: 8
   role-specific questions split across Behavioral / Technical / Culture
   Fit, each with a note on what a strong answer covers.
4. Each question renders as a cue card. Expanding "Practice this answer"
   reveals a textarea; submitting calls `POST /api/feedback`, which sends
   the question + answer to Gemini and returns strengths and specific
   improvements.

## About the free API

Google's Gemini API free tier (via [Google AI Studio](https://aistudio.google.com))
is, as of this writing, the only major LLM provider offering a genuinely
free, indefinite API tier with no credit card — roughly 1,500 requests/day
on Flash models. Rate limits and exact model names can shift over time, so
if `gemini-2.5-flash` (the default in `lib/gemini.ts`) is ever renamed or
retired, set `GEMINI_MODEL` in `.env.local` to whatever the current
free-tier Flash model is called — check
https://ai.google.dev/gemini-api/docs/pricing for the current list.

Note: on the free tier, Google may use your prompts/responses to improve
their products. Don't paste anything you wouldn't want used that way (the
paid tier removes this).

## Customizing the AI behavior

The two prompts live in `app/api/questions/route.ts` and
`app/api/feedback/route.ts` as `SYSTEM_PROMPT` constants. Edit them to
change question count, tone, category mix, or the JSON shape returned.

## Next steps if you want to keep building this

- **Save sessions** — add Supabase (or similar) so users can return to a
  past prep set instead of losing it on refresh.
- **Voice practice** — record a spoken answer and transcribe it (e.g. with
  the Web Speech API, also free) instead of typing.
- **Mock interview mode** — chain questions into a timed, one-at-a-time
  flow that feels more like a real interview.
- **Export** — let users download their question set + coach notes as a
  PDF to review offline before the interview.

## Deploying

Standard Next.js app — deploys as-is to **Vercel** (recommended) or any
Node host that supports Next.js. Set `GEMINI_API_KEY` as an environment
variable in your host's dashboard — never commit `.env.local`.
