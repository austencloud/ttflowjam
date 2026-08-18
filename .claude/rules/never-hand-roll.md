# Never Hand-Roll (One Concept, One Owner)

Before building any shared-feeling behavior:

1. Grep this repo and check `@austencloud/*` packages (media-spotlight, theme, media-manager, image-loader, drawer, sidebar, chip-toggle) for an existing owner — search at least 3 synonym terms.
2. Declare the outcome in your report: **Reuse / Extend / Compose / Create**.
3. A second parallel implementation of an owned concept is forbidden; a third is a defect.

Known owners: gallery viewer → `@austencloud/media-spotlight`; theming → `@austencloud/theme` + `src/app.css`; forms → zod schema + SvelteKit form actions + Turnstile/honeypot (cirque inquiry pattern); R2 upload → SigV4 presign (cirque `r2-signing.ts` pattern).
