# Styling

- Tokens live in `src/app.css` on `:root`. Component styles are scoped `<style>` blocks that read only `var(--token)`. No hardcoded colors/sizes/durations.
- Permanently dark. Never write light/dark variant pairs.
- No Tailwind. No `!important` (stylelint warns; the reduced-motion global block is the one sanctioned exception).
- Text floor 14px essential / 12px supplementary. Touch targets ≥44px (`--min-touch-target`). Contrast AAA (7:1 normal, 4.5:1 large). Always-visible focus rings.
- No `<input type="checkbox">` — booleans are buttons with `aria-pressed`.
- No layout shift: reserve space for dynamic content.
