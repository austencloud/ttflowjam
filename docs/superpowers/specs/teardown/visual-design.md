# TTFJ Site Teardown — Visual Design & Layout

Reviewer: adversarial, visual axis only. All numbers measured live against
https://ttflowjam.pages.dev on 2026-08-25 via Chrome DevTools (`emulate` +
`evaluate_script`), not read off source.

## Verdict

This is a 1440×900 design with a responsive stylesheet that stops caring above
1088px and gives up below 768px — three layout breakpoints total, zero container
queries, and no root type ramp, so a 1216px column sits frozen in the middle of a
3840px screen (68% dead rail) and a 217-photo gallery collapses to one column and
100 screens of scroll on a phone. Worse for the actual job: the one fact the site
exists to deliver — "is it on tonight" — is below the fold on iPhone SE and
essentially invisible on a folded-phone landscape viewport.

## Findings

### The band and the 4K problem

`app.css --shell-w: min(76rem, 92vw)` | **FATAL** | The content band hard-caps at
1216px and never grows again.
  Measured band width / viewport: 375→345px (92%), 820→754px (92%), 960→883px
  (92%), 1440→1216px (84.4%), 1920→1216px (63.8%), 2560→1216px (47.5%,
  **1344px dead rail**), 3840→1216px (**31.7%, 2624px dead rail**). A design that
  ignores two-thirds of the screen it is displayed on is not "restrained," it is
  unfinished. Principle: the content band grows with the viewport above its floor;
  only the floor is fixed.

all CSS (8 files, 39.7KB) | **FATAL** | Exactly three layout breakpoints exist
site-wide: `min-width:52rem` (832px), `min-width:68rem` (1088px),
`max-width:768px`. Zero `@container` queries.
  **Above 1088px the design is literally identical at every width up to 3840px.**
  Every 4K failure below is a symptom of this one fact.

all CSS | **MAJOR** | No root font-size ramp. `html` has no `font-size` rule, so
`rem` resolves to 16px at 375 and at 3840 alike. Only 7 `clamp()` calls exist and
their ceilings are reached by ~1322px.
  Measured `h1`: 42.1px @375 → 61.7px @820 → **80px @1440, @1920, @2560, @3840**.
  Body copy is 16px at 3840. At 4K@100% or on a jam-night TV, every text role is
  postage-stamp sized because nothing scales for you at that width.

`/` @ 3840×2160 | **MAJOR** | Whole page is 2415px tall in a 2160px viewport — the
entire site is 1.12 screens. Hero is 960px (44% of viewport height), FAQ cards are
373×155px, and the footer is nearly on-screen at load.
  A 4K visitor sees the whole site at once, rendered tiny, with 2624px of empty
  rail on both sides. It reads as a mobile page someone forgot to close.

`/` hero `<img class="hero-photo">` @3840 | **MAJOR** | Source is 1856×1238,
displayed at 3825×960 — a **2.06× upscale**. No `srcset` on any image site-wide
(verified: all five homepage images `srcset:false`).
  The single largest visual element on the site is visibly soft on the display it
  is most likely to be shown on. There is no responsive-image strategy at all.

`/` hero crop @3840 | **MINOR** | 1.50:1 source object-fit-covered into a 3.98:1
box discards ~62% of the image. The photo becomes a letterbox strip; the subjects'
heads and the club arcs — the reason to use the photo — are cropped out.

### Hierarchy: the site does not answer its own question

