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
				<a class={link.icon} href={link.href} rel="external">
					<span class="link-icon"><SocialIcon name={link.icon} /></span>
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
		justify-content: center;
		gap: var(--space-2);
	}

	nav a {
		--link-accent: var(--theme-accent);

		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
		gap: var(--space-2);
		padding-inline: var(--space-3);
		border: var(--border-thin) solid color-mix(in srgb, var(--link-accent) 38%, var(--theme-stroke));
		border-radius: var(--radius-medium);
		background-color: color-mix(in srgb, var(--link-accent) 8%, var(--theme-card-bg));
		color: var(--color-text-soft);
		font-weight: 750;
		text-decoration: none;
		transition:
			background var(--duration-fast) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out),
			color var(--duration-fast) var(--ease-out);
	}

	nav a.facebook {
		--link-accent: #1877f2;
	}

	nav a.instagram {
		--link-accent: #e1306c;
		background-image: linear-gradient(
			135deg,
			rgb(131 58 180 / 0.13),
			rgb(225 48 108 / 0.11),
			rgb(252 175 69 / 0.1)
		);
	}

	nav a.album {
		--link-accent: #4285f4;
		background-image: linear-gradient(
			135deg,
			rgb(66 133 244 / 0.1),
			rgb(52 168 83 / 0.08),
			rgb(251 188 4 / 0.08),
			rgb(234 67 53 / 0.08)
		);
	}

	.link-icon {
		display: inline-flex;
		color: var(--link-accent);
	}

	nav a:hover {
		border-color: var(--link-accent);
		background-color: color-mix(in srgb, var(--link-accent) 14%, var(--theme-card-hover-bg));
		color: var(--color-text);
	}
</style>
