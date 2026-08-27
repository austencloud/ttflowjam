<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import JamStatusPanel from "$lib/components/JamStatusPanel.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { siteDetails } from "$lib/data/site-details";

	const basics = [
		{
			title: "Show up when you can",
			copy: "The first props usually land around 4ish. The busiest stretch is later in the evening.",
		},
		{
			title: "Look for the totem pole",
			copy: "The group gathers on the north side of Palmer Square Park. Hoops on the grass are another good clue.",
		},
		{
			title: "Borrow before you buy",
			copy: "Regulars bring extra props. Ask what is available and somebody can help you start.",
		},
		{
			title: "Leave when you want",
			copy: "Watch for ten minutes or stay until the lights come out. There is no class schedule to miss.",
		},
	];

	const questions = [
		{
			question: "Is Tuesday guaranteed?",
			answer:
				"The calendar repeats every Tuesday in season. Weather can change the plan, so check the Facebook call before leaving home.",
		},
		{
			question: "Do I need to know how to flow?",
			answer:
				"No. The park has beginners, working performers, curious neighbors, and people who mostly came to sit in the grass.",
		},
		{
			question: "Are tacos there every week?",
			answer:
				"No. Taco nights have their own schedule. The flow jam still happens on the Tuesdays between them.",
		},
	];
</script>

<PageMeta
	title="Taco Tuesday Flow Jam · Chicago"
	description="Free flow arts in Palmer Square Park. Tuesdays 4ish–10ish, April through October. No signup, no experience needed, and props are available to borrow."
	path="/"
	home
/>

