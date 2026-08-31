<script lang="ts">
	import { onNavigate } from "$app/navigation";

	const mainRoutes = ["/", "/gallery", "/help-out"] as const;
	let latestTransition = 0;

	function routePosition(url: URL | null | undefined) {
		if (!url) return -1;

		const pathname = url.pathname.replace(/\/+$/, "") || "/";
		return mainRoutes.findIndex((route) => route === pathname);
	}

	onNavigate((navigation) => {
		const from = routePosition(navigation.from?.url);
		const to = routePosition(navigation.to?.url);
		const startViewTransition = document.startViewTransition?.bind(document);

		if (
			from === -1 ||
			to === -1 ||
			from === to ||
			!startViewTransition ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}

		const transitionNumber = ++latestTransition;
		document.documentElement.dataset.routeDirection = to > from ? "forward" : "backward";

		return new Promise<void>((resolve) => {
			try {
				const transition = startViewTransition(async () => {
					resolve();
					await navigation.complete;
				});

				void transition.finished
					.catch(() => undefined)
					.finally(() => {
						if (transitionNumber === latestTransition) {
							delete document.documentElement.dataset.routeDirection;
						}
					});
			} catch {
				if (transitionNumber === latestTransition) {
					delete document.documentElement.dataset.routeDirection;
				}
				resolve();
			}
		});
	});
</script>

<style>
	:global(html) {
		view-transition-name: none;
	}

	:global(#content) {
		view-transition-name: route-content;
	}

	:global(::view-transition-group(route-content)),
	:global(::view-transition-old(route-content)),
	:global(::view-transition-new(route-content)) {
		animation-duration: var(--duration-normal);
		animation-fill-mode: both;
		animation-timing-function: var(--ease-out);
	}

	:global(::view-transition-old(route-content)),
	:global(::view-transition-new(route-content)) {
		mix-blend-mode: normal;
	}

	:global(html[data-route-direction="forward"]::view-transition-old(route-content)) {
		animation-name: route-forward-out;
	}

	:global(html[data-route-direction="forward"]::view-transition-new(route-content)) {
		animation-name: route-forward-in;
	}

	:global(html[data-route-direction="backward"]::view-transition-old(route-content)) {
		animation-name: route-backward-out;
	}

	:global(html[data-route-direction="backward"]::view-transition-new(route-content)) {
		animation-name: route-backward-in;
	}

	@keyframes route-forward-out {
		to {
			opacity: 0;
			transform: translateX(calc(var(--space-5) * -1));
		}
	}

	@keyframes route-forward-in {
		from {
			opacity: 0;
			transform: translateX(var(--space-5));
		}
	}

	@keyframes route-backward-out {
		to {
			opacity: 0;
			transform: translateX(var(--space-5));
		}
	}

	@keyframes route-backward-in {
		from {
			opacity: 0;
			transform: translateX(calc(var(--space-5) * -1));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(#content) {
			view-transition-name: none;
		}
	}
</style>
