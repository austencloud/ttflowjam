# TTFJ Site Teardown — Reviewer Brief (2026-08-25)

You are one of four independent adversarial reviewers. Read this brief, then
execute ONLY your assigned axis. Do not review the other axes.

## What the site is

Public website for **Taco Tuesday Flow Jam** — a free weekly flow-arts jam
(juggling, poi, staff, LED and fire props) that has run in Chicago since 2017.
Tuesdays, roughly 4pm to 10pm, April through October, at Palmer Square Park in
Logan Square. It is free, all ages, all skill levels. It is run by nobody in
particular: no organization, no staff, no budget. Tacos are funded by a
communal $5-if-you-eat honor system. The community mascot is "TacoCat," a cat
in a taco. The jam was written up by the Chicago Sun-Times in 2023.

Repo: `E:\ttflowjam` (SvelteKit 2 + Svelte 5, strict TS, vanilla scoped CSS
over tokens in `src/app.css`). Live: https://ttflowjam.pages.dev

Pages: `/` (hero + live "is it on tonight" status + FAQ), `/about`,
`/gallery` (217 community photos), `/events` (other Chicago flow events),
`/links` (social links + taco fund).

## Who it is actually for

1. A curious person who saw someone spinning fire in a park and googled it.
   They want to know: is this real, can I just show up, will I be the only
   beginner, is it happening tonight.
2. A traveling flow artist looking for a jam while in Chicago.
3. A regular checking whether it's cancelled for weather.

It is NOT for: investors, clients, or anyone evaluating a product. Nobody is
buying anything. The only conversions that exist are "show up in the park" and
"chip in for tacos."

## Rules of engagement

**Be adversarial. Nothing is sacred** — not the mascot, not the dark theme,
not the fonts, not the photo hero, not the page structure. The owner has
explicitly put the entire art direction on the table and asked for this to be
torn to shreds before it gets rebuilt.

Report everything you find, at every severity. Do not self-censor to keep the
list short, do not pre-filter to "only the important ones," and do not soften
a finding because it might be a deliberate choice. If it is deliberate and
still wrong, say it is wrong. Uncertain findings are welcome — mark them.

Argue from principle, not preference. "I don't like it" is worthless. "This
fails because a first-time visitor cannot tell X" is useful. Where you assert
a rule, name it.

Do not fix anything. Do not edit files. This is diagnosis only.

## Output format

Write your report to the path given in your dispatch. Structure:

```
## Verdict
Two sentences. What is fundamentally wrong on this axis.

## Findings
<file:line or page/viewport> | SEVERITY | finding
  Why it fails, in one or two sentences. Name the principle.

## The three that matter most
Ranked. If only three things get fixed on this axis, these.

## What is actually good
Be honest. What should survive the rebuild, and why.
```

SEVERITY is one of: FATAL (actively drives people away or makes the site
untrustworthy), MAJOR (a visitor notices and thinks less of it), MINOR
(a designer notices), NIT.

End with a section titled `## If I were rebuilding this` — 150 words on the
direction you would take this axis, stated as a position you would defend.
