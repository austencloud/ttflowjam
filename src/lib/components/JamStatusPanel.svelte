<script lang="ts">
	import ActionLink from "$lib/components/ActionLink.svelte";
	import { siteDetails } from "$lib/data/site-details";
	import { formatJamDate, jamStatus } from "$lib/services/jam-status";

	const status = jamStatus(new Date());
	const dateLabel = formatJamDate(status.nextJam);
	const lead =
		status.state === "today"
			? "Tonight"
			: status.state === "off-season"
				? "First Tuesday back"
				: "Next Tuesday";
</script>

<section id="jam-status" aria-labelledby="jam-status-title">
	<div class="topline">
		<p>{lead}</p>
		<span>Calendar forecast</span>
	</div>
	<h2 id="jam-status-title">{dateLabel}</h2>
	<p class="schedule">4ish–10ish · free</p>

	<div class="call">
		<span aria-hidden="true"></span>
		<div>
			<strong>No weather call posted</strong>
			<p>The calendar points to Tuesday. Facebook has the human go/no-go call.</p>
		</div>
	</div>

	<dl>
		<div>
			<dt>Where</dt>
			<dd>{siteDetails.location}</dd>
		</div>
		<div>
			<dt>Who</dt>
			<dd>All ages and levels. No signup.</dd>
		</div>
		<div>
			<dt>Gear</dt>
			<dd>Bring a prop or borrow one at the park.</dd>
		</div>
	</dl>

	<div class="actions">
		<ActionLink href={siteDetails.mapUrl} tone="ink" external>Map the totem pole</ActionLink>
		<ActionLink href={siteDetails.facebookUrl} tone="outline" external>Check the call</ActionLink>
	</div>
</section>

<style>
	section {
		min-height: var(--status-reserve);
		padding: var(--space-5);
		border: var(--border-heavy) solid var(--color-paper-ink);
		border-radius: var(--radius-small);
		background-color: var(--color-paper);
		background-image: var(--texture-paper);
		box-shadow: var(--shadow-panel);
		color: var(--color-paper-ink);
	}

	.topline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2) var(--space-4);
		margin-bottom: var(--space-2);
		border-bottom: var(--border-medium) solid var(--color-paper-ink);
	}

	.topline p,
	.topline span,
	.schedule,
	dt {
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	.topline p {
		margin-bottom: var(--space-2);
	}

	.topline span {
		margin-bottom: var(--space-2);
		color: var(--color-red-deep);
	}

	h2 {
		margin-bottom: var(--space-2);
		font-size: var(--text-status);
		font-weight: 900;
	}

	.schedule {
		margin-bottom: var(--space-5);
	}

	.call {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-3);
		padding: var(--space-4);
		border: var(--border-medium) solid var(--color-red-deep);
		background: var(--color-paper-deep);
	}

	.call > span {
		width: var(--space-3);
		height: var(--space-3);
		margin-top: var(--space-1);
		border: var(--border-medium) solid var(--color-paper-ink);
		border-radius: var(--radius-round);
		background: var(--color-red);
	}

	.call strong {
		display: block;
		font-size: var(--text-card-title);
		line-height: 1.05;
	}

	.call p {
		margin: var(--space-2) 0 0;
		font-size: var(--text-small);
		line-height: 1.4;
	}

	dl {
		display: grid;
		gap: 0;
		margin-block: var(--space-5);
	}

	dl div {
		display: grid;
		grid-template-columns: minmax(var(--space-8), auto) 1fr;
		gap: var(--space-4);
		padding-block: var(--space-3);
		border-bottom: var(--border-thin) solid var(--color-paper-ink);
	}

	dt,
	dd {
		margin: 0;
	}

	dd {
		font-size: var(--text-small);
		font-weight: 650;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.actions :global(.outline) {
		border-color: var(--color-paper-ink);
		background: transparent;
		color: var(--color-paper-ink);
	}
</style>
