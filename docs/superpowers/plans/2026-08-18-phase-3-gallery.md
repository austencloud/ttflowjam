# Phase 3: Gallery — decisions record

Date: 2026-08-18

## What shipped

- `/gallery`: thumbnail grid + `@austencloud/media-spotlight@1.0.2` viewer
  (npm, not vendored — CI installs it from the registry).
- Storage: Cloudflare R2 bucket `ttfj-media`, bound as `TTFJ_MEDIA` in
  `wrangler.toml`. Keys: `gallery/thumb/<id>.webp` (640w q75) and
  `gallery/full/<id>.webp` (1600w q80), generated with PIL from
  `harvest/google-photos/` mirrors.
- Serving: `src/routes/gallery/media/[...key]/+server.ts` streams from R2 with
  `cache-control: immutable`. In `npm run dev` (no R2 binding) it reads from
  the gitignored `harvest/gallery-build/` pile instead.
- Manifest: `src/lib/data/gallery-manifest.json` (committed, ids + full
  dimensions, album order). Media stays out of git; the manifest is the
  committed index, consistent with the harvest convention.

## Privacy screen (locked rule applied)

Every album photo was individually reviewed by vision agents before
publication. Of 301 photos: **217 kept, 65 excluded, 19 junk/too-small**.
Excluded = anything at a private residence (the after-party backyard: house
siding, windows, garage, enclosed yard — nearly all fire-spinning shots) plus
ambiguous real-fire shots with no visible context, excluded on the
privacy-first default. The exclusion list with reasons lives in the session
scratchpad screen-result files; re-running the screen re-derives it.

**Rule for future syncs: new album photos must pass the same screen before
being added to the bucket/manifest. Real flames with no park context =
exclude by default.**

## Deferred

- Cron sync Worker (album → mirror → screen → manifest → deploy). Manual
  re-run of the harvest + screen + build scripts covers it for now.
- Videos (album mirrors are photos only).
