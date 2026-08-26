# TTFJ Site Teardown — Information Architecture

Reviewer axis: **Information Architecture**. Page set, page jobs, missing pages,
navigation, entry points, dead ends. Visual styling and prose quality are out of
scope and were not assessed.

Evidence base: full read of `src/` (5 routes, layout, header, footer,
`src/lib/services/jam-status.ts`), `harvest/README.md`, the Facebook export in
`harvest/facebook/` (113 posts, 2017-04-10 → 2026-08-05; 13 hosted events), the
original design spec `docs/superpowers/specs/2026-08-18-ttfj-website-design.md`,
the phase-3 handoff, plus live measurement of https://ttflowjam.pages.dev at
390×844 (mobile) via DevTools.

---

## Verdict

The site is a five-page brochure whose single most-needed answer — *is it on
tonight* — lives below the fold on one of the five pages and is computed from a
calendar that can never say "cancelled," while the three visitors it exists for
have zero pages addressed to them. It is not a hub: measured across all five
routes there is exactly **one** internal link inside any page body, so every page
is a cul-de-sac and the header nav is the entire information architecture.

---

## Findings

### A. The link graph — the structural failure everything else sits on

`all routes` | **FATAL** | The entire site contains **1 internal body link**: `/` → `/about` (`src/routes/+page.svelte:129`). Measured in-page (`main` element) link counts: `/` = 2 links (1 internal, 1 external), `/about` = **0 links**, `/gallery` = 1 (external), `/events` = 4 (all external), `/links` = 6 (all external).
  A website is a graph, not a stack of documents. With no in-body cross-links, nothing can guide a visitor from what they just read to what they need next; the only navigation is a generic menu that is identical on every page and knows nothing about where the visitor is or why. Principle: *content should hand off to content; menus are the fallback, not the mechanism.*

`src/routes/about/+page.svelte` | **FATAL** | `/about` has zero links in its body and ends on a photo. This is the page a first-timer reaches from the homepage's only CTA ("What's a flow jam?", `+page.svelte:129`), i.e. the highest-intent moment on the site, and it terminates. No map, no "next Tuesday is…", no photos, no Facebook, no way to ask anything.
  Journey broken: (a) curious googler. The funnel is `/` → `/about` → nothing.

`src/routes/links/+page.svelte` | **MAJOR** | 6 of 6 links leave the site. `/links` is a page whose entire function is to end the visit.
  Journeys broken: all three. Every route out of this page is a route off the site, including to Facebook, which is the thing the site was built to replace (spec §1: *"the site is the destination, not a redirect board"*).

`src/routes/events/+page.svelte` | **MAJOR** | 4 of 4 links external, and there is no path back to the jam from any card. A visitor who came for Taco Tuesday and is now reading about Full Moon Jam has been handed to another organization with no return trip.

---

### B. Journey 1 — the person who saw fire in a park and googled it

`/` mobile 390×844 | **MAJOR** | Header consumes **153px** in two wrapped rows; the status card's top edge sits at **687px** and its bottom at **855px** — past the 844px fold. The site's answer to its own #1 question is not visible on arrival on the most common phone size.
  Principle: *the most-needed answer occupies the first screen.* Measured, not estimated.

`/` and `/about` | **FATAL** | There is no page for a first-timer. Their actual questions — will I be the only beginner, do I need to own props, can I just watch, is it OK to bring a kid, will someone talk to me, is standing near fire safe — are answered in fragments: three sentences on the homepage (`+page.svelte:124-127`) and a bring-list on `/about` (`about/+page.svelte:5-11`) that assumes you already own props. The homepage's beginner CTA points at a page whose first two sections are a definition and a nine-year origin story.
  Principle: *a named audience with no page is an unserved audience.* The brief names this visitor first.

`src/routes/about/+page.svelte:24-88` | **MAJOR** | Section order is origin-first: What is this → origin story (1917 words of history) → what to bring → TacoCat theology → fine print. The two decision-relevant sections for a first-timer (what to bring; free/all ages/all levels) are 3rd and 5th, behind mascot lore.
  Principle: *order by reader need, not by author chronology.*

