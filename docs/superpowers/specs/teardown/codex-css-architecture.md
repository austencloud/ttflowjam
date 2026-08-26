## Verdict
The CSS is a small theme dictionary, not a design system: it names colors and increments but provides almost no layout, content, control, or composition primitives, so every route invents its own dialect. That poverty already freezes the site into one 76rem glass-card composition, duplicates routine page code, and makes responsive or art-direction changes a page-by-page rewrite.

## Findings
src/app.css:3 | MAJOR | The 46 custom properties are mostly named constants, not a governed token system.
  There are primitives but no semantic roles for page inset, content measure, section spacing, controls, grids, or surface variants; components therefore bind directly to brand colors and raw effects. This violates separation of design decisions from implementation.

src/app.css:5 | MINOR | Ten of 46 declared tokens are unused across the assigned files.
  `--color-guac-green`, three background levels, `--radius-sm`, `--ease-out`, `--text-title`, `--z-modal`, and `--z-toast` have zero consumers; `--color-salsa-red` is only an ingredient of another token. A 22% dead-token rate makes the vocabulary promise capabilities the system does not have.

src/app.css:47 | MAJOR | The spacing scale is six hand-picked values with a broken progression: 4, 8, 16, 24, 40, 64px.
  Its ratios jump 2, 2, 1.5, 1.67, and 1.6, and semantic uses are absent, so the same `--spacing-2xl` means page top padding, section separation, and footer offset. A scale without role tokens cannot encode vertical rhythm.

src/app.css:77 | MAJOR | The type ramp is incomplete and internally arbitrary.
  Only five fluid sizes exist, their clamp formulas use unrelated slopes, body and card-heading sizes fall outside the ramp, and the unused `--text-title` means no route actually has a page-title level. Typographic hierarchy should be systematic and complete.

src/routes/+page.svelte:210 | MINOR | Font sizes and weights escape the token system repeatedly.
  The homepage hardcodes 1.35rem and 1.2rem (line 266); Header hardcodes 1.15rem at `Header.svelte:57`; weights 640/650 recur across six files without tokens. These values make global type tuning impossible.

src/routes/+page.svelte:169 | MINOR | Visual constants are hardcoded inside routes and components despite matching system concerns.
  Examples include mascot clamps and shadows (lines 169–172), CTA ink/shadows (330–341), header blur/colors (`Header.svelte:37-40`), gallery underline color (`gallery/+page.svelte:93`), and glow geometry (`GlassCard.svelte:66-70`). Theme or contrast changes require hunting literals.

src/app.css:55 | MAJOR | One universal 76rem shell is the entire layout system.
  At 1920px it caps at 1216px, leaving 352px gutters per side; at 3840px it still caps at 1216px, leaving 1312px per side and using only 31.7% of the viewport. Nothing scales after the type clamps reach their maxima, so large-screen design freezes.

src/app.css:140 | MAJOR | `.shell` couples alignment, maximum width, and a fixed 24px inset into one global class.
  Full-bleed bands with aligned inner copy, narrow prose, asymmetric editorial grids, breakout media, and independently sized header/footer content all require overriding or nesting this primitive. A redesign needs separate container, measure, gutter, and breakout concepts first.

src/routes/about/+page.svelte:100 | MAJOR | Four of four interior routes duplicate identical page-top scaffolding.
  About, events, gallery, and links each declare `.page { padding-top: var(--spacing-2xl) }` (`events:67`, `gallery:81`, `links:98`), while each also repeats a `SectionHeading` plus lede pattern. The repeated contract should be a page-intro/layout composition, not 4 local copies.

src/routes/events/+page.svelte:71 | MAJOR | Four routes solve the same lede differently.
  Events uses fluid lede type, secondary color, 60ch, and bottom margin; gallery omits the type; links puts equivalent prose under `.fund p`; about splits `.lede` at 60ch from generic `p` at 65ch. This is four implementations of one content role with inconsistent hierarchy and spacing.

