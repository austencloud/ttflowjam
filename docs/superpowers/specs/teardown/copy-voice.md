# Teardown — Copy & Voice

Reviewer axis: every user-visible string. No visual/layout/code findings.
Sources cross-checked: `harvest/README.md` (FB bio, flyer wording, press), the
canonical blurb "Is the weather nice? Is it Tuesday?"

## Verdict

The site hedges the facts it knows and asserts the facts it can't know: it says
"It's ON right now!" from a clock that has never heard of weather, then answers
"Are there tacos?" with "Sometimes!" when the taco dates are published on
Facebook. Underneath that, three incompatible voices (letterspaced editorial
kickers, group-chat "4ish," and mock-liturgical deity language) share every page,
and the word **free** appears exactly once on the entire site — in a box labeled
"the fine print."

## Findings

### A. It doesn't answer the questions it exists to answer

`src/routes/+page.svelte:79` | **FATAL** | `"A weekly celebration of flow arts, food, and community. Come play!"`
The single highest-value line on the site is a lifted Facebook bio (`harvest/README.md:15`)
that contains zero decision-grade information: not free, not Tuesday, not the
park, not the hours. "Come play!" is stock enthusiasm. Principle: the hero line
answers "should I go," not "what genre of thing is this."

`src/routes/about/+page.svelte:83` | **FATAL** | `"Free, all ages, all levels, every Tuesday April through October."`
This is the only occurrence of "free" as jam copy anywhere on the site (grep-verified:
the only other hits are `@fortawesome/free-*` imports and a Midwest Flow Fest note).
It is on the third page, inside a card headed "The fine print (there isn't much)."
The #1 objection for a stranger — does this cost money, am I crashing something —
is buried behind a self-deprecating joke. Principle: the objection that stops the
visit goes above the fold, not in fine print.

`src/routes/+page.svelte:38–51` | **FATAL** | the three-item FAQ
Kicker `"The essentials"` (`:96`). The essentials it omits: is it free, do I need
experience, will I be the only beginner, what do I bring, is fire allowed, what
happens if it rains, where in the park, how do I get there. It spends one of its
three slots on tacos.

