<script lang="ts">
	import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

	interface Props {
		icon: IconDefinition;
		size?: string;
	}

	let { icon, size = "1em" }: Props = $props();

	const [width, height, , , pathData] = $derived(icon.icon);
	const paths = $derived(Array.isArray(pathData) ? pathData : [pathData]);
</script>

<svg
	viewBox="0 0 {width} {height}"
	style="width: {size}; height: {size};"
	fill="currentColor"
	aria-hidden="true"
>
	{#each paths as d (d)}
		<path {d} />
	{/each}
</svg>

<style>
	svg {
		display: inline-block;
		vertical-align: -0.125em;
	}
</style>
