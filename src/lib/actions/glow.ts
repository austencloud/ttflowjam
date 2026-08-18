import type { Action } from "svelte/action";

/**
 * Cursor-tracking glow: writes --glow-x / --glow-y / --glow-o custom properties
 * for a radial-gradient overlay to consume. No-ops on touch devices and for
 * users preferring reduced motion.
 */
export const glow: Action<HTMLElement> = (node) => {
	if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
		return {};
	}

	function move(event: PointerEvent) {
		const rect = node.getBoundingClientRect();
		node.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
		node.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
		node.style.setProperty("--glow-o", "1");
	}

	function leave() {
		node.style.setProperty("--glow-o", "0");
	}

	node.addEventListener("pointermove", move);
	node.addEventListener("pointerleave", leave);

	return {
		destroy() {
			node.removeEventListener("pointermove", move);
			node.removeEventListener("pointerleave", leave);
		},
	};
};
