<script lang="ts">
	import { flip } from "svelte/animate";
	import { onDestroy, tick } from "svelte";
	import ActionLink from "$lib/components/ActionLink.svelte";
	import EmbeddedGoogleForm from "$lib/components/EmbeddedGoogleForm.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import { siteDetails } from "$lib/data/site-details";
	import { withGoogleFormJamDate } from "$lib/services/google-form-jam-date";
	import { findNewSignupIds } from "$lib/services/help-out-signup-updates";
	import type { HelpOutSignup } from "$lib/services/help-out-signups";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let signups = $derived<HelpOutSignup[]>(data.signups);
	let signupsAvailable = $derived(data.signupsAvailable);
	let celebratedSignupIds = $state<Set<string>>(new Set());
	let signupAnnouncement = $state("");
	let signupList: HTMLElement;
	let prefersReducedMotion = $state(false);
	let selectedChoice = $state<"pitch-in" | "classes" | null>(null);
	let selectedJamDateOverride = $state<string | null>(null);
	let refreshRun = 0;
	let selectedJamDate = $derived(selectedJamDateOverride ?? data.jamDates[0]?.iso ?? "");
	let selectedJam = $derived(
		data.jamDates.find((jamDate) => jamDate.iso === selectedJamDate) ?? data.jamDates[0]
	);
	let selectedJamSignups = $derived(signups.filter((signup) => signup.jamDate === selectedJamDate));
	let helpOutFormUrl = $derived(
		selectedJam
			? withGoogleFormJamDate(
					siteDetails.helpOutFormUrl,
					siteDetails.helpOutJamDateEntryId,
					selectedJam.date
				)
			: siteDetails.helpOutFormUrl
	);
	let helpOutFormEmbedUrl = $derived(
		selectedJam
			? withGoogleFormJamDate(
					siteDetails.helpOutFormEmbedUrl,
					siteDetails.helpOutJamDateEntryId,
					selectedJam.date
				)
			: siteDetails.helpOutFormEmbedUrl
	);
	let classFormUrl = $derived(
		selectedJam
			? withGoogleFormJamDate(
					siteDetails.classProposalFormUrl,
					siteDetails.classProposalJamDateEntryId,
					selectedJam.date
				)
			: siteDetails.classProposalFormUrl
	);
	let classFormEmbedUrl = $derived(
		selectedJam
			? withGoogleFormJamDate(
					siteDetails.classProposalFormEmbedUrl,
					siteDetails.classProposalJamDateEntryId,
					selectedJam.date
				)
			: siteDetails.classProposalFormEmbedUrl
	);

	const signupRefreshAttempts = 20;
	const signupRefreshInterval = 750;
	const listMotionDuration = 240;

	$effect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updateMotionPreference = () => (prefersReducedMotion = mediaQuery.matches);

		updateMotionPreference();
		mediaQuery.addEventListener("change", updateMotionPreference);
		return () => mediaQuery.removeEventListener("change", updateMotionPreference);
	});

	onDestroy(() => {
		refreshRun += 1;
	});

	async function waitForNextRefresh() {
		await new Promise((resolve) => window.setTimeout(resolve, signupRefreshInterval));
	}

	async function refreshSignupsAfterSubmit() {
		const activeRun = ++refreshRun;
		const signupsBeforeSubmit = selectedJamSignups;

		for (let attempt = 0; attempt < signupRefreshAttempts; attempt += 1) {
			try {
				const response = await fetch(`/help-out/signups?refresh=${Date.now()}`, {
					cache: "no-store",
					headers: { accept: "application/json" },
				});

				if (activeRun !== refreshRun) return;
				if (!response.ok) {
					await waitForNextRefresh();
					continue;
				}

				const refreshed = (await response.json()) as { signups: HelpOutSignup[] };
				const refreshedJamSignups = refreshed.signups.filter(
					(signup) => signup.jamDate === selectedJamDate
				);
				const newSignupIds = findNewSignupIds(signupsBeforeSubmit, refreshedJamSignups);

				signups = refreshed.signups;
				signupsAvailable = true;

				if (newSignupIds.length > 0) {
					celebratedSignupIds = new Set(newSignupIds);
					signupAnnouncement = "You’re on the list!";
					await tick();
					signupList.scrollIntoView({
						behavior: prefersReducedMotion ? "auto" : "smooth",
						block: "center",
					});
					return;
				}
			} catch {
				// The response sheet can take a moment to publish the newest row. Retrying keeps that delay invisible.
			}

			await waitForNextRefresh();
		}
	}

	function toggleChoice(choice: "pitch-in" | "classes") {
		if (selectedChoice === choice) {
			selectedChoice = null;
			return;
		}

		selectedChoice = choice;
	}

	function selectJamDate(date: string) {
		refreshRun += 1;
		selectedJamDateOverride = date;
		celebratedSignupIds = new Set();
		signupAnnouncement = "";
	}
