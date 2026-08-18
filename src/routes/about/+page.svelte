<script lang="ts">
	import GlassCard from "$lib/components/GlassCard.svelte";
	import SectionHeading from "$lib/components/SectionHeading.svelte";

	const bring = [
		"Juggling props, hoops, poi, staffs, fans, toys of all kinds",
		"Slacklines and yoga mats",
		"A hungry belly (and maybe tacos to share)",
		"Sunscreen and bug spray",
		"Your enthusiasm to learn",
	];
</script>

<svelte:head>
	<title>About · Taco Tuesday Flow Jam</title>
	<meta
		name="description"
		content="What flow arts are, how the jam started in 2017, and why a cat in a taco is our glorious deity. Palmer Square Park, Chicago, every Tuesday in season."
	/>
</svelte:head>

<div class="page shell">
	<section class="reveal">
		<SectionHeading kicker="What is this?" title="Flow arts, tacos, and a park full of friends" />
		<p class="lede">
			Flow arts are movement play: spinning poi, dancing with hoops, juggling clubs, tossing
			staffs, walking slacklines. Any prop that gets your body and brain into that sweet
			locked-in feeling people call <em>flow</em> counts. No experience needed, no audience, no
			pressure. Come watch, come learn, come teach. Someone will happily show you their
			favorite trick.
		</p>
	</section>

	<section class="reveal">
		<SectionHeading kicker="The origin story" title="From a lightbulb to year nine" />
		<p>
			The first ever Taco Tuesday Flow Jam happened on <strong>April 11, 2017</strong>, meeting
			at the eagle statue by the Logan Square Blue Line. One week later the jam moved a few
			blocks west to Palmer Square Park for, in the founders' own words,
			<em>"more space and nicer grass!"</em> It never left.
		</p>
		<p>
			It's been running every summer since: rain or shine, tacos or no tacos, now deep into
			<strong>year nine</strong>. There's no sign-up and no organizer you're waiting on.
			Taco Tuesday happens because <strong>you</strong> show up. Your presence is the event.
		</p>
	</section>

	<section class="reveal">
		<SectionHeading kicker="What to bring" title="Pack light, play hard" />
		<ul>
			{#each bring as item (item)}
				<li>{item}</li>
			{/each}
		</ul>
		<p class="ethos">
			This is a <strong>Leave It Better</strong> event: we leave the park cleaner than we
			found it, every single week.
		</p>
	</section>

	<section class="reveal tacocat">
		<img
			src="/media/tacocat.png"
			alt="TacoCat, a cat tucked inside a taco holding a Taco Tuesday Flow Jams sign"
			width="220"
			height="220"
		/>
		<div>
			<SectionHeading kicker="Required theology" title="Who is TacoCat?" />
			<p>
				TacoCat is our glorious deity: the prolific and powerful palindrome in the sky. Spelled
				the same forwards and backwards, worshipped the same rain or shine. Every jam is held
				in TacoCat's honor, and TacoCat loves you. 😻🌮
			</p>
		</div>
	</section>

	<section class="reveal">
		<GlassCard>
			<h3>The fine print (there isn't much)</h3>
			<p>
				Free, all ages, all levels, every Tuesday April through October. Fire props only where
				legal and safe (ask the regulars). The jam is maintained by word of mouth and the taco
				fund; if you eat tacos, a $5 donation keeps the griddle going.
			</p>
		</GlassCard>
	</section>

	<img
		class="closing reveal"
		src="/media/night-smiles.webp"
		alt="Smiling jammers juggling glowing LED clubs at night in the park"
		width="1280"
		height="854"
	/>
</div>

<style>
	.page {
		padding-top: var(--spacing-2xl);
	}

	section {
		margin-bottom: var(--spacing-2xl);
	}

	.lede {
		font-size: var(--text-lede);
		color: var(--color-text-secondary);
		max-width: 60ch;
	}

	p {
		color: var(--color-text-secondary);
		max-width: 65ch;
	}

	ul {
		margin: 0;
		padding-left: 1.2em;
		color: var(--color-text-secondary);
	}

	li {
		margin-bottom: var(--spacing-xs);
	}

	.ethos {
		margin-top: var(--spacing-md);
	}

	.tacocat {
		display: grid;
		gap: var(--spacing-xl);
		align-items: center;
	}

	@media (min-width: 52rem) {
		.tacocat {
			grid-template-columns: auto 1fr;
		}
	}

	.tacocat img {
		width: clamp(160px, 20vw, 220px);
		height: auto;
		filter: drop-shadow(0 8px 24px oklch(0.05 0.02 270 / 0.5));
		justify-self: center;
	}

	h3 {
		margin: 0 0 var(--spacing-sm);
		font-style: italic;
		color: var(--color-taco-gold);
	}

	.closing {
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
	}
</style>
