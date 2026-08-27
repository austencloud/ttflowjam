# Taco Tuesday Flow Jam — Park Noticeboard Rebuild

Date: 2026-08-27
Status: Approved for implementation by Austen

## 1. Position

The site is a community noticeboard in Palmer Square after dusk, not a nightlife
landing page and not a municipal portal. Its first screen answers the practical
question a visitor brought with them. Real photographs then prove the answer is
worth acting on.

The direction combines:

- Park Signage's status-first hierarchy;
- Late Edition's photographic confidence;
- Riso Flyer's handmade character as a restrained accent.

Night Market is rejected as the governing direction. It overweights the evening
crowd and makes a free, all-ages park jam read like ticketed nightlife.

## 2. Product job

The persistent product question is: **what should I know about the next Taco
Tuesday?** The interface may state calendar facts, community norms, and a human
weather call. It must never turn a calendar calculation into a claim that people
are physically present.

The three primary visitors remain:

1. a first-timer deciding whether they are welcome;
2. a traveler looking for Chicago flow arts;
3. a regular checking the next Tuesday and the current weather call.

## 3. Information architecture

Primary navigation:

- `/` — Tonight: next-Tuesday status, time, map, arrival facts, current taco dates;
- `/first-time` — permission, arrival, borrowing props, what the evening feels like;
- `/gallery` — privacy-approved community photography in original aspect ratios;
- `/story` — 2017 origin, self-organized model, press, TacoCat;
- `/tacos` — published taco dates, the communal $5 ask, PayPal, contribution guidance.

Compatibility:

- `/about` redirects to `/first-time`;
- `/links` redirects to `/tacos`;
- `/events` remains reachable as `/chicago-flow`, linked from First Time and the
  footer rather than primary navigation.

Every route ends with a shared next-Tuesday panel containing status, map, and the
taco-fund handoff. Social links live in the footer instead of occupying a route.

## 4. Status truth model

The status system has two layers:

1. **Calendar forecast** computed in `America/Chicago`: in season, Tuesday today,
   next Tuesday, and off season.
2. **Human weather call**: confirmed, weather watch, cancelled, or no call posted.

Until a persistent human override source ships, the UI uses `no call posted` and
links to the Facebook page for the latest weather call. It may say "It's Tuesday"
or "Next jam: Tuesday, September 1." It may not say "ON right now."

Status is visible on every route through persistent chrome and the shared closing
panel. The compact chrome state contains the next date, not a second wordmark.

## 5. Visual system

### Ground and colour

- Dusk navy remains the page ground.
- Warm paper and taco gold carry primary information.
- Utility green is reserved for a human confirmed status.
- Salsa red is reserved for cancellation, urgent weather, and the Riso registration
  accent.
- Glass and gradient text are removed. Surfaces are flat paper, ink, rule, and
  photograph compositions.

### Type

- A heavy sans handles status, navigation, time, and labels.
- Fraunces is restricted to story-scale display lines and photographic captions.
- Functional headings never use decorative italic below display size.
- The root type ramp continues above desktop rather than freezing at 1088px.

### Composition

- The status rail is the first content on a phone and remains above the fold at
  390x844 and 960x412.
- The shell separates viewport gutters, reading measure, wide media, and full bleed.
- Large screens recompose into useful columns instead of centering a 1216px strip.
- TacoCat is a seal/sticker, once per composition. It is not repeated as mascot,
  wordmark icon, hero ornament, and footer deity.

### Motion

- Content is visible in its baseline state.
- No scroll-linked opacity reveal.
- Motion is limited to status feedback, focus/hover response, and the existing
  media spotlight transition.
- Reduced motion disables nonessential transforms and pulses.

## 6. Photography

Only IDs already present in `src/lib/data/gallery-manifest.json` are eligible for
site art. This preserves the locked privacy screen.

- Hero and editorial images are reselected from the approved 217-image set.
- The hero uses art-directed sources and `srcset`/`sizes` so faces and props survive
  phone and ultrawide crops.
- Gallery cells preserve source aspect ratios. Landscape photographs are the
  majority and must not be forced into squares.
- The current manifest has no dates. The rebuild does not fabricate year groupings.
  A later metadata recovery can add eras once dates are evidenced.

Selected photo provenance:

- lead group and social card: `410c464b57fc4443`;
- first-timer feature: `c63681bfb362f3ae`;
- story feature: `a3257e248fa8ce95`;
- taco feature: `b6ba6a5d51b7617c`;
- after-dark feature: `5e95c6efa767302e`.

Every ID appears in `src/lib/data/gallery-manifest.json`. Static WebP variants are
derived from the corresponding approved harvest original.

## 7. Voice

The governing voice is the flyer and guidebook line: "Is the weather nice? Is it
Tuesday?" Facts first, jokes second, one joke when earned.

Required first-screen facts:

- free;
- all ages and all skill levels;
- no sign-up;
- bring a prop or borrow one;
- Tuesdays 4ish–10ish, April–October;
- Palmer Square Park, by the totem pole on the north side.

The institutional "we" is avoided. TacoCat is described as the mascot, not as a
site-wide deity. After-party details remain entirely absent.

## 8. Search and sharing

- Every route has a specific title and description.
- Open Graph and Twitter-card metadata use a privacy-approved hero image.
- JSON-LD describes the organization and Palmer Square location. Event markup waits
  for a persistent human call source so search results never promote a cancelled
  calendar forecast as confirmed.
- `sitemap.xml`, canonical URLs, and a designed error route ship with the rebuild.
- Structured data is validated before deployment.

## 9. Accessibility contract

- WCAG 2.2 AA minimum, retaining the project's AAA contrast target.
- Focus indicators remain visible and unobscured by sticky chrome.
- Primary controls retain at least 44px touch targets.
- Navigation has a deliberate mobile composition and does not rely on accidental
  wrapping.
- Gallery controls keep single-pointer alternatives to swipe and drag.
- Status does not rely on colour alone.

## 10. Ownership

- Theme and layout foundations: `src/app.css`.
- Persistent chrome and status: `Header.svelte`, `Footer.svelte`, and a shared
  status component.
- Calendar computation: `src/lib/services/jam-status.ts`.
- Gallery viewer: reuse `@austencloud/media-spotlight`.
- Responsive static media: generated variants under `static/media/` with a
  documented selection manifest.

Outcome declaration: **Reuse** media spotlight and jam-date logic; **extend** the
status model; **replace** the current visual primitives; **create** the route-level
Park Noticeboard compositions.

## 11. Verification

- `npm run lint`
- `npm run lint:css`
- `npm run check`
- `npm test`
- `npm run build`
- browser sweep at 375x667, 390x844, 960x412, 820x1180, 1280x720,
  1920x1080, 2560x1440, and 3840x2160;
- keyboard and reduced-motion pass;
- no horizontal overflow;
- status remains above the fold at both phone targets;
- responsive images load an appropriate source rather than upscaling the current
  1856px hero across 4K;
- social-card and structured-data validation before deployment.

## 12. Non-goals

- No after-party location or private-residence imagery.
- No invented gallery dates, captions, accessibility facts, or fire-safety policy.
- No new voting, classes, or potluck backend in this rebuild.
- No deployment until the rebuilt branch is visually approved and the full gate is
  green.
