<script lang="ts">
	import SectionHeading from "$lib/components/SectionHeading.svelte";

	const links = [
		{
			emoji: "📘",
			label: "Facebook page",
			desc: "Announcements, weather calls, and a decade of taco lore.",
			href: "https://www.facebook.com/flowtaco",
		},
		{
			emoji: "😻",
			label: "TacoCat's Circus",
			desc: "The community group. Share your ideas for workshops, activities, and shenanigans.",
			href: "https://www.facebook.com/groups/257085130465999/",
		},
		{
			emoji: "📸",
			label: "Instagram",
			desc: "@flowtaco. Clips and photos from the park.",
			href: "https://www.instagram.com/flowtaco",
		},
		{
			emoji: "🖼️",
			label: "Community photo album",
			desc: "The shared Google Photos album. Add your shots from the jam!",
			href: "https://photos.app.goo.gl/uNgZT4Zz6EBixmby7",
		},
		{
			emoji: "📰",
			label: "Chicago Sun-Times feature",
			desc: "The jam made the paper in 2023.",
			href: "https://chicago.suntimes.com/2023/8/27/23814214/taco-tuesday-flow-jam-palmer-square",
		},
	];
</script>

<svelte:head>
	<title>Links · Taco Tuesday Flow Jam</title>
	<meta
		name="description"
		content="All the Taco Tuesday Flow Jam links: Facebook, Instagram, the community photo album, and the taco fund."
	/>
</svelte:head>

<div class="page shell">
	<SectionHeading kicker="Find us everywhere" title="The link pile" />
	<ul class="cards">
		{#each links as link (link.href)}
			<li>
				<a class="card" href={link.href} rel="external">
					<span class="emoji" aria-hidden="true">{link.emoji}</span>
					<span class="text">
						<span class="label">{link.label}</span>
						<span class="desc">{link.desc}</span>
					</span>
					<span class="arrow" aria-hidden="true">→</span>
				</a>
			</li>
		{/each}
	</ul>

	<section class="fund reveal">
		<SectionHeading kicker="Keep the griddle going" title="The taco fund" />
		<p>
			Tacos at the jam are a communal effort. If you flow and eat, please chip in <strong>$5</strong>
			to the taco fund. It buys the next round of tortillas.
		</p>
		<p class="paypal">Donate via PayPal: <strong>flowtacocat@gmail.com</strong></p>
	</section>
</div>

<style>
	.page {
		padding-top: var(--spacing-2xl);
	}

	.cards {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--spacing-md);
	}

	.card {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		min-height: var(--min-touch-target);
		padding: var(--spacing-md) var(--spacing-lg);
		border-radius: var(--radius-lg);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		box-shadow: var(--shadow-glass);
		color: var(--color-text-primary);
		text-decoration: none;
		transition:
			transform var(--transition-fast),
			border-color var(--transition-fast),
			background var(--transition-fast);
	}

	.card:hover {
		transform: translateY(var(--hover-lift));
		border-color: var(--glass-border-hover);
		background: var(--glass-bg-elevated);
	}

	.card:hover .arrow {
		transform: translateX(4px);
	}

	.emoji {
		font-size: 1.6rem;
	}

	.text {
		display: grid;
		gap: 2px;
	}

	.label {
		font-weight: 650;
	}

	.desc {
		color: var(--color-text-secondary);
		font-size: var(--font-size-min);
	}

	.arrow {
		margin-left: auto;
		color: var(--color-taco-gold);
		transition: transform var(--transition-fast);
	}

	.fund {
		margin-top: var(--spacing-2xl);
	}

	.fund p {
		color: var(--color-text-secondary);
		max-width: 60ch;
	}

	.paypal {
		font-size: var(--text-lede);
	}
</style>
