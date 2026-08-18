# Phase 2: Content Core Implementation Plan

> Mode: vibe-build per Austen's direction ("full send… ralph wiggum this then shave away the
> crappy bits"). This plan records decisions, sources, and the file map; code lands directly
> with the full gate (`check && lint && test && build`) before every commit.

**Goal:** Home (photo-led hero), About/Flow Arts, Links, Other Events — launchable, visually
at tka-platform's quality bar, retuned to the fiesta palette.

**Decisions (Austen, 2026-08-18):**

- Hero: **photo-led** — full-bleed community photo, dark scrim, glass status card.
  Hero photo: `harvest/google-photos/7fd15e2c28bae472.jpg` (LED club group, Palmer Square).
  Alternates for section imagery: `c219153c7adadbe6.jpg`, `9c2bb69d7710c895.jpg`.
  **Never use backyard fire-jam photos — that's the after-party house (off-site, locked).**
- TacoCat canon art: the taco-shell cat illustration (`harvest/pdf-assets/Im0.png`),
  background removed so it floats on dark.
- Links page: harvest-verified set for now (FB page, TacoCat's Circus group, Instagram
  @flowtaco, Google Photos album, Sun-Times feature). Austen will add more later.
- Taco fund: publish PayPal email as-is (`flowtacocat@gmail.com`).

**Design system (from tka-platform research):**

- OKLCH tokens; fiesta hue anchors: gold ~80, red ~25, green ~150, purple ~300; dusk
  surfaces stay in the existing hex ramp but gain OKLCH glass recipes.
- Glass recipe: `oklch(0.16 0.018 H / 0.45)` fill, 1px `oklch(0.4 0.04 H / 0.14)` border,
  `blur(14px)`, multi-layer shadow ending `inset 0 1px 0 <light>`.
- Motion: tiny. 160ms hovers, −2px lifts, 1.02 scales; `animation-timeline: view()` inside
  `@supports` for entrance reveals; per-component reduced-motion + `pointer: coarse` guards.
- Type: Fraunces (display, italic 700, WONK on) + Inter (body) via @fontsource; continuous
  `clamp()` ramps, no breakpoint jumps. Kickers: uppercase, +0.16em tracking.
- One content band (`--shell-w`); no left-edge accent bars; clickables look like buttons.

**Content sources (all fact-checked against harvest):**

- FAQ copy: 2026-08-05 FAQ post ("every Tuesday until the end of time", "starts when the
  first person shows up", "not always tacos… always flowing TacoCats and good vibes").
- Beacon line: "If you show up and you're the first one there, CONGRATULATIONS! You are now
  the beacon for others to find!"
- Origin: page created 2017-04-06; first jam Tue 2017-04-11 at the Logan Square eagle;
  moved to Palmer Square for jam #2 (2017-04-18) for "more space and nicer grass";
  year naming (Year NINE = 2026). Meeting point: totem pole, center-north of the park.
- Leave It Better ethos; taco fund ("communal effort", $5 suggested).
- Other events: Chicago Juggling Club (Mon 6:45–8:45pm Jefferson Park Fieldhouse, Thu 7–9pm
  Cirques Experience Gym, $5 suggested — jugglingedge.com, flagged "verify before attending");
  Chicago Full Moon Jam (fullmoonjam.org); Midwest Flow Fest (flowfests.com).
- Press: Sun-Times 2023-08-27 feature.

**File map:**

- `src/app.css` — extend tokens: OKLCH accents, glass recipes, motion/easing, shell width,
  font stacks. Keep existing tokens working.
- `static/media/hero.webp` (+`hero.jpg` fallback), `static/media/tacocat.png` (cutout),
  `static/media/*.webp` section images — committed site assets (distinct from gitignored harvest).
- `src/lib/components/Header.svelte` — glass fixed header, scroll shrink, gradient wordmark.
- `src/lib/components/Footer.svelte` — polish to match.
- `src/lib/components/GlassCard.svelte` — the house surface (single owner of glass recipe).
- `src/lib/components/SectionHeading.svelte` — kicker + title pattern.
- `src/routes/+page.svelte` — photo hero + status card + FAQ strip + tonight-checklist.
- `src/routes/about/+page.svelte` — what flow arts is, origin story, TacoCat lore, ethos.
- `src/routes/links/+page.svelte` — link cards (harvest set + taco fund).
- `src/routes/events/+page.svelte` — other Chicago events cards.
- `tests` — none new earned (no new pure logic; jam-status already covered).

**Exit criteria:** full gate green, deployed to ttflowjam.pages.dev, pushed, CI green.
