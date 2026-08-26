# TTFJ Teardown — Synthesis (2026-08-25)

Four independent adversarial reviews, one per axis, each given the same brief
(`../2026-08-25-teardown-brief.md`) and no knowledge of the others' findings.

| Axis | Reviewer | FATAL | MAJOR | MINOR | NIT | Report |
|---|---|---|---|---|---|---|
| CSS & component architecture | Codex | 0 | 18 | 6 | 2 | `codex-css-architecture.md` |
| Copy & voice | subagent | 5 | 18 | 17 | 2 | `copy-voice.md` |
| Information architecture | subagent | 10 | 33 | 3 | 1 | `information-architecture.md` |
| Visual design | subagent | 6 | 13 | 11 | 1 | `visual-design.md` |

Totals: **21 fatal, 82 major, 37 minor, 6 nit.**

## What three reviewers found without talking to each other

**The live status is the site's whole reason to exist, and it is a calendar
wearing a status's clothes.** All three landed reviews name this in their top
three. `src/lib/jam-status.ts` takes a single argument — a `Date` — and derives
"It's ON right now!" from month, weekday, and hour. It has four states and none
of them is "cancelled." It will shout that the jam is on during a thunderstorm.

The three reviewers reached that from three directions:

- **Copy** — the page asserts a fact the code cannot know, and it is the only
  dynamic claim on the site. One confident wrong answer in a storm and every
  other sentence loses its credit.
- **IA** — `/links:12` openly describes Facebook as the place for "weather
  calls." The site concedes its own primary job in its own copy. And the status
  lives on one route of five, so a regular who bookmarked any other page sees
  nothing.
- **CSS** — unrelated but adjacent: the `.reveal` system starts every element at
  `opacity: 0` and depends on scroll-timeline progress to reveal it, so content
  visibility is conditional on scroll rather than on the content existing.
  Reduced-motion does not opt out (`app.css:168` shortens a *duration*, which
  does nothing to a scroll-progress-driven animation).

This is the one finding that is direction-independent: it must be fixed whatever
the site ends up looking like.

### The status is also physically below the fold

The visual review measured what the other two argued. On an iPhone SE (375×667)
the status card's bottom edge sits at **703px** — past the fold. At 960×412
(Z Fold folded, landscape) its top is at **405px**, leaving 7px of a 143px card
visible. On a 390×844 phone the header alone eats 153px in a wrapped two-row nav.

So the site's one job fails on the first screen of the devices its two most
important audiences are holding, *and* the answer it would have given is derived
from a calendar. Both halves have to be fixed.

## Second convergence: the site has nothing for a first-timer

- **IA** — the brief's first-named visitor has no page. The homepage's only
  beginner CTA points at `/about`, which is a nine-year origin story with the
  decision-relevant facts in positions 3 and 5, zero links in its body, and a
  photo at the end. It is a terminus.
- **Copy** — "Free" appears exactly once on the entire site, in fine print on
  `/about:83`. The stranger who googled this is asking permission to show up,
  and the homepage never grants it.

## Third convergence: nothing is a system

- **CSS** — 46 CSS custom properties, 10 of them unused (22% dead). One `.shell`
  class is the entire layout system; at 3840px it uses 31.7% of the viewport.
  Three incompatible CTA implementations. Four routes duplicate the same
  page-top scaffolding four different ways.
- **IA** — the site contains exactly **one** internal body link across all five
  routes (`/` → `/about`). `/links` (6/6) and `/events` (4/4) link only off-site.
  Every path through the site is at most two clicks and ends somewhere else.
- **Copy** — three competing voices, and the weakest owns the two most-read
  slots: the hero tagline and the site-wide footer.

### The gallery fails at both ends

The page with the most content and the most emotional pull is unusable at both
extremes. Verified independently against the live site (2026-08-25):

| Viewport | Measured |
|---|---|
| 375×667 | 1 column, 217 rows, **67,167px** document height = **100.7 screens** of scroll, no pagination |
| 3840×2160 | 217 photos as **188px** squares inside a 1216px band, **2,624px** of dead rail |

