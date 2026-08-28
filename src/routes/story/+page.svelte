<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";
	import { siteDetails } from "$lib/data/site-details";
</script>

<PageMeta
	title="The story"
	description="The 2017 start of Taco Tuesday Flow Jam, its move to Palmer Square Park, and the TacoCat mascot."
	path="/story"
/>

<div class="page">
	<div class="lead-grid">
		<header class="intro">
			<p class="kicker">History</p>
			<h1>Started in 2017.</h1>
			<p>
				The first jam met near the Logan Square Blue Line on April 11, 2017. It moved to Palmer
				Square Park the following week.
			</p>
		</header>

		<figure class="lead-photo">
			<picture>
				<source
					srcset="/media/park-noticeboard/story-640.webp 640w, /media/park-noticeboard/story-1280.webp 1280w"
				/>
				<img
					src="/media/park-noticeboard/story-640.webp"
					alt="Two Taco Tuesday Flow Jam regulars making faces at the camera while wearing a clown nose, red yarn wig, and oversized green sunglasses"
					width="1280"
					height="960"
					fetchpriority="high"
				/>
			</picture>
			<figcaption>Taco Tuesday Flow Jam participants at Palmer Square Park</figcaption>
		</figure>
	</div>

	<section class="timeline">
		<SectionHeading kicker="April 2017" title="The first two jams" />
		<div class="entries">
			<article>
				<p class="date">April 11, 2017</p>
				<h2>Logan Square</h2>
				<p>The first jam met at the eagle statue near the Logan Square Blue Line station.</p>
			</article>
			<article>
				<p class="date">April 18, 2017</p>
				<h2>Palmer Square</h2>
				<p>
					The jam moved to Palmer Square Park. The totem pole became the meeting landmark, and the
					jam has returned there each season.
				</p>
			</article>
		</div>
	</section>

	<section class="continuity">
		<div>
			<p class="kicker">Organization</p>
			<h2>Self-organized</h2>
		</div>
		<div class="prose">
			<p>
				The jam has no staff, ticketing, or formal organization. Participants bring props, share
				gear, and contribute food on scheduled taco nights.
			</p>
			<ActionLink href={siteDetails.pressUrl} tone="quiet" external
				>Read the 2023 Sun-Times feature</ActionLink
			>
		</div>
	</section>

	<section class="mascot">
		<img
			src="/media/tacocat.png"
			alt="TacoCat, a cat tucked inside a taco holding a Taco Tuesday Flow Jams sign"
			width="320"
			height="320"
			loading="lazy"
			decoding="async"
		/>
		<div>
			<p class="kicker">Mascot</p>
			<h2>TacoCat</h2>
			<p>TacoCat is the jam's mascot. The name is a palindrome.</p>
		</div>
	</section>

	<figure class="night-photo">
		<picture>
			<source
				srcset="/media/park-noticeboard/night-led-720.webp 720w, /media/park-noticeboard/night-led-1600.webp 1600w"
			/>
			<img
				src="/media/park-noticeboard/night-led-720.webp"
				alt="A flow artist spinning bright multicolor LED fans after dark at the jam"
				width="1600"
				height="1067"
				loading="lazy"
				decoding="async"
			/>
		</picture>
		<figcaption>LED fan spinning after sunset at Palmer Square Park</figcaption>
	</figure>
</div>

<style>
	.page {
		width: var(--shell-width);
		margin-inline: auto;
		padding-top: var(--space-7);
	}

	.intro {
		max-width: var(--reading-width);
	}

	.lead-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--feature-min), 1fr));
		gap: var(--space-7);
		align-items: center;
	}

	.kicker,
	.date {
		margin-bottom: var(--space-3);
		color: var(--color-gold);
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	h1 {
		margin-bottom: var(--space-5);
		font-family: var(--font-story);
		font-size: var(--text-page);
		font-weight: 620;
	}

	.intro > p:last-child {
		color: var(--color-text-soft);
		font-family: var(--font-story);
		font-size: var(--text-lede);
	}

	.lead-photo,
	.night-photo {
		margin: 0;
		border: var(--border-heavy) solid var(--color-paper);
		background: var(--color-paper);
	}

	.lead-photo {
		width: 100%;
		box-shadow: var(--shadow-photo);
		transform: rotate(var(--photo-tilt));
	}

	.lead-photo img,
	.night-photo img {
		display: block;
		width: 100%;
	}

	figcaption {
		padding: var(--space-3) var(--space-4);
		background: var(--color-paper);
		color: var(--color-paper-ink);
		font-family: var(--font-story);
		font-size: var(--text-small);
		font-style: italic;
		font-weight: 620;
	}

	.timeline,
	.continuity,
	.mascot,
	.night-photo {
		margin-top: var(--section-gap);
	}

	.entries {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--feature-min), 1fr));
		gap: var(--space-4);
	}

	.entries article {
		padding: var(--space-6);
		border: var(--border-thin) solid var(--color-line);
		background: var(--color-night-raised);
	}

	.entries h2 {
		margin-bottom: var(--space-3);
		font-family: var(--font-story);
		font-size: var(--text-section);
		font-weight: 620;
	}

	.entries p:last-child,
	.prose,
	.mascot p:last-child {
		color: var(--color-text-soft);
	}

	.entries p:last-child {
		margin-bottom: 0;
	}

	.continuity {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--feature-min), 1fr));
		gap: var(--space-7);
		padding-block: var(--space-7);
		border-block: var(--border-heavy) solid var(--color-red);
	}

	.continuity h2,
	.mascot h2 {
		margin-bottom: var(--space-5);
		font-family: var(--font-story);
		font-size: var(--text-section);
		font-weight: 620;
	}

	.prose {
		max-width: var(--reading-width);
	}

	.prose p {
		margin-bottom: var(--space-5);
	}

	.mascot {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--feature-min), 1fr));
		gap: var(--space-7);
		align-items: center;
		padding: var(--space-6);
		border: var(--border-heavy) solid var(--color-paper-ink);
		background-color: var(--color-paper);
		background-image: var(--texture-paper);
		box-shadow: var(--shadow-panel);
		color: var(--color-paper-ink);
	}

	.mascot img {
		width: min(100%, var(--status-reserve));
		justify-self: center;
	}

	.mascot .kicker {
		color: var(--color-red-deep);
	}

	.mascot p:last-child {
		color: var(--color-paper-ink);
	}

	.night-photo {
		box-shadow: var(--shadow-panel);
	}
</style>
