<script lang="ts">
	const links = [
		{ href: "/", label: "Home" },
		{ href: "/about", label: "About" },
		{ href: "/events", label: "Other Events" },
		{ href: "/links", label: "Links" },
	];
</script>

<header>
	<div class="bar shell">
		<a class="brand" href="/">🌮 <span class="wordmark">Taco Tuesday Flow Jam</span></a>
		<nav aria-label="Main">
			{#each links as link (link.href)}
				<a href={link.href}>{link.label}</a>
			{/each}
		</nav>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: var(--z-header);
		background: oklch(0.15 0.02 270 / 0.72);
		backdrop-filter: blur(16px) saturate(160%);
		-webkit-backdrop-filter: blur(16px) saturate(160%);
		border-bottom: 1px solid oklch(0.6 0.03 270 / 0.08);
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-sm);
		padding-block: var(--spacing-xs);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-sm);
		min-height: var(--min-touch-target);
		font-size: 1.15rem;
		text-decoration: none;
	}

	.wordmark {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 700;
		font-variation-settings:
			"opsz" 144,
			"SOFT" 0,
			"WONK" 1;
		letter-spacing: 0.02em;
		background: var(--gradient-fiesta);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
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
