<script lang="ts">
	import { MediaSpotlight } from "@austencloud/media-spotlight";
	import type { HeroOrigin, MediaItem } from "@austencloud/media-spotlight";
	import "@austencloud/media-spotlight/css/spotlight-tokens.css";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import { siteDetails } from "$lib/data/site-details";
	import manifest from "$lib/data/gallery-manifest.json";

	const featuredIds = [
		"410c464b57fc4443",
		"c63681bfb362f3ae",
		"a3257e248fa8ce95",
		"b6ba6a5d51b7617c",
		"5e95c6efa767302e",
		"fc1ef1a530b532e6",
		"2f6bb21f7b1ce937",
		"c219153c7adadbe6",
		"68a80875231ca161",
		"c9caf199a27bd29f",
	];

	const featured = new Map(featuredIds.map((id, index) => [id, index]));
	const orderedPhotos = [...manifest].sort((a, b) => {
		const aRank = featured.get(a.id) ?? Number.POSITIVE_INFINITY;
		const bRank = featured.get(b.id) ?? Number.POSITIVE_INFINITY;
		return aRank - bRank;
	});

	const items: MediaItem[] = orderedPhotos.map((photo, index) => ({
		id: photo.id,
		type: "image",
		url: `/gallery/media/full/${photo.id}.webp`,
		thumbnailUrl: `/gallery/media/thumb/${photo.id}.webp`,
		width: photo.w,
		height: photo.h,
		alt: `Photo ${index + 1} from the Taco Tuesday Flow Jam community album`,
	}));

	let open = $state(false);
	let currentIndex = $state(0);
	let heroOrigin = $state<HeroOrigin | null>(null);

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
</script>

<PageMeta
	title="Gallery"
	description="Privacy-reviewed photos from Taco Tuesday Flow Jam at Palmer Square Park."
	path="/gallery"
/>

<div class="page">
	<header>
		<p class="kicker">Community album</p>
		<h1>Gallery</h1>
		<p class="lede">
			{items.length} privacy-reviewed photos from the shared album. Dates are not shown because the source
			dates were not reliable.
		</p>
		<a href={siteDetails.albumUrl} rel="external">Add your own photos to the shared album</a>
	</header>

	<ul class="grid">
		{#each items as item, index (item.id)}
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
				</button>
			</li>
		{/each}
	</ul>
</div>

<MediaSpotlight
	{items}
	bind:currentIndex
	bind:open
	{heroOrigin}
	config={{ loop: true, chromeTimeout: 3000, mediaPadding: 24 }}
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
		max-width: var(--reading-width);
		margin-bottom: var(--space-7);
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

	.lede {
		margin-bottom: var(--space-4);
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}

	header a {
		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
		color: var(--color-gold);
		font-size: var(--text-small);
		font-weight: 780;
		text-underline-offset: var(--space-1);
	}

	header a:hover {
		color: var(--color-text);
	}

	.grid {
		margin: 0;
		padding: 0;
		column-gap: var(--space-3);
		column-width: var(--gallery-column);
		list-style: none;
	}

	.grid li {
		break-inside: avoid;
		margin-bottom: var(--space-3);
	}

	.cell {
		display: block;
		width: 100%;
		padding: 0;
		overflow: hidden;
		border: var(--border-medium) solid var(--color-line);
		border-radius: var(--radius-small);
		background: var(--color-night-panel);
		cursor: pointer;
		transition:
			border-color var(--duration-fast) var(--ease-out),
			transform var(--duration-fast) var(--ease-out);
	}

	.cell:hover {
		border-color: var(--color-gold);
		transform: translateY(calc(var(--border-medium) * -1));
	}

	.cell img {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
