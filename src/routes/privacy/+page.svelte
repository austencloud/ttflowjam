<script lang="ts">
	import { siteDetails } from "$lib/data/site-details";
</script>

<svelte:head>
	<title>Privacy · {siteDetails.name}</title>
	<meta
		name="description"
		content="How Taco Tuesday Flow Jam uses Google account information for gallery moderation."
	/>
</svelte:head>

<section class="privacy" aria-labelledby="privacy-title">
	<p class="kicker">Gallery moderation</p>
	<h1 id="privacy-title">Privacy</h1>

	<div class="copy">
		<p>
			Google sign-in gives this site your Google account ID, email address, name, and profile
			photo. We use that information only to check moderator access, show who made a gallery
			change, and keep moderators signed in.
		</p>
		<p>
			Moderator access is limited to an email list maintained by the site owner. Session tokens
			are stored as hashes and expire after 30 days. Removing a moderator ends their active
			sessions.
		</p>
		<p>We do not sell account information or use it for advertising.</p>
		<p>
			This policy covers gallery moderation on this site. Google Photos, Google Forms, and other
			linked Google services have their own privacy policies.
		</p>
	</div>

	<p class="updated">Last updated September 1, 2026.</p>
</section>

<style>
	.privacy {
		width: min(100% - (2 * var(--space-4)), 46rem);
		margin-inline: auto;
		padding-block: clamp(var(--space-7), 9vw, var(--space-9));
	}

	.kicker {
		margin: 0 0 var(--space-2);
		color: var(--theme-led);
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	h1 {
		margin: 0 0 var(--space-6);
		color: var(--theme-text);
		font-size: var(--text-display);
		line-height: 0.95;
	}

	.copy {
		display: grid;
		gap: var(--space-4);
		padding: clamp(var(--space-5), 5vw, var(--space-7));
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-large);
		background: var(--theme-card-bg);
	}

	.copy p,
	.updated {
		margin: 0;
		font-size: var(--text-body);
		line-height: 1.65;
	}

	.copy p {
		color: var(--color-text-soft);
	}

	.updated {
		margin-top: var(--space-4);
		color: var(--color-text-muted);
		font-size: var(--text-small);
	}
</style>