`/` @ 375×667 | **FATAL** | The status card ("It's ON right now / flowing until
10ish / Palmer Square Park, 2200 N Kedzie Blvd") has its bottom edge at **703px in
a 667px viewport**. The address line is cut by the fold.
  Use case #1 and #3 in the brief are "is it on tonight" and "is it cancelled for
  weather." On the most common small phone, the answer is clipped on arrival.

`/` @ 960×412 (Z Fold folded, landscape) | **FATAL** | Status card top is at
**405px in a 412px viewport** — 7px of a 143px card is visible. The entire first
screen is header + mascot + wordmark + tagline.
  Verified by screenshot: the first viewport contains zero operational
  information. Hero section alone is 535px = 130% of the viewport height.

`/` header @375 and @960 | **MAJOR** | Sticky header is **153px tall — 22.9% of a
667px viewport** — because the 5-item nav wraps to two rows (3 + 2).
  A permanently-docked bar eating a quarter of a phone screen, on every page, to
  show five links. The wrap also orphans a row of two.

`/` @375 | **MAJOR** | "Taco Tuesday Flow Jam" appears twice within 400px: header
wordmark (18.4px) and `h1` (42px, two lines). Combined with the 140px mascot, the
site spends ~400px of a 667px screen restating its own name before saying
anything.

`/` FAQ ordering | **MINOR** | The FAQ heading is "THE ESSENTIALS / Frequently
asked, honestly answered" — two lines of throat-clearing (14.08px kicker + 33.6px
display heading, 92px total) above three cards that contain the actual essentials.
The label costs more vertical space than any single answer.

### Reveal animation

`0.9TRtn2tz.css` `.reveal{animation:reveal-up linear both;animation-timeline:view();animation-range:entry 0% entry 30%}` | **MAJOR** | Scroll-driven
opacity with no static fallback path for non-scrolling render contexts.
  Verified on load at 1920×1080, before any scroll: homepage section opacities are
  `[hero 1, FAQ 0.1498, beacon 0, duo 0]`. Verified in `fullPage` capture: two of
  four homepage sections and the 1168×779px closing photo on `/about` render as
  **solid empty black**. Any print-to-PDF, link-unfurl screenshot, archive crawl,
  or headless preview of this site produces a page with holes in it.
  *Not fatal*: I tested the no-support path by forcing `animation-timeline:none`
  and all sections resolved to opacity 1, so Safari/Firefox degrade to
  "no animation, visible." Credit where due — but the capture failure is real and
  I observed it.

`.reveal` behavior | **MINOR** | Because `view()` is a positional timeline rather
than a one-shot, sections **fade back out when you scroll up**. Measured: after
scrolling to the bottom of `/about` and back to top, 3 `.reveal` elements are
below opacity 1 again. Content that un-reveals on reverse scroll is a novelty, not
a transition.

### Gallery — the worst page

`/gallery` @375×667 | **FATAL** | The grid collapses to **1 column**. 217 photos =
**217 rows**, document height **67,167px = 100.7 viewport-heights of scrolling**.
No pagination, no "load more", no album grouping, no jump-to-year.
  Root cause is exact: `.grid{grid-template-columns:repeat(auto-fill,minmax(min(11rem,44vw),1fr))}`.
  At 375 the grid box is 297px and the floor resolves to `min(176px, 165px)` =
  165px; 2×165 + 8px gap = 338px > 297px, so `auto-fill` yields one track and
  `1fr` stretches it to 297px. The `44vw` was clearly meant to guarantee two
  columns, but it measures the *viewport* while the grid only owns 79vw of it.
  Off by one gutter, costing 108 screens of scroll.

`/gallery` @3840×2160 | **FATAL** | 217 community photos rendered as 187×187px
thumbnails in a 6-column, 1168px-wide strip inside a 3840px viewport — **2624px
(68%) of empty rail on a page whose entire purpose is showing photographs**.
  There is room for ~18 columns at this cell size, or 6 columns at ~600px each.
  This is the single most indefensible layout decision on the site.

`/gallery` @1920 and @3840 | **MAJOR** | 217 items in 6 columns = 36 full rows
**plus a last row containing exactly one photo**. Measured: last row top 7397,
n=1. Principle: never a row of one — pick column counts where
`itemCount % cols != 1`, or justify the final row.

`/gallery` all viewports | **MAJOR** | Every cell is forced to `aspect-ratio` 1.00
with `object-fit:cover` (verified: 20 sampled cells all 1.00). Flow photography is
tall (a fire poi arc) or wide (a group shot); a 187px centre-crop square destroys
both. Screenshot confirms group photos reduced to a smear of torsos.

`/gallery` @1920 | **MINOR** | Three widths stacked on one page: intro paragraph
capped at **605.6px**, photo grid **1168px**, shell **1216px**. The narrow cap does
no readability work — the sentence is two lines — it just makes the page look like
two unrelated pages.

