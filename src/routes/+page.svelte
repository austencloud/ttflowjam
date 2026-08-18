<script lang="ts">
	import { jamStatus } from "$lib/services/jam-status";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";

	const status = jamStatus(new Date());

	const headline = {
		"on-now": "It's ON right now! 🔥",
		today: "It's on TONIGHT! 🌮",
		upcoming: "Next jam:",
		"off-season": "See you in spring! First jam:",
	}[status.state];

	const nextJamLabel = status.nextJam.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	const faqs = [
		{
			q: "Is it happening?",
			a: "Yes. Every Tuesday until the end of time. If the weather's bad, you'll just see fewer people.",
		},
		{
			q: "When does it start?",
			a: "When the first person shows up! Usually around 4ish. Most people are there 6–9. Park closes at 11.",
		},
		{
			q: "Are there tacos?",
			a: "Sometimes! Tacos are a communal effort. There's not always tacos, but there's always flowing TacoCats and good vibes. 🌀💞✨",
		},
	];
</script>

<svelte:head>
	<title>Taco Tuesday Flow Jam · Chicago</title>
	<meta
		name="description"
		content="A weekly celebration of flow arts, food, and community. Tuesdays 4ish-10ish, April-October, Palmer Square Park, Chicago."
	/>
</svelte:head>

<section class="hero">
	<img
		class="hero-photo"
		src="/media/hero.webp"
		alt="Jammers passing glowing LED juggling clubs at night in Palmer Square Park"
		fetchpriority="high"
	/>
	<div class="scrim" aria-hidden="true"></div>
	<div class="hero-content shell">
		<img
			class="mascot"
			src="/media/tacocat.png"
			alt="TacoCat, a cat tucked inside a taco holding a Taco Tuesday Flow Jams sign"
			width="140"
			height="140"
		/>
		<h1>Taco Tuesday Flow Jam</h1>
		<p class="tagline">A weekly celebration of flow arts, food, and community. Come play!</p>
		<div class="status-card">
			<GlassCard elevated>
				<p class="status">
					{headline}
					{#if status.state !== "on-now" && status.state !== "today"}
						<strong>{nextJamLabel}</strong>
					{/if}
				</p>
				<p class="where">Tuesdays 4ish–10ish · Palmer Square Park, 2200 N Kedzie Blvd</p>
			</GlassCard>
		</div>
	</div>
</section>

<section class="shell reveal">
	<SectionHeading kicker="The essentials" title="Frequently asked, honestly answered" />
	<div class="faq-grid">
		{#each faqs as faq (faq.q)}
			<GlassCard>
				<h3>{faq.q}</h3>
				<p>{faq.a}</p>
			</GlassCard>
		{/each}
	</div>
</section>

<section class="shell reveal beacon">
	<blockquote>
		“If you show up and you're the first one there, <em>congratulations!</em> You are now the
		beacon for others to find.”
	</blockquote>
	<p class="beacon-note">Look for us by the totem pole, center of the park on the north side.</p>
</section>

<section class="shell reveal duo">
	<img
		src="/media/night-passing.webp"
		alt="Two silhouetted jammers passing glowing juggling clubs under the park trees"
		width="1280"
		height="854"
	/>
	<div class="duo-copy">
		<SectionHeading kicker="New here?" title="Never flowed before? Perfect." />
		<p>
			Poi, hoops, staff, juggling, fans, slacklines. Flow arts are for playing, not performing.
			Someone will hand you a prop within five minutes of arriving. That's a promise and a threat.
		</p>
		<div class="cta-row">
			<a class="cta" href="/about">What's a flow jam?</a>
			<a class="cta ghost" href="https://photos.app.goo.gl/uNgZT4Zz6EBixmby7" rel="external">
				See the photos
			</a>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: min(88svh, 60rem);
		display: flex;
		align-items: flex-end;
		overflow: hidden;
	}

	.hero-photo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 35%;
	}

	.scrim {
		position: absolute;
		inset: 0;
		background: var(--gradient-dusk-scrim);
	}

	.hero-content {
		position: relative;
		width: 100%;
		text-align: center;
		padding-block: var(--spacing-2xl) var(--spacing-xl);
	}

	.mascot {
		width: clamp(96px, 14vw, 140px);
		height: auto;
		filter: drop-shadow(0 8px 24px oklch(0.05 0.02 270 / 0.6));
		animation: bob 6s ease-in-out infinite;
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-8px);
		}
	}

	h1 {
		margin: var(--spacing-sm) 0 0;
		font-size: var(--text-hero);
		font-style: italic;
		font-weight: 700;
		background: var(--gradient-fiesta);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	.tagline {
		margin: var(--spacing-sm) 0 var(--spacing-lg);
		font-size: var(--text-lede);
		color: var(--color-text-primary);
	}

	.status-card {
		max-width: 34rem;
		margin-inline: auto;
	}

	.status {
		margin: 0;
		font-size: 1.35rem;
	}

	.where {
		margin: var(--spacing-xs) 0 0;
		color: var(--color-text-secondary);
	}

	section:not(.hero) {
		margin-top: var(--spacing-2xl);
	}

	.faq-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(17rem, 100%), 1fr));
		gap: var(--spacing-lg);
	}

	.faq-grid h3 {
		margin: 0 0 var(--spacing-sm);
		font-size: 1.2rem;
		font-style: italic;
		color: var(--color-taco-gold);
	}

	.faq-grid p {
		margin: 0;
		color: var(--color-text-secondary);
	}

	.beacon blockquote {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-section);
		font-style: italic;
		font-weight: 500;
		text-align: center;
		max-width: 46rem;
		margin-inline: auto;
		text-wrap: balance;
	}

	.beacon-note {
		text-align: center;
		color: var(--color-text-muted);
		margin-top: var(--spacing-md);
	}

	.duo {
		display: grid;
		gap: var(--spacing-xl);
		align-items: center;
	}

	@media (min-width: 68rem) {
		.duo {
			grid-template-columns: 5fr 6fr;
		}
	}

	.duo img {
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
	}

	.duo-copy p {
		color: var(--color-text-secondary);
		font-size: var(--text-lede);
	}

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-md);
		margin-top: var(--spacing-lg);
	}

	.cta {
		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
		padding: 0 var(--spacing-lg);
		border-radius: var(--radius-md);
		background: var(--gradient-fiesta);
		color: #1a1305;
		font-weight: 650;
		text-decoration: none;
		box-shadow: 0 10px 28px oklch(0.65 0.15 70 / 0.3);
		transition:
			transform var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	.cta:hover {
		transform: translateY(var(--hover-lift));
		box-shadow: 0 14px 36px oklch(0.65 0.15 70 / 0.42);
	}

	.cta.ghost {
		background: transparent;
		color: var(--color-text-primary);
		border: 1px solid var(--glass-border-hover);
		box-shadow: none;
	}

	.cta.ghost:hover {
		background: var(--color-bg-card-hover);
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.mascot {
			animation: none;
		}
	}
</style>
