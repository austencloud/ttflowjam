<script lang="ts">
	import { MediaSpotlight } from "@austencloud/media-spotlight";
	import type { HeroOrigin, MediaItem } from "@austencloud/media-spotlight";
	import "@austencloud/media-spotlight/css/spotlight-tokens.css";
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import { siteDetails } from "$lib/data/site-details";
	import manifest from "$lib/data/gallery-manifest.json";

	const featuredIds = [
		"38faa9921878369d",
		"213fea554433f162",
		"cefe3a03eb489f72",
		"e50b4fdc2f14e707",
		"78fbff5603c1d755",
		"0089c3b9b06270d6",
		"55540390e333005a",
		"16b76ae24543f891",
		"c2ed9019c79b19e2",
		"5df89b95173bdd9e",
	];

	const featured = new Map(featuredIds.map((id, index) => [id, index]));
	const orderedMedia = [...manifest].sort((a, b) => {
		const aRank = featured.get(a.id) ?? Number.POSITIVE_INFINITY;
		const bRank = featured.get(b.id) ?? Number.POSITIVE_INFINITY;
		return aRank - bRank;
	});
	const years = [...new Set(manifest.map((media) => media.year))].sort((a, b) => b - a);
	const yearCounts = new Map(
		years.map((year) => [year, manifest.filter((media) => media.year === year).length])
	);

	let open = $state(false);
	let currentIndex = $state(0);
	let heroOrigin = $state<HeroOrigin | null>(null);
	let selectedYear = $state<number | "all">("all");
	const visibleMedia = $derived(
		selectedYear === "all"
			? orderedMedia
			: orderedMedia.filter((media) => media.year === selectedYear)
	);
	function isVideo(media: { type?: string }) {
		return media.type === "video";
	}

	const items: MediaItem[] = $derived(
		visibleMedia.map((media, index) => ({
			id: media.id,
			type: isVideo(media) ? "video" : "image",
			url: isVideo(media)
				? `/gallery/media/video/${media.id}.mp4`
				: `/gallery/media/full/${media.id}.webp`,
			thumbnailUrl: `/gallery/media/thumb/${media.id}.webp`,
			width: media.w,
			height: media.h,
			alt: `Taco Tuesday Flow Jam ${isVideo(media) ? "video" : "photo"} ${index + 1} from ${media.year}`,
		}))
	);

	function showYear(year: number | "all") {
		selectedYear = year;
		currentIndex = 0;
		heroOrigin = null;
	}

	function openAt(index: number, event: MouseEvent) {
		const item = items[index];
		if (!item) {
			return;
		}

		heroOrigin = {
			rect: (event.currentTarget as HTMLElement).getBoundingClientRect(),
			thumbnailUrl: item.thumbnailUrl,
		};
		currentIndex = index;
		open = true;
	}

	const featuredCount = featuredIds.length;
</script>

<PageMeta
	title="Gallery"
	description="Photos from Taco Tuesday Flow Jam at Palmer Square Park."
	path="/gallery"
/>

