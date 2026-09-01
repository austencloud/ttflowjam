<script lang="ts">
	import { enhance } from "$app/forms";
	import ActionLink from "$lib/components/ActionLink.svelte";
	import PageMeta from "$lib/components/PageMeta.svelte";
	import type { ActionData, PageData } from "./$types";

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<PageMeta
	title="Gallery moderators"
	description="Manage access to the Taco Tuesday Flow Jam gallery."
	path="/gallery/manage/moderators"
/>

<svelte:head><meta name="robots" content="noindex, nofollow" /></svelte:head>

<div class="page">
	<header>
		<div>
			<p class="kicker">Gallery access</p>
			<h1>Moderators</h1>
			<p>Add their Google email. They can sign in immediately. Nothing is emailed.</p>
		</div>
		<ActionLink href="/gallery/manage" tone="outline">Back to gallery manager</ActionLink>
	</header>

	<form method="POST" action="?/add" use:enhance class="add-form">
		<label for="moderator-email">Google email</label>
		<div>
			<input
				id="moderator-email"
				name="email"
				type="email"
				autocomplete="email"
				placeholder="name@gmail.com"
				required
			/>
			<button type="submit">Add moderator</button>
		</div>
	</form>

	{#if form?.message}
		<p class:error={!form.success} class="notice" role="status">{form.message}</p>
	{/if}

	<ul class="moderators" aria-label="Current gallery moderators">
		{#each data.moderators as moderator (moderator.email)}
			<li>
				<div class="identity">
					{#if moderator.picture}
						<img
							src={moderator.picture}
							alt=""
							width="48"
							height="48"
							referrerpolicy="no-referrer"
						/>
					{:else}
						<span class="initial" aria-hidden="true">{moderator.email.charAt(0).toUpperCase()}</span>
					{/if}
					<div>
						<strong>{moderator.name ?? moderator.email}</strong>
						{#if moderator.name}<span>{moderator.email}</span>{/if}
						<small
							>{moderator.role === "owner"
								? "Owner"
								: moderator.signedIn
									? "Signed in"
									: "Ready to sign in"}</small
						>
					</div>
				</div>
				{#if moderator.role !== "owner"}
					<form method="POST" action="?/revoke" use:enhance>
						<input type="hidden" name="email" value={moderator.email} />
						<button class="revoke" type="submit">Remove access</button>
					</form>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.page {
		width: min(58rem, var(--shell-width));
		margin-inline: auto;
		padding-block: var(--space-7) var(--space-9);
	}

	header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-5);
		margin-bottom: var(--space-7);
	}

	header p:not(.kicker) {
		max-width: 42ch;
		margin-bottom: 0;
		color: var(--color-text-soft);
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

	.add-form {
		display: grid;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
		padding: var(--space-5);
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-large);
		background: var(--theme-panel-bg);
	}

	.add-form label {
		font-size: var(--font-size-min);
		font-weight: 800;
	}

	.add-form > div {
		display: flex;
		gap: var(--space-3);
	}

	input {
		min-width: 0;
		min-height: var(--min-touch-target);
		flex: 1;
		padding-inline: var(--space-4);
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-medium);
		background: var(--theme-card-bg);
		color: var(--theme-text);
	}

	button {
		min-height: var(--min-touch-target);
		padding-inline: var(--space-4);
		border: var(--border-thin) solid var(--theme-selection);
		border-radius: var(--radius-medium);
		background: var(--theme-selection);
		color: var(--theme-on-accent);
		font-weight: 850;
		cursor: pointer;
	}

	.notice {
		margin-bottom: var(--space-4);
		color: var(--semantic-success);
		font-size: var(--font-size-min);
		font-weight: 760;
	}

	.notice.error {
		color: var(--semantic-error);
	}

	.moderators {
		display: grid;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.moderators li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		border: var(--border-thin) solid var(--theme-stroke);
		border-radius: var(--radius-large);
		background: var(--theme-card-bg);
	}

	.identity {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: var(--space-3);
	}

	.identity img,
	.initial {
		width: 3rem;
		height: 3rem;
		flex: 0 0 auto;
		border-radius: var(--radius-round);
		object-fit: cover;
	}

	.initial {
		display: grid;
		place-items: center;
		background: color-mix(in srgb, var(--theme-led) 24%, var(--theme-panel-bg));
		color: var(--theme-selection);
		font-weight: 900;
	}

	.identity > div {
		display: grid;
		min-width: 0;
	}

	.identity strong,
	.identity span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.identity span,
	.identity small {
		color: var(--color-text-muted);
		font-size: var(--font-size-min);
	}

	.revoke {
		border-color: color-mix(in srgb, var(--semantic-error) 45%, var(--theme-stroke));
		background: transparent;
		color: var(--semantic-error);
	}

	@media (max-width: 40rem) {
		header,
		.add-form > div,
		.moderators li {
			align-items: stretch;
			flex-direction: column;
		}

		header :global(a) {
			align-self: start;
		}

		.revoke {
			width: 100%;
		}
	}
</style>