`src/routes/about/+page.svelte:83-85` | **MAJOR** | Fire safety is one clause: *"Fire props only where legal and safe (ask the regulars)."* The visitor in this journey googled **because they saw fire**. The site's only answer is "ask someone when you get there," which is precisely the friction the site was built to remove.
  Missing entirely: what fire is/isn't allowed at Palmer Square, safety spotter norms, how far back to stand, the Full Moon Jam free fire-safety trainings the design spec already identified (§4.2).

`all routes` | **MAJOR** | No map link exists anywhere. `"Palmer Square Park, 2200 N Kedzie Blvd"` (`+page.svelte:89`) is plain text; `"by the totem pole, center of the park on the north side"` (`+page.svelte:112`) is a landmark with no image and no pin. On a phone, "get me there" requires copy-paste into another app.
  Journeys broken: (a) and (b). Principle: *an address that is not a tap is not directions.*

`all routes` | **MAJOR** | No transit or arrival info. `/about:38` mentions the Logan Square Blue Line only as a 2017 history detail. Nothing says which stop, how far the walk, whether to drive, whether parking exists.

`all routes` | **MAJOR** | No accessibility note. Grass or path? Seating? Restrooms? Is there shade? Can a wheelchair get to the totem pole? Nobody deciding whether to bring a parent, a kid, or a body that needs to sit down can answer this from the site.

`static/robots.txt`, `src/app.html` | **MAJOR** | No `sitemap.xml` (404 confirmed live), no OG/Twitter tags, no `Event`/`LocalBusiness` JSON-LD. Head contains exactly one meta tag (description). For a "search a thing you saw in a park" journey, the site is competing for the query with an existing 1.4K-follower Facebook page and a Sun-Times article, with no structured data and no share card.

---

### C. Journey 2 — the traveling flow artist

`src/routes/+page.svelte` | **MAJOR** | If they land on a Thursday, the homepage says the next jam is in 5 days and offers no alternative. `/events` — the only page that serves this person on a non-Tuesday — is not linked from the homepage at all. The homepage's two CTAs are `/about` and an external photo album.
  Principle: *when the primary answer is "not now," the page must offer the second-best answer.*

`src/lib/services/jam-status.ts:56-79` + `+page.svelte:22` | **MAJOR** | Off-season (Nov–Mar) the homepage collapses to *"See you in spring! First jam: Tuesday, April 7"* and nothing else changes. Five months of the year the site's central feature is a tombstone, with no handoff to `/events`, no indoor-season answer (the 2017-10-03 harvested post shows the community actively brainstormed winter options), and no reason to stay.

`src/routes/events/+page.svelte:5-28` | **MAJOR** | Three events, two of which carry no actual dates ("Full-moon nights, summer season", "Annually in September") and a lede that pre-apologises: *"Details drift, so check the source link."* A directory that tells you not to trust it is a bookmark list occupying 20% of the primary navigation.

`all routes` | **MAJOR** | No way to contact a human. No email, no form, no "message us." The only channels are Facebook and Instagram DMs on `/links`. A traveler who wants to ask "is anyone bringing a spare staff Tuesday?" must leave the site and create/log into a Facebook account.

`src/routes/gallery/+page.svelte:43-49` | **MINOR** | 217 undated, uncaptioned, ungrouped squares titled "A pile of Tuesdays." It proves volume but not *who is there* or *what a Tuesday looks like*. For an outsider judging whether they'd fit in, an unstructured pile is weaker evidence than 12 captioned photos across nine years.

---

### D. Journey 3 — the regular checking if it's cancelled

