<script lang="ts">
	import { MediaSpotlight } from "@austencloud/media-spotlight";
	import type { HeroOrigin, MediaItem } from "@austencloud/media-spotlight";
	import "@austencloud/media-spotlight/css/spotlight-tokens.css";
	import { onMount } from "svelte";

	const AUTO_ADVANCE_MS = 6000;
	const SWIPE_DISTANCE = 48;

	const photos = [
		{
			id: "410c464b57fc4443",
			small: "/media/park-noticeboard/hero-group-720.webp",
			large: "/media/park-noticeboard/hero-group-1920.webp",
			width: 1920,
			height: 1280,
			position: "center 56%",
			alt: "Taco Tuesday Flow Jam group holding hoops, clubs, and staffs in the park",
		},
		{
			id: "023d75c6179b2583",
			small: "/media/home-carousel/023d75c6179b2583-720.webp",
			large: "/media/home-carousel/023d75c6179b2583-1920.webp",
			width: 1920,
			height: 1149,
			position: "center",
			alt: "Taco Tuesday Flow Jam group posing with hoops and props on the playground",
		},
		{
			id: "22fe815d5bbd8cb8",
			small: "/media/home-carousel/22fe815d5bbd8cb8-720.webp",
			large: "/media/home-carousel/22fe815d5bbd8cb8-1920.webp",
			width: 1920,
			height: 1440,
			position: "center 68%",
			alt: "Taco Tuesday Flow Jam group posing with juggling clubs and hoops",
		},
		{
			id: "295f6d509cf40bd1",
			small: "/media/home-carousel/295f6d509cf40bd1-720.webp",
			large: "/media/home-carousel/295f6d509cf40bd1-1920.webp",
			width: 1920,
			height: 1292,
			position: "center",
			alt: "Taco Tuesday Flow Jam group posing with flow props and a park cat",
		},
		{
			id: "a10c36eb0c8e3e2d",
			small: "/media/home-carousel/a10c36eb0c8e3e2d-720.webp",
			large: "/media/home-carousel/a10c36eb0c8e3e2d-1920.webp",
			width: 1920,
			height: 1080,
			position: "center",
			alt: "Taco Tuesday Flow Jam group sitting together on the playground",
		},
	] as const;

	const items: MediaItem[] = photos.map((photo) => ({
		id: photo.id,
		type: "image",
		url: photo.large,
		thumbnailUrl: photo.small,
		width: photo.width,
		height: photo.height,
		alt: photo.alt,
	}));

	let carousel: HTMLElement;
	let currentIndex = $state(0);
	let loadedIndices = $state<Set<number>>(new Set([0, 1]));
	let autoplay = $state(true);
	let reducedMotion = $state(false);
	let pointerStartX = $state<number | null>(null);
	let swiped = $state(false);
	let pageVisible = $state(true);
	let onScreen = $state(true);
	let spotlightOpen = $state(false);
	let heroOrigin = $state<HeroOrigin | null>(null);

	const currentPhoto = $derived(photos[currentIndex] ?? photos[0]);
	$effect(() => {
		const nextIndex = (currentIndex + 1) % photos.length;
		if (!loadedIndices.has(currentIndex) || !loadedIndices.has(nextIndex)) {
			loadedIndices = new Set([...loadedIndices, currentIndex, nextIndex]);
		}
	});

	onMount(() => {
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updateMotion = () => {
			reducedMotion = motionQuery.matches;
			if (reducedMotion) {
				autoplay = false;
			}
		};
		const updateVisibility = () => {
			pageVisible = document.visibilityState === "visible";
		};

		updateMotion();
		updateVisibility();
		motionQuery.addEventListener("change", updateMotion);
		document.addEventListener("visibilitychange", updateVisibility);
		const autoplayInterval = window.setInterval(() => {
			if (autoplay && !reducedMotion && pageVisible && onScreen && !spotlightOpen) {
				currentIndex = (currentIndex + 1) % photos.length;
			}
		}, AUTO_ADVANCE_MS);

		const observer = new IntersectionObserver(
			([entry]) => {
				onScreen = entry?.isIntersecting ?? true;
			},
			{ threshold: 0.05 }
		);
		observer.observe(carousel);

		return () => {
			motionQuery.removeEventListener("change", updateMotion);
			document.removeEventListener("visibilitychange", updateVisibility);
			window.clearInterval(autoplayInterval);
			observer.disconnect();
		};
	});

	function moveTo(index: number, manual = true) {
		currentIndex = (index + photos.length) % photos.length;
		if (manual) {
			autoplay = false;
		}
	}

	function toggleAutoplay() {
		autoplay = !autoplay;
	}

	function handlePointerDown(event: PointerEvent) {
		if (event.pointerType === "mouse" && event.button !== 0) {
			return;
		}

		pointerStartX = event.clientX;
		swiped = false;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function handlePointerUp(event: PointerEvent) {
		if (pointerStartX === null) {
			return;
		}

		const distance = event.clientX - pointerStartX;
		pointerStartX = null;
		if (Math.abs(distance) < SWIPE_DISTANCE) {
			return;
		}

		swiped = true;
		moveTo(currentIndex + (distance > 0 ? -1 : 1));
	}

	function handleStageKeydown(event: KeyboardEvent) {
		if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
			return;
		}

		event.preventDefault();
		moveTo(currentIndex + (event.key === "ArrowLeft" ? -1 : 1));
	}

	function openPhoto(event: MouseEvent) {
		if (swiped) {
			swiped = false;
			return;
		}

		heroOrigin = {
			rect: (event.currentTarget as HTMLElement).getBoundingClientRect(),
			thumbnailUrl: currentPhoto.small,
		};
		spotlightOpen = true;
	}
