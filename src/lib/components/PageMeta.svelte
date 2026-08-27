<script lang="ts">
	import { siteDetails } from "$lib/data/site-details";

	interface Props {
		title: string;
		description: string;
		path: string;
		home?: boolean;
	}

	let { title, description, path, home = false }: Props = $props();

	const fullTitle = $derived(home ? title : `${title} · ${siteDetails.name}`);
	const canonical = $derived(`${siteDetails.canonicalUrl}${path}`);
	const shareImage = `${siteDetails.canonicalUrl}/media/park-noticeboard/share-card.webp`;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteDetails.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={shareImage} />
	<meta
		property="og:image:alt"
		content="Taco Tuesday Flow Jam community members gathered with hoops and juggling props at Palmer Square Park"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={shareImage} />
</svelte:head>