`src/lib/services/jam-status.ts:56-79` | **FATAL** | `jamStatus()` takes a `Date` and nothing else. Month ∈ [Apr,Oct] + weekday === Tuesday + hour ∈ [16,22) ⇒ **"It's ON right now!"** unconditionally. There is no weather input, no admin override, no cancellation state, no "everyone's at Flow Fest this week," no park-closure state. The state machine has four states and none of them is "no."
  The site's largest, boldest, gold-pulsing claim is the one claim it cannot verify. Principle: *never render a confident answer to a question you don't have the data for.* The design spec specified the fix (§4.1: *"Admin override banner for cancellations… via the announcements system"*); it was never built.

`src/routes/+page.svelte:41` | **FATAL** | The FAQ hard-codes the cancellation answer away: *"Is it happening? Yes. Every Tuesday until the end of time. If the weather's bad, you'll just see fewer people."* True as an ethos, useless as an answer, and it structurally forecloses the site ever telling visitor #3 what they came for.

`src/routes/links/+page.svelte:12` | **FATAL** | `/links` describes the Facebook page as the place for *"Announcements, weather calls."* The site names another platform as the authority for its own #1 job. That is an architecture that concedes its reason to exist, and it means the honest instruction to every regular is "don't use this site, use Facebook."

`src/lib/components/Header.svelte:4-10`, `src/lib/components/Footer.svelte` | **FATAL** | Status exists on `/` only. The header (present on every page) carries a wordmark and 5 nav items and no status; the footer carries a static "Tuesdays 4ish–10ish, April–October" that is true in January. A regular who bookmarked `/gallery`, or who lands on `/about` from a shared link, gets no status at all.
  Principle: *ambient state belongs in persistent chrome, not on one page.*

`src/lib/services/jam-status.ts` | **MINOR (uncertain)** | Status is computed from the **browser's local clock**, not `America/Chicago`. Someone checking from another timezone (the traveler planning the trip; a friend on the coast confirming for a visitor) can get the wrong day and hour. Low frequency, silent when wrong.

`all routes` | **MAJOR** | Nothing on the site is dated or timestamped — no "updated", no announcement history, no last-post date. There is no signal that a human touched this recently, which is exactly the signal a regular needs before trusting a live claim over Facebook.

---

### E. Every page: earn it or kill it

| Route | The one job no other page does | Verdict |
|---|---|---|
| `/` | Live status for tonight | **Earned, diluted.** The status is 1 of 5 sections and the smallest. Hero + status + FAQ + pull-quote + photo/copy duo = 3061px of page (measured) for one card of answer. |
| `/about` | Two jobs badly fused: "what is a flow jam" (urgent, first-timer) and "nine years of history" (not urgent, but the credibility asset). | **Split.** Neither job is well served by sharing a page; the beginner content should be promoted to its own page, the history expanded into the lore page the 113-post harvest justifies. |
| `/gallery` | Proof that this is real, large, and fun | **Earned.** Strongest asset on the site. Needs grouping and dates, not deletion. |
| `/events` | Other Chicago flow orgs | **Demote.** Three cards, four external links, no dates on two of them. A footer block or a section on a visitor page, not a top-level peer of About. |
| `/links` | *Nothing.* 3 of its 6 links (Facebook, Instagram, Photos) are already in the site-wide footer; the album is duplicated on `/gallery`; the Sun-Times link is press that belongs in the story; the PayPal taco fund is the site's **only conversion** and it is buried on the least-visited page. | **Kill and distribute.** It is a leftover Linktree habit, and the design spec (§1) already ruled against it. |

`src/routes/links/+page.svelte:78-94` | **MAJOR** | The taco fund — the one and only conversion the brief says exists ("chip in for tacos") — is the last section of the last nav item. It appears nowhere else on the site. Meanwhile `/about:83-86` and `+page.svelte` both mention the $5 with no button.
  Principle: *the only conversion gets the most reachable position, not the least.*

---

### F. What is missing entirely

Each is scored by the journey it breaks.

