<script lang="ts">
	import "@fontsource-variable/inter";
	import "@fontsource-variable/fraunces/full.css";
	import "@fontsource-variable/fraunces/full-italic.css";
	import "../app.css";
	import type { Snippet } from "svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import JamClosingPanel from "$lib/components/JamClosingPanel.svelte";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#091321" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": "Taco Tuesday Flow Jam",
			"url": "https://ttflowjam.pages.dev",
			"description": "A free weekly flow arts gathering at Palmer Square Park in Chicago, Tuesdays April through October.",
			"sameAs": [
				"https://www.facebook.com/flowtaco",
				"https://www.instagram.com/flowtaco",
				"https://photos.app.goo.gl/uNgZT4Zz6EBixmby7"
			],
			"location": {
				"@type": "Place",
				"name": "Palmer Square Park",
				"address": {
					"@type": "PostalAddress",
					"addressLocality": "Chicago",
					"addressRegion": "IL",
					"addressCountry": "US"
				}
			}
		}
	</script>
</svelte:head>

<Header />
<main id="content">
	{@render children()}
</main>
<JamClosingPanel />
<Footer />

<style>
	main {
		min-height: 60vh;
	}
</style>
