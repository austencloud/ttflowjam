<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import { siteDetails } from "$lib/data/site-details";

	type MapView = "map" | "street";

	let dialog: HTMLDialogElement;
	let activeView = $state<MapView>("map");
	let loadedViews = $state<Set<MapView>>(new Set());

	function loadView(view: MapView) {
		loadedViews = new Set(loadedViews).add(view);
	}

	function openDialog() {
		loadView(activeView);
		dialog.showModal();
	}

	function selectView(view: MapView) {
		activeView = view;
		loadView(view);
	}

	function handleTabKeydown(event: KeyboardEvent) {
		let nextView: MapView | undefined;

		if (event.key === "ArrowLeft" || event.key === "Home") {
			nextView = "map";
		} else if (event.key === "ArrowRight" || event.key === "End") {
			nextView = "street";
		}

		if (!nextView) return;

		event.preventDefault();
		selectView(nextView);
		dialog.querySelector<HTMLButtonElement>(`#${nextView}-tab`)?.focus();
	}

	function closeOnBackdrop(event: MouseEvent) {
		if (event.target === dialog) {
			dialog.close();
		}
	}
</script>

<button class="map-trigger" type="button" onclick={openDialog}>
	<svg aria-hidden="true" viewBox="0 0 24 24">
		<path d="M12 21s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z" />
		<circle cx="12" cy="8" r="2.5" />
	</svg>
	<span>Map &amp; Street View</span>
</button>

