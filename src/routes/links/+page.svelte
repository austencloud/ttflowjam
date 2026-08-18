<script lang="ts">
	import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
	import { faCat, faImages, faNewspaper } from "@fortawesome/free-solid-svg-icons";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";

	const links = [
		{
			icon: faFacebook,
			label: "Facebook page",
			desc: "Announcements, weather calls, and a decade of taco lore.",
			href: "https://www.facebook.com/flowtaco",
		},
		{
			icon: faCat,
			label: "TacoCat's Circus",
			desc: "The community group. Share your ideas for workshops, activities, and shenanigans.",
			href: "https://www.facebook.com/groups/257085130465999/",
		},
		{
			icon: faInstagram,
			label: "Instagram",
			desc: "@flowtaco. Clips and photos from the park.",
			href: "https://www.instagram.com/flowtaco",
		},
		{
			icon: faImages,
			label: "Community photo album",
			desc: "The shared Google Photos album. Add your shots from the jam!",
			href: "https://photos.app.goo.gl/uNgZT4Zz6EBixmby7",
		},
		{
			icon: faNewspaper,
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
				<GlassCard href={link.href}>
					<span class="row">
						<span class="glyph"><Icon icon={link.icon} size="1.5rem" /></span>
						<span class="text">
							<span class="label">{link.label}</span>
							<span class="desc">{link.desc}</span>
						</span>
						<span class="arrow" aria-hidden="true">→</span>
					</span>
				</GlassCard>
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

	.row {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		min-height: var(--min-touch-target);
	}

	li:hover .arrow {
		transform: translateX(4px);
	}

	.glyph {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-md);
		background: oklch(0.75 0.13 75 / 0.12);
		color: var(--color-taco-gold);
		flex-shrink: 0;
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
