Read `docs/superpowers/specs/2026-08-25-teardown-brief.md` first. It defines
the site, the audience, the rules of engagement, and the output format. Follow
that format exactly.

Your assigned axis: **CSS & COMPONENT ARCHITECTURE**.

Reading list (read all of these fully, nothing else):

- `src/app.css`
- `src/routes/+layout.svelte`
- `src/routes/+page.svelte`
- `src/routes/about/+page.svelte`
- `src/routes/events/+page.svelte`
- `src/routes/gallery/+page.svelte`
- `src/routes/links/+page.svelte`
- `src/lib/components/Header.svelte`
- `src/lib/components/Footer.svelte`
- `src/lib/components/GlassCard.svelte`
- `src/lib/components/SectionHeading.svelte`
- `src/lib/components/Icon.svelte`
- `src/lib/actions/glow.ts`

What to attack:

1. **The token system.** Is `src/app.css` a real design system or a pile of
   named constants? Are there values hardcoded in components that should be
   tokens? Are there tokens nothing uses? Is the type scale coherent or
   arbitrary? Is there a spacing rhythm or just five sizes someone picked?
2. **Component poverty.** The entire site has five components and only ONE
   of them (`GlassCard`) is a surface. Every page therefore reimplements its
   own layout, its own lists, its own buttons. Find every place two pages
   solve the same problem differently. Quantify the duplication.
3. **How the code constrains the design.** This is the most important
   question. What visual moves are currently impossible or painful because of
   how the CSS is structured? What would have to change architecturally
   before a real redesign could even be attempted?
4. **Responsive strategy.** Find every breakpoint. Are they consistent? Is
   there a strategy, or ad-hoc media queries per page? What happens between
   1440px and 3840px — does anything grow, or does the design freeze?
5. **Dead space and layout math.** The homepage has a large empty region
   between the FAQ block and the footer at 1920x1080. Find the cause in the
   CSS and name it precisely.
6. **Correctness bugs** in CSS or Svelte that a reviewer would catch: unused
   selectors, specificity traps, `:global` leaks, reveal/scroll-animation
   logic that can leave content permanently invisible, accessibility of the
   custom `Icon` SVG wrapper, focus states, reduced-motion handling.

Be specific. Every finding needs `file:line`. Quantify wherever you can
(counts, px values, ratios). Do not edit any file.

Write your report to `docs/superpowers/specs/teardown/codex-css-architecture.md`.
