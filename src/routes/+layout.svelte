<script lang="ts">
	import "../app.css";
	import type { Snippet } from "svelte";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<Header />
<main>
	{@render children()}
</main>
<Footer />

<style>
	main {
		max-width: 72rem;
		margin: 0 auto;
		padding: var(--spacing-lg);
		min-height: 60vh;
	}
</style>
