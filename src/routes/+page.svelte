<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import JamStatusPanel from "$lib/components/JamStatusPanel.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import { siteDetails } from "$lib/data/site-details";
</script>

<PageMeta
	title="Taco Tuesday Flow Jam · Chicago"
	description="Free flow jam in Palmer Square Park. Tuesdays from 4ish to 10ish, April through October. Bring a prop or borrow one."
	path="/"
	home
/>

<div class="page">
	<section class="hero" aria-labelledby="page-title">
		<div class="hero-grid">
			<div class="identity">
				<p class="kicker">Free weekly flow jam · Palmer Square Park</p>
				<h1 id="page-title">Taco Tuesday Flow Jam</h1>
				<p class="lede">
					Tuesdays, 4ish to 10ish, April through October. All ages, all skill levels, no sign-up.
				</p>
			</div>
			<JamStatusPanel />
		</div>

		<figure class="hero-photo">
			<picture>
				<source
					srcset="/media/park-noticeboard/hero-group-1200.webp 1200w, /media/park-noticeboard/hero-group-1920.webp 1920w"
					media="(min-width: 48rem)"
				/>
				<img
					src="/media/park-noticeboard/hero-group-720.webp"
					srcset="/media/park-noticeboard/hero-group-720.webp 720w, /media/park-noticeboard/hero-group-1200.webp 1200w"
					sizes="100vw"
					alt="A large group of Taco Tuesday Flow Jam regulars holding hoops, juggling clubs, and staffs beside the Palmer Square totem pole"
					width="1920"
					height="1279"
					fetchpriority="high"
				/>
			</picture>
			<figcaption>
				<span>Palmer Square Park, Chicago</span>
				<span>North side, by the totem pole</span>
			</figcaption>
		</figure>
	</section>

	<section class="first-time">
		<figure>
			<picture>
				<source
					srcset="/media/park-noticeboard/first-time-720.webp 720w, /media/park-noticeboard/first-time-1400.webp 1400w"
				/>
				<img
					src="/media/park-noticeboard/first-time-720.webp"
					alt="A flow artist practicing with two flower-shaped props while another balances nearby in Palmer Square Park"
					width="1400"
					height="1100"
					loading="lazy"
					decoding="async"
				/>
			</picture>
			<figcaption>Flow arts practice at Palmer Square Park</figcaption>
		</figure>
		<div>
			<p class="kicker">First time</p>
			<h2>No gear required.</h2>
			<p>Bring a prop or ask before borrowing one at the park.</p>
			<div class="actions">
				<ActionLink href="/first-time">First-timer guide</ActionLink>
				<ActionLink href={siteDetails.mapUrl} tone="outline" external>Open the map</ActionLink>
			</div>
		</div>
	</section>
</div>

<style>
	.page {
		width: var(--shell-width);
		margin-inline: auto;
	}

	.hero {
		padding-top: var(--space-5);
	}

	.hero-grid,
	.first-time {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--feature-min), 1fr));
		gap: var(--space-7);
		align-items: center;
	}

	.hero-grid {
		gap: var(--space-5);
	}

	.identity {
		padding-block: 0;
	}

	.kicker {
		margin-bottom: var(--space-3);
		color: var(--color-gold);
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	h1 {
		max-width: var(--reading-width);
		margin-bottom: var(--space-5);
		font-size: var(--text-display);
		font-weight: 900;
	}

	.lede {
		max-width: var(--reading-width);
		margin-bottom: 0;
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}

	.hero-photo {
		margin-top: var(--space-7);
		border: var(--border-heavy) solid var(--color-paper);
		background: var(--color-paper);
		box-shadow: var(--shadow-photo);
	}

	.hero-photo img,
	.first-time img {
		display: block;
		width: 100%;
	}

	.hero-photo figcaption,
	.first-time figcaption {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-2) var(--space-5);
		padding: var(--space-3) var(--space-4);
		background: var(--color-paper);
		color: var(--color-paper-ink);
		font-size: var(--text-small);
		font-weight: 750;
	}

	.first-time {
		margin-top: var(--section-gap);
	}

	.first-time figure {
		margin: 0;
		border: var(--border-heavy) solid var(--color-paper);
		background: var(--color-paper);
		transform: rotate(var(--photo-tilt));
	}

	.first-time h2 {
		margin-bottom: var(--space-5);
		font-size: var(--text-section);
		font-weight: 880;
	}

	.first-time p:not(.kicker) {
		max-width: var(--reading-width);
		color: var(--color-text-soft);
		font-size: var(--text-lede);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
