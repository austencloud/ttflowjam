<script lang="ts">
	import { MediaSpotlight } from "@austencloud/media-spotlight";
	import type { HeroOrigin, MediaItem } from "@austencloud/media-spotlight";
	import "@austencloud/media-spotlight/css/spotlight-tokens.css";
	import { flip } from "svelte/animate";
	import { untrack } from "svelte";
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import { galleryMediaUrl } from "$lib/services/gallery-media-url";
	import type { PageData } from "./$types";

	type GalleryItem = PageData["media"][number];
	type ModerationAction = "hide" | "restore";
	type StatusFilter = "visible" | "hidden";

	interface Notice {
		mediaId: string;
		action: ModerationAction;
		message: string;
	}

	let { data }: { data: PageData } = $props();
	let media = $state<GalleryItem[]>(untrack(() => data.media));
	let statusFilter = $state<StatusFilter>("visible");
	let selectedYear = $state<number | "all">("all");
	let visibleCount = $state(120);
	let pendingIds = $state<Set<string>>(new Set());
	let notice = $state<Notice | null>(null);
	let requestError = $state("");
	let prefersReducedMotion = $state(false);
	let spotlightOpen = $state(false);
	let spotlightIndex = $state(0);
	let heroOrigin = $state<HeroOrigin | null>(null);

	const batchSize = 120;
	const listMotionDuration = 240;
	const years = $derived([...new Set(media.map((item) => item.year))].sort((a, b) => b - a));
	const visibleTotal = $derived(media.filter((item) => !item.moderation).length);
	const hiddenTotal = $derived(media.length - visibleTotal);
	const filteredMedia = $derived(
		media.filter((item) => {
			const matchesStatus = statusFilter === "hidden" ? Boolean(item.moderation) : !item.moderation;
			const matchesYear = selectedYear === "all" || item.year === selectedYear;
			return matchesStatus && matchesYear;
		})
	);
	const renderedMedia = $derived(filteredMedia.slice(0, visibleCount));
	const hasMore = $derived(renderedMedia.length < filteredMedia.length);
	const spotlightItems: MediaItem[] = $derived(
		filteredMedia.map((item, index) => {
			const video = item.type === "video";
			const thumbnailUrl = galleryMediaUrl(`/gallery/manage/media/thumb/${item.id}.webp`);
			const previewUrl = galleryMediaUrl(`/gallery/manage/media/preview/${item.id}.webp`);
			const fullUrl = galleryMediaUrl(`/gallery/manage/media/full/${item.id}.webp`);
			return {
				id: item.id,
				type: video ? "video" : "image",
				url: video ? galleryMediaUrl(`/gallery/manage/media/video/${item.id}.mp4`) : fullUrl,
				thumbnailUrl,
				previewUrl,
				srcset: video ? undefined : `${thumbnailUrl} 640w, ${previewUrl} 1280w, ${fullUrl} 2048w`,
				sizes: video ? undefined : "100vw",
				width: item.w,
				height: item.h,
				alt: `Taco Tuesday Flow Jam ${video ? "video" : "photo"} ${index + 1}`,
			};
		})
	);

	$effect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updateMotionPreference = () => (prefersReducedMotion = mediaQuery.matches);
		updateMotionPreference();
		mediaQuery.addEventListener("change", updateMotionPreference);
		return () => mediaQuery.removeEventListener("change", updateMotionPreference);
	});

	function setStatusFilter(filter: StatusFilter) {
		statusFilter = filter;
		visibleCount = batchSize;
		spotlightOpen = false;
	}

	function handleYearChange(event: Event) {
		const value = (event.currentTarget as HTMLSelectElement).value;
		selectedYear = value === "all" ? "all" : Number(value);
		visibleCount = batchSize;
		spotlightOpen = false;
	}

	function openAt(index: number, event: MouseEvent) {
		const item = spotlightItems[index];
		if (!item) return;
		heroOrigin = {
			rect: (event.currentTarget as HTMLElement).getBoundingClientRect(),
			thumbnailUrl: item.thumbnailUrl,
			previewUrl: item.previewUrl,
		};
		spotlightIndex = index;
		spotlightOpen = true;
	}

	function setPending(mediaId: string, pending: boolean) {
		const next = new Set(pendingIds);
		if (pending) next.add(mediaId);
		else next.delete(mediaId);
		pendingIds = next;
	}

	async function moderate(item: GalleryItem, action: ModerationAction) {
		if (pendingIds.has(item.id)) return;
		setPending(item.id, true);
		requestError = "";

		try {
			const response = await fetch("/gallery/manage/api", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ mediaId: item.id, action }),
			});
			if (!response.ok) throw new Error(await response.text());

			const result = (await response.json()) as { moderation: GalleryItem["moderation"] };
			media = media.map((candidate) =>
				candidate.id === item.id ? { ...candidate, moderation: result.moderation } : candidate
			);
			notice = {
				mediaId: item.id,
				action,
				message: action === "hide" ? "Hidden from the public gallery." : "Back in the gallery.",
			};
		} catch {
			requestError = "That change did not save. Try again.";
		} finally {
			setPending(item.id, false);
		}
	}

	async function undo() {
		if (!notice) return;
		const item = media.find((candidate) => candidate.id === notice?.mediaId);
		if (!item) return;
		const action = notice.action === "hide" ? "restore" : "hide";
		notice = null;
		await moderate(item, action);
	}
