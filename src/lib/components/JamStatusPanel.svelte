<script lang="ts">
	import MapDialog from "$lib/components/MapDialog.svelte";
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
	</div>
	<h2 id="jam-status-title">{dateLabel}</h2>
	<p class="schedule">4ish to 10ish</p>

	<dl>
		<div>
			<dt>Where</dt>
			<dd>{siteDetails.location}</dd>
		</div>
		<div>
			<dt>Season</dt>
			<dd>Every Tuesday, April through October</dd>
		</div>
		<div>
			<dt>Details</dt>
			<dd>Free. All ages and skill levels. No signup.</dd>
		</div>
	</dl>

	<MapDialog />
</section>

<style>
	section {
		min-height: var(--status-reserve);
		padding: clamp(var(--space-4), 3vw, var(--space-5));
		border: var(--border-thin) solid
			color-mix(in srgb, var(--theme-accent) 28%, var(--theme-stroke));
		border-radius: var(--radius-large);
		background:
			radial-gradient(
				circle at 100% 0%,
				color-mix(in srgb, var(--theme-accent) 11%, transparent),
				transparent 42%
			),
			var(--theme-panel-bg);
		box-shadow: var(--shadow-panel);
		color: var(--theme-text);
	}

	.topline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2) var(--space-4);
		margin-bottom: var(--space-2);
		border-bottom: var(--border-thin) solid var(--theme-stroke);
	}

	.topline p,
	.schedule,
	dt {
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	.topline p {
		margin-bottom: var(--space-2);
		color: var(--theme-accent);
	}

	h2 {
		margin-bottom: var(--space-2);
		color: var(--brand-cream);
		font-size: var(--text-status);
		font-weight: 900;
	}

	.schedule {
		margin-bottom: var(--space-4);
	}

	dl {
		display: grid;
		gap: 0;
		margin-block: var(--space-4);
	}

	dl div {
		display: grid;
		grid-template-columns: minmax(var(--space-8), auto) 1fr;
		gap: var(--space-4);
		padding-block: var(--space-3);
		border-bottom: var(--border-thin) solid var(--theme-stroke);
	}

	dt,
	dd {
		margin: 0;
	}

	dd {
		font-size: var(--text-small);
		font-weight: 650;
	}

	@media (min-width: 48rem) and (max-height: 35rem) {
		section {
			min-height: 0;
			padding: var(--space-4);
		}

		h2 {
			font-size: clamp(2rem, 4vw, 3rem);
		}

		.schedule {
			margin-bottom: var(--space-2);
		}

		dl {
			margin-block: var(--space-2);
		}

		dl div {
			padding-block: var(--space-2);
		}
	}
</style>
