<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import GroupPhotoCarousel from "$lib/components/GroupPhotoCarousel.svelte";
	import JamStatusPanel from "$lib/components/JamStatusPanel.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import { siteDetails, tacoNights2026 } from "$lib/data/site-details";
</script>

<PageMeta
	title="Taco Tuesday Flow Jam · Chicago"
	description="Free flow jam in Palmer Square Park. Tuesdays from 4ish to 10ish, April through October."
	path="/"
	home
/>

<div class="page">
	<section class="hero" aria-labelledby="page-title">
		<div class="hero-grid">
			<div class="identity">
				<img src="/media/tacocat.png" alt="" width="512" height="512" />
				<h1 id="page-title">
					<span>Taco Tuesday</span>
					<span class="flow-jam">Flow Jam</span>
				</h1>
			</div>
			<div class="status">
				<JamStatusPanel />
			</div>
		</div>

		<GroupPhotoCarousel />
	</section>

	<section class="tacos" aria-labelledby="taco-title">
		<div class="taco-copy">
			<p class="kicker">2026 taco dates</p>
			<h2 id="taco-title">Every other Tuesday.</h2>
			<div class="taco-details">
				<p>Food starts around 6ish. $5 if you eat.</p>
				<ActionLink href={siteDetails.paypalUrl} tone="outline" external>Taco fund</ActionLink>
			</div>
		</div>
		<ol aria-label="2026 taco dates">
			{#each tacoNights2026 as night (night.iso)}
				<li><time datetime={night.iso}>{night.label}</time></li>
			{/each}
		</ol>
	</section>
</div>

<style>
	.page {
		width: var(--shell-width);
		margin-inline: auto;
	}

	.hero {
		padding-top: clamp(var(--space-5), 3vw, var(--space-7));
	}

	.hero-grid {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-5);
	}

	.identity {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(var(--space-2), 2.4vw, var(--space-5));
		width: 100%;
	}

	.identity img {
		width: clamp(5rem, 8vw, 7.5rem);
		height: auto;
		flex: 0 0 auto;
	}

	h1 {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: 0;
		font-size: clamp(2.7rem, 1.55rem + 4.1vw, 6.5rem);
		font-weight: 900;
		line-height: 0.82;
		text-align: left;
		text-transform: uppercase;
	}

	h1 .flow-jam {
		color: var(--theme-accent);
		font-size: 0.58em;
		letter-spacing: 0.16em;
		line-height: 1.2;
	}

	.status {
		width: min(100%, 44rem);
	}

	.tacos {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--feature-min), 1fr));
		gap: var(--space-7);
		align-items: center;
		margin-top: clamp(var(--space-5), 2.5vw, var(--space-7));
	}

	.kicker {
		margin: 0;
		color: var(--color-gold);
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	.taco-copy h2 {
		margin-bottom: 0;
		font-size: var(--text-section);
		font-weight: 880;
	}

	.taco-details {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3) var(--space-4);
		margin-top: var(--space-4);
	}

	.taco-details p {
		margin: 0;
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}

	ol {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		padding-block: var(--space-3);
		border-top: var(--border-thin) solid var(--theme-stroke-strong);
	}

	time {
		display: block;
		font-size: var(--text-card-title);
		font-weight: 820;
		letter-spacing: var(--tracking-card);
	}

	@media (min-width: 64rem) {
		ol {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (min-width: 105rem) {
		.hero-grid {
			display: grid;
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
			gap: var(--space-8);
			width: min(100%, 120rem);
			margin-inline: auto;
		}

		.identity {
			justify-content: flex-start;
		}

		.status {
			width: 100%;
		}
	}

	@media (min-width: 48rem) and (max-height: 35rem) {
		.hero {
			padding-top: var(--space-4);
		}

		.hero-grid {
			display: grid;
			grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
			gap: var(--space-5);
			align-items: center;
		}

		.identity {
			gap: var(--space-3);
		}

		.identity img {
			width: 5rem;
		}

		h1 {
			font-size: clamp(2.4rem, 5vw, 3.6rem);
		}
	}
</style>
