<script lang="ts">
	const links = [
		{ href: "/", label: "Home" },
		{ href: "/about", label: "About" },
		{ href: "/gallery", label: "Gallery" },
		{ href: "/events", label: "Other Events" },
		{ href: "/links", label: "Links" },
	];
</script>

<header>
	<a class="brand" href="/">🌮 Taco Tuesday Flow Jam</a>
	<nav aria-label="Main">
		{#each links as link (link.href)}
			<a href={link.href}>{link.label}</a>
		{/each}
	</nav>
</header>

<style>
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-lg);
		background: var(--color-bg-secondary);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: var(--z-header);
	}

	.brand {
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--color-taco-gold);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
	}

	nav a {
		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
		padding: 0 var(--spacing-md);
		border-radius: var(--radius-full);
		color: var(--color-text-secondary);
		text-decoration: none;
		transition:
			background var(--transition-fast),
			color var(--transition-fast);
	}

	nav a:hover {
		background: var(--color-bg-card-hover);
		color: var(--color-text-primary);
	}
</style>
