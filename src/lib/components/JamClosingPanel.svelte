<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import { siteDetails } from "$lib/data/site-details";
	import { formatJamDate, jamStatus } from "$lib/services/jam-status";

	const status = jamStatus(new Date());
	const dateLabel = formatJamDate(status.nextJam);
	const lead =
		status.state === "today"
			? "Tonight at Palmer Square"
			: status.state === "off-season"
				? "The first Tuesday back"
				: "Next Tuesday at Palmer Square";
</script>

<aside aria-labelledby="closing-title">
	<div class="inner">
		<div>
			<p class="kicker">{lead}</p>
			<h2 id="closing-title">{dateLabel}</h2>
			<p>{siteDetails.schedule}. Free, no signup, and beginner-friendly.</p>
		</div>
		<div class="actions">
			<ActionLink href={siteDetails.mapUrl} external>Map the totem pole</ActionLink>
			<ActionLink href={siteDetails.facebookUrl} tone="outline" external>Weather call</ActionLink>
			<ActionLink href={siteDetails.paypalUrl} tone="quiet" external>Taco fund</ActionLink>
		</div>
	</div>
</aside>

<style>
	aside {
		width: var(--shell-width);
		margin: var(--section-gap) auto 0;
		padding: var(--space-6);
		border: var(--border-medium) solid var(--color-line);
		border-left: var(--border-heavy) solid var(--color-red);
		background: var(--color-night-panel);
	}

	.inner {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--closing-min), 1fr));
		gap: var(--space-6);
		align-items: end;
	}

	.kicker {
		margin-bottom: var(--space-2);
		color: var(--color-gold);
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	h2 {
		margin-bottom: var(--space-3);
		font-size: var(--text-section);
		font-weight: 880;
	}

	p:last-child {
		max-width: var(--reading-width);
		margin-bottom: 0;
		color: var(--color-text-soft);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		justify-content: flex-end;
	}
</style>
