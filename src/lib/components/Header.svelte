<script lang="ts">
	import { page } from "$app/state";

	const links = [
		{ href: "/", label: "Info" },
		{ href: "/gallery", label: "Gallery" },
		{ href: "/help-out", label: "Volunteer" },
	];

	const isActive = (href: string) =>
		href === "/" ? page.url.pathname === "/" : page.url.pathname.startsWith(href);
</script>

<a class="skip" href="#content">Skip to the page</a>

<header>
	<div class="bar">
		<nav aria-label="Main navigation">
			{#each links as link (link.href)}
				<a href={link.href} aria-current={isActive(link.href) ? "page" : undefined}>{link.label}</a>
			{/each}
		</nav>
	</div>
</header>

<style>
	.skip {
		position: fixed;
		top: 0;
		left: var(--space-3);
		z-index: calc(var(--z-header) + 1);
		min-height: var(--min-touch-target);
		padding: var(--space-3) var(--space-4);
		background: var(--color-paper);
		color: var(--color-paper-ink);
		font-weight: 800;
		transform: translateY(-120%);
	}

	.skip:focus-visible {
		transform: translateY(var(--space-3));
	}

	header {
		position: sticky;
		top: 0;
		z-index: var(--z-header);
		border-bottom: var(--border-thin) solid var(--color-line);
		background: color-mix(in srgb, var(--theme-page-bg) 88%, transparent);
		backdrop-filter: blur(1rem);
	}

	.bar {
		width: var(--shell-width);
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: var(--min-touch-target);
		margin-inline: auto;
	}

	nav a {
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		line-height: 1;
		text-decoration: none;
		text-transform: uppercase;
	}

	nav {
		display: flex;
		gap: var(--space-4);
	}

	nav a {
		position: relative;
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		min-height: var(--min-touch-target);
		padding-inline: var(--space-2);
		color: var(--color-text-soft);
		transition: color var(--duration-fast) var(--ease-out);
	}

	nav a::after {
		position: absolute;
		right: var(--space-2);
		bottom: 0;
		left: var(--space-2);
		height: var(--border-medium);
		background: transparent;
		content: "";
		transition: background var(--duration-fast) var(--ease-out);
	}

	nav a:hover {
		color: var(--theme-selection-strong);
	}

	nav a[aria-current="page"] {
		color: var(--theme-text);
	}

	nav a[aria-current="page"]::after {
		background: linear-gradient(
			90deg,
			var(--theme-selection),
			var(--theme-led),
			var(--theme-spark)
		);
	}
</style>
