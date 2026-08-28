<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { siteDetails } from "$lib/data/site-details";

	const arrivalSteps = [
		{
			title: "Find the meeting spot",
			copy: "The jam meets by the totem pole on the north side of Palmer Square Park.",
		},
		{
			title: "No check-in",
			copy: "The jam is free and does not require registration.",
		},
		{
			title: "Borrowing props",
			copy: "Ask the owner before using another person's prop.",
		},
		{
			title: "Open practice",
			copy: "This is an open jam, not a scheduled class.",
		},
	];

	const packingList = [
		"Water and a layer for after sunset",
		"Sunscreen and bug spray",
		"A prop, if you have one",
		"Food, except on a published taco night",
	];
</script>

<PageMeta
	title="First-time guide"
	description="A first-timer guide to Taco Tuesday Flow Jam: where to meet, when to arrive, what to bring, and how borrowing props works."
	path="/first-time"
/>

<div class="page">
	<header class="intro">
		<p class="kicker">First time</p>
		<h1>First-time guide</h1>
		<p>No signup or gear is required. Taco Tuesday is an open flow arts jam in a public park.</p>
		<div class="actions">
			<ActionLink href={siteDetails.mapUrl} external>Map the meeting spot</ActionLink>
			<ActionLink href={siteDetails.facebookUrl} tone="outline" external>Weather updates</ActionLink
			>
		</div>
	</header>

	<figure class="lead-photo">
		<picture>
			<source
				srcset="/media/park-noticeboard/first-time-720.webp 720w, /media/park-noticeboard/first-time-1400.webp 1400w"
			/>
			<img
				src="/media/park-noticeboard/first-time-720.webp"
				alt="Two flow artists practicing different balance props on the grass at Palmer Square Park"
				width="1400"
				height="1100"
				fetchpriority="high"
			/>
		</picture>
		<figcaption>Flow arts practice at Palmer Square Park</figcaption>
	</figure>

	<section class="arrival">
		<SectionHeading kicker="Arrival" title="What to expect" />
		<ol>
			{#each arrivalSteps as step, index (step.title)}
				<li>
					<span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
					<div>
						<h2>{step.title}</h2>
						<p>{step.copy}</p>
					</div>
				</li>
			{/each}
		</ol>
	</section>

	<section class="bring">
		<div>
			<SectionHeading kicker="Before you go" title="Useful to bring" />
			<ul>
				{#each packingList as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="answers">
		<SectionHeading kicker="Current information" title="Weather, access, and tacos" />
		<div>
			<article>
				<h2>Weather</h2>
				<p>This site shows the regular schedule. Weather updates are posted on Facebook.</p>
			</article>
			<article>
				<h2>Access questions</h2>
				<p>
					The meeting area is on park grass. Message the Facebook page with specific access
					questions.
				</p>
			</article>
			<article>
				<h2>Tacos</h2>
				<p>Tacos are served only on the published taco nights.</p>
			</article>
		</div>
		<ActionLink href="/tacos" tone="quiet">See the taco schedule</ActionLink>
	</section>
</div>

<style>
	.page {
		width: var(--shell-width);
		margin-inline: auto;
		padding-top: var(--space-7);
	}

	.intro {
		max-width: var(--reading-width);
		padding-bottom: var(--space-7);
	}

	.kicker {
		margin-bottom: var(--space-3);
		color: var(--color-gold);
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	h1 {
		margin-bottom: var(--space-5);
		font-size: var(--text-page);
		font-weight: 900;
	}

	.intro > p:not(.kicker) {
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}

	.lead-photo {
		margin: 0;
		border: var(--border-heavy) solid var(--color-paper);
		background: var(--color-paper);
		box-shadow: var(--shadow-photo);
	}

	.lead-photo img {
		display: block;
		width: 100%;
	}

	.lead-photo figcaption {
		padding: var(--space-3) var(--space-4);
		background: var(--color-paper);
		color: var(--color-paper-ink);
		font-size: var(--text-small);
		font-weight: 750;
	}

	.arrival,
	.bring,
	.answers {
		margin-top: var(--section-gap);
	}

	ol,
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	ol {
		border-top: var(--border-thin) solid var(--color-line);
	}

	ol li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: var(--space-5);
		padding-block: var(--space-5);
		border-bottom: var(--border-thin) solid var(--color-line);
	}

	ol span {
		color: var(--color-red);
		font-weight: 850;
		letter-spacing: var(--tracking-label);
	}

	ol h2,
	.answers h2 {
		margin-bottom: var(--space-2);
		font-size: var(--text-card-title);
		font-weight: 820;
		letter-spacing: var(--tracking-card);
		line-height: 1.1;
	}

	ol p,
	.answers p {
		max-width: var(--reading-width);
		margin-bottom: 0;
		color: var(--color-text-soft);
	}

	.bring {
		max-width: var(--reading-width);
	}

	.bring ul {
		display: grid;
		gap: var(--space-3);
	}

	.bring li {
		padding: var(--space-4);
		border-left: var(--border-heavy) solid var(--color-gold);
		background: var(--color-night-raised);
	}

	.answers > div {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--card-min), 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-5);
	}

	.answers article {
		padding: var(--space-5);
		border: var(--border-thin) solid var(--color-line);
		background: var(--color-night-raised);
	}
</style>
