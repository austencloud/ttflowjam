# Taco Tuesday Flow Jam — ttflowjam

Community hub for Chicago's weekly flow arts jam. SvelteKit 2 + Svelte 5 (runes only),
strict TypeScript, Cloudflare Pages, vanilla scoped CSS over tokens in `src/app.css`.

## Commands

- `npm run dev` — dev server on :5177 (strict port)
- `npm run check && npm run lint && npm test && npm run build` — the full gate; run before every commit

## Rules

- `.claude/rules/` is authoritative: never-hand-roll, code-style, styling
- Reuse `@austencloud/*` packages (media-spotlight, theme, image-loader) before building anything they cover
- The canonical asset pile is `harvest/` (gitignored media + committed manifests). Never re-scrape a source that's already in the pile.
- The spec is `docs/superpowers/specs/2026-08-18-ttfj-website-design.md`; decisions in §9 are locked
- Verification before completion: every "done" claim needs the command output that proves it
- Writing style for site copy: warm, playful, direct. TacoCat is canon. Never publish the after-party location or any home address.
