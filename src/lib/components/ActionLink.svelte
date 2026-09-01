<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		href: string;
		children: Snippet;
		tone?: "paper" | "ink" | "outline" | "quiet";
		external?: boolean;
	}

	let { href, children, tone = "paper", external = false }: Props = $props();
</script>

<a
	class:paper={tone === "paper"}
	class:ink={tone === "ink"}
	class:outline={tone === "outline"}
	class:quiet={tone === "quiet"}
	{href}
	rel={external ? "external" : undefined}
>
	{@render children()}
</a>

<style>
	a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--min-touch-target);
		padding-inline: var(--space-5);
		border: var(--border-thin) solid transparent;
		border-radius: var(--radius-medium);
		font-size: var(--text-small);
		font-weight: 780;
		letter-spacing: var(--tracking-label);
		line-height: 1;
		text-align: center;
		text-decoration: none;
		text-transform: uppercase;
		transition:
			background var(--duration-fast) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out),
			color var(--duration-fast) var(--ease-out);
	}

	.paper {
		background: var(--theme-accent);
		color: var(--color-paper-ink);
	}

	.paper:hover {
		background: var(--theme-accent-strong);
	}

	.ink {
		background: var(--theme-accent);
		color: var(--color-paper-ink);
	}

	.ink:hover {
		background: var(--color-red-deep);
	}

	.outline {
		border-color: var(--theme-stroke-strong);
		background: var(--theme-card-bg);
		color: var(--theme-text);
	}

	.outline:hover {
		border-color: var(--theme-selection);
		background: var(--theme-card-hover-bg);
	}

	.quiet {
		padding-inline: 0;
		color: var(--theme-accent);
		text-decoration: underline;
		text-decoration-thickness: var(--border-thin);
		text-underline-offset: var(--space-1);
	}

	.quiet:hover {
		color: var(--theme-text);
	}
</style>