Root cause of the phone case is pinned exactly: `minmax(min(11rem, 44vw), 1fr)`.
`44vw` measures the *viewport* (165px) but the grid only owns 297px of it, so two
columns miss fitting by one gutter and it collapses to one.

### Nothing responds above 1088px

`--shell-w: min(76rem, 92vw)` caps at 1216px. Verified: **31.7%** of a 3840
viewport. The whole site has three breakpoints (832 / 1088 / 768), zero container
queries, and no root font ramp — root font-size is still `16px` at 3840. Above
1088px the design is byte-identical all the way up. This is the same finding
Codex reached from the CSS side, measured from the pixel side.

## Two corrections the visual review made

Both came from measuring instead of assuming, and both are worth recording
because they *lower* the priority of things earlier passes flagged:

1. **The "dead space" between the FAQ and the footer at 1920 is not visible to a
   scrolling human.** It is the `animation-timeline: view()` reveal rendering
   sections at opacity 0 in full-page captures. Content does appear on scroll,
   and the no-support path degrades to visible (forcing `animation-timeline: none`
   yields opacity 1), so Safari and Firefox are fine. It remains a real defect —
   any print, PDF, link unfurl, or crawler screenshot has holes in it, and
   content fades back out on reverse scroll — but it is MAJOR, not the structural
   layout gap it first appeared to be. My earlier description of it as dead
   layout was wrong; Codex correctly identified the mechanism.
2. **Contrast is not a defect anywhere on the site.** The first pass flagged
   failures; those were an artifact of measuring while the reveal held sections
   at 0.15 opacity. Re-measured with proper alpha compositing, everything clears
   AA (hero status 10.7:1, FAQ ≈10:1, nav 14.4:1). The dim FAQ text in
   screenshots is the animation, not the color. Retracted.

## What survives the rebuild

The reviewers agreed on this too. **The photography** is the strongest asset and
the layout keeps under-using it (2.06× upscaled hero with no `srcset` site-wide,
62% cropped, 188px thumbnails). **The palette** — `#12141D` ground, `#F7B32B`
taco gold, `#F4F1EA` text — is coherent, earns its darkness from the subject, and
has no AA failures; keep the tokens as they are. **The Fraunces/Inter pairing**
has a point of view and does not look like a template; the problem is where
Fraunces is applied (19.2px functional headings), not that it was chosen. **The
status card concept** is exactly the right idea and the right piece of
information — it just needs to be first, honest, and on every page. And there is
**zero horizontal overflow at any of seven viewports**.

## Also worth knowing

- **Zero Open Graph tags exist.** Every share of this site — the medium the jam
  actually spreads through — renders as a bare URL.
- **"Every Tuesday until the end of time"** contradicts the April–October season
  stated two paragraphs away.
- **"year nine"** is off by one and contradicts a nearby "a decade."
- Fabrication risk: the founders' quote ("more space and nicer grass!"), an
  unattributed "beacon" blockquote, and a "Leave It Better event" are asserted
  without a source in the harvest.
- The harvest already contains material the site does not publish: exact taco
  dates, "tacos start at 6ish" (the site says "Sometimes!"), a potluck sign-up
  the Instagram bio promises with no landing page, 13 hosted events, and the
  Sun-Times feature.

## Order of operations

1. **Fix the status** — honesty, a cancelled state, and above the fold on a
   phone. Direction-independent, and it is the trust anchor.
2. **Fix the gallery grid floor.** One line (`44vw` → a container-relative
   measure) turns 100.7 screens into roughly 34. Also direction-independent.
3. **Pick an art direction** (`directions.html`) — this gates everything below.
4. **Rebuild the architecture** under the chosen direction: real layout
   primitives, a fluid band with a 1680-ish recomposing tier, a root type ramp,
   a semantic token model, and reveal that starts visible.
5. **Rewrite the copy** in one voice, with "free" and "just show up" promoted.
6. **Re-cut the IA** so pages route into each other and a first-timer has a page.
7. **Add OG tags** before any of it gets shared.
