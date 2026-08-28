<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { siteDetails, tacoNights2026 } from "$lib/data/site-details";
	import { civilDateToIso, jamStatus } from "$lib/services/jam-status";

	const today = civilDateToIso(jamStatus(new Date()).today);
	const nextTaco = tacoNights2026.find((night) => night.iso >= today);
</script>

<PageMeta
	title="Taco nights"
	description="The 2026 Taco Tuesday Flow Jam taco schedule and taco fund information."
	path="/tacos"
/>

<div class="page">
	<header class="intro">
		<p class="kicker">2026</p>
		<h1>Taco night schedule</h1>
		<p>The flow jam runs every Tuesday in season. Tacos are served only on the dates below.</p>
	</header>

	<div class="lead-grid">
		<figure>
			<picture>
				<source
					srcset="/media/park-noticeboard/tacos-720.webp 720w, /media/park-noticeboard/tacos-1600.webp 1600w"
				/>
				<img
					src="/media/park-noticeboard/tacos-720.webp"
					alt="Three Taco Tuesday regulars preparing food at a crowded outdoor table in Palmer Square Park"
					width="1600"
					height="1066"
					fetchpriority="high"
				/>
			</picture>
			<figcaption>Food preparation at Palmer Square Park</figcaption>
		</figure>

		<aside aria-labelledby="next-taco-title">
			<p class="label">2026 taco schedule</p>
			{#if nextTaco}
				<h2 id="next-taco-title">Next tacos: {nextTaco.label}</h2>
				<p>Food starts around 6ish and continues while supplies last.</p>
			{:else}
				<h2 id="next-taco-title">The published 2026 taco dates have passed.</h2>
				<p>Watch Facebook for the next posted cookout.</p>
			{/if}
			<p class="caveat">The flow jam keeps its regular Tuesday schedule.</p>
			<div class="actions">
				<ActionLink href={siteDetails.paypalUrl} tone="ink" external
					>Contribute to the taco fund</ActionLink
				>
				<ActionLink href={siteDetails.facebookUrl} tone="outline" external
					>Check Facebook</ActionLink
				>
			</div>
		</aside>
	</div>

	<section class="schedule">
		<SectionHeading kicker="Published schedule" title="2026 taco nights" />
		<ol>
			{#each tacoNights2026 as night (night.iso)}
				<li class:past={night.iso < today} class:next={night.iso === nextTaco?.iso}>
					<time datetime={night.iso}>{night.label}</time>
					<span>
						{night.iso < today ? "Past" : night.iso === nextTaco?.iso ? "Next" : "Upcoming"}
					</span>
				</li>
			{/each}
		</ol>
	</section>

	<section class="how">
		<SectionHeading kicker="Taco nights" title="Serving, contributions, and cleanup" />
		<div class="cards">
			<article>
				<h2>Serving</h2>
				<p>Food starts around 6ish and continues while supplies last.</p>
			</article>
			<article>
				<h2>Contribution</h2>
				<p>The contribution is $5 if you eat. PayPal contributions support ingredient purchases.</p>
			</article>
			<article>
				<h2>Cleanup</h2>
				<p>Pack out plates, food scraps, and gear.</p>
			</article>
		</div>
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

	.intro > p:last-child {
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}

	.lead-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--feature-min), 1fr));
		gap: var(--space-7);
		align-items: center;
	}

	figure {
		margin: 0;
		border: var(--border-heavy) solid var(--color-paper);
		background: var(--color-paper);
		box-shadow: var(--shadow-photo);
	}

	figure img {
		display: block;
		width: 100%;
	}

	figcaption {
		padding: var(--space-3) var(--space-4);
		background: var(--color-paper);
		color: var(--color-paper-ink);
		font-size: var(--text-small);
		font-weight: 750;
	}

	.lead-grid aside {
		padding: var(--space-6);
		border: var(--border-heavy) solid var(--color-paper-ink);
		background-color: var(--color-paper);
		background-image: var(--texture-paper);
		box-shadow: var(--shadow-panel);
		color: var(--color-paper-ink);
	}

	.lead-grid .label {
		color: var(--color-red-deep);
	}

	.lead-grid h2 {
		margin-bottom: var(--space-4);
		font-size: var(--text-section);
		font-weight: 880;
	}

	.caveat {
		padding-top: var(--space-4);
		border-top: var(--border-thin) solid var(--color-paper-ink);
		font-weight: 720;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-5);
	}

	.actions :global(.outline) {
		border-color: var(--color-paper-ink);
		background: transparent;
		color: var(--color-paper-ink);
	}

	.schedule,
	.how {
		margin-top: var(--section-gap);
	}

	ol {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--card-min), 1fr));
		gap: var(--space-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	ol li {
		display: grid;
		min-height: var(--status-reserve);
		align-content: space-between;
		padding: var(--space-5);
		border: var(--border-medium) solid var(--color-line);
		background: var(--color-night-panel);
	}

	ol li.past {
		color: var(--color-text-muted);
	}

	ol li.next {
		border-color: var(--color-gold);
		background: var(--color-paper);
		color: var(--color-paper-ink);
	}

	time {
		font-size: var(--text-section);
		font-weight: 880;
		letter-spacing: var(--tracking-tight);
		line-height: 1;
	}

	ol span {
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--card-min), 1fr));
		gap: var(--space-4);
	}

	.cards article {
		padding: var(--space-5);
		border-top: var(--border-heavy) solid var(--color-red);
		background: var(--color-night-raised);
	}

	.cards h2 {
		margin-bottom: var(--space-3);
		font-size: var(--text-card-title);
		font-weight: 820;
		letter-spacing: var(--tracking-card);
		line-height: 1.1;
	}

	.cards p {
		margin-bottom: 0;
		color: var(--color-text-soft);
	}
</style>