`src/routes/about/+page.svelte:84–85` | **MAJOR** | `"Fire props only where legal and safe (ask the regulars)."`
Fire is the reason half the audience found this site (brief: "saw someone
spinning fire in a park and googled it"). The answer is a deferral to people the
reader has not met yet. Say what the actual practice is: where in the park, what
time it starts, whether a stranger with a wick head can light up.

`src/routes/+page.svelte:41` | **MAJOR** | `"If the weather's bad, you'll just see fewer people."`
The regular checking for a rainout (brief, audience 3) gets a shrug. Worse, it
contradicts the community's own canonical blurb, which gates on weather FIRST:
"Is the weather nice? Is it Tuesday?" The site inverted its own decision
procedure.

`src/routes/+page.svelte:112` | **MAJOR** | `"Look for us by the totem pole, center of the park on the north side."`
The best wayfinding sentence on the site, and it is three screens below the
status card that carries the street address. The visitor who needs it is standing
in the park on their phone. Wrong slot.

`src/routes/events/+page.svelte:17,24` | **MAJOR** | `"Check their site for dates."` (twice)
A listings page whose listings do not list dates. Two of three entries defer the
only fact a listing exists to carry.

### B. Claims the site cannot support

`src/routes/+page.svelte:19` + `src/lib/services/jam-status.ts:56–79` | **FATAL** | `"It's ON right now!"`
`jamStatus()` reads a clock, a weekday, and a month. It has no weather input, no
cancellation feed, no human override. At 6pm on a Tuesday in a thunderstorm the
site shouts that the jam is on. Principle: never let copy assert more certainty
than the data behind it. This one line is the whole trust surface of the site.

`src/routes/about/+page.svelte:35,43` | **MAJOR** | `"From a lightbulb to year nine"` / `"now deep into <strong>year nine</strong>"`
Arithmetic: first jam April 11, 2017 (`:37`); the 2026 season is the tenth. Also
hardcoded — it was wrong in 2026 and will be wronger every April. And it
contradicts `src/routes/links/+page.svelte:12`, `"a decade of taco lore."` The
site cannot agree with itself on its own age. ("A lightbulb" is also a
non-sequitur — no lightbulb appears anywhere in the copy.)

`src/routes/gallery/+page.svelte:38` | **MAJOR** | `"Nine years of Tuesdays at Palmer Square Park."`
Same off-by-one, now in a meta description Google will cache.

`src/routes/about/+page.svelte:39–40` | **MAJOR (uncertain)** | `"for, in the founders' own words, <em>\"more space and nicer grass!\"</em>"`
A direct quotation attributed to named-but-unnamed "founders." Nothing in
`harvest/README.md` records this quote. If it came from a 2017 Facebook post,
cite it; if it was written to sound folksy, it is fabricated attribution — the
most corrosive kind of copy error, because it is unfalsifiable to the reader and
checkable by the community.

`src/routes/+page.svelte:108–111` | **MAJOR** | `"If you show up and you're the first one there, <em>congratulations!</em> You are now the beacon for others to find."`
Set in a blockquote with curly quotes and no speaker. An unattributed pull-quote
reads as invented lore. Either name who said it (real quotes from a 1.4K-follower
page are the site's cheapest credibility) or unset the quote marks and own it as
site copy.

`src/routes/about/+page.svelte:57–59` | **MAJOR (uncertain)** | `"This is a <strong>Leave It Better</strong> event: we leave the park cleaner than we found it, every single week."`
Title-cased like a named program the reader is expected to recognize. No support
in harvest. Plus "every single week" is an absolute about a group with no
organizer and no attendance.

`src/routes/about/+page.svelte:43` | **MINOR (uncertain)** | `"running every summer since: rain or shine"`
Covers 2020. Unverified, and easy to disprove.

`src/routes/+page.svelte:126` | **MINOR** | `"Someone will hand you a prop within five minutes of arriving."`
Invented precision. The sentiment is right; "five minutes" is a number nobody
measured.

`src/routes/gallery/+page.svelte:46–48` | **MINOR** | `"Add them to the album</a> and they'll land here."`
The gallery reads a committed `gallery-manifest.json`. Photos land here when
someone rebuilds the site, not when someone uploads. Promising automation you
don't have is the same failure as "It's ON right now!" in miniature.

`src/routes/events/+page.svelte:18` | **NIT** | `"A Chicago institution."`
An unearned superlative about somebody else's event.

`src/routes/+page.svelte:89` | **NIT (uncertain)** | `"Palmer Square Park, 2200 N Kedzie Blvd"`
Chicago Park District lists the address on Kedzie **Ave**. Verify before print.

### C. AI-isms and template construction

Diagnostic note, stated honestly: **em-dash abuse is not a problem here** —
grep found zero em dashes in prose. The generated-text signature on this site is
the *tricolon*, and it is everywhere.

`src/routes/about/+page.svelte:26–31` | **MAJOR** | the About lede
Three stacked tricolons in six sentences: `"spinning poi, dancing with hoops,
juggling clubs, tossing staffs, walking slacklines"` (five parallel gerunds),
`"No experience needed, no audience, no pressure"` (negation triple), `"Come
watch, come learn, come teach"` (anaphora triple). Then `"that sweet locked-in
feeling people call <em>flow</em>"` — an em-tagged word-reveal, another generated
tell. This paragraph is the clearest "written by a model" artifact on the site.

`src/routes/about/+page.svelte:72–74` | **MAJOR** | `"the prolific and powerful palindrome in the sky. Spelled the same forwards and backwards, worshipped the same rain or shine."`
Alliterative doublet + perfectly balanced parallel clauses = LLM cadence at full
volume. Also "prolific" is the wrong word (prolific = produces a lot; nothing
here is produced), and this is the third "rain or shine" on the site
(`:43`, `:73`, plus `+page.svelte:41`'s weather shrug).

`src/routes/+page.svelte:79` | **MAJOR** | `"a weekly celebration of flow arts, food, and community"`
Category-noun tricolon. Swap three nouns and it is any event site on earth.
Repeated verbatim in the home meta description (`:58`).

`src/routes/+page.svelte:125` | **MINOR** | `"Flow arts are for playing, not performing."`
The X-not-Y antithesis. Good sentiment, machine rhythm, and it is the second
X-not-Y-shaped construction on the page.

`src/routes/about/+page.svelte:50` | **MINOR** | `"Pack light, play hard"`
Rhyming imperative cliché.

`src/routes/about/+page.svelte:83` | **MINOR** | `"Free, all ages, all levels"` — another triple.

`src/routes/+page.svelte:123` | **MINOR** | `"Never flowed before? Perfect."`
Stock reassurance, stacked under another question (`kicker="New here?"`). Two
rhetorical questions in one heading block.

`src/routes/about/+page.svelte:10` | **MINOR** | `"Your enthusiasm to learn"`
A packing-list item that cannot be packed. Vague-benefit filler, and mildly
patronizing — it assigns the reader a student posture before they arrive.

**Exclamation audit** | **MINOR** | Ten in ~700 words of copy: `:19 "It's ON right
now!"`, `:20 "It's on TONIGHT!"`, `:22 "See you in spring!"`, `:45 "When the
first person shows up!"`, `:49 "Sometimes!"`, `:79 "Come play!"`, `:109
"congratulations!"`, `about:40 "nicer grass!"`, `links:30 "from the jam!"`,
`Footer:5 "paws wide open!"`. A voice that shouts constantly cannot emphasize
anything. Principle: exclamation points are a budget, not a texture.

`src/routes/+page.svelte:96` | **MINOR** | `"Frequently asked, honestly answered"`
Announcing your own honesty implies the alternative was on the table, and the
answers below it contain the site's two biggest inaccuracies. Never claim a
virtue in copy; demonstrate it.

### D. Internal contradictions

`src/routes/+page.svelte:41` vs `:22`, `:89`, `about:83` | **FATAL** | `"Yes. Every Tuesday until the end of time."`
The site's own status card has an `off-season` state (`:22 "See you in spring!"`),
the hero says April–October (`about:83`, `Footer:4`), and `jam-status.ts:9–10`
enforces months 3–9. In November this FAQ tells a visitor to go to an empty park.
A first-timer reading top-to-bottom gets "every Tuesday forever" and "April
through October" within one scroll.

**Three different sets of hours** | **MAJOR** | `:89 "Tuesdays 4ish–10ish"`,
`:35 "flowing until 10ish"`, `:45 "Usually around 4ish. Most people are there 6–9.
Park closes at 11."` Four numbers for one event. Pick the useful one (6–9 is the
one that answers "when will people actually be there") and make the others
subordinate to it.

**Two different taco-fund conditions** | **MINOR** | `about:85 "if you eat tacos,
a $5 donation"` vs `links:81 "If you flow and eat, please chip in $5"`. One says
eating triggers it, the other says flowing-and-eating. Small, but it is money.

**"We" who?** | **MAJOR** | `about:44 "no organizer you're waiting on"` vs
`events:42 "Neither can we."`, `+page:112 "Look for us"`, `about:73 "our glorious
deity"`, `events:61 "Tell us in"`, `links:60 "Find us everywhere"`. The site
insists nobody runs this, then narrates in an institutional first-person plural
throughout. Decide: either a named human writes this ("I'm Austen, I started it")
or the copy speaks in the second person about the park ("people show up," "you'll
find them"). The current mix reads like an org pretending not to be one.

### E. Register — there are three voices, not one

1. **Editorial-magazine** — the letterspaced uppercase kickers: `"The essentials"`,
   `"The origin story"`, `"What to bring"`, `"Beyond Tuesday"`, `"The community
   album"`, `"Find us everywhere"`, `"Required theology"`. Sober, curated,
   Fraunces-italic display. Implies an editor.
2. **Group chat** — `"4ish–10ish"`, `"good vibes"`, `"shenanigans"`, `"a pile of
   Tuesdays"`, `"That's a promise and a threat"`, `"ancient history"`. Implies a
   friend texting.
3. **Mock-liturgical** — `"Required theology"`, `"our glorious deity"`,
   `"worshipped"`, the `.blessing` class name, `"welcomes you with paws wide
   open!"`. Implies a bit that has been running for years.

None is dominant, so none reads as intentional. Voice 2 is the real one (it
matches the flyer, `harvest/README.md:16`: "Every Tuesday — 4ish–10ish, Palmer
Square Park"). Voice 1 is borrowing gravity the subject does not want. Voice 3
is an in-joke.

`src/lib/components/Footer.svelte:5` | **MAJOR** | `"Our glorious deity TacoCat welcomes you with paws wide open!"`
**Assessment as asked: it lands as cringe, and the reason is structural, not
tonal.** The joke's setup ("TacoCat is a cat in a taco, it's a palindrome") lives
on `/about`; the punchline is site-wide, on every page, in the footer. A visitor
who lands on `/gallery` from Google gets the punchline with no setup and cannot
tell whether the site is being ironic — the phrase "glorious deity" is used twice
with no wink, so sincerity is a live reading. Second problem: the footer is the
last-resort fact slot (hours, address, free, all ages, how to ask a question), and
this site spends its most-read footer line on a bit while omitting "free," the
street address, and any contact. In-jokes work where the in-group is visible —
next to the mascot art on `/about`, in the group name "TacoCat's Circus," on a
sticker. Not as the closing sentence of every page. "Paws wide open" is also a
strained retrofit of "arms wide open" that produces an unintentional image.

### F. Microcopy

`src/lib/components/Header.svelte:8` | **MAJOR** | `"Other Events"`
"Other" is relative to a context the label does not supply, and on the page
itself the heading is `"Beyond Tuesday"` (`events:40`) — the nav and the page do
not agree on what the page is. Better: **"More Jams"** or **"Around Chicago."**

`src/lib/components/Header.svelte:9` | **MINOR** | `"Links"`
Names the mechanism, not the errand. The page is Facebook + Instagram + album +
press + the taco fund. Call it **"Follow"** or **"Find Us."**

`src/routes/events/+page.svelte:54` | **MAJOR** | `"Details →"` ×3
Three identical non-descriptive link labels. A screen-reader user tabbing the
page hears "Details, Details, Details." Use the destination:
`"Chicago Juggling Club site →"`.

`src/routes/gallery/+page.svelte:15,54` | **MAJOR** | ``alt: `Photo ${i + 1} from the Taco Tuesday Flow Jam community album` ``
217 near-identical alt strings, surfaced again as the button label
(`aria-label="View {item.alt}"`). This is alt text that satisfies a linter and
describes nothing. If per-photo alt is impossible, make the grid a single labeled
region and give the cells positional labels only ("Photo 12 of 217") — do not
repeat the album name 217 times.

`src/lib/services/jam-status.ts:41` | **NIT** | `"happening now"`
Dead string. In the `on-now` state the page hardcodes `"flowing until 10ish"`
(`+page.svelte:35`), so this branch never renders.

`src/lib/services/jam-status.ts:53` | **MINOR** | `` `in ${days} day${...}` ``
Produces "in 1 day" for tomorrow and "in 7 days" for next Tuesday. Humans say
"tomorrow" and "next Tuesday." Robotic where the site is otherwise casual.

`src/routes/+page.svelte:20` | **MINOR** | `"It's on TONIGHT!"`
Rendered from midnight until 4pm. At 9am, "TONIGHT" is a strange way to describe
4pm, and it conflicts with the site's own "4ish."

`src/routes/+page.svelte:22` | **MINOR** | `"See you in spring! First jam:"`
"See you" presumes a prior relationship. The off-season visitor is the one most
likely to be a total stranger, and this state is live for five months a year —
nearly half the site's life is spent in a message written for regulars.

`src/routes/+page.svelte:131` | **MAJOR** | `"See the photos"` → external Google Photos
The site has its own `/gallery` with 217 photos. The homepage's secondary CTA
routes past it to a third-party album. Copy problem and funnel problem.

`src/routes/links/+page.svelte:89` | **GOOD** | `"Chip in with PayPal"` — verb + amount + destination. Keep.

`src/routes/events/+page.svelte:35` | **MINOR** | `"...Midwest Flow Fest, and more."`
There is no "and more." Three entries. Meta descriptions that overpromise get
punished by bounce.

`src/routes/+page.svelte:55` | **MINOR** | `"Taco Tuesday Flow Jam · Chicago"`
The homepage `<title>` — the one string that shows in a search result and a
browser tab — does not say what the thing is. Someone who googled "fire spinning
chicago park" sees a name and a city. Add the noun and the price:
`"Taco Tuesday Flow Jam — free weekly flow arts jam in Logan Square, Chicago"`.

**No Open Graph tags anywhere** | **MAJOR** | This community lives on Facebook
(`harvest/README.md:14`: 1.4K followers, posts cross-published from Instagram).
Every share of this URL renders as a bare link with the meta description as its
only text — and the home meta description is the generic bio. The share card *is*
the copy surface for the primary distribution channel, and it is unwritten.

**No error page, no empty states** | **MINOR** | No `+error.svelte`. A 404 on a
site this small is a chance to say "wrong page, but the jam is still Tuesday at
Palmer Square." Currently it says whatever SvelteKit says.

## The three that matter most

1. **`+page.svelte:19` — "It's ON right now!" asserts a fact the code cannot
   know.** The status card is the site's whole reason to exist and its only
   dynamic claim; if it is ever confidently wrong in a storm, every other word
   loses credibility. Either wire a weather signal, or rewrite the copy to state
   what it actually knows (it's Tuesday, it's in season, here's what people
   usually do) and route the weather question to Facebook.
2. **"Free" appears once, in the fine print (`about:83`).** The stranger who
   googled this is asking permission to show up. The homepage never grants it.
3. **The voice is three voices, and the weakest one owns the two most-read
   slots** — the hero tagline (`:79`, a lifted generic bio) and the site-wide
   footer (`Footer:5`, the deity bit). Pick the flyer voice the community
   already uses and let it own the hero.

## What is actually good

- **`gallery:43` `"A pile of Tuesdays"`** — the best three words on the site.
  Specific, unpretentious, could not appear on another site.
- **`events:43–44` `"Details drift, so check the source link before trekking
  across town."`** — honest about its own staleness and respects the reader's
  time. This is the register the whole site should be in.
- **`links:79 "Keep the griddle going"` / `links:83 "It buys the next round of
  tortillas."`** — an ask that names the concrete thing the money becomes. Best
  conversion copy on the site.
- **`+page.svelte:112` `"Look for us by the totem pole, center of the park on the
  north side."`** — the only sentence that solves a real navigation problem.
  Promote it, don't cut it.
- **`+page.svelte:66`** hero alt text — `"Jammers passing glowing LED juggling
  clubs at night in Palmer Square Park"` is genuinely descriptive and
  location-specific. Model for the gallery alts.
- **`about:44–45` `"There's no sign-up and no organizer you're waiting on. Taco
  Tuesday happens because you show up."`** — the actual thesis of the whole
  thing. It is on page two, paragraph four. Move it to the hero.
- **`gallery:45` `"newest jams and ancient history alike"`** and
  **`links:60 "The link pile"`** — dry, human, unforced.
- **Zero em dashes.** Whatever else went wrong, the prose is not punctuation
  soup.

## Rewrites — the ten worst offenders

**1. `+page.svelte:79` hero tagline**
> was: "A weekly celebration of flow arts, food, and community. Come play!"
```
Free flow arts jam in Palmer Square Park. Every Tuesday, 4ish to 10ish,
April through October. Bring a prop or borrow one.
```

**2. `+page.svelte:19,35` on-now status (honest about what it knows)**
> was: "It's ON right now!" / "flowing until 10ish"
```
It's Tuesday. People are in the park.
Usually going until about 10. Pouring rain? Check Facebook.
```

**3. `+page.svelte:41` FAQ "Is it happening?"**
> was: "Yes. Every Tuesday until the end of time. If the weather's bad, you'll just see fewer people."
```
Is it on tonight?
If it's Tuesday between April and October, yes. Nobody calls it off and
nobody has to — in bad weather it just shrinks to whoever came anyway.
Off-season it doesn't run; we start back up the first Tuesday in April.
```

**4. `+page.svelte:45` FAQ "When does it start?"**
> was: "When the first person shows up! Usually around 4ish. Most people are there 6–9. Park closes at 11."
```
What time should I come?
Between 6 and 9 there's a crowd. Early birds start around 4. The park
closes at 11 and people usually beat it by an hour.
```

**5. `+page.svelte:49` FAQ "Are there tacos?"**
> was: "Sometimes! Tacos are a communal effort. There's not always tacos, but there's always flowing TacoCats and good vibes."
```
Are there tacos?
Some Tuesdays, not all. Taco nights get posted on Facebook a few days
ahead. If you eat, drop $5 in the jar — that's the whole funding model.
```

**6. Missing FAQ — add as the first card**
```
Can I just show up?
Yes. It's free, it's a public park, and nobody's in charge. You don't
need experience, a prop, or to know anyone. Walk up to whoever's
spinning and say you've never done it.
```

**7. `+page.svelte:125–127` the beginner block**
> was: "Flow arts are for playing, not performing. Someone will hand you a prop within five minutes of arriving. That's a promise and a threat."
```
Poi, hoops, staff, juggling clubs, fans, slacklines. Nobody's performing —
most people at any given jam are grinding on something they still can't do.
Stand near anyone with a prop bag and you will end up holding something.
```

**8. `about:35,42–46` the age claim**
> was: "From a lightbulb to year nine" / "now deep into <strong>year nine</strong>"
```
kicker: How it started
title:  April 11, 2017

The first one met at the eagle statue by the Logan Square Blue Line stop.
A week later it moved four blocks west to Palmer Square for more space and
better grass, and never moved again. It's run every season since.
```
(Compute the season number from the date, or drop it. Also fix
`gallery:38` and `links:12` — "a decade of taco lore" contradicts it.)

**9. `about:70–74` TacoCat**
> was: kicker "Required theology" / "TacoCat is our glorious deity: the prolific and powerful palindrome in the sky. Spelled the same forwards and backwards, worshipped the same rain or shine. Every jam is held in TacoCat's honor, and TacoCat loves you."
```
kicker: The mascot
title:  Who is TacoCat?

A cat in a taco. Spelled the same both ways. Somebody drew it years ago,
it ended up on the flyer, then on the sign, then on the group name, and
at this point arguing about it is pointless.
```

**10. `Footer.svelte:5` the blessing**
> was: "Our glorious deity TacoCat welcomes you with paws wide open!"
```
Free · all ages · all skill levels · no sign-up
Look for the totem pole on the north side of the park.
```
(If the bit must live, put it under the mascot art on `/about` where the setup
is, as a caption: "TacoCat approves." One line, once.)

## If I were rebuilding this

I would write the whole site in the voice of the flyer and the guidebook blurb —
"Is the weather nice? Is it Tuesday?" — because that line is already the brand: a
two-question decision procedure, delivered deadpan, that assumes you are an adult
who can decide for yourself. Every page inherits that shape. State the condition,
state the answer, stop. Facts first, jokes second, one joke per page, and the
mascot stays where the setup is instead of ending every page with a punchline
nobody was handed.

I would kill the institutional "we." Either a named person writes this in first
person, or the copy talks about the park in the second and third — never a
faceless plural on a site whose thesis is that nobody is in charge.

And I would let the copy hedge only where reality hedges. Tacos are uncertain;
say when they're announced. Free is not uncertain; say it in the hero. The
current site does the exact opposite, and that inversion is the whole problem.