`/gallery` DOM | **MINOR** | 435 `<img>` elements for 217 photos; 218 of them
measure 0×0 at top:0. Uncertain whether this is a lightbox preload set, but it is
double the intended image count in the document.

### /about

`/about` @1920×1080 | **MAJOR** | **Four different content widths stacked down one
page**: kickers/headings/rules/list items 1168px, TacoCat section 908px, lead
paragraph 787px, body paragraphs 656px.
  Every section draws a hairline rule promising a 1168px column, then fills 656px
  of it. Measured: rules span x=376→1544, body copy stops at x≈1032. The right 35%
  of the band is empty on every section, all the way down. Principle: one width
  per page.

`/about` @1920 | **MAJOR** | Largest type on the page is 33.6px. There is no `h1`
and no title-scale anchor — the homepage `h1` is 80px, so /about reads as a
fragment of a page rather than a page. First two full screens contain zero
imagery: a wall of left-ragged prose against flat #12141D.

`/about` @1920 | **MINOR** | 887px of vertical space (82.1% of a viewport) between
the last text section and the footer. *Correction to the brief's premise*: this is
not empty — it is the 1168×779 `night-smiles.webp` closing photo, which the
`fullPage` capture drops because of the reveal bug above. Real on capture, not
real for a scrolling human.

### /events

`/events` @1920 | **MAJOR** | The three cards in one row have heights **313 / 265 /
243px — a 70px spread** — and their "Details →" links land at y=633 / 585 / 563.
  Peer cards in a single row with ragged bottoms and three different CTA baselines.
  The parent is not stretching them (`align-items: normal`, non-grid). A card row
  is a comparison table; unequal cards say the items are unequal.

`/events` @1920 | **MINOR** | Whole page is 1145px tall and the footer occupies
27.4% of it. Three cards and two sentences is the entire payload; the page
dead-ends immediately below the fold at any desktop size.

### /links

`/links` @1920 | **MAJOR** | The `→` glyph is 14px wide and sits **494–830px away
from the text it belongs to** (measured gaps per row: 664, 494, 762, 630, 830).
  Every row is a 1168px bar with content crammed left and a lone arrow pinned
  right, and the gap is a *different size in every row*, so it does not even read
  as an aligned column. This is the single largest per-element dead space on the
  site.

`/links` @375×667 | **MAJOR** | The three-column icon | text | arrow row does not
recompose — it squeezes. The description column measures **162px inside a 297px
row** (icon 81px + arrow 38px hold fixed columns), forcing ~22 characters per line
and 3-line wraps for one short sentence.
  The arrow is decorative — the whole row is already a link — and costs 13% of the
  row width for zero information. Principle: responsive design recomposes; it does
  not just narrow the text column until it wraps.

### Rhythm, alignment, type

`/` @1440×900 | **MINOR** | Section gaps are 92 / 63 / 65px. `section:not(.hero)`
sets `margin-top: var(--spacing-2xl)` (64px) but the hero seam is 92px. Close
enough to look accidental rather than intentional.

`/` FAQ @820×1180 and @960×412 | **MINOR** | Grid resolves to 2 columns for 3
cards — **orphan row (2 + 1)** at both tablet and folded-landscape.

`/` and `/about` FAQ/section headings | **MINOR** | Question headings are Fraunces
italic with `font-variation-settings:"SOFT" 0,"WONK" 1,"opsz" 144` at 19.2px —
a wonky display italic carrying functional Q&A. A display face at display size
(the 33.6px section headings, the 80px `h1`) is a choice; the same face at 19.2px
for "Is it happening?" is decoration applied to information.

`/` kicker | **NIT** | 14.08px, uppercase, 2.25px letter-spacing. At the small end
of legible, and it is the only thing labelling each section.

`/` and site-wide contrast | **NOT A DEFECT — verified** | I measured every text
role with proper alpha compositing. Everything clears WCAG AA comfortably: hero
status 10.7:1, countdown 6.6:1, address 6.7:1, FAQ question ≈9.9:1, FAQ answer
≈10.2:1, footer blessing 6.7:1, nav 14.4:1. My first pass reported failures; those
were an artifact of measuring while the reveal animation held sections at opacity
0.15. Retracted. **The dim FAQ text in any full-page screenshot is the reveal bug,
not a contrast bug.**

