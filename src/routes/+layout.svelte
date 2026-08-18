<script lang="ts">
	import "@fontsource-variable/inter";
	import "@fontsource-variable/fraunces/full.css";
	import "@fontsource-variable/fraunces/full-italic.css";
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
		min-height: 60vh;
	}
</style>
