<script lang="ts">
	import { onMount } from "svelte";
	import { disableGoogleAutoSelect, loadGoogleIdentity } from "$lib/services/google-identity";

	interface Moderator {
		email: string;
		role: "owner" | "moderator";
		name: string | null;
		picture: string | null;
	}

	interface Props {
		moderator: Moderator;
	}

	let { moderator }: Props = $props();
	let accountRoot: HTMLDivElement;
	let menuOpen = $state(false);
	let imageFailed = $state(false);
	let signingOut = $state(false);
	const displayName = $derived(moderator.name?.trim() || moderator.email || "Organizer");
	const shortName = $derived(displayName.split(/\s+/)[0] || "Organizer");
	const initial = $derived(displayName.charAt(0).toUpperCase());

	onMount(() => {
		void loadGoogleIdentity().catch(() => undefined);

		const closeOutside = (event: PointerEvent) => {
			if (menuOpen && !accountRoot.contains(event.target as Node)) menuOpen = false;
		};
		const closeWithKeyboard = (event: KeyboardEvent) => {
			if (event.key === "Escape") menuOpen = false;
		};
		document.addEventListener("pointerdown", closeOutside);
		document.addEventListener("keydown", closeWithKeyboard);
		return () => {
			document.removeEventListener("pointerdown", closeOutside);
			document.removeEventListener("keydown", closeWithKeyboard);
		};
	});

	async function signOut(event: SubmitEvent) {
		if (signingOut) return;
		event.preventDefault();
		signingOut = true;
		await disableGoogleAutoSelect().catch(() => undefined);
		(event.currentTarget as HTMLFormElement).submit();
	}
</script>

<div class="account" bind:this={accountRoot}>
	<button
		type="button"
		class="account-button"
		aria-label={`Signed in as ${displayName}. Open organizer menu.`}
		aria-expanded={menuOpen}
		aria-haspopup="menu"
		onclick={() => (menuOpen = !menuOpen)}
	>
		<span class="avatar" aria-hidden="true">
			{#if moderator.picture && !imageFailed}
				<img src={moderator.picture} alt="" onerror={() => (imageFailed = true)} />
			{:else}
				<span>{initial}</span>
			{/if}
			<span class="presence"></span>
		</span>
		<span class="account-name">{shortName}</span>
		<svg class="chevron" viewBox="0 0 16 16" aria-hidden="true">
			<path d="m4 6 4 4 4-4" />
		</svg>
	</button>

	<div class:open={menuOpen} class="account-menu" role="menu" aria-label="Organizer account">
		<div class="identity">
			<strong>{displayName}</strong>
			<span>{moderator.email}</span>
			<small>{moderator.role === "owner" ? "Site owner" : "Gallery moderator"}</small>
		</div>
		<a href="/gallery/manage" role="menuitem">Manage gallery</a>
		{#if moderator.role === "owner"}
			<a href="/gallery/manage/moderators" role="menuitem">Moderators</a>
		{/if}
		<form method="POST" action="/gallery/manage/auth/sign-out" onsubmit={signOut}>
			<button type="submit" role="menuitem" disabled={signingOut}>
				{signingOut ? "Signing out…" : "Sign out"}
			</button>
		</form>
	</div>
</div>

<style>
	.account {
		position: relative;
		justify-self: end;
	}

	.account-button {
		display: inline-flex;
		height: var(--min-touch-target);
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding-inline: var(--space-2);
		border: var(--border-thin) solid transparent;
		border-radius: var(--radius-round);
		background: transparent;
		color: var(--color-text-soft);
		font-size: var(--text-small);
		font-weight: 800;
		text-decoration: none;
		cursor: pointer;
		transition:
			background var(--duration-fast) var(--ease-out),
			border-color var(--duration-fast) var(--ease-out),
			color var(--duration-fast) var(--ease-out);
	}

	.account-button:hover,
	.account-button[aria-expanded="true"] {
		border-color: var(--theme-stroke-strong);
		background: var(--theme-card-bg);
		color: var(--theme-selection-strong);
	}

	.avatar {
		display: grid;
		position: relative;
		width: var(--account-avatar-size);
		height: var(--account-avatar-size);
		flex: 0 0 auto;
		overflow: visible;
		place-items: center;
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-round);
		background: var(--theme-card-hover-bg);
		color: var(--theme-selection-strong);
		font-weight: 900;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		border-radius: inherit;
		object-fit: cover;
	}

	.presence {
		position: absolute;
		right: calc(var(--border-thin) * -1);
		bottom: calc(var(--border-thin) * -1);
		width: var(--presence-size);
		height: var(--presence-size);
		border: var(--border-medium) solid var(--theme-page-bg);
		border-radius: var(--radius-round);
		background: var(--semantic-success);
	}

	.account-name {
		max-width: var(--account-name-width);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chevron {
		width: var(--icon-size-small);
		height: var(--icon-size-small);
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.8;
		transition: transform var(--duration-fast) var(--ease-out);
	}

	.account-button[aria-expanded="true"] .chevron {
		transform: rotate(180deg);
	}

	.account-menu {
		display: grid;
		position: absolute;
		top: calc(100% + var(--space-2));
		right: 0;
		width: min(var(--account-menu-width), calc(100vw - (var(--page-gutter) * 2)));
		padding: var(--space-2);
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-large);
		background: color-mix(in srgb, var(--theme-panel-bg) 96%, transparent);
		box-shadow: var(--shadow-panel);
		opacity: 0;
		pointer-events: none;
		transform: translateY(calc(var(--space-2) * -1));
		visibility: hidden;
		transition:
			opacity var(--duration-normal) var(--ease-out),
			transform var(--duration-normal) var(--ease-out),
			visibility 0s linear var(--duration-normal);
		backdrop-filter: blur(var(--account-menu-blur));
	}

	.account-menu.open {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
		visibility: visible;
		transition-delay: 0s;
	}

	.identity {
		display: grid;
		gap: var(--space-1);
		padding: var(--space-3);
		border-bottom: var(--border-thin) solid var(--theme-stroke);
	}

	.identity strong,
	.identity span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.identity strong {
		color: var(--theme-text);
		font-size: var(--text-body);
	}

	.identity span,
	.identity small {
		color: var(--color-text-muted);
		font-size: var(--font-size-min);
	}

	.identity small {
		color: var(--semantic-success);
		font-weight: 760;
	}

	.account-menu a,
	.account-menu form button {
		display: flex;
		width: 100%;
		min-height: var(--min-touch-target);
		align-items: center;
		padding-inline: var(--space-3);
		border: 0;
		border-radius: var(--radius-medium);
		background: transparent;
		color: var(--color-text-soft);
		font-size: var(--font-size-min);
		font-weight: 760;
		text-decoration: none;
		cursor: pointer;
		transition:
			background var(--duration-fast) var(--ease-out),
			color var(--duration-fast) var(--ease-out);
	}

	.account-menu a:hover,
	.account-menu form button:hover {
		background: var(--theme-card-hover-bg);
		color: var(--theme-selection-strong);
	}

	.account-menu form {
		border-top: var(--border-thin) solid var(--theme-stroke);
	}

	.account-menu form button {
		color: var(--theme-food-strong);
	}

	@media (max-width: 34rem) {
		.account-name,
		.chevron {
			display: none;
		}
	}
</style>
