# TTFJ Website — Phase 3 Wrap + Next Steps — Handoff (2026-08-23)

## Mission

Public website for **Taco Tuesday Flow Jam** (Chicago's weekly flow-arts jam at
Palmer Square Park), repo `E:\ttflowjam` → github.com/austencloud/ttflowjam,
live at https://ttflowjam.pages.dev on Cloudflare Pages. Design spec:
`docs/superpowers/specs/2026-08-18-ttfj-website-design.md`. Phases 1–3 are
shipped; this handoff covers the phase-3 round (icons/interactivity + gallery)
and the two in-flight account tasks (domain purchase, PayPal) that were
interrupted by a session disconnect on 2026-08-23.

Note for the reader: this doc was written by a successor session after the
disconnect. Repo/git state below was re-verified fresh on 2026-08-23; runtime
evidence (screenshots, console, live-page checks) is from the working session's
recorded transcript.

## Done — verified

All commits are on `main` and pushed (`origin/main` = `3ed697e`, confirmed
2026-08-23 via `git log` / `git status`: working tree clean except untracked
`launchers/`).

- **`37707ad` — FontAwesome icons, live countdown, cursor glow, active nav.**
  Emojis removed site-wide (FA SVG icon data via a tiny `Icon` component — no
  FA runtime), TacoCat cutout in header/footer/favicon, countdown to next jam
  (30s tick), gold pulse on the status card while the jam is on,
  cursor-tracking glow on glass cards (hover devices only, reduced-motion
  safe), FAQ sibling-dim, active-page nav marker. Evidence: 10/10 vitest
  passing (4 new countdown tests) in the working session; full gate
  (check+lint+test+build) green before commit.
- **`d98c506` — Gallery backed by R2 with media-spotlight viewer.** 217 photos
  in a grid at `/gallery`, opening into `@austencloud/media-spotlight@1.0.2`
  (hero zoom, swipe, arrows, pinch). 640px thumbs + 1600px fulls in R2 bucket
  `ttfj-media` — **434 files uploaded, zero failures** (verified by the upload
  script's final status). Served via `src/routes/gallery/media/[...key]/+server.ts`
  with immutable caching. Evidence: live verification on ttflowjam.pages.dev —
  all cells loaded, viewer opened/navigated/closed, console clean; CI run for
  the push watched to green.
- **`3ed697e` — phase 3 decisions record** at
  `docs/superpowers/plans/2026-08-18-phase-3-gallery.md` (includes the privacy
  screen results and the locked rule for future syncs).
- **Deployed.** Deploys are MANUAL (CI is a quality gate only):
  `npx wrangler pages deploy .svelte-kit/cloudflare --project-name=ttflowjam --branch=main --commit-dirty=true`.
  The current live deploy includes all of the above.

## Believed done — unverified

Nothing known. The "Add them to the album" link color fix (browser-default
blue → site gold) went in with the gallery commit and was screenshot-checked in
the working session, but if you touch `/gallery`, glance at it.

## In flight

- **Untracked `launchers/`** (`start-claude.bat`, `start-codex.bat`) at repo
  root — local convenience launchers, not part of any phase. Either gitignore
  or leave; don't sweep them into an unrelated commit.
- **Two in-app browser tabs were open when the session died** — Cloudflare
  (deep-linked to Registrar → Register domain, signed out) and PayPal (login
  page, remembering austencloud@gmail.com, signed out). Both were waiting on
  Austen to sign in. Those tabs are gone; reopen as needed.

## Loose ends (ranked)

1. **Domain purchase + DNS.** Austen approved on 2026-08-23 ("all about it …
   I'll buy it on cloudflare"). Candidates: `tacotuesdayflowjam.com`,
   `ttflowjam.com` (~$10/yr). The flow: he signs into Cloudflare, you run the
   registrar search and get him to the checkout screen — **the purchase click
   is his** (financial action, always). After purchase: add the custom domain
   to the `ttflowjam` Pages project and verify it serves.
2. **Taco Tuesday PayPal.** Austen asked for this same turn. Open question
   never answered: does a PayPal account for **flowtacocat@gmail.com** exist,
   or only his personal one? Account creation and password entry are his.
   Once he's signed into the right account: set up a PayPal.me handle (e.g.
   `paypal.me/tacotuesdayflowjam`) — stage everything, he confirms the final
   submit — then update the site's taco-fund section from a bare email address
   to a one-tap donate link.
3. **OG share cards.** A pasted link currently shows nothing. OG image = hero
   shot + TacoCat. Quick win, was the agreed next pass alongside the domain.
4. **Lore page.** 113 harvested Facebook posts spanning 2017-04-10 →
   2026-08-05 in `harvest/facebook/` — year-by-year timeline (the eagle, the
   move to Palmer Square, the 2023-08-27 Sun-Times feature). Source facts and
   press links: `harvest/README.md`.
5. **Album auto-sync Worker** (deferred in the phase-3 doc). Scheduled Worker:
   mirror new album photos → privacy screen → manifest → deploy. Manual
   re-runs cover it for now.
6. **Phase 4 community features** (Firebase: weather calls, taco-fund pings,
   workshop voting) — only worth building once 1–3 drive real traffic.

## Decisions already made

- **Privacy screen is a locked rule** (2026-08-18, applied 2026-08-23 round):
  every album photo is individually vision-screened before publication. Of
  301: 217 kept, 65 excluded (private-residence backyard — nearly all
  fire-spinning shots), 19 junk. **Real flames with no visible park context =
  exclude by default.** Any future album sync must pass the same screen.
- **No emojis in the UI** — FontAwesome SVG data through the `Icon` component,
  no FA runtime bundle.
- **Media stays out of git** (repo is public); the committed manifest
  `src/lib/data/gallery-manifest.json` is the index.
- **Deploys are manual wrangler**; CI (`.github/workflows/ci.yml`) gates
  quality only. The TKA-style deploy-hook gate arrives "when the site has
  users."
- Austen's priority order for next work (2026-08-23): domain first, then share
  cards + lore page.

## Gotchas

- **Facebook export JSON is mojibake** — decode strings with
  `s.encode('latin-1').decode('utf-8')` (noted in `harvest/README.md`).
- **The R2 upload loop is slow** (~2.6 s/file — a fresh `npx wrangler` process
  per file). It finished fine (434/434), but for the next bulk upload use a
  batched approach. Don't mistake the slowness for a stall; single puts work.
- **Dev mode has no R2 binding** — the gallery media route falls back to the
  gitignored `harvest/gallery-build/` pile. If gallery images 404 locally,
  that pile is missing, not the code.
- **The per-photo screen results lived in the working session's scratchpad**
  (ephemeral, gone). The exclusion list is re-derivable by re-running the
  vision screen over `harvest/google-photos/`; the counts and rule are in the
  phase-3 doc.
- **Credential/financial boundaries**: signing in, buying the domain, creating
  the PayPal account, entering passwords — all Austen's. Drive up to the
  checkout/confirm screen and hand off.
- Node >=22. This repo is standalone — TKA-platform's dev-server rules
  (:5173 etc.) don't apply here; `npm run dev` is fine.
