# Taco Tuesday Flow Jam — Website Design & Game Plan

Date: 2026-08-18
Status: DRAFT — core decisions locked with Austen (see §9). No code has been written.

---

## 1. Why this site exists

Your message archive (2015–2026; the jam itself dates to ~2016/2017) shows the same three questions asked every single year, by phone and Messenger, over and over:

1. "Is Taco Tuesday happening today?"
2. "What time does it start?"
3. "Where is it / send me the details?"

(Documented instances: 2021-07-03, 2021-07-06, 2024-10-08, 2025-04-22, 2025-04-29, 2025-10-07.)

The site's first job is to answer those three questions instantly, on a phone, from a link. Everything else — gallery, voting, classes, taco sign-ups, other events — hangs off that hub. The initial "linktree" idea survives as the Links page, but the site is the destination, not a redirect board.

## 2. What research established

### Identity (from the Sun-Times, the TKA guidebooks, Facebook, and message archives)

- **Name:** "Taco Tuesday Flow Jam" (press, singular) / "Taco Tuesday Flow Jams Chicago" (Facebook page name). Canonical spelling to be confirmed — see Open Questions.
- **Where:** Palmer Square Park, 2200 N Kedzie Blvd, Logan Square, Chicago — "middle of the park, by the totem pole."
- **When:** Tuesdays, spring through fall (first jam ~early April, season winds down in October). Afternoon into evening; historically "starts at 3" (2019), more recently people arrive "around 6 or so" (2025). Weather-dependent by design.
- **Since:** 2017 (guidebook copy; Sun-Times says "about 2016"). Founded by Austen Cloud; now "self-sustaining, no specific leader."
- **Format:** weekly potluck + open flow jam — jugglers, acro-yogis, fire spinners, hoopers, poi/staff, prop sharing, free teaching. Traditions: taco potluck, annual water-balloon fight, after-party fire jam.
- **Mascot:** TacoCat, "our glorious deity." Austen confirmed (2026-08-18) TacoCat gets full mascot treatment on the site; dedicated art doesn't exist yet and is a few steps away, so the site ships with TacoCat copy now and slots for art later. (The related TKA spec: `E:\tka-platform\docs\superpowers\specs\2026-08-04-taco-cat-presence-design.md`.)
- **Press:** Chicago Sun-Times feature (Aug 2023), LoganSquarist (2019), listed on fullmoonjam.org's "Join the Jams."
- **Socials found:** facebook.com/flowtaco (page, ~1.3k likes, post-approval enabled). Instagram @flowtaco is Austen's and active (confirmed 2026-08-18) — link it. No linktree exists.

### Ready-made content assets

| Asset                                                                   | Location                                                                          | Use                                 |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------- |
| Canonical info blurb ("Is the weather nice? Is it Tuesday?")            | `E:\tka-platform\static\guides\level-2.pdf` p36 (also level-1 p45)                | Hero/About copy, near-verbatim      |
| Embedded image on that page (`Im0.png`, 85 KB — likely TacoCat/jam art) | same PDFs, extractable via pypdf                                                  | Only local jam visual               |
| Founder bio                                                             | `E:\tka-platform\docs\grants\drafts\CC-09-artist-bio.md`                          | About page                          |
| ~390 messages, 2015–2026                                                | `E:\personal-hub\message-backfill\all-messages.jsonl` + `facebook-messages.jsonl` | History timeline, FAQ, testimonials |
| Flow-jam explainer draft                                                | `E:\flow-arts-wiki\content\drafts\Flow_jam.wiki`                                  | Background copy                     |
| Sun-Times quotes                                                        | web research                                                                      | Testimonials/press section          |

**Gaps that must come from outside the machine:** logo, flyers, event photos, TacoCat art. Sources: the Facebook page (needs your browser login for a scrape session) and the community Google Photos album.

### Content NOT found anywhere

No existing sign-up sheets, flyers, QR codes, logos, or website attempts. `E:\ttflowjam` was empty. This is a true greenfield with excellent raw copy.

## 3. Stack — same world as your other repos

Decision principle you set: no throwaway primitives; use the canonical versions from day one.

