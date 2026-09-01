<script module lang="ts">
	import type { GoogleCredentialResponse, GoogleIdentityApi } from "$lib/services/google-identity";

	type CredentialHandler = (credential: string) => void;

	const credentialHandlers = new Set<CredentialHandler>();
	let initializedClientId: string | null = null;

	function dispatchCredential(response: GoogleCredentialResponse) {
		for (const handler of credentialHandlers) handler(response.credential);
	}

	function initialize(google: GoogleIdentityApi, clientId: string) {
		if (initializedClientId === clientId) return;
		google.initialize({
			client_id: clientId,
			callback: dispatchCredential,
			auto_select: true,
			cancel_on_tap_outside: false,
			context: "signin",
			itp_support: true,
		});
		initializedClientId = clientId;
	}
</script>

<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { loadGoogleIdentity } from "$lib/services/google-identity";

	interface Props {
		clientId: string;
		onCredential: (credential: string) => void | Promise<void>;
		onUnavailable?: (message: string) => void;
	}

	let { clientId, onCredential, onUnavailable }: Props = $props();
	let buttonHost: HTMLDivElement;
	let google: Awaited<ReturnType<typeof loadGoogleIdentity>> | null = null;
	let promptTimer: ReturnType<typeof setTimeout> | null = null;
	let mounted = false;

	const handleCredential: CredentialHandler = (credential) => void onCredential(credential);

	onMount(async () => {
		mounted = true;
		credentialHandlers.add(handleCredential);
		try {
			google = await loadGoogleIdentity();
			if (!mounted) return;
			initialize(google, clientId);
			google.renderButton(buttonHost, {
				type: "standard",
				theme: "filled_black",
				size: "large",
				shape: "pill",
				text: "signin_with",
				logo_alignment: "left",
				width: Math.floor(Math.min(buttonHost.clientWidth, 320)),
			});
			promptTimer = setTimeout(() => google?.prompt(), 500);
		} catch {
			onUnavailable?.("Google sign-in could not load. Check your connection and try again.");
		}
	});

	onDestroy(() => {
		mounted = false;
		credentialHandlers.delete(handleCredential);
		if (promptTimer) clearTimeout(promptTimer);
		google?.cancel();
	});
</script>

<div class="google-button" bind:this={buttonHost} aria-label="Sign in with Google"></div>

<style>
	.google-button {
		display: grid;
		width: min(100%, var(--google-button-width));
		min-height: var(--min-touch-target);
		place-items: center;
	}
</style>