src/routes/+page.svelte:258 | MAJOR | Repeated collection layouts have no shared grid primitive.
  FAQ cards use auto-fit at 17rem, events cards auto-fit at 20rem (`events/+page.svelte:78-82`), gallery uses auto-fill at 11rem/44vw (`gallery/+page.svelte:101-108`), and links uses a one-column grid (`links/+page.svelte:102-108`). Some variation is valid, but every route reimplements reset, gap, and column math, making coordinated responsive change four edits.

src/routes/+page.svelte:323 | MAJOR | The site has no control/link component, producing three incompatible CTA systems.
  Homepage `.cta` occupies 32 CSS lines (323–354), links `.donate` occupies 22 (171–192), and events makes a third text-link control (106–117). They differ in radius, fill, shadow, hover, and underline behavior despite serving comparable navigation/action roles.

src/lib/components/GlassCard.svelte:31 | MAJOR | The sole surface component hardwires one visual treatment and one padding size.
  Glass background, blur, border, radius, shadow, overflow, and 24px padding are inseparable; only `elevated`, link, and misleading `interactive` booleans vary it. Any redesign needing flat panels, image cards, edge-to-edge media, density options, or responsive padding must fork or override the component.

src/lib/components/GlassCard.svelte:16 | MAJOR | `GlassCard` conflates surface, link, and decorative hover behavior through branching markup.
  `href` silently forces `rel="external"` even for a future internal link, while `interactive` without `href` renders a non-focusable `div` with pointer-reactive affordance (lines 20–23). Component APIs should encode semantics, not make appearance imply interactivity.

src/routes/+page.svelte:241 | MAJOR | The homepage pierces component encapsulation with `:global(.glass)` twice.
  The FAQ depends on `GlassCard`'s private class name and overrides its transition list, so an internal rename or animation change breaks a distant route. This specificity/encapsulation trap is evidence that variants and group behavior are missing from the component API.

src/routes/+page.svelte:254 | MAJOR | A broad element selector makes every future non-hero homepage section inherit 64px top margin.
  `section:not(.hero)` is a hidden page-wide contract; nested semantic sections would also receive spacing unless explicitly defeated. Composition spacing should belong to an explicit stack/container, not tag shape.

src/routes/+page.svelte:300 | MAJOR | Responsive layout has only two width breakpoints, chosen ad hoc per page.
  Homepage changes its duo at 68rem/1088px, about changes TacoCat at 52rem/832px (`about/+page.svelte:139`), and no shared breakpoint or container-query strategy exists. Header, navigation, cards, controls, and gallery have no explicit narrow- or wide-screen states.

src/lib/components/Header.svelte:43 | MAJOR | Header responsiveness is accidental wrapping, not designed navigation behavior.
  Both `.bar` and `nav` wrap (lines 45 and 83) with no breakpoint, so intermediate widths can create an unpredictable two-row sticky header whose height shifts with label/font metrics. Content-driven fallback is useful, but primary navigation needs deliberate states.

src/app.css:147 | MAJOR | The reveal system can turn real content into blank space.
  Supporting browsers apply `animation: reveal-up linear both` before elements enter, so every `.reveal` starts at opacity 0; visibility now depends on view-timeline progress rather than content availability. Progressive enhancement must never hide core content as its baseline state.

src/routes/+page.svelte:107 | MAJOR | The reported 1920×1080 “dead space” after the FAQ is invisible content, not an empty layout region.
  Both following sections, `.beacon` and `.duo` (line 115), carry `.reveal`; `app.css:151` maps opacity 0 through the first 30% of viewport entry. At that viewport the 88svh hero (`+page.svelte:140`) pushes them below the fold, so the area is painted as background until enough scrolling advances their timelines; the footer’s additional 64px top margin (`Footer.svelte:16`) extends the apparent gap.

