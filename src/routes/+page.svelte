<script lang="ts">
	import { jamStatus } from "$lib/services/jam-status";

	const status = jamStatus(new Date());

	const headline = {
		"on-now": "It's ON right now! 🔥",
		today: "It's on TONIGHT! 🌮",
		upcoming: "Next jam:",
		"off-season": "See you in spring! First jam:",
	}[status.state];

	const nextJamLabel = status.nextJam.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});
</script>

<svelte:head>
	<title>Taco Tuesday Flow Jam — Chicago</title>
	<meta
		name="description"
		content="A weekly celebration of flow arts, food, and community. Tuesdays 4ish-10ish, April-October, Palmer Square Park, Chicago."
	/>
</svelte:head>

<section class="hero">
	<h1>Taco Tuesday Flow Jam</h1>
	<p class="tagline">A weekly celebration of flow arts, food, and community. Come play!</p>
	<p class="status">
		{headline}
		{#if status.state !== "on-now" && status.state !== "today"}
			<strong>{nextJamLabel}</strong>
		{/if}
	</p>
	<p class="where">Tuesdays 4ish–10ish · Palmer Square Park, 2200 N Kedzie Blvd</p>
</section>

<style>
	.hero {
		text-align: center;
		padding: var(--spacing-2xl) 0;
	}

	h1 {
		font-size: clamp(2rem, 6vw, 3.5rem);
		background: var(--gradient-fiesta);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
		margin: 0;
	}

	.tagline {
		font-size: 1.15rem;
		color: var(--color-text-secondary);
	}

	.status {
		font-size: 1.4rem;
		margin: var(--spacing-xl) 0 var(--spacing-sm);
	}

	.where {
		color: var(--color-text-muted);
	}
</style>
