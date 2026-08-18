<script lang="ts">
	interface Props {
		kicker: string;
		title: string;
	}

	let { kicker, title }: Props = $props();
</script>

<header class="section-heading">
	<p class="kicker">{kicker}</p>
	<h2>{title}</h2>
</header>

<style>
	.section-heading {
		border-top: 1px solid var(--color-border);
		padding-top: var(--spacing-lg);
		margin-bottom: var(--spacing-xl);
	}

	.kicker {
		margin: 0 0 var(--spacing-sm);
		font-size: var(--text-kicker);
		font-weight: 650;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-taco-gold);
	}

	h2 {
		margin: 0;
		font-size: var(--text-section);
		font-style: italic;
		font-weight: 640;
	}
</style>
