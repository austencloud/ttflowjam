<script lang="ts">
	import { MediaSpotlight } from "@austencloud/media-spotlight";
	import type { HeroOrigin, MediaItem } from "@austencloud/media-spotlight";
	import "@austencloud/media-spotlight/css/spotlight-tokens.css";
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import { siteDetails } from "$lib/data/site-details";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

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
	const orderedMedia = $derived(
		[...data.media].sort((a, b) => {
			const aRank = featured.get(a.id) ?? Number.POSITIVE_INFINITY;
			const bRank = featured.get(b.id) ?? Number.POSITIVE_INFINITY;
			return aRank - bRank;
		})
	);
	const years = $derived([...new Set(data.media.map((media) => media.year))].sort((a, b) => b - a));
	const yearCounts = $derived(
		new Map(years.map((year) => [year, data.media.filter((media) => media.year === year).length]))
	);
	const BATCH_SIZE = 60;

	let open = $state(false);
	let currentIndex = $state(0);
	let heroOrigin = $state<HeroOrigin | null>(null);
	let selectedYear = $state<number | "all">("all");
	let visibleCount = $state(BATCH_SIZE);
	let loadMoreButton: HTMLButtonElement | null = $state(null);

	const visibleMedia = $derived(
		selectedYear === "all"
			? orderedMedia
			: orderedMedia.filter((media) => media.year === selectedYear)
	);
	const items: MediaItem[] = $derived(
		visibleMedia.map((media, index) => {
			const video = media.type === "video";
			const fullUrl = `/gallery/media/full/${media.id}.webp`;
			const previewUrl = `/gallery/media/preview/${media.id}.webp`;
			const thumbnailUrl = `/gallery/media/thumb/${media.id}.webp`;
			return {
				id: media.id,
				type: video ? "video" : "image",
				url: video ? `/gallery/media/video/${media.id}.mp4` : fullUrl,
				thumbnailUrl,
				previewUrl,
				srcset: video ? undefined : `${thumbnailUrl} 640w, ${previewUrl} 1280w, ${fullUrl} 2048w`,
				sizes: video ? undefined : "100vw",
				width: media.w,
				height: media.h,
				alt: `Taco Tuesday Flow Jam ${video ? "video" : "photo"} ${index + 1} from ${media.year}`,
			};
		})
	);
	const renderedItems = $derived(items.slice(0, visibleCount));
	const hasMore = $derived(renderedItems.length < items.length);

	$effect(() => {
		if (!loadMoreButton || !hasMore) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					loadMore();
				}
			},
			{ rootMargin: "600px 0px" }
		);
		observer.observe(loadMoreButton);
		return () => observer.disconnect();
	});

	function showYear(year: number | "all") {
		selectedYear = year;
		visibleCount = BATCH_SIZE;
		currentIndex = 0;
		heroOrigin = null;
		open = false;
	}

	function handleYearChange(event: Event) {
		const value = (event.currentTarget as HTMLSelectElement).value;
		showYear(value === "all" ? "all" : Number(value));
	}

	function loadMore() {
		visibleCount = Math.min(items.length, visibleCount + BATCH_SIZE);
	}

	function openAt(index: number, event: MouseEvent) {
		const item = items[index];
		if (!item) return;
		heroOrigin = {
			rect: (event.currentTarget as HTMLElement).getBoundingClientRect(),
			thumbnailUrl: item.thumbnailUrl,
			previewUrl: item.previewUrl,
		};
		currentIndex = index;
		open = true;
	}
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
		<div class="header-actions">
			<ActionLink href={siteDetails.albumUrl} external>Add photos</ActionLink>
			<ActionLink href="/gallery/manage" tone="outline">Organizers</ActionLink>
		</div>
	</header>

	<div class="gallery-tools">
		<label class="year-control">
			<span>Year</span>
			<span class="select-shell">
				<select value={selectedYear} onchange={handleYearChange}>
					<option value="all">All years ({data.media.length})</option>
					{#each years as year}
						<option value={year}>{year} ({yearCounts.get(year)})</option>
					{/each}
				</select>
				<svg viewBox="0 0 20 20" aria-hidden="true">
					<path d="m5 7.5 5 5 5-5" />
				</svg>
			</span>
		</label>
		<output aria-live="polite">
			{items.length}
			{items.length === 1 ? "memory" : "memories"}
		</output>
	</div>

	<ul class:single={items.length === 1} class="grid" aria-label="Taco Tuesday memories">
		{#each renderedItems as item, index (item.id)}
			<li>
				<button class="cell" onclick={(event) => openAt(index, event)} aria-label="View {item.alt}">
					<img
						src={item.thumbnailUrl}
						alt=""
						width={item.width}
						height={item.height}
						loading={index < 12 ? "eager" : "lazy"}
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
		{/each}
	</ul>

	{#if hasMore}
		<div class="more">
			<button bind:this={loadMoreButton} type="button" onclick={loadMore}>
				Show more
				<span aria-hidden="true">{renderedItems.length} / {items.length}</span>
			</button>
		</div>
	{/if}
</div>

<div class="spotlight-theme">
	<MediaSpotlight
		{items}
		bind:currentIndex
		bind:open
		{heroOrigin}
		config={{
			loop: true,
			autoplayVideo: false,
			chromeTimeout: 0,
			mediaPadding: 20,
			showFilmstrip: true,
			showArrows: true,
		}}
		callbacks={{
			onclose: () => {
				heroOrigin = null;
			},
		}}
	/>
</div>

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

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-3);
	}

	.gallery-tools {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-4);
		margin-bottom: var(--space-5);
		padding-bottom: var(--space-4);
		border-bottom: var(--border-thin) solid var(--theme-stroke);
	}

	.year-control {
		display: grid;
		gap: var(--space-2);
		color: var(--color-text-muted);
		font-size: var(--font-size-min);
		font-weight: 780;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	.select-shell {
		display: grid;
		position: relative;
		grid-template-areas: "control";
		align-items: center;
		width: min(18rem, calc(100vw - (var(--page-gutter) * 2)));
	}

	select,
	.select-shell svg {
		grid-area: control;
	}

	select {
		width: 100%;
		min-height: var(--min-touch-target);
		padding: 0 var(--space-6) 0 var(--space-4);
		appearance: none;
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-medium);
		background: var(--color-night-raised);
		color: var(--color-text);
		font: inherit;
		font-size: var(--text-body);
		font-weight: 800;
		letter-spacing: 0;
		text-transform: none;
		cursor: pointer;
		transition:
			border-color var(--duration-fast) var(--ease-out),
			background var(--duration-fast) var(--ease-out);
	}

	select:hover,
	select:focus-visible {
		border-color: var(--theme-spark);
		background: var(--theme-card-hover-bg);
	}

	.select-shell svg {
		justify-self: end;
		width: 1.25rem;
		margin-right: var(--space-3);
		fill: none;
		stroke: var(--theme-spark);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2;
		pointer-events: none;
	}

	output {
		padding-bottom: calc((var(--min-touch-target) - 1.4em) / 2);
		color: var(--color-text-muted);
		font-size: var(--text-small);
		font-variant-numeric: tabular-nums;
		font-weight: 700;
		white-space: nowrap;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(var(--gallery-column), 100%), 1fr));
		gap: var(--space-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.grid.single {
		width: min(30rem, 100%);
		margin-inline: auto;
		grid-template-columns: 1fr;
	}

	.cell {
		display: block;
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		padding: 0;
		overflow: hidden;
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-large);
		background:
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--theme-led) 12%, transparent),
				transparent 60%
			),
			var(--color-night-panel);
		cursor: pointer;
		transition:
			border-color var(--duration-fast) var(--ease-out),
			transform var(--duration-fast) var(--ease-out),
			box-shadow var(--duration-fast) var(--ease-out);
	}

	.cell:hover {
		border-color: var(--theme-spark);
		box-shadow: 0 0 1.2rem color-mix(in srgb, var(--theme-selection) 18%, transparent);
		transform: translateY(-2px);
	}

	.cell:focus-visible {
		outline: var(--border-medium) solid var(--theme-spark);
		outline-offset: 3px;
	}

	.cell img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--duration-normal) var(--ease-out);
	}

	.cell:hover img {
		transform: scale(1.025);
	}

	.play-badge {
		display: grid;
		position: absolute;
		right: var(--space-3);
		bottom: var(--space-3);
		width: 2.75rem;
		height: 2.75rem;
		place-items: center;
		border: var(--border-medium) solid var(--theme-selection);
		border-radius: var(--radius-round);
		background: var(--color-photo-scrim);
		color: var(--theme-selection);
		box-shadow: 0 0 1rem color-mix(in srgb, var(--theme-selection) 28%, transparent);
	}

	.play-badge svg {
		width: 1.45rem;
		height: 1.45rem;
		fill: currentColor;
	}

	.more {
		display: grid;
		place-items: center;
		min-height: 8rem;
	}

	.more button {
		display: inline-flex;
		min-height: var(--min-touch-target);
		align-items: center;
		gap: var(--space-3);
		padding-inline: var(--space-5);
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-medium);
		background: var(--color-night-raised);
		color: var(--color-text);
		font-size: var(--text-body);
		font-weight: 800;
		cursor: pointer;
		transition:
			border-color var(--duration-fast) var(--ease-out),
			background var(--duration-fast) var(--ease-out);
	}

	.more button:hover,
	.more button:focus-visible {
		border-color: var(--theme-spark);
		background: var(--theme-card-hover-bg);
	}

	.more span {
		color: var(--color-text-muted);
		font-size: var(--font-size-min);
		font-variant-numeric: tabular-nums;
	}

	.spotlight-theme {
		--spotlight-backdrop: #07070d;
		--spotlight-arrow-size: clamp(48px, 2.8vw, 72px);
		--spotlight-arrow-size-mobile: 48px;
		--spotlight-arrow-bg: color-mix(in srgb, var(--color-night-panel) 88%, transparent);
		--spotlight-arrow-bg-hover: color-mix(in srgb, var(--theme-led) 28%, var(--color-night-panel));
		--spotlight-arrow-color: var(--theme-selection);
		--spotlight-close-bg: color-mix(in srgb, var(--color-night-panel) 88%, transparent);
		--spotlight-close-color: var(--color-text);
		--spotlight-close-size: clamp(48px, 2.5vw, 68px);
		--spotlight-counter-bg: color-mix(in srgb, var(--color-night-panel) 88%, transparent);
		--spotlight-counter-color: var(--color-text);
		--spotlight-filmstrip-active-border: var(--theme-selection);
		--spotlight-filmstrip-height: clamp(80px, 4.5vw, 120px);
		--spotlight-filmstrip-thumb-size: clamp(60px, 3.2vw, 92px);
		--spotlight-error-bg: var(--color-night-panel);
		--spotlight-error-color: var(--color-text);
	}

	@media (max-width: 40rem) {
		.page {
			padding-top: var(--space-5);
		}

		header {
			margin-bottom: var(--space-5);
		}

		.gallery-tools {
			align-items: stretch;
			flex-direction: column;
			gap: var(--space-2);
		}

		.select-shell {
			width: 100%;
		}

		output {
			padding-bottom: 0;
		}

		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--space-2);
		}

		.cell {
			border-radius: var(--radius-medium);
		}

		.play-badge {
			right: var(--space-2);
			bottom: var(--space-2);
			width: 2.5rem;
			height: 2.5rem;
		}

		.spotlight-theme {
			--spotlight-filmstrip-height: 68px;
			--spotlight-filmstrip-thumb-size: 48px;
			--spotlight-chrome-padding-mobile: 10px;
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
	}

	@media (prefers-reduced-motion: reduce) {
		.cell,
		.cell img,
		select,
		.more button {
			transition: none;
		}

		.cell:hover,
		.cell:hover img {
			transform: none;
		}
	}
</style>