<div class="page">
	<header>
		<p class="kicker">Community album</p>
		<h1>Gallery</h1>
		<ActionLink href={siteDetails.albumUrl} external>Add photos to the shared album</ActionLink>
	</header>

	<div class="year-filter" role="group" aria-label="Filter gallery by year">
		<button
			class:active={selectedYear === "all"}
			type="button"
			aria-pressed={selectedYear === "all"}
			onclick={() => showYear("all")}
		>
			All <span>{manifest.length}</span>
		</button>
		{#each years as year}
			<button
				class:active={selectedYear === year}
				type="button"
				aria-pressed={selectedYear === year}
				onclick={() => showYear(year)}
			>
				{year} <span>{yearCounts.get(year)}</span>
			</button>
		{/each}
	</div>

	{#snippet galleryItem(item: MediaItem, index: number)}
		<li>
			<button class="cell" onclick={(event) => openAt(index, event)} aria-label="View {item.alt}">
				<img
					src={item.thumbnailUrl}
					alt=""
					width={item.width}
					height={item.height}
					loading={index < 8 ? "eager" : "lazy"}
					decoding="async"
				/>
				{#if item.type === "video"}
					<span class="play-badge" aria-hidden="true">
						<svg viewBox="0 0 24 24">
							<path d="M8 5.5v13l10-6.5z" />
						</svg>
					</span>
				{/if}
			</button>
		</li>
	{/snippet}

	{#if selectedYear === "all"}
		<ul class="featured-grid" aria-label="Featured photos">
			{#each items.slice(0, featuredCount) as item, index (item.id)}
				{@render galleryItem(item, index)}
			{/each}
		</ul>
	{/if}

	<ul class:single={visibleMedia.length === 1} class="grid">
		{#each items.slice(selectedYear === "all" ? featuredCount : 0) as item, index (item.id)}
			{@render galleryItem(item, index + (selectedYear === "all" ? featuredCount : 0))}
		{/each}
	</ul>
</div>

<MediaSpotlight
	{items}
	bind:currentIndex
	bind:open
	{heroOrigin}
	config={{ loop: true, autoplayVideo: false, chromeTimeout: 3000, mediaPadding: 24 }}
	callbacks={{
		onclose: () => {
			heroOrigin = null;
		},
	}}
/>

<style>
	.page {
		width: var(--shell-width);
		margin-inline: auto;
		padding-top: var(--space-7);
	}

	header {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-bottom: var(--space-6);
		text-align: center;
	}

	.kicker {
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

	.year-filter {
		display: flex;
		gap: var(--space-2);
		margin-inline: calc(var(--page-gutter) * -1);
		margin-bottom: var(--space-7);
		padding-inline: var(--page-gutter);
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
		scroll-snap-type: inline proximity;
	}

	.year-filter button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		min-height: var(--min-touch-target);
		padding-inline: var(--space-4);
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-round);
		background: var(--color-night-raised);
		color: var(--color-text);
		font-size: var(--text-small);
		font-weight: 800;
		cursor: pointer;
		flex: 0 0 auto;
		scroll-snap-align: start;
		transition:
			background var(--duration-fast) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out),
			color var(--duration-fast) var(--ease-out);
	}

	.year-filter button:hover {
		border-color: var(--theme-accent);
		background: var(--theme-card-hover-bg);
	}

	.year-filter button.active {
		border-color: var(--color-paper);
		background: var(--color-paper);
		color: var(--color-paper-ink);
	}

	.year-filter span {
		display: inline-grid;
		min-width: 1.75rem;
		height: 1.75rem;
		place-items: center;
		padding-inline: var(--space-2);
		border-radius: var(--radius-round);
		background: var(--color-night-soft);
		color: var(--color-text);
		font-size: var(--font-size-min);
		line-height: 1;
	}

	.year-filter button.active span {
		background: var(--color-paper-ink);
	}

	.grid {
		margin: 0;
		padding: 0;
		column-gap: var(--space-3);
		column-width: var(--gallery-column);
		list-style: none;
	}

	.featured-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-3);
		margin: 0 0 var(--space-3);
		padding: 0;
		list-style: none;
	}

	.featured-grid li,
	.featured-grid .cell {
		min-width: 0;
		height: 100%;
	}

	.featured-grid img {
		height: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.grid.single {
		width: min(30rem, 100%);
		margin-inline: auto;
		column-count: 1;
		column-width: auto;
	}

	.grid li {
		break-inside: avoid;
		margin-bottom: var(--space-3);
	}

	.cell {
		display: block;
		position: relative;
		width: 100%;
		padding: 0;
		overflow: hidden;
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-large);
		background: var(--color-night-panel);
		cursor: pointer;
		transition: border-color var(--duration-fast) var(--ease-out);
	}

	.cell:hover {
		border-color: var(--theme-accent);
	}

	.cell img {
		display: block;
		width: 100%;
		height: auto;
	}

	.play-badge {
		display: grid;
		position: absolute;
		right: var(--space-3);
		bottom: var(--space-3);
		width: 2.75rem;
		height: 2.75rem;
		place-items: center;
		border: var(--border-medium) solid var(--color-paper);
		border-radius: var(--radius-round);
		background: var(--color-photo-scrim);
		color: var(--color-paper);
		box-shadow: 0 0.25rem 0.8rem var(--color-shadow);
	}

	.play-badge svg {
		width: 1.45rem;
		height: 1.45rem;
		fill: currentColor;
	}

	@media (min-width: 60rem) {
		.featured-grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}

		.year-filter {
			justify-content: center;
			flex-wrap: wrap;
			margin-inline: 0;
			padding-inline: 0;
			overflow: visible;
		}
	}

	@media (min-width: 45rem) and (max-height: 32rem) {
		.page {
			padding-top: var(--space-4);
		}

		header {
			margin-bottom: var(--space-4);
		}

		.kicker {
			margin-bottom: var(--space-1);
		}

		h1 {
			margin-bottom: var(--space-3);
			font-size: clamp(2.5rem, 11vh, var(--text-page));
		}

		.year-filter {
			margin-bottom: var(--space-4);
		}
	}
</style>