</script>

<PageMeta
	title="Manage gallery"
	description="Moderator controls for the Taco Tuesday Flow Jam gallery."
	path="/gallery/manage"
/>

<svelte:head><meta name="robots" content="noindex, nofollow" /></svelte:head>

<div class="page">
	<header class="page-header">
		<div>
			<p class="kicker">Gallery</p>
			<h1>Manage photos</h1>
			<p class="lede">
				Open anything for a closer look. Remove it from the public gallery when needed.
			</p>
		</div>
		<div class="account-actions">
			{#if data.moderator.role === "owner"}
				<ActionLink href="/gallery/manage/moderators" tone="outline">Moderators</ActionLink>
			{/if}
			<ActionLink href="/gallery" tone="outline">Public gallery</ActionLink>
		</div>
	</header>

	<section class="controls" aria-label="Gallery filters">
		<div class="status-filters" aria-label="Visibility" role="group">
			<button
				type="button"
				class:active={statusFilter === "visible"}
				aria-pressed={statusFilter === "visible"}
				onclick={() => setStatusFilter("visible")}
			>
				Visible <span>{visibleTotal}</span>
			</button>
			<button
				type="button"
				class:active={statusFilter === "hidden"}
				aria-pressed={statusFilter === "hidden"}
				onclick={() => setStatusFilter("hidden")}
			>
				Hidden <span>{hiddenTotal}</span>
			</button>
		</div>

		<label class="year-control">
			<span>Year</span>
			<select value={selectedYear} onchange={handleYearChange}>
				<option value="all">All years</option>
				{#each years as year}<option value={year}>{year}</option>{/each}
			</select>
		</label>
	</section>

	<div class="result-line">
		<p>{filteredMedia.length} {filteredMedia.length === 1 ? "item" : "items"}</p>
		<p class="error" aria-live="polite">{requestError}</p>
	</div>

	{#if filteredMedia.length === 0}
		<div class="empty">
			<p>{statusFilter === "hidden" ? "Nothing hidden." : "Nothing here."}</p>
		</div>
	{:else}
		<ul class="grid" aria-label="Gallery moderation items">
			{#each renderedMedia as item, index (item.id)}
				<li
					animate:flip={{ duration: prefersReducedMotion ? 0 : listMotionDuration }}
					class:hidden={Boolean(item.moderation)}
				>
					<button
						type="button"
						class="preview"
						onclick={(event) => openAt(index, event)}
						aria-label={`Open ${item.type === "video" ? "video" : "photo"}`}
					>
						<img
							src={galleryMediaUrl(`/gallery/manage/media/thumb/${item.id}.webp`)}
							alt=""
							width={item.w}
							height={item.h}
							loading="lazy"
							decoding="async"
						/>
					</button>
					<button
						type="button"
						class:restore={Boolean(item.moderation)}
						class="moderate-control"
						disabled={pendingIds.has(item.id)}
						aria-label={item.moderation ? "Restore to public gallery" : "Hide from public gallery"}
						title={item.moderation ? "Restore to gallery" : "Hide from gallery"}
						onclick={() => moderate(item, item.moderation ? "restore" : "hide")}
					>
						{#if item.moderation}
							<svg viewBox="0 0 24 24" aria-hidden="true"
								><path d="M4 7v5h5" /><path d="M5.5 11a7 7 0 1 1 1.9 6.8" /></svg
							>
						{:else}
							<svg viewBox="0 0 24 24" aria-hidden="true"
								><path d="M4 7h16" /><path d="m9 7 .7-2h4.6l.7 2" /><path
									d="m7 7 .8 13h8.4L17 7"
								/><path d="M10 11v5M14 11v5" /></svg
							>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if hasMore}
		<div class="more">
			<button type="button" onclick={() => (visibleCount += batchSize)}
				>Show more <span>{renderedMedia.length} / {filteredMedia.length}</span></button
			>
		</div>
	{/if}
</div>

<div class:shown={notice !== null} class="toast" role="status" aria-live="polite">
	<p>{notice?.message ?? ""}</p>
	<button type="button" disabled={!notice} onclick={undo}>Undo</button>
</div>

<div class="spotlight-theme">
	<MediaSpotlight
		items={spotlightItems}
		bind:currentIndex={spotlightIndex}
		bind:open={spotlightOpen}
		{heroOrigin}
		config={{
			loop: true,
			autoplayVideo: false,
			chromeTimeout: 0,
			mediaPadding: 20,
			showFilmstrip: true,
			showArrows: true,
		}}
		callbacks={{ onclose: () => (heroOrigin = null) }}
	/>
</div>

<style>
	.page {
		width: var(--shell-width);
		margin-inline: auto;
		padding-block: var(--space-7) var(--space-9);
	}
	.page-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-6);
		margin-bottom: var(--space-6);
	}
	.kicker {
		margin-bottom: var(--space-2);
		color: var(--theme-selection);
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}
	h1 {
		margin-bottom: var(--space-3);
		font-size: var(--text-section);
		font-weight: 900;
	}
	.lede {
		max-width: 55ch;
		margin-bottom: 0;
		color: var(--color-text-soft);
	}
	.account-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: end;
		gap: var(--space-2);
	}
	.controls {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-5);
		padding-bottom: var(--space-4);
		border-bottom: var(--border-thin) solid var(--theme-stroke);
	}
	.status-filters {
		display: flex;
		gap: var(--space-2);
	}
	.status-filters button,
	.more button {
		min-height: var(--min-touch-target);
		padding-inline: var(--space-4);
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-round);
		background: transparent;
		color: var(--color-text-soft);
		font-size: var(--text-small);
		font-weight: 800;
		cursor: pointer;
		transition:
			background var(--duration-fast) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out),
			color var(--duration-fast) var(--ease-out);
	}
	.status-filters button:hover,
	.status-filters button.active,
	.more button:hover {
		border-color: var(--theme-selection);
		background: var(--theme-card-hover-bg);
		color: var(--theme-text);
	}
	.status-filters span,
	.more span {
		margin-left: var(--space-2);
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}
	.year-control {
		display: grid;
		min-width: 11rem;
		gap: var(--space-2);
		color: var(--color-text-muted);
		font-size: var(--font-size-min);
		font-weight: 780;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}
	select {
		min-height: var(--min-touch-target);
		padding-inline: var(--space-3);
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-medium);
		background: var(--theme-card-bg);
		color: var(--theme-text);
		font-size: var(--text-body);
		font-weight: 760;
		letter-spacing: 0;
		text-transform: none;
	}
	.result-line {
		display: flex;
		min-height: 3.5rem;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		color: var(--color-text-muted);
		font-size: var(--text-small);
		font-variant-numeric: tabular-nums;
	}
	.result-line p {
		margin: 0;
	}
	.error {
		color: var(--semantic-error);
		font-weight: 750;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(var(--gallery-column), 100%), 1fr));
		gap: var(--space-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.grid li {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: var(--radius-large);
		background: var(--theme-panel-bg);
	}
	.preview {
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		overflow: hidden;
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: inherit;
		background: transparent;
		cursor: zoom-in;
		transition:
			border-color var(--duration-fast) var(--ease-out),
			box-shadow var(--duration-fast) var(--ease-out);
	}
	.preview:hover {
		border-color: var(--theme-selection);
		box-shadow: inset 0 0 0 var(--border-thin) var(--theme-selection);
	}
	.preview img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			filter var(--duration-normal) var(--ease-out),
			opacity var(--duration-normal) var(--ease-out),
			transform var(--duration-normal) var(--ease-out);
	}
	.preview:hover img {
		transform: scale(1.02);
	}
	.hidden .preview img {
		opacity: 0.52;
		filter: grayscale(0.38) saturate(0.55);
	}
	.moderate-control {
		display: grid;
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		width: var(--min-touch-target);
		height: var(--min-touch-target);
		padding: 0;
		place-items: center;
		border: var(--border-thin) solid rgb(255 255 255 / 0.18);
		border-radius: var(--radius-round);
		background: rgb(11 11 16 / 0.82);
		box-shadow: 0 0.35rem 1rem rgb(0 0 0 / 0.35);
		color: var(--theme-food-strong);
		cursor: pointer;
		transition:
			opacity var(--duration-fast) var(--ease-out),
			transform var(--duration-fast) var(--ease-out),
			background var(--duration-fast) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out);
	}
	.moderate-control svg {
		width: 1.25rem;
		height: 1.25rem;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.8;
	}
	.moderate-control:hover {
		border-color: currentColor;
		background: color-mix(in srgb, var(--theme-food) 18%, var(--color-night));
		transform: scale(1.06);
	}
	.moderate-control.restore {
		color: var(--semantic-success);
	}
	.moderate-control.restore:hover {
		background: color-mix(in srgb, var(--semantic-success) 16%, var(--color-night));
	}
	.moderate-control:disabled {
		cursor: wait;
		opacity: 0.6;
	}
	.empty {
		display: grid;
		min-height: 18rem;
		place-content: center;
		color: var(--color-text-muted);
		text-align: center;
	}
	.empty p {
		margin: 0;
		font-size: var(--text-card-title);
		font-weight: 850;
	}
	.more {
		display: grid;
		min-height: 8rem;
		place-items: center;
	}
	.toast {
		display: flex;
		position: fixed;
		right: var(--page-gutter);
		bottom: var(--space-5);
		z-index: calc(var(--z-header) + 2);
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		border: var(--border-thin) solid var(--theme-selection);
		border-radius: var(--radius-large);
		background: var(--theme-card-hover-bg);
		box-shadow: var(--shadow-panel);
		color: var(--theme-text);
		opacity: 0;
		pointer-events: none;
		transform: translateY(var(--space-4));
		transition:
			opacity var(--duration-normal) var(--ease-out),
			transform var(--duration-normal) var(--ease-out);
	}
	.toast.shown {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
	}
	.toast p {
		margin: 0;
		font-weight: 750;
	}
	.toast button {
		min-height: var(--min-touch-target);
		padding-inline: var(--space-3);
		border: 0;
		border-radius: var(--radius-medium);
		background: var(--theme-selection);
		color: var(--theme-on-accent);
		font-weight: 850;
		cursor: pointer;
	}
	.spotlight-theme {
		--spotlight-backdrop: #07070d;
		--spotlight-arrow-bg: color-mix(in srgb, var(--color-night-panel) 88%, transparent);
		--spotlight-arrow-bg-hover: color-mix(in srgb, var(--theme-led) 28%, var(--color-night-panel));
		--spotlight-arrow-color: var(--theme-selection);
		--spotlight-close-bg: color-mix(in srgb, var(--color-night-panel) 88%, transparent);
		--spotlight-close-color: var(--color-text);
		--spotlight-counter-bg: color-mix(in srgb, var(--color-night-panel) 88%, transparent);
		--spotlight-counter-color: var(--color-text);
		--spotlight-filmstrip-active-border: var(--theme-selection);
	}

	@media (hover: hover) and (pointer: fine) {
		.moderate-control:not(:focus-visible) {
			opacity: 0;
			transform: translateY(-0.25rem) scale(0.94);
		}
		.grid li:hover .moderate-control,
		.grid li:focus-within .moderate-control {
			opacity: 1;
			transform: none;
		}
	}

	@media (max-width: 44rem) {
		.page {
			padding-top: var(--space-5);
		}
		.page-header,
		.controls {
			align-items: stretch;
			flex-direction: column;
		}
		.account-actions {
			justify-content: start;
		}
		.year-control {
			width: 100%;
		}
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--space-2);
		}
		.grid li {
			border-radius: var(--radius-medium);
		}
		.toast {
			right: var(--space-3);
			bottom: var(--space-3);
			left: var(--space-3);
			justify-content: space-between;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.preview,
		.preview img,
		.moderate-control,
		.toast {
			transition: none;
		}
		.preview:hover img,
		.moderate-control:hover {
			transform: none;
		}
	}
</style>
