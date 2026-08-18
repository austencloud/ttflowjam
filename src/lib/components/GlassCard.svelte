<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		elevated?: boolean;
	}

	let { children, elevated = false }: Props = $props();
</script>

<div class="glass" class:elevated>
	{@render children()}
</div>

<style>
	.glass {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		box-shadow: var(--shadow-glass);
		padding: var(--spacing-lg);
	}

	.elevated {
		background: var(--glass-bg-elevated);
	}
</style>
