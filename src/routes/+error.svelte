<script lang="ts">
	import { page } from "$app/state";
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
</script>

<PageMeta
	title="Page not found"
	description="That Taco Tuesday Flow Jam page could not be found."
	path={page.url.pathname}
/>

<section>
	<p class="code">{page.status}</p>
	<h1>Page not found</h1>
	<p>{page.error?.message ?? "The requested page could not be found."}</p>
	<div>
		<ActionLink href="/">Back to the jam page</ActionLink>
	</div>
</section>

<style>
	section {
		width: var(--shell-width);
		min-height: var(--status-reserve);
		margin-inline: auto;
		padding-block: var(--section-gap);
	}

	.code {
		margin-bottom: var(--space-3);
		color: var(--color-red);
		font-size: var(--text-small);
		font-weight: 850;
		letter-spacing: var(--tracking-label);
	}

	h1 {
		max-width: var(--reading-width);
		margin-bottom: var(--space-5);
		font-size: var(--text-page);
		font-weight: 900;
	}

	section > p:not(.code) {
		max-width: var(--reading-width);
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}

	section > div {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