| Missing | Journey broken | Severity | Note |
|---|---|---|---|
| **First-timer page** ("your first Tuesday") | (a) | **FATAL** | No page addresses the primary named visitor. |
| **Cancellation / weather status with an override** | (c) | **FATAL** | Feature exists in the spec (§4.1), was never built. Site currently defers to Facebook. |
| **Taco-dates answer** | (a),(b),(c) | **MAJOR** | The harvested 2026-07-26 post lists exact taco Tuesdays (Jul 28, Aug 11, Aug 25, Sep 8) and "tacos start at 6ish." The site says *"Sometimes!"* (`+page.svelte:49`). The data exists in `harvest/` and the jam is **named after** this fact. |
| **Potluck sign-up landing** | current live funnel | **FATAL** | That same post says *"signup at the link in our bio."* The bio link is this site. The site has no sign-up. The organisation's active CTA dead-ends here. |
| **Map + transit + park landmark** | (a),(b) | **MAJOR** | See §B. |
| **Fire-safety rules** | (a) | **MAJOR** | One deflecting clause on `/about`. |
| **Accessibility note** | (a) | **MAJOR** | Unanswerable from the site. |
| **Contact a human** | (b) | **MAJOR** | No email, no form. |
| **Nine-year history / lore page** | (a),(b) — credibility | **MAJOR** | 113 posts 2017→2026, 13 hosted events, the eagle statue, the move to Palmer Square, the 2023 Sun-Times feature. Currently: two paragraphs on `/about` and a bullet on `/links`. This is the site's best trust asset and its best search surface, and it is functionally absent. Flagged as loose end #4 in the phase-3 handoff and still open. |
| **Special-day calendar** (prop swap, workshops, water-balloon day, first/last jam) | (b),(c) | **MAJOR** | `events_you_hosted.json` proves these recur — a 2024 "Taco Tuesday PROP SWAP!", a 2023 jam with a printed workshop schedule ("6:00–7:00 Workshops"). None of it has a home. Note the irony: the page called **Other Events** contains only *other people's* events, while TTFJ's own events have no page. |
| **OG / share card** | all entry points | **MAJOR** | Confirmed absent live. |
| **Lost & found** | (c) | **NIT** | Recurring need (2024-06-20 hoops post); no home. |
| **Sitemap / Event structured data** | (a) discovery | **MINOR** | `/sitemap.xml` → 404. |

---

### G. Homepage load: right split?

