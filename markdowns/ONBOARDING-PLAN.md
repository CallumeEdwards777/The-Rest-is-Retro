# Onboarding flow — build plan (step-by-step, test after each step)

Feature: first-time visitors answer 2 quick multiple-choice questions, are invited to
create an account to save their picks, then land on a browse page pre-filtered to their
interests. Must feel good on both mobile and desktop. This implements the roadmap item
"Discover Your Era quiz" (owner: Martim).

**Working agreement:** build ONE step, verify it in a real browser (desktop 1280px AND
mobile 390px), screenshot it, commit it, then STOP and show Martim for UX feedback
before starting the next step. Martim reviews visually, never by reading code.

## Context for a fresh session

- Repo: `/Users/martim/AIOS/bootcamp/the-rest-is-retro-group-assignment`, branch `martim/prep-day` (pushed).
- Run: MySQL already running · `cd server && npm run dev` (API :3001) · `cd client && npm run dev` (app :5173).
- Test login: `vintage_vera` / `password123` (user id 1). Seed reset: `cd server && npm run seed`.
- Design truth: `markdowns/DESIGN.md` (palette, tokens in `client/src/index.css`). Fraunces 900 headlines, Inter body, cream/orange/teal/amber.
- Key existing pieces to REUSE: era + category filter chips in `ItemList.jsx` (the
  personalized landing is just these pre-selected); the auth card pattern in
  `Login.jsx`/`Signup.jsx` (`.auth-page`/`.auth` CSS); `SessionContext` (persists user in
  localStorage under `sessionUser`).
- Verify in browser via `~/.codex/skills/playwright/scripts/playwright_cli.sh` (open/goto/fill/click/screenshot; screenshots save relative to cwd). Stage milestone screenshots with `uploads put <file> --state after --meta path=/welcome`.

## Step 1 — Quiz screens (no accounts, no persistence beyond localStorage)

- New route `/welcome` with a card-flow component (reuse `.auth-page` centering + a new
  `.quiz` card style; single column, big tap targets, progress dots).
- Q1 "Which decades speak to you?" — multi-select chips: '70s, '80s, '90s, Y2K.
- Q2 "What do you hunt?" — multi-select chips: the 5 categories (fetch from `/api/categories`).
- Next/Back buttons; selections stored in localStorage key `onboarding`
  (`{eras: [], categoryIds: [], done: false}`).
- First-visit redirect: on `/`, if no `onboarding.done` and no auth token → redirect to
  `/welcome`. Always show a "Skip for now" link (sets `done: true`, goes to `/`).
- **STOP → Martim tests**: flow feel, question wording, chip labels, mobile layout.

## Step 2 — "Save your picks" account step

- Third panel after Q2: pitch line ("Create an account to save your era") + the signup
  form (reuse/extract from `Signup.jsx`) with a toggle to log in instead, and a
  "Continue as guest" link.
- On signup/login success OR guest: mark `onboarding.done = true`, keep answers, go to `/`.
- Returning users (have token) never see `/welcome` unless they visit it directly.
- **STOP → Martim tests**: full new-user journey end to end on mobile width.

## Step 3 — Personalized landing

- `/` reads `onboarding` prefs: pre-select the matching era chip (single era if one
  chosen; "All decades" if several/none) and category chips; hero subtitle becomes
  personal, e.g. "Fresh from the '80s for you" (+ username when logged in).
- Add a small "Change my era" link near the chips → reopens `/welcome` with previous
  answers pre-selected.
- **STOP → Martim tests**: do the filters match the answers he gave; hero copy taste check.

## Step 4 (stretch, only if time) — persistence + polish

- Save prefs to the user record (nullable `preferences` JSON/TEXT column on `user`,
  written at signup/login, read into localStorage) so picks follow the account across
  devices. Requires reseed after the model change.
- Then: the consolidated Claude Design polish pass over ALL screens (project
  "The Rest Is Retro" at claude.ai/design, projectId `5cd8811e-8c09-4134-bf6c-ab52d9052fe4`),
  and only after that, deployment (plan already agreed: TiDB Serverless free MySQL +
  Render server + Vercel client; make client API URL an env var + JWT secret to env first).

## Guardrails

- Commit after each step (small conventional commits); push is pre-approved on this branch.
- Don't touch the buy flow, My Listings, or the seed data; category ids come from the API, never hardcoded names.
- Era values in data are `1970s/1980s/1990s/2000s` (display "Y2K" for 2000s — helpers in `ItemCard.jsx`: `eraLabel`, `formatPrice`, `itemImage`).
- Lint must stay at 0 errors (`cd client && npx eslint .`); a PostToolUse hook runs it on every edit.
