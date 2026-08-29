<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import { siteDetails } from "$lib/data/site-details";
</script>

<PageMeta
	title="Help out"
	description="Volunteer, list what you are bringing, or propose a donation-based class at Taco Tuesday Flow Jam."
	path="/help-out"
/>

<div class="page">
	<header>
		<h1>Help out</h1>
		<p>Add your name to the sheet or propose a class.</p>
	</header>

	<div class="options">
		<section aria-labelledby="signup-title">
			<h2 id="signup-title">Helping hands and things to bring</h2>
			<p>
				Use the shared sheet for setup, cleanup, and anything you plan to bring. Everyone can see
				what is claimed.
			</p>
			<ActionLink href={siteDetails.helpOutSheetUrl} external>Open the signup sheet</ActionLink>
		</section>

		<section aria-labelledby="class-title">
			<h2 id="class-title">Teach a class</h2>
			<p>Classes are donation based. Donations go directly to the instructor.</p>
			<ActionLink href={siteDetails.classProposalFormUrl} tone="outline" external
				>Propose a class</ActionLink
			>
		</section>
	</div>
</div>

<style>
	.page {
		width: min(var(--shell-width), 68rem);
		margin-inline: auto;
		padding-block: clamp(var(--space-6), 7vw, var(--space-8));
	}

	header {
		margin-inline: auto;
		text-align: center;
	}

	h1 {
		margin-bottom: var(--space-3);
		font-size: var(--text-page);
		font-weight: 900;
		letter-spacing: var(--tracking-tight);
	}

	header p {
		margin: 0;
		color: var(--theme-text-soft);
		font-size: var(--text-lede);
	}

	.options {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
		gap: var(--space-4);
		margin-top: clamp(var(--space-6), 6vw, var(--space-8));
	}

	section {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		padding: clamp(var(--space-5), 4vw, var(--space-6));
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-large);
		background: var(--theme-panel-bg);
	}

	h2 {
		margin-bottom: var(--space-3);
		font-size: var(--text-card-title);
		font-weight: 850;
		letter-spacing: var(--tracking-card);
	}

	section p {
		margin-bottom: var(--space-6);
		color: var(--theme-text-soft);
		line-height: 1.55;
	}

	section :global(a) {
		margin-top: auto;
	}

	@media (min-width: 48rem) and (max-height: 35rem) {
		.page {
			padding-block: var(--space-4);
		}

		.options {
			margin-top: var(--space-4);
		}
	}
</style>
