<script lang="ts">
	interface Props {
		src: string;
		title: string;
		fallbackHref: string;
		size?: "help" | "classes";
		onSubmitted?: () => void;
	}

	let { src, title, fallbackHref, size = "help", onSubmitted }: Props = $props();
	let hasLoaded = false;

	$effect(() => {
		src;
		hasLoaded = false;
	});

	function handleLoad() {
		if (!hasLoaded) {
			hasLoaded = true;
			return;
		}

		onSubmitted?.();
	}
</script>

<div class:classes={size === "classes"} class="form-embed">
	<iframe {src} {title} loading="lazy" onload={handleLoad}>Loading…</iframe>
	<noscript><a href={fallbackHref} rel="external">Open form</a></noscript>
</div>

<style>
	.form-embed {
		overflow: hidden;
		padding-top: var(--border-heavy);
		border: var(--border-thin) solid color-mix(in srgb, var(--brand-cream) 30%, var(--theme-stroke));
		border-radius: var(--radius-large);
		background:
			linear-gradient(
					90deg,
					var(--theme-accent),
					var(--theme-led),
					var(--theme-selection),
					var(--theme-spark)
				)
				top / 100% var(--border-heavy) no-repeat,
			var(--theme-panel-bg);
		box-shadow: var(--shadow-panel);
	}

	iframe {
		display: block;
		width: 100%;
		height: var(--help-form-height);
		border: 0;
		background: var(--theme-panel-bg);
	}

	.classes iframe {
		height: var(--class-form-height);
	}

	noscript {
		display: flex;
		justify-content: center;
		padding: var(--space-4);
		border-top: var(--border-thin) solid var(--theme-stroke);
	}

	a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--min-touch-target);
		padding-inline: var(--space-5);
		border: var(--border-thin) solid var(--theme-stroke-strong);
		border-radius: var(--radius-medium);
		background: var(--theme-card-bg);
		color: var(--theme-text);
		font-weight: 780;
		text-decoration: none;
	}
</style>
