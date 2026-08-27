<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { siteDetails } from "$lib/data/site-details";

	const arrivalSteps = [
		{
			title: "Find the totem pole",
			copy: "Head to the north side of Palmer Square Park. Look for hoops, blankets, and people making unusual shapes with sticks.",
		},
		{
			title: "Put your bag down",
			copy: "There is no check-in. Say hello, watch for a minute, and ask where there is room to play.",
		},
		{
			title: "Ask to try something",
			copy: "Extra props circulate through the park. Ask before grabbing, then ask for one small move to start with.",
		},
		{
			title: "Make the night yours",
			copy: "Practice, talk, picnic, or just watch. You are not holding up a class and nobody is scoring you.",
		},
	];

	const packingList = [
		"Water and a layer for after sunset",
		"Sunscreen or bug spray when the evening calls for it",
		"A prop you already own, if you want to bring one",
		"Food for yourself, unless the taco schedule says otherwise",
	];
</script>

<PageMeta
	title="Your first Tuesday"
	description="A first-timer guide to Taco Tuesday Flow Jam: where to meet, when to arrive, what to bring, and how borrowing props works."
	path="/first-time"
/>

<div class="page">
	<header class="intro">
		<p class="kicker">First-timer guide</p>
		<h1>Come curious. The rest is optional.</h1>
		<p>
			You do not need gear, a teacher, or a reason to be good at this. Taco Tuesday is a public park
			hang where people practice together and lend each other props.
		</p>
		<div class="actions">
			<ActionLink href={siteDetails.mapUrl} external>Map the meeting spot</ActionLink>
			<ActionLink href={siteDetails.facebookUrl} tone="outline" external
				>Check the weather call</ActionLink
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
		<figcaption>Bring your own strange object, or meet one there.</figcaption>
	</figure>

	<section class="arrival">
		<SectionHeading
			kicker="When you get there"
			title="There is no front door."
			description="The gathering is loose by design. These four steps are enough to get oriented."
		/>
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
			<SectionHeading kicker="Pack light" title="Useful, not required" />
			<ul>
				{#each packingList as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
		<aside>
			<p class="label">Leave these at home</p>
			<p class="big">The idea that everyone is watching you.</p>
			<p>Most people are busy dropping their own props. Beginner mistakes blend right in.</p>
		</aside>
	</section>

	<section class="answers">
		<SectionHeading kicker="Before you leave home" title="A few honest limits" />
		<div>
			<article>
				<h2>Weather</h2>
				<p>
					This site shows the repeating calendar, not a live organizer decision. Facebook is where
					the current call appears.
				</p>
			</article>
			<article>
				<h2>Access questions</h2>
				<p>
					The group gathers on park grass. Message the Facebook page if you need a specific access
					answer before coming.
				</p>
			</article>
			<article>
				<h2>Tacos</h2>
				<p>
					Food is not there every week. Check the taco schedule instead of arriving hungry on faith
					alone.
				</p>
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

	.kicker,
	.label {
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
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--feature-min), 1fr));
		gap: var(--space-7);
		align-items: start;
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

	.bring aside {
		padding: var(--space-6);
		border: var(--border-heavy) solid var(--color-paper-ink);
		background-color: var(--color-paper);
		background-image: var(--texture-paper);
		box-shadow: var(--shadow-panel);
		color: var(--color-paper-ink);
	}

	.bring aside .label {
		color: var(--color-red-deep);
	}

	.big {
		margin-bottom: var(--space-5);
		font-family: var(--font-story);
		font-size: var(--text-section);
		font-weight: 620;
		line-height: 1;
	}

	.bring aside p:last-child {
		margin-bottom: 0;
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
