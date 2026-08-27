<script lang="ts">
	import { siteDetails } from "$lib/data/site-details";
</script>

<footer>
	<div class="inner">
		<div>
			<p class="brand">Taco Tuesday Flow Jam</p>
			<p>{siteDetails.schedule}</p>
			<p>{siteDetails.location}</p>
		</div>
		<nav aria-label="Community links">
			<a href={siteDetails.facebookUrl} rel="external">Facebook</a>
			<a href={siteDetails.instagramUrl} rel="external">Instagram</a>
			<a href={siteDetails.albumUrl} rel="external">Community album</a>
			<a href="/chicago-flow">More Chicago flow</a>
		</nav>
	</div>
	<p class="honesty">Weather calls live on Facebook. This site does not guess.</p>
</footer>

<style>
	footer {
		margin-top: var(--space-8);
		padding-block: var(--space-7);
		border-top: var(--border-heavy) solid var(--color-paper);
		background: var(--color-night-raised);
		color: var(--color-text-soft);
		font-size: var(--text-small);
	}

	.inner,
	.honesty {
		width: var(--shell-width);
		margin-inline: auto;
	}

	.inner {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--card-min), 1fr));
		gap: var(--space-6);
	}

	.brand {
		color: var(--color-text);
		font-size: var(--text-card-title);
		font-weight: 850;
		letter-spacing: var(--tracking-tight);
	}

	p {
		margin-bottom: var(--space-2);
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		align-content: start;
		justify-content: flex-end;
		gap: var(--space-2) var(--space-5);
	}

	nav a {
		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
		color: var(--color-gold);
		font-weight: 750;
		text-underline-offset: var(--space-1);
	}

	nav a:hover {
		color: var(--color-text);
	}

	.honesty {
		margin-top: var(--space-6);
		margin-bottom: 0;
		padding-top: var(--space-4);
		border-top: var(--border-thin) solid var(--color-line);
		color: var(--color-text-muted);
	}
</style>