<dialog bind:this={dialog} aria-labelledby="map-dialog-title" onclick={closeOnBackdrop}>
	<div class="dialog-shell">
		<header>
			<div>
				<p>Jam location</p>
				<h2 id="map-dialog-title">Palmer Square Park</h2>
			</div>
			<button
				class="close-button"
				type="button"
				onclick={() => dialog.close()}
				aria-label="Close map"
			>
				<svg aria-hidden="true" viewBox="0 0 24 24">
					<path d="m6 6 12 12M18 6 6 18" />
				</svg>
			</button>
		</header>

		<div class="view-tabs" role="tablist" aria-label="Location view">
			<button
				id="map-tab"
				type="button"
				role="tab"
				aria-selected={activeView === "map"}
				aria-controls="map-panel"
				tabindex={activeView === "map" ? 0 : -1}
				onkeydown={handleTabKeydown}
				onclick={() => selectView("map")}>Map</button
			>
			<button
				id="street-tab"
				type="button"
				role="tab"
				aria-selected={activeView === "street"}
				aria-controls="street-panel"
				tabindex={activeView === "street" ? 0 : -1}
				onkeydown={handleTabKeydown}
				onclick={() => selectView("street")}>Street View</button
			>
		</div>

		<div class="frames">
			<div
				id="map-panel"
				class:hidden={activeView !== "map"}
				role="tabpanel"
				aria-labelledby="map-tab"
			>
				{#if loadedViews.has("map")}
					<iframe
						title="Map of Taco Tuesday Flow Jam at Palmer Square Park"
						src={siteDetails.mapEmbedUrl}
						loading="lazy"
						allowfullscreen
						referrerpolicy="strict-origin-when-cross-origin"
					></iframe>
				{/if}
			</div>
			<div
				id="street-panel"
				class:hidden={activeView !== "street"}
				role="tabpanel"
				aria-labelledby="street-tab"
			>
				{#if loadedViews.has("street")}
					<iframe
						title="Street View of the Taco Tuesday Flow Jam meeting spot"
						src={siteDetails.streetViewEmbedUrl}
						loading="lazy"
						allowfullscreen
						referrerpolicy="strict-origin-when-cross-origin"
					></iframe>
				{/if}
			</div>
		</div>

		<footer>
			<p>Palmer Square Park, Chicago</p>
			<ActionLink href={siteDetails.mapUrl} tone="ink" external>Get directions</ActionLink>
		</footer>
	</div>
</dialog>

<style>
	.map-trigger {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--min-touch-target);
		padding-inline: var(--space-5);
		border: var(--border-thin) solid transparent;
		border-radius: var(--radius-medium);
		background: var(--theme-accent);
		color: var(--color-paper-ink);
		font-size: var(--text-small);
		font-weight: 780;
		letter-spacing: var(--tracking-label);
		line-height: 1;
		text-transform: uppercase;
		cursor: pointer;
		transition: background var(--duration-fast) var(--ease-out);
	}

	.map-trigger:hover {
		background: var(--theme-accent-strong);
	}

	.map-trigger svg {
		width: var(--space-5);
		height: var(--space-5);
		margin-inline-end: var(--space-2);
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: var(--border-medium);
	}

	dialog {
		width: min(calc(100vw - (var(--space-4) * 2)), var(--map-dialog-width));
		max-width: none;
		max-height: calc(100svh - (var(--space-4) * 2));
		padding: 0;
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-large);
		background: var(--theme-panel-bg);
		box-shadow: var(--shadow-photo);
		color: var(--theme-text);
		overflow: hidden;
		animation: dialog-enter var(--duration-normal) var(--ease-out);
	}

	dialog::backdrop {
		background: var(--color-photo-scrim);
		animation: backdrop-enter var(--duration-normal) var(--ease-out);
	}

	.dialog-shell {
		display: grid;
		grid-template-rows: auto auto minmax(0, 1fr) auto;
		max-height: calc(100svh - (var(--space-4) * 2));
	}

	header,
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-4) var(--space-5);
	}

	header {
		border-bottom: var(--border-thin) solid var(--theme-stroke);
	}

	header p,
	footer p {
		margin: 0;
		color: var(--theme-text-muted);
		font-size: var(--text-small);
		font-weight: 760;
		letter-spacing: var(--tracking-label);
		line-height: 1.2;
		text-transform: uppercase;
	}

	header p {
		margin-bottom: var(--space-1);
		color: var(--theme-accent);
	}

	header h2 {
		margin: 0;
		font-size: var(--text-card-title);
	}

	.close-button {
		display: grid;
		place-items: center;
		min-width: var(--min-touch-target);
		min-height: var(--min-touch-target);
		padding: 0;
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-round);
		background: var(--theme-card-bg);
		color: var(--theme-text);
		cursor: pointer;
		transition:
			background var(--duration-fast) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out);
	}

	.close-button:hover {
		border-color: var(--theme-accent);
		background: var(--theme-card-hover-bg);
	}

	.close-button svg {
		width: var(--space-5);
		height: var(--space-5);
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-width: var(--border-medium);
	}

	.view-tabs {
		display: flex;
		gap: var(--space-5);
		padding-inline: var(--space-5);
		border-bottom: var(--border-thin) solid var(--theme-stroke);
	}

	.view-tabs button {
		position: relative;
		min-width: var(--min-touch-target);
		min-height: var(--min-touch-target);
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--theme-text-muted);
		font-size: var(--text-small);
		font-weight: 780;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
		cursor: pointer;
		transition: color var(--duration-fast) var(--ease-out);
	}

	.view-tabs button::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: var(--border-medium);
		background: transparent;
		content: "";
		transition: background var(--duration-fast) var(--ease-out);
	}

	.view-tabs button[aria-selected="true"] {
		color: var(--theme-text);
	}

	.view-tabs button[aria-selected="true"]::after {
		background: var(--theme-accent);
	}

	.frames,
	.frames > div {
		min-height: var(--map-frame-min-height);
	}

	.frames {
		height: var(--map-frame-height);
		background: var(--theme-card-bg);
	}

	.frames > div,
	iframe {
		width: 100%;
		height: 100%;
	}

	.frames > div.hidden {
		display: none;
	}

	iframe {
		display: block;
		border: 0;
	}

	footer {
		border-top: var(--border-thin) solid var(--theme-stroke);
	}

	@keyframes dialog-enter {
		from {
			opacity: 0;
			transform: translateY(var(--space-3)) scale(0.98);
		}

		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes backdrop-enter {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@media (max-width: 36rem) {
		header,
		footer {
			padding: var(--space-3) var(--space-4);
		}

		.view-tabs {
			padding-inline: var(--space-4);
		}

		footer p {
			display: none;
		}

		footer :global(a) {
			width: 100%;
		}
	}
</style>
