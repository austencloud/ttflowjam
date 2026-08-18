<script lang="ts">
	import type { Snippet } from "svelte";
	import { glow } from "$lib/actions/glow";

	interface Props {
		children: Snippet;
		elevated?: boolean;
		/** Render as a link card instead of a plain surface. */
		href?: string;
		interactive?: boolean;
	}

	let { children, elevated = false, href, interactive = false }: Props = $props();
</script>

{#if href}
	<a class="glass interactive" {href} rel="external" use:glow>
		{@render children()}
	</a>
{:else if interactive}
	<div class="glass interactive" use:glow>
		{@render children()}
	</div>
{:else}
	<div class="glass" class:elevated>
		{@render children()}
	</div>
{/if}

<style>
	.glass {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		display: block;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		box-shadow: var(--shadow-glass);
		padding: var(--spacing-lg);
		color: inherit;
		text-decoration: none;
	}

	.elevated {
		background: var(--glass-bg-elevated);
	}

	.interactive {
		transition:
			transform var(--transition-fast),
			border-color var(--transition-fast),
			background var(--transition-fast);
	}

	.interactive::after {
		content: "";
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		opacity: var(--glow-o, 0);
		background: radial-gradient(
			180px circle at var(--glow-x, 50%) var(--glow-y, 50%),
			oklch(0.75 0.13 75 / 0.14),
			transparent 70%
		);
		transition: opacity 0.25s ease;
	}

	.interactive:hover {
		transform: translateY(var(--hover-lift));
		border-color: var(--glass-border-hover);
		background: var(--glass-bg-elevated);
	}
</style>