<div class="page">
	<section class="hero" aria-labelledby="page-title">
		<div class="hero-grid">
			<div class="identity">
				<p class="kicker">Free park jam · Chicago · Since 2017</p>
				<h1 id="page-title">Tuesday night belongs to the park.</h1>
				<p class="lede">
					Free flow arts in Palmer Square. Come play, learn one move, or sit in the grass.
				</p>
			</div>
			<JamStatusPanel />
		</div>

		<figure class="hero-photo">
			<picture>
				<source
					srcset="/media/park-noticeboard/hero-group-1200.webp 1200w, /media/park-noticeboard/hero-group-1920.webp 1920w"
					media="(min-width: 48rem)"
				/>
				<img
					src="/media/park-noticeboard/hero-group-720.webp"
					srcset="/media/park-noticeboard/hero-group-720.webp 720w, /media/park-noticeboard/hero-group-1200.webp 1200w"
					sizes="100vw"
					alt="A large group of Taco Tuesday Flow Jam regulars holding hoops, juggling clubs, and staffs beside the Palmer Square totem pole"
					width="1920"
					height="1279"
					fetchpriority="high"
				/>
			</picture>
			<figcaption>
				<span>Palmer Square Park, Chicago</span>
				<span>Find the totem pole. The props will be nearby.</span>
			</figcaption>
		</figure>
	</section>

	<section class="basics" aria-labelledby="basics-title">
		<SectionHeading
			kicker="How the night works"
			title="No registration desk. No skill check."
			description="The jam is closer to a weekly neighborhood picnic than a class or show."
		/>
		<div class="card-grid">
			{#each basics as basic, index (basic.title)}
				<article>
					<span aria-hidden="true">0{index + 1}</span>
					<h3 id={index === 0 ? "basics-title" : undefined}>{basic.title}</h3>
					<p>{basic.copy}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="first-time">
		<figure>
			<picture>
				<source
					srcset="/media/park-noticeboard/first-time-720.webp 720w, /media/park-noticeboard/first-time-1400.webp 1400w"
				/>
				<img
					src="/media/park-noticeboard/first-time-720.webp"
					alt="A flow artist practicing with two flower-shaped props while another balances nearby in Palmer Square Park"
					width="1400"
					height="1100"
					loading="lazy"
					decoding="async"
				/>
			</picture>
			<figcaption>There is always something strange to try.</figcaption>
		</figure>
		<div>
			<p class="kicker">Your first Tuesday</p>
			<h2>You do not need to know what “flow arts” means.</h2>
			<p>
				Come empty-handed. Ask about poi, hoops, juggling, fans, staffs, or whatever odd object is
				moving through the air. People share props and teach each other because that is the point.
			</p>
			<div class="actions">
				<ActionLink href="/first-time">Read the first-timer guide</ActionLink>
				<ActionLink href={siteDetails.mapUrl} tone="outline" external>Open the map</ActionLink>
			</div>
		</div>
	</section>

	<section class="questions">
		<SectionHeading kicker="Straight answers" title="The useful questions" />
		<div class="question-grid">
			{#each questions as item (item.question)}
				<article>
					<h3>{item.question}</h3>
					<p>{item.answer}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="explore">
		<SectionHeading kicker="Keep looking" title="See the jam from another angle" />
		<nav aria-label="Explore the site">
			<a href="/gallery"><span>217 approved photos</span><strong>Open the gallery</strong></a>
			<a href="/story"><span>Started in 2017</span><strong>Read the story</strong></a>
			<a href="/tacos"><span>Not every Tuesday</span><strong>Find taco night</strong></a>
			<a href="/chicago-flow"><span>The other six days</span><strong>More Chicago flow</strong></a>
		</nav>
	</section>
</div>

<style>
	.page {
		width: var(--shell-width);
		margin-inline: auto;
	}

	.hero {
		padding-top: var(--space-5);
	}

	.hero-grid,
	.first-time {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--feature-min), 1fr));
		gap: var(--space-7);
		align-items: center;
	}

	.hero-grid {
		gap: var(--space-5);
	}

	.identity {
		padding-block: 0;
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
		max-width: var(--reading-width);
		margin-bottom: var(--space-5);
		font-size: var(--text-display);
		font-weight: 900;
	}

	.lede {
		max-width: var(--reading-width);
		margin-bottom: 0;
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}

	.hero-photo {
		margin-top: var(--space-7);
		border: var(--border-heavy) solid var(--color-paper);
		background: var(--color-paper);
		box-shadow: var(--shadow-photo);
	}

	.hero-photo img,
	.first-time img {
		display: block;
		width: 100%;
	}

	.hero-photo figcaption,
	.first-time figcaption {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-2) var(--space-5);
		padding: var(--space-3) var(--space-4);
		background: var(--color-paper);
		color: var(--color-paper-ink);
		font-size: var(--text-small);
		font-weight: 750;
	}

	.basics,
	.first-time,
	.questions,
	.explore {
		margin-top: var(--section-gap);
	}

	.card-grid,
	.question-grid,
	.explore nav {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--card-min), 1fr));
		gap: var(--space-4);
	}

	.card-grid article,
	.question-grid article {
		padding: var(--space-5);
		border: var(--border-thin) solid var(--color-line);
		background: var(--color-night-raised);
	}

	.card-grid span {
		display: block;
		margin-bottom: var(--space-6);
		color: var(--color-red);
		font-size: var(--text-small);
		font-weight: 850;
		letter-spacing: var(--tracking-label);
	}

	.card-grid h3,
	.question-grid h3 {
		margin-bottom: var(--space-3);
		font-size: var(--text-card-title);
		font-weight: 820;
		letter-spacing: var(--tracking-card);
		line-height: 1.08;
	}

	.card-grid p,
	.question-grid p {
		margin-bottom: 0;
		color: var(--color-text-soft);
		font-size: var(--text-small);
	}

	.first-time figure {
		margin: 0;
		border: var(--border-heavy) solid var(--color-paper);
		background: var(--color-paper);
		transform: rotate(var(--photo-tilt));
	}

	.first-time h2 {
		margin-bottom: var(--space-5);
		font-size: var(--text-section);
		font-weight: 880;
	}

	.first-time p:not(.kicker) {
		max-width: var(--reading-width);
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}

	.explore nav a {
		display: grid;
		min-height: var(--status-reserve);
		align-content: space-between;
		padding: var(--space-5);
		border: var(--border-medium) solid var(--color-line);
		background: var(--color-night-panel);
		text-decoration: none;
		transition:
			background var(--duration-normal) var(--ease-out),
			border-color var(--duration-normal) var(--ease-out),
			transform var(--duration-normal) var(--ease-out);
	}

	.explore nav a:hover {
		border-color: var(--color-gold);
		background: var(--color-night-soft);
		transform: translateY(calc(var(--border-medium) * -1));
	}

	.explore span {
		color: var(--color-text-muted);
		font-size: var(--text-small);
		font-weight: 750;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	.explore strong {
		color: var(--color-gold);
		font-size: var(--text-card-title);
		line-height: 1.12;
	}
</style>
