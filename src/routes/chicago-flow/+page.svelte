<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { siteDetails } from "$lib/data/site-details";

	const events = [
		{
			name: "Chicago Full Moon Jam",
			when: "Summer full moons · sunset–10 PM",
			where: "Chicago lakefront locations",
			copy: "Free, family-friendly fire performances and drum circles. The organizer posts each location and date.",
			href: "https://www.fullmoonjam.org/",
		},
		{
			name: "Flow Fest Chicago",
			when: "Annual summer festival",
			where: "2026: Ping Tom Memorial Park",
			copy: "A public day of flow arts workshops, vendors, jams, and performances. Check the current event page before traveling.",
			href: "https://flowfests.com/chicago-2026/",
		},
		{
			name: "TacoCat's Circus",
			when: "Community posts throughout the year",
			where: "Facebook group",
			copy: "Local people share workshops, pop-up jams, prop questions, and event notices here.",
			href: siteDetails.communityUrl,
		},
	];
</script>

<PageMeta
	title="More Chicago flow"
	description="Current organizer links for Chicago flow arts gatherings beyond Taco Tuesday, including Full Moon Jam and Flow Fest Chicago."
	path="/chicago-flow"
/>

<div class="page">
	<header>
		<p class="kicker">The other six days</p>
		<h1>More flow around Chicago.</h1>
		<p>
			These are organizer links, not copied calendars. Open the source before crossing the city.
			Locations and dates can change.
		</p>
	</header>

	<section>
		<SectionHeading kicker="Current sources" title="Start with the people running it" />
		<div class="grid">
			{#each events as event (event.name)}
				<article>
					<p class="when">{event.when}</p>
					<h2>{event.name}</h2>
					<p class="where">{event.where}</p>
					<p>{event.copy}</p>
					<ActionLink href={event.href} tone="quiet" external>Open organizer page</ActionLink>
				</article>
			{/each}
		</div>
	</section>
</div>

<style>
	.page {
		width: var(--shell-width);
		margin-inline: auto;
		padding-top: var(--space-7);
	}

	header {
		max-width: var(--reading-width);
		padding-bottom: var(--section-gap);
	}

	.kicker,
	.when {
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

	header > p:last-child {
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--card-min), 1fr));
		gap: var(--space-4);
	}

	article {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: var(--space-5);
		border: var(--border-thin) solid var(--color-line);
		background: var(--color-night-raised);
	}

	article h2 {
		margin-bottom: var(--space-3);
		font-size: var(--text-card-title);
		font-weight: 850;
		letter-spacing: var(--tracking-card);
		line-height: 1.08;
	}

	.where {
		color: var(--color-red);
		font-size: var(--text-small);
		font-weight: 750;
	}

	article > p:not(.when, .where) {
		flex: 1;
		color: var(--color-text-soft);
	}
</style>
