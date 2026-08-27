<script lang="ts">
	interface Props {
		kicker: string;
		title: string;
		description?: string;
	}

	let { kicker, title, description }: Props = $props();
</script>

<header>
	<p class="kicker">{kicker}</p>
	<h2>{title}</h2>
	{#if description}
		<p class="description">{description}</p>
	{/if}
</header>

<style>
	header {
		max-width: var(--reading-width);
		margin-bottom: var(--space-7);
		padding-top: var(--space-5);
		border-top: var(--border-heavy) solid var(--color-red);
	}

	.kicker {
		margin-bottom: var(--space-3);
		color: var(--color-gold);
		font-size: var(--text-small);
		font-weight: 800;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	h2 {
		margin-bottom: 0;
		font-size: var(--text-section);
		font-weight: 850;
	}

	.description {
		max-width: var(--reading-width);
		margin-top: var(--space-4);
		margin-bottom: 0;
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}
</style>
