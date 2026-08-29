<script lang="ts">
	import SocialIcon from "$lib/components/SocialIcon.svelte";
	import { siteDetails } from "$lib/data/site-details";

	const communityLinks = [
		{ href: siteDetails.facebookUrl, label: "Facebook", icon: "facebook" },
		{ href: siteDetails.instagramUrl, label: "Instagram", icon: "instagram" },
		{ href: siteDetails.albumUrl, label: "Community album", icon: "album" },
	] as const;
</script>

<footer>
	<div class="inner">
		<nav aria-label="Community links">
			{#each communityLinks as link (link.href)}
				<a href={link.href} rel="external">
					<SocialIcon name={link.icon} />
					<span>{link.label}</span>
				</a>
			{/each}
		</nav>
	</div>
</footer>

<style>
	footer {
		margin-top: var(--space-6);
		padding-block: var(--space-2);
		border-top: var(--border-thin) solid var(--theme-stroke);
		background: var(--theme-page-bg);
		color: var(--color-text-soft);
		font-size: var(--text-small);
	}

	.inner {
		width: var(--shell-width);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--space-3) var(--space-5);
		margin-inline: auto;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	nav a {
		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
		gap: var(--space-2);
		padding-inline: var(--space-3);
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-medium);
		background: var(--theme-card-bg);
		color: var(--color-text-soft);
		font-weight: 750;
		text-decoration: none;
		transition:
			background var(--duration-fast) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out),
			color var(--duration-fast) var(--ease-out);
	}

	nav a:hover {
		border-color: var(--theme-accent);
		background: var(--theme-card-hover-bg);
		color: var(--color-text);
	}
</style>
