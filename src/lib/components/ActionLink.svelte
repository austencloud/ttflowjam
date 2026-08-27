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
		border: var(--border-medium) solid transparent;
		border-radius: var(--radius-small);
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
			color var(--duration-fast) var(--ease-out),
			transform var(--duration-fast) var(--ease-out);
	}

	a:hover {
		transform: translateY(calc(var(--border-medium) * -1));
	}

	.paper {
		background: var(--color-paper);
		color: var(--color-paper-ink);
	}

	.paper:hover {
		background: var(--color-gold);
	}

	.ink {
		background: var(--color-paper-ink);
		color: var(--color-text);
	}

	.ink:hover {
		background: var(--color-red-deep);
	}

	.outline {
		border-color: var(--color-line);
		background: var(--color-night-raised);
		color: var(--color-text);
	}

	.outline:hover {
		border-color: var(--color-gold);
	}

	.quiet {
		padding-inline: 0;
		color: var(--color-gold);
		text-decoration: underline;
		text-decoration-thickness: var(--border-thin);
		text-underline-offset: var(--space-1);
	}

	.quiet:hover {
		color: var(--color-text);
	}
</style>
