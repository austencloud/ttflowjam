<script lang="ts">
	import { page } from "$app/state";
	import { formatJamDate, jamStatus } from "$lib/services/jam-status";

	const links = [
		{ href: "/", label: "Tonight" },
		{ href: "/first-time", label: "First time" },
		{ href: "/gallery", label: "Gallery" },
		{ href: "/story", label: "Story" },
		{ href: "/tacos", label: "Tacos" },
	];

	const status = jamStatus(new Date());
	const dateLabel = status.state === "today" ? "Tonight" : formatJamDate(status.nextJam, "short");
	const isActive = (href: string) =>
		href === "/" ? page.url.pathname === "/" : page.url.pathname.startsWith(href);
</script>

<a class="skip" href="#content">Skip to the page</a>

<header>
	<div class="top">
		<a class="brand" href="/" aria-label="Taco Tuesday Flow Jam home">Taco Tuesday</a>
		<a class="status" href="/#jam-status">
			<span class="signal" aria-hidden="true"></span>
			<strong>No call</strong>
			<b>{dateLabel}</b>
			<span class="sr-only">Weather call not posted. {dateLabel} is the calendar forecast.</span>
		</a>
	</div>
	<nav aria-label="Main navigation">
		<div>
			{#each links as link (link.href)}
				<a href={link.href} aria-current={isActive(link.href) ? "page" : undefined}>{link.label}</a>
			{/each}
		</div>
	</nav>
</header>

<style>
	.skip {
		position: fixed;
		top: var(--space-3);
		left: var(--space-3);
		z-index: calc(var(--z-header) + 1);
		min-height: var(--min-touch-target);
		padding: var(--space-3) var(--space-4);
		background: var(--color-paper);
		color: var(--color-paper-ink);
		font-weight: 800;
		transform: translateY(calc((var(--header-offset) + var(--space-4)) * -1));
	}

	.skip:focus-visible {
		transform: translateY(0);
	}

	header {
		position: sticky;
		top: 0;
		z-index: var(--z-header);
		border-bottom: var(--border-thin) solid var(--color-line);
		background: var(--color-night);
	}

	.top,
	nav > div {
		width: var(--shell-width);
		margin-inline: auto;
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		min-height: var(--min-touch-target);
	}

	.brand,
	.status,
	nav a {
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		line-height: 1;
		text-decoration: none;
		text-transform: uppercase;
	}

	.brand {
		min-width: 0;
		overflow: hidden;
		color: var(--color-text);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-height: var(--min-touch-target);
		color: var(--color-text-soft);
		white-space: nowrap;
	}

	.status .signal {
		width: var(--space-3);
		height: var(--space-3);
		border: var(--border-medium) solid var(--color-text);
		border-radius: var(--radius-round);
		background: var(--color-red);
	}

	.sr-only {
		position: absolute;
		width: var(--border-thin);
		height: var(--border-thin);
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.status strong {
		color: var(--color-red);
	}

	.status b {
		color: var(--color-gold);
	}

	nav {
		border-top: var(--border-thin) solid var(--color-line-soft);
	}

	nav > div {
		display: flex;
		overflow-x: auto;
		scrollbar-width: thin;
	}

	nav a {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		min-height: var(--min-touch-target);
		padding-inline: var(--space-4);
		border-right: var(--border-thin) solid var(--color-line-soft);
		color: var(--color-text-soft);
		transition:
			background var(--duration-fast) var(--ease-out),
			color var(--duration-fast) var(--ease-out);
	}

	nav a:first-child {
		border-left: var(--border-thin) solid var(--color-line-soft);
	}

	nav a:hover,
	nav a[aria-current="page"] {
		background: var(--color-paper);
		color: var(--color-paper-ink);
	}
</style>