`h1` and header wordmark | **MINOR** | Both use `background-clip:text` with
`color:transparent`, so contrast is unmeasurable by any automated check and the
`h1` sits over a photograph. It survives here because the scrim is heavy
(`oklch(0.13 0.02 270 / 0.96)` at the bottom), but it is unverifiable by
construction — swap the hero photo and nobody will know it broke.

### Overflow

all pages, all seven viewports | **PASS** | No horizontal overflow anywhere.
`documentElement.scrollWidth` never exceeded `innerWidth`. Credit.

## The three that matter most

1. **The gallery at both ends.** One column and 100.7 screens of scroll at 375;
   187px thumbnails in 31.7% of a 3840px screen. It is the page with the most
   content and the most emotional pull — 217 photos of your actual community — and
   it is unusable on a phone and insulting on a big screen. Fixing the
   `minmax(min(11rem,44vw),1fr))` floor and adding pinned column counts per tier is
   a few lines; adding pagination or year-grouping is the real work.

2. **"Is it on tonight" is below the fold.** 703px card bottom in a 667px
   viewport; 405px card top in a 412px viewport. The site has exactly one job for
   two of its three stated audiences and it fails that job on the first screen of
   the devices those people are holding. This is a hierarchy problem, not a styling
   one — the mascot, the duplicated wordmark, and the 153px wrapping nav are
   consuming the space the answer needs.

3. **Nothing above 1088px.** One frozen 1216px band, no type ramp, no third tier.
   Every 4K finding collapses into this. It is also the cheapest structural fix:
   a fluid band with a real ceiling plus a `1680`-ish tier that recomposes column
   counts would resolve the dead rail on all five pages at once.

## What is actually good

- **The photography.** The hero and the closing `/about` shot are genuinely good
  images — real people, real night light, real LED clubs. They are the strongest
  asset on the site and the layout keeps under-using them (2× upscaled, 62%
  cropped, 187px thumbnails). Build the rebuild around them.
- **The palette and the dark theme.** `#12141D` ground, `#F7B32B` taco gold,
  `#F4F1EA` text. It is coherent, it earns its darkness from the subject matter
  (night jams, glowing props), and I could not find a single AA contrast failure
  in it. Keep the tokens exactly as they are.
- **The type pairing.** Fraunces display italic against Inter Variable is a real
  pairing with a point of view, and it does not look like a template. The problem
  is where Fraunces is applied (19.2px functional headings), not that it was
  chosen.
- **No horizontal overflow at any of seven viewports**, and no layout-shifting
  dynamic text found. The basics are not broken.
- **The status card concept.** A live "It's ON right now / flowing until 10ish"
  panel is exactly the right idea and the right piece of information. It just needs
  to be first, not fourth.
- **`/events` and `/links` content restraint.** Three events, five links, no
  padding for its own sake. The pages are thin because the truth is thin, which is
  honest. They need layout, not more content.

## If I were rebuilding this

I would make the answer the hero and the photos the site. Above the fold, at every
viewport including 412px tall: a status band that says ON or OFF, the time, and
the cross-streets — no mascot, no restated wordmark, no scroll required. The photo
moves behind or below it, full-bleed, at real resolution with a `srcset`.

Then I would let the layout breathe upward. One fluid band with a floor around
1100px and a ceiling near 2400px, a root type ramp from 1680px to 3840px so every
`rem` grows in lockstep, and pinned column counts per tier instead of `auto-fill`
against a floor — because `auto-fill` is what produced both the one-column phone
gallery and the orphan row of one.

The gallery becomes the centrepiece rather than an appendix: a masonry or mixed
aspect-ratio grid that respects tall fire shots and wide group shots, 2 columns
minimum at 375, 8–10 at 4K, chunked by year with real pagination.

And I would delete the scroll-linked reveal entirely. It buys nothing, it breaks
every capture of the site, and it makes content fade out when you scroll back up.
A jam listing should render instantly and completely, the first time, everywhere.