| Concern                   | Choice                                                                                                                                                                                                | Provenance                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Framework                 | SvelteKit 2 + Svelte 5 (runes only), Vite, TypeScript strict                                                                                                                                          | Both repos                    |
| Skeleton                  | Copy `E:\cirque-aflame\cirque-website` structure (right-sized: SEOHead, JsonLd, FadeIn, Breadcrumbs, form actions, wrangler.toml)                                                                     | cirque-website                |
| TS config                 | `E:\shared-packages\tsconfig.base.json` flags merged into SvelteKit shape (strict, noUncheckedIndexedAccess, verbatimModuleSyntax, …)                                                                 | shared-packages               |
| Lint/format               | TKA's flat `eslint.config.js` rule set + stylelint `declaration-no-important`; Prettier per TKA (the newer standard)                                                                                  | tka-platform                  |
| Styling                   | Vanilla scoped CSS + design tokens; `@austencloud/theme` (tokens.css, luminance-driven theming) + one `app.css` with TTFJ brand tokens; `@layer thirdparty, base, components, overrides`              | shared-packages + tka app.css |
| Gallery viewer            | `@austencloud/media-spotlight` v1.0.2 from npm (the canonical published gallery prototype — zero deps, hero animation, gestures, video) + a justified/masonry grid                                    | shared-packages               |
| Hosting                   | Cloudflare Pages (`@sveltejs/adapter-cloudflare`) + one scheduled Worker for the Google Photos sync (crons need Workers, not Pages)                                                                   | both repos                    |
| Storage                   | New R2 bucket `ttfj-media` (third bucket on the same account, alongside `cirque-media` and `tka-assets`)                                                                                              | your ask                      |
| Database                  | Firebase Firestore (new Firebase project `ttfj` or reuse pattern), server reads via the lightweight Firestore REST helper                                                                             | both repos                    |
| Auth                      | Firebase anonymous guest identity + optional Google upgrade (TKA's `guest-identity.ts` / `anonymous-upgrade.ts` pattern); admin routes behind `requireAdmin`                                          | tka-platform                  |
| Forms                     | Zod schema as contract + SvelteKit form actions + Turnstile + honeypot-as-signal                                                                                                                      | cirque-website inquiry flow   |
| Email                     | Brevo via plain fetch (`email.ts` pattern)                                                                                                                                                            | cirque-website                |
| Uploads (fallback/direct) | Hand-rolled SigV4 presigned R2 PUT (`r2.ts` + `r2-signing.ts` + presign endpoint + `connect-upload.ts`)                                                                                               | cirque-website                |
| Images                    | `generate-image-variants.mjs` (sharp, AVIF/WebP/JPEG, hard byte budgets) for static site imagery                                                                                                      | cirque-website                |
| Tests                     | Vitest + jsdom + testing-library; "Earned Tests" philosophy (test signing, parsing, validation — not glue)                                                                                            | cirque-website/ringmaster     |
| CI                        | Build + check + test gate, then deploy hook (TKA's gated two-workflow pattern)                                                                                                                        | tka-platform                  |
| Conventions               | Copy `.claude/rules/` selections: never-hand-roll, primitive-discovery, no-checkboxes, no-layout-shift, clickables-look-like-buttons, verification-protocol; CLAUDE.md with the fire-jam writing test | both repos                    |

New Firebase project vs. reusing an existing one is an open question (§9).

## 4. Sitemap & features

### 4.1 Home — "Is it on tonight?"

- Big status answer, computed client-side + editable override: **It's Tuesday + it's jam season (April–October) → "People will be gathering this afternoon/evening."** The guidebook logic verbatim: "Is the weather nice? Is it Tuesday?" A live weather check (Open-Meteo, free, no key) can color the answer.
- Admin override banner for cancellations/special sessions (rain-out, water-balloon day, first/last jam of season) via the announcements system.
- Time, park map (static map image + link, no heavy embed), "what to bring," next-Tuesday countdown.
- TacoCat greeting ("paws wide open").

### 4.2 About / What is Flow Arts

- Jam story (2017–present, Sun-Times quotes, self-sustaining ethos), traditions, founder bio.
- Flow arts explainer sourced from Flow Arts Institute + DrexFactor: props (poi, staff, hoop, fans, contact juggling, rope dart…), flow state, community culture, how to start, fire-safety norms (link Full Moon Jam's free fire-safety trainings).

### 4.3 Gallery — synced from the community Google Photos album

- **Sync architecture (researched, recommended):** a scheduled Cloudflare Worker (cron, every 12–24 h) fetches the album's public share link, parses the embedded `AF_initDataCallback` data (porting `google-photos-album-image-url-fetch`; `batchexecute` pagination if the album exceeds ~500 items), diffs against `manifest.json` in R2, mirrors only new items into `ttfj-media` at `=w2048` plus thumbnail sizes, and rewrites the manifest. Alerts (email via Brevo) if a run parses zero items, so a Google format change is noticed, never silent.
- Why: the official Google Photos API can no longer read user albums at all (post-March-2025 lockdown — app-created data only, sharing endpoints removed). Link-scrape-and-mirror is the community-standard approach; the site never depends on Google at request time, and the archive survives even if the album link dies. Contributors keep the zero-friction "add to shared album" flow they already use.
- Frontend: justified/masonry grid → `@austencloud/media-spotlight` with hero animation, swipe, pinch-zoom, video support. Grid reads `manifest.json` from R2.
- Optional later: a `/connect`-style direct upload page (presigned R2 PUT) for people not in the Google album.

### 4.4 Announcements

- Reuse TKA's announcement model (`title, message (markdown), severity, expiresAt, actionUrl`) trimmed to community scale. Firestore-backed, admin-only writes, public reads. Critical announcements also surface as the Home status banner.

### 4.5 Voting — "jam legislation"

- First real ballot: how to spend the $500 flow-toys gift card.
- No precedent in either repo (confirmed) — this is the one genuinely new feature. Design:
  - `Poll { id, title, description (markdown), options[], opensAt, closesAt, status, resultsVisibility: 'live'|'after-close' }` and `Vote { pollId, uid, optionId(s), createdAt }` in Firestore; security rules enforce one vote per uid per poll, only while open.
  - Voting requires identity: anonymous Firebase sign-in happens silently on first vote (one tap, no account creation friction), with optional Google upgrade so votes survive device changes. Honest caveat displayed: it's one-vote-per-device-ish for anonymous users; acceptable for jam-scale decisions.
  - Options can carry images (e.g., candidate props from the flow-toys shop).
  - UI built from the button-based toggle primitives (no checkboxes, per house rules), live tally bars after voting.

### 4.6 Classes

- Two flows, both zod + form actions + Turnstile:
  - **Teach:** propose a class/workshop (prop, level, description, preferred dates) → moderation queue (TKA's festival-submission moderation pattern) → approved classes appear on the schedule.
  - **Attend:** RSVP to a listed class using TKA's attendance schema (`status: 'interested'|'going'`, `role: 'attendee'|'instructor'`).
- Facilitated by you and the co-facilitator (admin role approves proposals).

### 4.7 Taco potluck sign-up

- Per-Tuesday sign-up: "I'm bringing ___" (tortillas, fillings, salsa, chips, drinks, napkins/plates…). Shows what's covered and what's missing for the next jam. Auto-rolls to next Tuesday; anonymous-identity claims so people can un-claim their own item.

### 4.8 Other Chicago events

- Curated cards from research: Chicago Juggling Club (Mon 6:45–8:45 PM Jefferson Park Fieldhouse; Thu 7–9 PM Cirques Experience Gym — times to re-verify), Chicago Full Moon Jam (+ its free fire-safety trainings), Flow Fest Chicago (Aug 29, 2026, Ping Tom Park), Aloft open gym, hoop jams, Lakes of Fire, Kinetic Fire, Midwest Fire Fest. Stored in Firestore so they're editable without a deploy.

### 4.9 Links

- The linktree superset: Facebook page, Instagram (once confirmed), Google Photos album, press articles, prop retailers (Home of Poi, Sacred Flow Art, etc.), this site's sibling pages.

### 4.10 History (stretch, cheap to add later)

- Timeline mined from the message corpus: 2017 first jams → Sun-Times feature → traditions. Good SEO and genuinely charming.

## 5. Facebook page harvest (interactive phase — needs you)

No Facebook events/pages/posts export exists locally (the archive has messages only). Plan:

1. You log into Facebook in the browser session (Claude in Chrome or DevTools MCP — your call at the time).
2. I page through facebook.com/flowtaco posts, collecting: page profile/cover art (the closest thing to a logo), post photos worth keeping, event history (dates/titles), and any recurring copy.
3. Downloads land in a local `harvest/facebook/` folder with a manifest (post date, caption, URL) for curation before anything is published; selected items get uploaded to R2.

This is its own session — it shouldn't block the build. The site can launch with Google Photos media alone.

## 6. Google Photos album — what I need from you

Just the **share link** of the album (Share → Create link, with "Collaborate" on, which is presumably already the case). No API keys, no OAuth, no Takeout. The sync Worker does the rest. If the album has more than ~500 items I'll implement the pagination path.

## 7. Domains — checked via RDAP on 2026-08-18

Available: `tacotuesdayflowjam.com`, `tacotuesdayflowjam.org`, `ttflowjam.com`, `tacoflowjam.com`, `chicagoflowjam.com`, `flowjamchicago.com`, `flowjam.club`, `flowjam.fun`, `flowjam.day`, `flowtues.day`, `tacojam.club`, `ttfj.club`
Taken: `flowjam.com`, `ttfj.com`, `tacotues.day`, `tacojam.fun`

Decision (2026-08-18): **`tacotuesdayflowjam.com` as the canonical domain** (matches the name people search for, matches the press coverage) **+ `ttflowjam.com` as the short redirect** you say out loud at the park ("tee-tee-flowjam dot com"). `flowjam.day` is the cutest wildcard if you want a fun alias. All ~$10/yr each at Cloudflare Registrar (at-cost), which also keeps DNS in the same dashboard as Pages/R2.

## 8. Build phases

1. **Scaffold** — repo init, cirque-website skeleton, strict TS/eslint/prettier/stylelint, tokens + theme package, CLAUDE.md + rules, CI, deploy empty shell to Cloudflare Pages.
2. **Content core** — Home ("Is it on tonight?"), About/Flow Arts, Links, Other Events. Site is already launchable and better than a linktree here.
3. **Gallery** — R2 bucket, sync Worker (scrape → mirror → manifest → alert), grid + media-spotlight.
4. **Community features** — announcements, voting (gift-card ballot first), taco sign-up, classes (propose + RSVP), anonymous auth.
5. **Harvest & polish** — Facebook scrape session with you, history timeline, OG images, Lighthouse/a11y pass, real-device checks.

Each phase gets its own implementation plan (superpowers writing-plans) and lands independently.

## 9. Decisions (Austen, 2026-08-18)

1. **Domain:** `tacotuesdayflowjam.com` canonical + `ttflowjam.com` redirect.
2. **Canonical name:** "Taco Tuesday Flow Jam" (singular).
3. **Jam time:** the page's own current flyer says **"Every Tuesday, 4ish–10ish, Palmer Square Park"** — the site uses "4ish–10ish" (supersedes the fuzzy-window guess; discovered during the Facebook harvest 2026-08-18).
4. **Backend:** new dedicated Firebase project, Firestore + anonymous auth with optional Google upgrade.
5. **TacoCat:** full mascot treatment. Two pieces of existing art found 2026-08-18: the illustration embedded in the TKA guide PDFs (cat-in-a-taco holding a "Taco Tuesday Flow Jams" sign — extracted to `harvest/pdf-assets/Im0.png`) and the Facebook page's red "TACO CAT" badge profile picture (in the incoming page export). Austen may still want new/refined art later.
6. **Instagram:** @flowtaco is Austen's and active — link it.
7. **After-party fire jam:** entirely off the public site. No mention, no address.
8. **Repo:** `E:\ttflowjam`, pushed public to GitHub under `austencloud`.
9. **Jam age:** year 9 (started ~2017) — the site's history copy uses this, not the message-archive span.

## 10. Later decisions and follow-ups

1. **Google Photos album:** share link provided 2026-08-18: `https://photos.app.goo.gl/uNgZT4Zz6EBixmby7` (kept out of site copy until launch decision; the sync Worker consumes it).
2. **Gift-card poll:** ballot contents decided later — voting feature ships with a placeholder poll.
3. **Co-facilitator:** Indigo — named on About, Classes admin.
4. **TacoCat art:** source/commission plan (the guide-PDF embedded image should be extracted and reviewed as a starting point).
5. **Facebook harvest:** in progress — full page history into `harvest/facebook/` (gitignored media + manifest), the canonical reference pile at `E:\ttflowjam\harvest\`.
