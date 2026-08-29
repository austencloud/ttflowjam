<script lang="ts">
	interface Props {
		name: "facebook" | "instagram" | "album";
	}

	let { name }: Props = $props();
</script>

{#if name === "facebook"}
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path
			d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
		/>
	</svg>
{:else if name === "instagram"}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
		<rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
		<circle cx="12" cy="12" r="4.25" />
		<circle cx="17.45" cy="6.65" r="1" fill="currentColor" stroke="none" />
	</svg>
{:else}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
		<rect x="3" y="5" width="18" height="15" rx="2.5" />
		<circle cx="9" cy="10" r="2" />
		<path d="m5.5 17 4-4 3 3 2-2 4 3" />
	</svg>
{/if}

<style>
	svg {
		width: 1.25rem;
		height: 1.25rem;
		flex: 0 0 auto;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