`src/routes/+page.svelte:95-135` | **MAJOR** | The split is backwards. The homepage carries three FAQ cards that are *scheduling* answers — "Is it happening?", "When does it start?", "Are there tacos?" — which is the right instinct badly placed: those three are the exact three questions the spec §1 documented as asked every year, so they should be **absorbed into the status card itself** (state + tonight's start + tonight's taco answer), not sit as a separate section 700px down. Meanwhile the work the FAQ *should* be doing on its own page — the twenty first-timer questions — has no page at all.
  Correct split: the homepage answers *tonight* (status, where, tacos-or-not, what's special this week, map). Everything else on it today (the pull-quote, the never-flowed-before block, the duo photo) is the seed of the first-timer page.

`src/routes/+page.svelte:130` | **MAJOR** | The homepage's second CTA, "See the photos," links to **Google Photos**, not to `/gallery`. The site routes its own visitors off-site, past a 217-photo gallery it built, to a third-party album that requires no account but renders as an unfamiliar Google UI. Same bug at `Footer.svelte:9` ("Photos" → Google).
  Principle: *never link off-site to content you host.*

---

### H. Navigation

`src/lib/components/Header.svelte:4-10` | **MAJOR** | Five flat items with no hierarchy, wrapping to two rows at 390px and consuming 153px of a 844px viewport on **every page**, permanently.

`Header.svelte:8` | **MAJOR** | "Other Events" is a top-level peer of About and Gallery. 20% of primary navigation is spent pointing at other organisations, on a site that has no page for its own events, no page for its own history, and no page for its own beginners.

`Header.svelte:9` | **MAJOR** | "Links" is a container label, not a destination — it describes the mechanism ("these are links") instead of the payload. A visitor cannot predict what is behind it, so it is clicked out of curiosity or not at all. Same class of problem, weaker: "Gallery" is a CMS noun; people say "photos."

`Header.svelte:4-10` | **MAJOR** | Ordering implies priority Home > About > Gallery > Other Events > Links. Actual priority by frequency of need is: status (weekly, every regular), first-timer info (every new person, i.e. the growth path), photos, taco fund, other orgs. The nav is close to inverted at the tail, and the two highest-value items (status, taco fund) have no nav presence at all.

`Header.svelte` | **MAJOR** | The header is the only element on every page and it carries no state. It is a wordmark plus a menu. On a site whose reason to exist is one time-varying fact, that is the most valuable real estate on the site spent on branding.

---

### I. Entry points (cold mobile arrival)

`/` | **MAJOR** | Instagram bio → `/` on a phone → 153px of nav → hero photo → mascot → wordmark → tagline → **then** status at 687px, clipped at the fold. The IA assumes a top-to-bottom desktop read of a marketing page. The actual arrival is one-handed, in daylight, possibly walking.

`src/app.html` | **MAJOR** | A shared Facebook post or Slack/iMessage link renders with no image, no title card, no description — confirmed: the document head has one meta tag. The brief names shared FB posts as a primary entry point; the site is invisible in the medium.

`/` | **MAJOR** | QR-on-a-flyer arrival is a *different* job from web arrival: "am I in the right place, where in the park, who do I talk to." The answer exists — the beacon quote and the totem-pole landmark (`+page.svelte:108-112`) — three screens down, with no map and no photo of the landmark.

`404` | **MINOR** | A mistyped QR or an old shared URL yields SvelteKit's bare default error page ("404 / Not Found", text flush to the viewport edge, no shell padding, no recovery link). Nav and footer do render, so it is recoverable but unhelpful. No `+error.svelte` exists.

---

### J. Dead ends (complete list, measured)

| Route | Internal body links | Next action offered |
|---|---|---|
| `/about` | **0** | none — terminal |
| `/gallery` | 0 (1 external) | leave for Google Photos |
| `/events` | 0 (4 external) | leave for another org |
| `/links` | 0 (6 external) | leave the site |
| `/` | 1 | `/about` (which is terminal) |

Every path through this site is at most two clicks long and ends outside it.

---

## The three that matter most

1. **There is no page for a first-timer, and `/about` — the page that pretends to be one — is a terminal history essay with zero links.** The brief's first-named visitor is the only visitor who can grow the jam, and the site has nothing addressed to them. Fix: a `/first-time` page owning props-you-don't-need, hour-by-hour, kids/dogs/watching, fire rules, accessibility, transit, map — and make the homepage's beginner CTA point at it.

2. **The live status is a calendar wearing a status's clothes, it cannot say "cancelled," and it exists on one page of five.** `jam-status.ts` will print "It's ON right now!" into a thunderstorm, `/links` openly names Facebook as the real authority for weather calls, and a regular who bookmarked any other page sees nothing. Fix: a data-backed status with a manual override, surfaced as a persistent element in the header on every route.

3. **The site is not a hub — one internal body link, site-wide.** Nothing hands off to anything; `/links` and `/events` exist to send people away; the homepage links to Google Photos instead of the gallery it built. Until pages route into each other, adding pages will not help. Fix: every page ends in the next thing, and off-site links are the exception, not the pattern.

---

## What is actually good

- **The status feature's premise and voice.** "It's ON right now!" / "flowing until 10ish" / a live countdown is the correct #1 job (the spec §1 derived it from six documented instances of the same question over five years) and the correct register. The concept survives; the placement and the data source do not.
- **`/gallery`.** 217 individually privacy-screened photos, an R2-backed pipeline, a real viewer with hero zoom and gestures, and a self-serve contribution loop (anyone adds to the shared album, it lands here). It is the most expensive and least replaceable asset on the site, and it is genuinely well built. Keep it; give it dates and eras.
- **The privacy screen as a locked rule** (65 backyard fire photos excluded, "real flames with no visible park context = exclude by default"). That is an IA/ethics decision made correctly and should not be reopened.
- **The FAQ copy is the community's own words**, verbatim from the 2026-08-05 Facebook post. Nothing invented, no fabricated warmth. That sourcing discipline should govern the rebuild.
- **The beacon quote and the totem-pole landmark** (`+page.svelte:108-112`). The single most useful sentence on the site for someone arriving alone, and unfakeable. It is in the wrong place, not wrong.
- **The footer carrying when/where on every page.** The one piece of ambient IA that works — proof the pattern is already understood; it just needs to carry live state instead of a static string.
- **Five pages is roughly the right page count.** The problem is not the number of rooms; it is that two of them belong to other people and none of them belongs to a beginner.

---

## Proposed replacement IA

**Pages (5, same count, different jobs):**

1. **`/` — "Is it on?"** Status first, above the fold on a 390px phone, before hero art. Then: tonight's specifics (start time, tacos y/n from a dated list, anything special this week), a tappable map + the totem-pole photo, transit line. Then a short first-timer hand-off and a photo strip → `/photos`. Ends with next Tuesday.
2. **`/first-time` — everything a stranger needs.** You need no props; someone will hand you one. Free, all ages, all levels. Hour-by-hour (4 setup, 6–9 peak, LEDs after dark, park closes 11). Can I just watch. Kids, dogs, alcohol. Fire: what happens, where to stand, who to ask. Accessibility, restrooms, parking, Blue Line. Leave It Better. Ends with the map and the status.
3. **`/photos`** — today's gallery, grouped by year so it doubles as nine years of evidence; absorbs the album-contribution CTA.
4. **`/story`** — the nine years, built from the 113 harvested posts: 2017 eagle statue → Palmer Square → traditions (prop swap, workshops, water-balloon day) → Sun-Times 2023 → year nine. Absorbs the press links, TacoCat, and the no-leader ethos.
5. **`/tacos`** — which Tuesdays have tacos, what to bring, the $5, the PayPal button, the potluck sign-up the Instagram bio is currently promising. The one conversion gets a page and a permanent button.

**Deleted:** `/links` — socials are already in the footer on every page; Sun-Times → `/story`; album → `/photos`; PayPal → `/tacos` + a persistent footer button. **Demoted:** `/events` → a section at the foot of `/first-time` (or `/chicago-flow`, out of primary nav) with real dates or nothing.

**Nav:** `Tonight · First time · Photos · Story · Tacos` — one row on mobile, every item a visitor job phrased as their question, zero slots spent on other organisations. Plus a **persistent status pill in the header on every route**: "ON tonight · 4–10 · Palmer Sq" / "Next: Tue Sep 1" / "Rained out — see you next week."

**Global rule:** every page ends with the same block — status, next Tuesday, map, taco fund. No page terminates.

**Defence against the current IA:** today there are 5 pages, 1 internal body link, the status on 1 of 5 routes, the beginner job on 0 routes, the only conversion on the least-visited route, 20% of nav given to other orgs, and the site's own richest asset (113 posts, a Sun-Times feature) unpublished. The proposal keeps the page count and the good parts, spends every route and every nav slot on one of the three named visitors, makes state ambient instead of local, and turns the harvest into the credibility page both the googler and the traveller need.

---

## If I were rebuilding this

I would treat the site as **one live answer with four supporting rooms**, not a brochure with a widget. The status is not a homepage section — it is the site, so it goes in persistent chrome on every route, backed by real data plus a one-tap human override, and it is allowed to say *no*. Everything else earns its place by naming a visitor: a beginner page because the beginner is the growth path, a story page because nine years and a Sun-Times feature are the trust the traveller needs, a photos page because proof beats prose, a tacos page because it is the name and the only conversion. `/links` dies; a hub does not need a page of exits. Every page ends in the next page. And I would design it phone-first from a QR code in daylight — if the answer is not on the first screen with one thumb, the IA has failed regardless of how good the rest reads.