src/app.css:168 | MAJOR | Reduced-motion handling does not actually opt content out of scroll-driven reveals.
  The blanket rule shortens animation duration, but a view-timeline animation is driven by scroll progress, not wall-clock duration; `.reveal` remains attached and retains `both` fill. The homepage only disables mascot bobbing (`+page.svelte:356`), leaving core sections vulnerable to hidden/translating states for users who explicitly requested less motion.

src/app.css:106 | MINOR | `overscroll-behavior: none` globally removes native boundary behavior without a demonstrated layout need.
  This can suppress platform navigation/refresh affordances and makes the whole document behave like an app shell. Global resets should be minimal and justified.

src/lib/components/Icon.svelte:15 | NIT | Decorative icon accessibility is mostly correct, but the wrapper has no semantic mode.
  `aria-hidden="true"` is appropriate for the current text-labelled links, yet the component cannot supply a title/label for a future standalone icon and does not expose class or accessibility props. The abstraction is safe only under an undocumented usage constraint.

src/app.css:121 | MINOR | The global focus ring is good, but hover-only feedback is duplicated without focus-visible equivalents.
  Cards lift/glow only on hover (`GlassCard.svelte:73`), gallery cells lift only on hover (`gallery/+page.svelte:125`), arrows move via `li:hover` (`links/+page.svelte:117`), and CTAs lift only on hover. The outline preserves operability, but keyboard users do not receive the same state communication.

src/lib/actions/glow.ts:9 | MINOR | Motion preference is sampled once and never reacts to a live setting change.
  The action no-ops correctly at mount, but it neither listens for `matchMedia` changes nor clears the three inline custom properties on destroy. Component behavior can become stale during a session and leaves presentation state on reused nodes.

src/app.css:1 | NIT | The declared cascade architecture is mostly ceremonial.
  Four layers are named, but assigned files populate only `base` and `components`; every Svelte style block sits outside those layers and therefore outranks layered rules. The advertised `overrides` layer cannot reliably govern component CSS, defeating the point of declaring a cascade order.

## The three that matter most
1. Replace the single `.shell` plus route-local CSS with explicit container, measure, stack, cluster, grid, page-intro, surface, and control primitives; otherwise every visual redesign remains a multi-file rewrite.
2. Remove opacity-driven reveal as a prerequisite for content visibility, especially under reduced motion; it is the precise source of the homepage’s apparent dead region and a correctness failure.
3. Build a semantic token model—roles for typography, spacing, surfaces, controls, and responsive/container behavior—then eliminate the hardcoded literals and 10 dead promises in the current token list.

## What is actually good
The global box sizing, image defaults, visible `:focus-visible` outline, 44px touch-target token, fluid headline clamps, and reduced-motion intent are sound foundations. `.shell` does at least align header, content, and footer consistently; `SectionHeading` removes one real repetition; `GlassCard` uses slots cleanly and keeps its visual internals scoped; the `Icon` is correctly hidden in every current text-labelled use; and `glow` cleans up its event listeners. The gallery’s intrinsic square cells and auto-filling grid are resilient without breakpoint sprawl. Keep those principles—shared alignment, content-driven grids, semantic markup, visible focus, decorative-icon hiding, and cleanup—but not the current one-size-fits-all implementations.

## If I were rebuilding this
I would start by separating foundations from compositions. Foundations would contain a semantic color system, a ratio-based spacing scale, a fluid type scale, motion preferences, focus treatment, and content measures. Compositions would provide container, narrow prose, full-bleed breakout, stack, cluster, switcher, and grid primitives, preferably driven by container queries rather than route breakpoints. Above those, I would build PageIntro, ButtonLink, CardLink, InfoList, and MediaPanel components with density, emphasis, and surface variants. Glass would become one optional surface treatment, not the site's structural unit. Routes would declare content and choose compositions; they would not own ledes, list resets, control styling, or section rhythm. Wide screens would gain editorial layouts and bounded fluid gaps instead of larger empty gutters. Motion would begin fully visible, enhance only transforms and opacity after capability checks, and be removed under reduced motion. This architecture would permit a redesign through tokens and variants, without rewriting every page.