</script>

<section class="carousel" bind:this={carousel} aria-label="Taco Tuesday group photos">
	<div class="photo-shell">
		<button
			class="stage"
			type="button"
			onclick={openPhoto}
			onkeydown={handleStageKeydown}
			onpointerdown={handlePointerDown}
			onpointerup={handlePointerUp}
			onpointercancel={() => (pointerStartX = null)}
			aria-label="Open photo {currentIndex + 1} of {photos.length}: {currentPhoto.alt}"
		>
			{#each photos as photo, index (photo.id)}
				{#if loadedIndices.has(index)}
					<img
						class:active={index === currentIndex}
						src={photo.small}
						srcset="{photo.small} 720w, {photo.large} {photo.width}w"
						sizes="(min-width: 100rem) 96rem, calc(100vw - 2rem)"
						alt=""
						width={photo.width}
						height={photo.height}
						loading={index === 0 ? "eager" : "lazy"}
						fetchpriority={index === 0 ? "high" : "auto"}
						decoding="async"
						aria-hidden={index !== currentIndex}
						style:object-position={photo.position}
					/>
				{/if}
			{/each}
		</button>
	</div>

	<div class="controls" aria-label="Photo controls">
		<button
			type="button"
			onclick={() => moveTo(currentIndex - 1)}
			aria-label="Previous group photo"
		>
			<span aria-hidden="true">←</span>
		</button>
		<p aria-live={autoplay ? "off" : "polite"}>{currentIndex + 1} / {photos.length}</p>
		<button type="button" onclick={() => moveTo(currentIndex + 1)} aria-label="Next group photo">
			<span aria-hidden="true">→</span>
		</button>
		<button class="autoplay" type="button" onclick={toggleAutoplay}>
			{autoplay ? "Pause" : "Play"}
		</button>
	</div>
</section>

<MediaSpotlight
	{items}
	bind:currentIndex
	bind:open={spotlightOpen}
	{heroOrigin}
	config={{ loop: true, chromeTimeout: 3000, mediaPadding: 24 }}
	callbacks={{
		onclose: () => {
			heroOrigin = null;
		},
	}}
/>

<style>
	.carousel {
		width: min(100%, 96rem);
		margin: var(--space-6) auto 0;
		container-type: inline-size;
	}

	.photo-shell {
		overflow: hidden;
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-large);
		background: var(--theme-panel-bg);
		box-shadow: var(--shadow-photo);
	}

	.stage {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 3 / 2;
		padding: 0;
		overflow: hidden;
		border: 0;
		background: var(--color-night-panel);
		cursor: zoom-in;
		touch-action: pan-y;
	}

	.stage img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 850ms var(--ease-out);
	}

	.stage img.active {
		opacity: 1;
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		width: max-content;
		max-width: 100%;
		margin-top: var(--space-5);
		margin-inline: auto;
		padding: var(--space-1);
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-medium);
		background: var(--theme-panel-bg);
	}

	.controls button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--min-touch-target);
		min-height: var(--min-touch-target);
		padding-inline: var(--space-3);
		border: 0;
		border-radius: var(--radius-small);
		background: transparent;
		color: var(--theme-accent);
		font-size: var(--text-small);
		font-weight: 780;
		letter-spacing: var(--tracking-label);
		line-height: 1;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			background var(--duration-fast) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out);
	}

	.controls button:hover {
		background: color-mix(in srgb, var(--theme-selection) 10%, var(--theme-card-hover-bg));
		color: var(--theme-selection-strong);
	}

	.controls p {
		min-width: 3.75rem;
		margin: 0;
		padding-inline: var(--space-2);
		border-inline: var(--border-thin) solid var(--theme-stroke);
		color: var(--color-text-soft);
		font-size: var(--text-small);
		font-variant-numeric: tabular-nums;
		font-weight: 760;
		text-align: center;
	}

	.controls .autoplay {
		min-width: 5.5rem;
	}

	@container (max-width: 32rem) {
		.carousel {
			margin-top: var(--space-5);
		}

		.controls {
			margin-top: var(--space-4);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stage img {
			transition: none;
		}
	}
</style>
