<script lang="ts">
	import { untrack } from "svelte";
	import ActionLink from "$lib/components/ActionLink.svelte";
	import GoogleOneTap from "$lib/components/GoogleOneTap.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let errorMessage = $state(untrack(() => data.errorMessage));
	let signingIn = $state(false);

	async function handleCredential(credential: string) {
		signingIn = true;
		errorMessage = "";
		try {
			const response = await fetch("/gallery/manage/auth/google", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ credential }),
			});
			const result = (await response.json()) as { error?: string };
			if (!response.ok) {
				throw new Error(result.error || "Google sign-in did not finish. Please try again.");
			}
			window.location.assign("/gallery/manage");
		} catch (cause) {
			errorMessage = cause instanceof Error ? cause.message : "Google sign-in did not finish.";
			signingIn = false;
		}
	}
</script>

<PageMeta
	title="Moderator sign-in"
	description="Sign in to manage the Taco Tuesday Flow Jam gallery."
	path="/gallery/manage/sign-in"
/>

<svelte:head><meta name="robots" content="noindex, nofollow" /></svelte:head>

<div class="page">
	<section class="sign-in-card" aria-labelledby="sign-in-title">
		<p class="kicker">Gallery moderators</p>
		<h1 id="sign-in-title">Sign in</h1>
		<p class="lede">Use the Google account that was added to the moderator list.</p>

		{#if errorMessage}
			<p class="error" role="alert">{errorMessage}</p>
		{:else if signingIn}
			<p class="status" role="status">Signing in…</p>
		{/if}

		<div class="google-button">
			<GoogleOneTap
				clientId={data.clientId}
				onCredential={handleCredential}
				onUnavailable={(message) => (errorMessage = message)}
			/>
		</div>

		<ActionLink href="/gallery" tone="outline">Back to gallery</ActionLink>
	</section>
</div>

<style>
	.page {
		display: grid;
		width: var(--shell-width);
		min-height: min(42rem, calc(100svh - var(--header-offset)));
		margin-inline: auto;
		padding-block: var(--space-7) var(--space-9);
		place-items: center;
	}

	.sign-in-card {
		display: grid;
		width: min(31rem, 100%);
		justify-items: center;
		padding: clamp(var(--space-5), 6vw, var(--space-7));
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-large);
		background: var(--theme-panel-bg);
		box-shadow: var(--shadow-panel);
		text-align: center;
	}

	.kicker {
		margin-bottom: var(--space-2);
		color: var(--theme-selection);
		font-size: var(--text-small);
		font-weight: 820;
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}

	h1 {
		margin-bottom: var(--space-3);
		font-size: var(--text-section);
		font-weight: 900;
	}

	.lede {
		max-width: 29ch;
		margin-bottom: var(--space-5);
		color: var(--color-text-soft);
	}

	.error {
		width: 100%;
		margin-bottom: var(--space-4);
		padding: var(--space-3);
		border-radius: var(--radius-medium);
		background: color-mix(in srgb, var(--semantic-error) 12%, var(--theme-card-bg));
		color: var(--semantic-error);
		font-size: var(--font-size-min);
		font-weight: 760;
	}

	.status {
		margin-bottom: var(--space-4);
		color: var(--theme-selection);
		font-size: var(--font-size-min);
		font-weight: 760;
	}

	.google-button {
		display: grid;
		min-height: var(--min-touch-target);
		margin-bottom: var(--space-5);
		place-items: center;
	}
</style>
