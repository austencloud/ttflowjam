<script lang="ts">
	import GlassCard from "$lib/components/GlassCard.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";

	const events = [
		{
			name: "Chicago Juggling Club",
			when: "Mondays 6:45–8:45 PM & Thursdays 7–9 PM",
			where:
				"Mon: Jefferson Park Fieldhouse, 4822 N Long Ave · Thu: Cirques Experience Gymnasium, 5944 N Magnolia Ave",
			note: "$5 suggested donation. Closes for holidays, so check before attending.",
			href: "https://jugglingedge.com/club.php?ClubID=1362",
		},
		{
			name: "Chicago Full Moon Jam",
			when: "Full-moon nights, summer season",
			where: "Foster Avenue Beach area. Check their site for dates.",
			note: "Fire spinning under the full moon with live drumming. A Chicago institution.",
			href: "https://fullmoonjam.org",
		},
		{
			name: "Midwest Flow Fest",
			when: "Annually in September",
			where: "Chicago parks. Location varies by year.",
			note: "A weekend of workshops and jams. Free to attend; workshop passes extra.",
			href: "https://www.flowfests.com/festivals/midwest-flow-fest/",
		},
	];
</script>

<svelte:head>
	<title>Other Events · Taco Tuesday Flow Jam</title>
	<meta
		name="description"
		content="Other Chicago flow arts and juggling gatherings: Chicago Juggling Club, the Full Moon Jam, Midwest Flow Fest, and more."
	/>
</svelte:head>

<div class="page shell">
	<SectionHeading kicker="Beyond Tuesday" title="More flow around Chicago" />
	<p class="lede">
		Can't wait a whole week? Neither can we. Here's where Chicago flows on the other six days.
		Details drift, so check the source link before trekking across town.
	</p>

	<div class="grid">
		{#each events as event (event.name)}
			<div class="reveal">
				<GlassCard>
					<h3>{event.name}</h3>
					<p class="when">{event.when}</p>
					<p class="where">{event.where}</p>
					<p class="note">{event.note}</p>
					<a href={event.href} rel="external">Details →</a>
				</GlassCard>
			</div>
		{/each}
	</div>

	<p class="suggest">
		Know another Chicago flow gathering that belongs here? Tell us in
		<a href="https://www.facebook.com/groups/257085130465999/" rel="external">TacoCat's Circus</a>.
	</p>
</div>

<style>
	.page {
		padding-top: var(--spacing-2xl);
	}

	.lede {
		font-size: var(--text-lede);
		color: var(--color-text-secondary);
		max-width: 60ch;
		margin-bottom: var(--spacing-xl);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
		gap: var(--spacing-lg);
	}

	h3 {
		margin: 0 0 var(--spacing-xs);
		font-style: italic;
		color: var(--color-taco-gold);
	}

	.when {
		margin: 0;
		font-weight: 650;
	}

	.where {
		margin: var(--spacing-xs) 0;
		color: var(--color-text-secondary);
		font-size: var(--font-size-min);
	}

	.note {
		color: var(--color-text-muted);
		font-size: var(--font-size-min);
	}

	.grid a {
		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
		color: var(--color-taco-gold);
		font-weight: 650;
		text-decoration: none;
	}

	.grid a:hover {
		text-decoration: underline;
	}

	.suggest {
		margin-top: var(--spacing-xl);
		color: var(--color-text-secondary);
	}

	.suggest a {
		color: var(--color-taco-gold);
	}
</style>
