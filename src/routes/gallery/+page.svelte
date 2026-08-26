<script lang="ts">
	import { MediaSpotlight } from "@austencloud/media-spotlight";
	import type { HeroOrigin, MediaItem } from "@austencloud/media-spotlight";
	import "@austencloud/media-spotlight/css/spotlight-tokens.css";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import manifest from "$lib/data/gallery-manifest.json";

	const items: MediaItem[] = manifest.map((photo, i) => ({
		id: photo.id,
		type: "image",
		url: `/gallery/media/full/${photo.id}.webp`,
		thumbnailUrl: `/gallery/media/thumb/${photo.id}.webp`,
		width: photo.w,
		height: photo.h,
		alt: `Photo ${i + 1} from the Taco Tuesday Flow Jam community album`,
	}));

	let open = $state(false);
	let currentIndex = $state(0);
	let heroOrigin = $state<HeroOrigin | null>(null);

	function openAt(index: number, event: MouseEvent) {
		const item = items[index];
		if (!item) return;
		heroOrigin = {
			rect: (event.currentTarget as HTMLElement).getBoundingClientRect(),
			thumbnailUrl: item.thumbnailUrl,
		};
		currentIndex = index;
		open = true;
	}
</script>

<svelte:head>
	<title>Gallery · Taco Tuesday Flow Jam</title>
	<meta
		name="description"
		content="Photos from the Taco Tuesday Flow Jam community album. Nine years of Tuesdays at Palmer Square Park."
	/>
</svelte:head>

<div class="page shell">
	<SectionHeading kicker="The community album" title="A pile of Tuesdays" />
	<p class="lede">
		{items.length} photos from the shared album, newest jams and ancient history alike. Took some
		shots at the park? <a href="https://photos.app.goo.gl/uNgZT4Zz6EBixmby7" rel="external"
			>Add them to the album</a
		> and they'll land here.
	</p>

	<ul class="grid">
		{#each items as item, i (item.id)}
			<li>
				<button class="cell" onclick={(e) => openAt(i, e)} aria-label="View {item.alt}">
					<img
						src={item.thumbnailUrl}
						alt=""
						loading={i < 12 ? "eager" : "lazy"}
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
		padding-top: var(--spacing-2xl);
	}

	.lede {
		color: var(--color-text-secondary);
		max-width: 60ch;
		margin-bottom: var(--spacing-xl);
	}

	.lede a {
		color: var(--color-taco-gold);
		text-decoration-color: oklch(0.75 0.13 75 / 0.4);
		text-underline-offset: 3px;
	}

	.lede a:hover {
		text-decoration-color: var(--color-taco-gold);
	}

	/* Column counts are pinned per tier rather than auto-filled. The previous
	   `minmax(min(11rem, 44vw), 1fr)` floor measured the viewport, but the grid
	   only owns ~79% of it, so two 44vw tracks missed fitting by a single
	   gutter and the whole gallery collapsed to one column on a phone:
	   217 rows, 67,167px of document, 100 screens of scroll. */
	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--spacing-sm);
	}

	@media (min-width: 30rem) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 45rem) {
		.grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (min-width: 64rem) {
		.grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}

	.cell {
		display: block;
		width: 100%;
		aspect-ratio: 1;
		padding: 0;
		border: 1px solid var(--glass-border);
		background: var(--glass-bg);
		cursor: pointer;
		border-radius: var(--radius-md);
		overflow: hidden;
		transition:
			transform var(--transition-fast),
			border-color var(--transition-fast);
	}

	.cell:hover {
		transform: translateY(var(--hover-lift));
		border-color: var(--glass-border-hover);
	}

	.cell img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
</style>