</script>

<PageMeta title="Volunteer" description="Volunteer at Taco Tuesday Flow Jam." path="/help-out" />

<main class="page">
	<header class="page-heading">
		<picture class="heading-photo" aria-hidden="true">
			<source
				srcset="/media/park-noticeboard/hero-group-720.webp 720w, /media/park-noticeboard/hero-group-1200.webp 1200w, /media/park-noticeboard/hero-group-1920.webp 1920w"
				sizes="(max-width: 48rem) calc(100vw - 2rem), 82rem"
			/>
			<img
				src="/media/park-noticeboard/hero-group-1200.webp"
				alt=""
				width="1200"
				height="800"
				fetchpriority="high"
			/>
		</picture>
		<div class="heading-copy">
			<h1>Volunteer</h1>
			<p>Help the jam or bring a class.</p>
		</div>
	</header>

	<section aria-label="Volunteer" class="page-section volunteer-section">
		<div class="jam-date-picker">
			<div class="jam-date-copy">
				<span>Choose a jam</span>
				<label for="jam-date">Which Tuesday are you signing up for?</label>
			</div>
			<div class="select-shell">
				<select
					id="jam-date"
					value={selectedJamDate}
					onchange={(event) => selectJamDate(event.currentTarget.value)}
				>
					{#each data.jamDates as jamDate}
						<option value={jamDate.iso}>{jamDate.label}</option>
					{/each}
				</select>
				<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
					<path d="m6 9 6 6 6-6" />
				</svg>
			</div>
		</div>

		<div class:has-selection={selectedChoice !== null} class="volunteer-options">
			<button
				type="button"
				class:active={selectedChoice === "pitch-in"}
				class="choice-trigger pitch-in-choice"
				aria-expanded={selectedChoice === "pitch-in"}
				aria-controls="pitch-in-panel"
				onclick={() => toggleChoice("pitch-in")}
			>
				<span class="choice-copy">
					<strong>Help with the jam</strong>
					<span>Set up, clean up, or bring something for {selectedJam?.shortLabel}.</span>
				</span>
				<span class="choice-chevron" aria-hidden="true">
					<svg viewBox="0 0 24 24" width="24" height="24">
						<path d="m6 9 6 6 6-6" />
					</svg>
				</span>
			</button>

			<button
				type="button"
				class:active={selectedChoice === "classes"}
				class="choice-trigger classes-choice"
				aria-expanded={selectedChoice === "classes"}
				aria-controls="classes-panel"
				onclick={() => toggleChoice("classes")}
			>
				<span class="choice-copy">
					<strong>Classes</strong>
					<span>Teach a donation-based class or request one for {selectedJam?.shortLabel}.</span>
				</span>
				<span class="choice-chevron" aria-hidden="true">
					<svg viewBox="0 0 24 24" width="24" height="24">
						<path d="m6 9 6 6 6-6" />
					</svg>
				</span>
			</button>
		</div>

		<div class="volunteer-panels">
			<div
				id="pitch-in-panel"
				class:open={selectedChoice === "pitch-in"}
				class="choice-disclosure"
				aria-hidden={selectedChoice !== "pitch-in"}
				inert={selectedChoice !== "pitch-in"}
			>
				<div class="choice-clip">
					<div class="choice-content">
						<div class="pitch-grid">
							<EmbeddedGoogleForm
								src={helpOutFormEmbedUrl}
								title="Taco Tuesday volunteer signup"
								fallbackHref={helpOutFormUrl}
								onSubmitted={refreshSignupsAfterSubmit}
							/>

							<div class="support-rail">
								<aside
									bind:this={signupList}
									aria-labelledby="signup-list-title"
									class="signup-list"
								>
									<div class="signup-list-heading">
										<h2 id="signup-list-title">Who’s helping</h2>
										<p>{selectedJam?.label}</p>
									</div>

									<div class:show={signupAnnouncement} class="celebration-shell" aria-live="polite">
										<div class="celebration-clip">
											<div class="celebration">
												<span class="celebration-check" aria-hidden="true">✓</span>
												<strong>{signupAnnouncement}</strong>
												<span class="celebration-spark" aria-hidden="true">✦</span>
											</div>
										</div>
									</div>

									{#if !signupsAvailable}
										<p class="empty-state">
											The signup list could not be loaded. The form still works.
										</p>
									{:else if selectedJamSignups.length === 0}
										<p class="empty-state">No one has signed up for this Tuesday yet.</p>
									{:else}
										<ul class="signups">
											{#each selectedJamSignups as signup (signup.id)}
												<li
													animate:flip={{
														duration: prefersReducedMotion ? 0 : listMotionDuration,
													}}
													class:just-added={celebratedSignupIds.has(signup.id)}
												>
													<div class="signup-name-row">
														<strong>{signup.name}</strong>
														{#if celebratedSignupIds.has(signup.id)}
															<span class="added-badge" aria-hidden="true">✓ Added</span>
														{/if}
													</div>
													{#if signup.helpingWith.length > 0}
														<ul class="commitments" aria-label={`${signup.name} is helping with`}>
															{#each signup.helpingWith as commitment}
																<li
																	class:setup={commitment === "Set up"}
																	class:cleanup={commitment === "Clean up"}
																	class:contribution={commitment === "Bringing something"}
																>
																	{commitment}
																</li>
															{/each}
														</ul>
													{/if}
													{#if signup.bringing}
														<p class="bringing"><span>Bringing</span> {signup.bringing}</p>
													{/if}
												</li>
											{/each}
										</ul>
									{/if}

									<div class="signup-list-footer">
										<ActionLink href={siteDetails.helpOutSheetUrl} tone="outline" external
											>View signup sheet</ActionLink
										>
									</div>
								</aside>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				id="classes-panel"
				class:open={selectedChoice === "classes"}
				class="choice-disclosure"
				aria-hidden={selectedChoice !== "classes"}
				inert={selectedChoice !== "classes"}
			>
				<div class="choice-clip">
					<div class="choice-content class-content">
						<div class="class-form">
							<EmbeddedGoogleForm
								src={classFormEmbedUrl}
								title="Taco Tuesday class form"
								fallbackHref={classFormUrl}
								size="classes"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<style>
	.page {
		display: grid;
		align-content: start;
		gap: var(--help-page-section-gap);
		width: min(var(--shell-width), var(--help-page-width));
		min-height: calc(100svh - var(--header-offset) - 5.75rem);
		margin-inline: auto;
		padding-block: clamp(var(--space-4), 3vw, var(--space-7))
			clamp(var(--space-7), 5vw, var(--space-8));
	}

	.page-heading {
		position: relative;
		isolation: isolate;
		display: grid;
		place-items: center;
		min-height: clamp(13rem, 21vw, 18rem);
		overflow: hidden;
		padding: clamp(var(--space-6), 6vw, var(--space-9)) var(--space-5);
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: clamp(var(--radius-large), 3vw, 2.5rem);
		box-shadow: var(--shadow-photo);
		text-align: center;
	}

	.page-heading::after {
		position: absolute;
		z-index: -1;
		inset: 0;
		background:
			linear-gradient(
				180deg,
				rgb(11 11 16 / 0.08) 0%,
				rgb(11 11 16 / 0.28) 42%,
				rgb(11 11 16 / 0.78) 100%
			),
			radial-gradient(circle at 50% 40%, transparent 30%, rgb(11 11 16 / 0.3) 100%);
		content: "";
	}

	.heading-photo,
	.heading-photo img {
		position: absolute;
		z-index: -2;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.heading-photo img {
		object-fit: cover;
		object-position: center 62%;
	}

	.heading-copy {
		max-width: var(--reading-width);
		text-shadow: 0 0.18rem 1rem rgb(0 0 0 / 0.72);
	}

	h1 {
		margin-bottom: var(--space-3);
		font-size: var(--text-page);
		font-weight: 900;
		letter-spacing: var(--tracking-tight);
	}

	.page-heading p {
		margin: 0;
		color: var(--theme-text-soft);
		font-size: var(--text-lede);
	}

	.page-heading p {
		color: var(--theme-text);
	}

	.page-section {
		display: grid;
		gap: var(--space-6);
	}

	.volunteer-section {
		display: grid;
		align-self: stretch;
		align-content: center;
		gap: var(--space-5);
		width: 100%;
		margin-inline: auto;
	}

	.jam-date-picker {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.72fr);
		align-items: center;
		gap: var(--space-5);
		padding: var(--space-5);
		border: var(--border-thin) solid color-mix(in srgb, var(--theme-led) 38%, var(--theme-stroke));
		border-radius: var(--radius-large);
		background: color-mix(in srgb, var(--theme-led) 7%, var(--theme-panel-bg));
		box-shadow: var(--shadow-panel);
	}

	.jam-date-copy {
		display: grid;
		gap: var(--space-2);
	}

	.jam-date-copy span {
		color: var(--theme-led);
		font-size: var(--text-small);
		font-weight: 850;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
	}

	.jam-date-copy label {
		font-size: var(--text-card-title);
		font-weight: 850;
		line-height: 1.15;
	}

	.select-shell {
		position: relative;
	}

	.select-shell select {
		width: 100%;
		min-height: var(--min-touch-target);
		appearance: none;
		padding: var(--space-3) calc(var(--space-6) + 1.25rem) var(--space-3) var(--space-4);
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-medium);
		background: var(--theme-card-bg);
		color: var(--theme-text);
		font: inherit;
		font-weight: 750;
		cursor: pointer;
	}

	.select-shell select:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}

	.select-shell svg {
		position: absolute;
		top: 50%;
		right: var(--space-4);
		fill: none;
		stroke: var(--theme-led);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2;
		pointer-events: none;
		transform: translateY(-50%);
	}

	.volunteer-options {
		position: relative;
		z-index: 4;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
		transition:
			padding var(--duration-normal) var(--ease-out),
			background var(--duration-normal) var(--ease-out),
			border-color var(--duration-normal) var(--ease-out),
			box-shadow var(--duration-normal) var(--ease-out);
	}

	.volunteer-options.has-selection {
		position: sticky;
		top: calc(var(--header-offset) + var(--space-2));
		padding: var(--space-2);
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-large);
		background: color-mix(in srgb, var(--theme-page-bg) 92%, transparent);
		box-shadow: var(--shadow-panel);
	}

	.choice-trigger {
		position: relative;
		overflow: hidden;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-5);
		width: 100%;
		min-height: 9rem;
		padding: clamp(var(--space-5), 3vw, var(--space-6));
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-large);
		background: var(--theme-panel-bg);
		color: var(--theme-text);
		box-shadow: var(--shadow-panel);
		text-align: left;
		cursor: pointer;
		transition:
			min-height var(--duration-normal) var(--ease-out),
			padding var(--duration-normal) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out),
			background var(--duration-fast) var(--ease-out),
			box-shadow var(--duration-fast) var(--ease-out);
	}

	.choice-trigger::before {
		position: absolute;
		inset: 0 auto 0 0;
		width: var(--border-heavy);
		background: var(--choice-color);
		content: "";
		opacity: 0.75;
		transition: opacity var(--duration-fast) var(--ease-out);
	}

	.pitch-in-choice {
		--choice-color: var(--theme-selection);
	}

	.classes-choice {
		--choice-color: var(--theme-spark);
	}

	.choice-trigger:hover,
	.choice-trigger.active {
		border-color: color-mix(in srgb, var(--choice-color) 58%, var(--theme-stroke));
		background: color-mix(in srgb, var(--choice-color) 7%, var(--theme-panel-bg));
	}

	.choice-trigger.active::before {
		opacity: 1;
	}

	.has-selection .choice-trigger {
		min-height: var(--min-touch-target);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-medium);
		box-shadow: none;
	}

	.choice-copy {
		display: grid;
		gap: var(--space-2);
		min-width: 0;
	}

	.choice-copy strong {
		font-size: clamp(1.5rem, 1.2rem + 0.8vw, 2.25rem);
		line-height: 1;
		letter-spacing: var(--tracking-tight);
		transition: font-size var(--duration-normal) var(--ease-out);
	}

	.choice-copy > span:last-child {
		overflow: hidden;
		max-width: 55ch;
		max-height: 3rem;
		color: var(--theme-text-soft);
		opacity: 1;
		transition:
			max-height var(--duration-normal) var(--ease-out),
			opacity var(--duration-fast) var(--ease-out);
	}

	.has-selection .choice-copy {
		gap: 0;
	}

	.has-selection .choice-copy strong {
		font-size: var(--text-card-title);
	}

	.has-selection .choice-copy > span:last-child {
		max-height: 0;
		opacity: 0;
	}

	.choice-chevron {
		display: grid;
		place-items: center;
		width: var(--min-touch-target);
		height: var(--min-touch-target);
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-round);
		background: var(--theme-card-bg);
		color: var(--choice-color);
		transition:
			transform var(--duration-normal) var(--ease-out),
			background var(--duration-fast) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out);
	}

	.choice-trigger:hover .choice-chevron,
	.choice-trigger.active .choice-chevron {
		border-color: var(--choice-color);
		background: color-mix(in srgb, var(--choice-color) 14%, var(--theme-card-bg));
	}

	.choice-trigger:focus-visible {
		box-shadow: none;
	}

	.choice-trigger:focus-visible .choice-chevron {
		box-shadow: var(--focus-ring);
	}

	.choice-trigger.active .choice-chevron {
		transform: rotate(180deg);
	}

	.choice-chevron svg {
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2;
	}

	.volunteer-panels {
		display: grid;
	}

	.choice-disclosure {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		visibility: hidden;
		transition:
			grid-template-rows var(--duration-normal) var(--ease-out),
			opacity var(--duration-fast) var(--ease-out),
			visibility 0s var(--duration-normal);
	}

	.choice-disclosure.open {
		grid-template-rows: 1fr;
		opacity: 1;
		visibility: visible;
		transition-delay: 0s;
	}

	.choice-clip {
		min-height: 0;
		overflow: hidden;
	}

	.choice-content {
		padding-top: var(--space-3);
	}

	.pitch-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.16fr) minmax(22rem, 0.84fr);
		align-items: start;
		gap: clamp(var(--space-5), 3vw, var(--space-7));
	}

	.support-rail {
		min-width: 0;
		container-type: inline-size;
	}

	.signup-list {
		overflow: hidden;
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-large);
		background: var(--theme-panel-bg);
		box-shadow: var(--shadow-panel);
	}

	.signup-list-heading {
		padding: var(--space-5);
		border-bottom: var(--border-thin) solid var(--theme-stroke);
	}

	.signup-list-heading h2 {
		margin: 0;
		font-size: var(--text-card-title);
		font-weight: 860;
	}

	.signup-list-heading p {
		margin: var(--space-2) 0 0;
		color: var(--theme-led);
		font-weight: 750;
	}

	.empty-state {
		margin: 0;
		padding: var(--space-6) var(--space-5);
		color: var(--theme-text-soft);
	}

	.celebration-shell {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		transition:
			grid-template-rows var(--duration-normal) var(--ease-out),
			opacity var(--duration-fast) var(--ease-out);
	}

	.celebration-shell.show {
		grid-template-rows: 1fr;
		opacity: 1;
	}

	.celebration-clip {
		min-height: 0;
		overflow: hidden;
	}

	.celebration {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin: var(--space-4);
		padding: var(--space-3) var(--space-4);
		border: var(--border-thin) solid color-mix(in srgb, var(--semantic-success) 48%, transparent);
		border-radius: var(--radius-medium);
		background: linear-gradient(
			115deg,
			color-mix(in srgb, var(--semantic-success) 16%, var(--theme-card-bg)),
			color-mix(in srgb, var(--theme-accent) 12%, var(--theme-card-bg))
		);
		color: var(--theme-text);
	}

	.celebration-check {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		flex: 0 0 auto;
		border-radius: var(--radius-round);
		background: var(--semantic-success);
		color: var(--theme-page-bg);
		font-weight: 900;
	}

	.celebration-spark {
		margin-left: auto;
		color: var(--theme-accent);
		font-size: 1.35rem;
		animation: celebration-spark calc(var(--duration-normal) * 3) var(--ease-out) both;
	}

	.signups,
	.commitments {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.signups {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.signups > li {
		display: grid;
		gap: var(--space-2);
		min-width: 0;
		padding: var(--space-3) var(--space-4);
		border-bottom: var(--border-thin) solid var(--theme-stroke);
		background: transparent;
		transition:
			background var(--duration-fast) var(--ease-out),
			box-shadow var(--duration-fast) var(--ease-out);
	}

	.signups > li:nth-child(even) {
		background: color-mix(in srgb, var(--theme-selection) 3%, transparent);
	}

	.signups > li:nth-child(odd) {
		border-right: var(--border-thin) solid var(--theme-stroke);
	}

	.signups > li.just-added {
		background: color-mix(in srgb, var(--semantic-success) 8%, var(--theme-panel-bg));
		animation: signup-arrival calc(var(--duration-normal) * 3) var(--ease-out) both;
	}

	.signups strong {
		font-size: var(--text-body);
		line-height: 1.1;
	}

	.signup-name-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.added-badge {
		flex: 0 0 auto;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-round);
		background: var(--semantic-success);
		color: var(--theme-page-bg);
		font-size: var(--text-small);
		font-weight: 850;
		line-height: 1;
	}

	.commitments {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.commitments li {
		padding: var(--space-2) var(--space-3);
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-round);
		background: var(--theme-card-bg);
		color: var(--theme-text-soft);
		font-size: var(--text-small);
		line-height: 1;
	}

	.commitments li.setup {
		border-color: color-mix(in srgb, var(--theme-selection) 52%, transparent);
		background: color-mix(in srgb, var(--theme-selection) 13%, var(--theme-card-bg));
		color: color-mix(in srgb, var(--theme-selection-strong) 78%, var(--theme-text));
	}

	.commitments li.cleanup {
		border-color: color-mix(in srgb, var(--semantic-success) 48%, transparent);
		background: color-mix(in srgb, var(--semantic-success) 11%, var(--theme-card-bg));
		color: color-mix(in srgb, var(--semantic-success) 78%, var(--theme-text));
	}

	.commitments li.contribution {
		border-color: color-mix(in srgb, var(--theme-spark) 48%, transparent);
		background: color-mix(in srgb, var(--theme-spark) 11%, var(--theme-card-bg));
		color: color-mix(in srgb, var(--theme-spark) 72%, var(--theme-text));
	}

	.bringing {
		margin: 0;
		color: var(--theme-text-soft);
	}

	.bringing span {
		margin-right: var(--space-2);
		color: var(--theme-accent);
		font-weight: 750;
	}

	.signup-list-footer {
		display: flex;
		justify-content: flex-end;
		padding: var(--space-4) var(--space-5);
		background: color-mix(in srgb, var(--theme-card-bg) 54%, transparent);
	}

	@keyframes celebration-spark {
		0% {
			opacity: 0;
			transform: scale(0.4) rotate(-45deg);
		}

		55% {
			opacity: 1;
			transform: scale(1.3) rotate(12deg);
		}

		100% {
			opacity: 1;
			transform: scale(1) rotate(0deg);
		}
	}

	@keyframes signup-arrival {
		0% {
			opacity: 0;
			box-shadow: inset 0 0 0 0 var(--semantic-success);
		}

		25% {
			opacity: 0;
		}

		70% {
			opacity: 1;
			box-shadow: inset 0 0 0 var(--border-medium) var(--semantic-success);
		}

		100% {
			opacity: 1;
			box-shadow: inset 0 0 0 var(--border-thin)
				color-mix(in srgb, var(--semantic-success) 52%, transparent);
		}
	}

	.class-form {
		width: min(100%, 68rem);
		margin-inline: auto;
	}

	@media (max-width: 64rem) {
		.jam-date-picker {
			grid-template-columns: 1fr;
		}

		.pitch-grid {
			grid-template-columns: 1fr;
		}

		.support-rail {
			order: -1;
		}
	}

	@media (max-width: 34rem) {
		.page {
			gap: var(--space-8);
			padding-block: var(--space-4) var(--space-8);
		}

		.page-heading {
			min-height: 12rem;
			padding-inline: var(--space-4);
		}

		.volunteer-options:not(.has-selection) {
			grid-template-columns: 1fr;
		}

		.volunteer-options.has-selection {
			gap: var(--space-2);
		}

		.choice-trigger {
			min-height: 0;
			padding: var(--space-5);
		}

		.has-selection .choice-trigger {
			gap: var(--space-2);
			padding: var(--space-3);
		}

		.choice-copy strong {
			font-size: 1.5rem;
		}

		.has-selection .choice-copy strong {
			font-size: var(--text-small);
			line-height: 1.15;
		}

		.has-selection .choice-chevron {
			width: 2.25rem;
			height: 2.25rem;
		}

		.signups > li {
			padding-inline: var(--space-4);
		}

		.signups {
			grid-template-columns: 1fr;
		}

		.signups > li:nth-child(odd) {
			border-right: 0;
		}

		.signup-list-footer {
			justify-content: stretch;
			padding-inline: var(--space-4);
		}

		.signup-list-footer :global(a) {
			width: 100%;
		}
	}

	@media (min-width: 48rem) and (max-height: 35rem) {
		.page {
			gap: var(--space-7);
			padding-block: var(--space-4) var(--space-7);
		}
	}
</style>
