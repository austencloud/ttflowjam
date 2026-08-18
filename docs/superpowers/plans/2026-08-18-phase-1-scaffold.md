# Phase 1: Scaffold + Deployable Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A strict-TypeScript SvelteKit 2 + Svelte 5 app with the house tooling, TTFJ design tokens, base layout, a working "Is it on tonight?" status function, and a live deploy on Cloudflare Pages.

**Architecture:** Single SvelteKit app at repo root (no monorepo — this site is cirque-website-scale). Vanilla scoped CSS over design tokens in `src/app.css`. Pure logic lives in `src/lib/services/` with colocated Vitest tests. Cloudflare Pages via adapter-cloudflare; CI gates deploy on check+test+build.

**Tech Stack:** SvelteKit ^2, Svelte ^5 (runes only), TypeScript strict, Vite ^6, Vitest 4 + jsdom + @testing-library/svelte, ESLint 9 flat config + typescript-eslint, Prettier (TKA style), stylelint (`declaration-no-important`), @sveltejs/adapter-cloudflare, wrangler 4, npm.

**Conventions (from `E:\cirque-aflame` + `E:\tka-platform` research):** no barrel exports; no `utils/`/`helpers/` folders (domain services in `src/lib/services/`); no checkboxes in UI; scoped `<style>` reading only `var(--token)`; Svelte 5 runes with `interface Props`; tests earn their place (pure logic, parsing, validation — not glue).

---

### Task 1: SvelteKit skeleton

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `.nvmrc`, `.npmrc`
- Create: `src/app.html`, `src/app.d.ts`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`
- Create: `static/robots.txt`

- [ ] **Step 1: Write `package.json`**

```json
{
	"name": "ttflowjam",
	"version": "0.1.0",
	"private": true,
	"type": "module",
	"engines": { "node": ">=22" },
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"lint": "eslint .",
		"lint:css": "stylelint \"src/**/*.{css,svelte}\"",
		"format": "prettier --write \"**/*.{js,ts,svelte,json,md,css}\"",
		"test": "vitest run",
		"test:watch": "vitest"
	},
	"devDependencies": {
		"@sveltejs/adapter-cloudflare": "^7.2.8",
		"@sveltejs/kit": "^2.0.0",
		"@sveltejs/vite-plugin-svelte": "^5.0.0",
		"@testing-library/jest-dom": "^6.6.0",
		"@testing-library/svelte": "^5.3.1",
		"eslint": "^9.0.0",
		"eslint-config-prettier": "^10.0.0",
		"jsdom": "^29.0.0",
		"postcss-html": "^1.7.0",
		"prettier": "^3.6.2",
		"prettier-plugin-svelte": "^3.3.0",
		"stylelint": "^16.0.0",
		"svelte": "^5.0.0",
		"svelte-check": "^4.0.0",
		"typescript": "^5.9.0",
		"typescript-eslint": "^8.0.0",
		"vite": "^6.0.0",
		"vitest": "^4.0.0",
		"wrangler": "^4.70.0"
	}
}
```

- [ ] **Step 2: Write `svelte.config.js`**

```js
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: { $lib: "src/lib" },
	},
};

export default config;
```

- [ ] **Step 3: Write `vite.config.ts`** (pinned strict port so tunnels/dev never collide with sibling projects — cirque-website pattern)

```ts
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5177,
		strictPort: true,
		hmr: { overlay: true },
	},
	css: { devSourcemap: true },
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
		environment: "jsdom",
		globals: true,
	},
});
```

- [ ] **Step 4: Write `tsconfig.json`** (shared-packages strict baseline merged into SvelteKit shape)

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"noUncheckedIndexedAccess": true,
		"noImplicitOverride": true,
		"noImplicitReturns": true,
		"noFallthroughCasesInSwitch": true,
		"isolatedModules": true,
		"verbatimModuleSyntax": true,
		"moduleResolution": "bundler"
	}
}
```

- [ ] **Step 5: Write `.nvmrc`** (content: `24`) **and `.npmrc`** (content: `engine-strict=true`)

- [ ] **Step 6: Write `src/app.html`**

```html
<!doctype html>
<html lang="en" class="no-js">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<script>
			document.documentElement.classList.replace("no-js", "js");
		</script>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

- [ ] **Step 7: Write `src/app.d.ts`**

```ts
declare global {
	namespace App {
		interface Platform {
			env: {
				TTFJ_MEDIA: R2Bucket;
			};
			context: ExecutionContext;
		}
	}
}

export {};
```

- [ ] **Step 8: Write placeholder `src/routes/+layout.svelte`**

```svelte
<script lang="ts">
	import "../app.css";
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children()}
```

- [ ] **Step 9: Write placeholder `src/routes/+page.svelte`**

```svelte
<h1>Taco Tuesday Flow Jam</h1>
<p>Chicago's weekly celebration of flow arts, food, and community.</p>
```

- [ ] **Step 10: Write `static/robots.txt`**

```
User-agent: *
Allow: /
```

- [ ] **Step 11: Install and verify**

Run: `npm install` then `npm run check`
Expected: 0 errors, 0 warnings (a fresh `app.css` from Task 3 may not exist yet — create an empty `src/app.css` now if check complains).

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json svelte.config.js vite.config.ts tsconfig.json .nvmrc .npmrc src static
git commit -m "feat: scaffold SvelteKit 2 + Svelte 5 app with strict TypeScript"
```

---

### Task 2: Lint/format tooling

**Files:**
- Create: `eslint.config.js`, `.prettierrc`, `.prettierignore`, `stylelint.config.js`

- [ ] **Step 1: Write `eslint.config.js`** (flat config; ringmaster rule set modernized; `.svelte` files covered by svelte-check, not ESLint — TKA pattern)

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
	{ ignores: [".svelte-kit/", "build/", "dist/", "node_modules/", "harvest/", "**/*.svelte"] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	prettier,
	{
		rules: {
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"prefer-const": "warn",
			"no-var": "error",
			eqeqeq: ["error", "always", { null: "ignore" }],
			curly: ["error", "all"],
			"no-throw-literal": "error",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
			],
			"@typescript-eslint/no-explicit-any": "warn",
		},
	}
);
```

Note: `@eslint/js` arrives as a transitive dep of eslint 9; if `npm run lint` errors with "Cannot find module '@eslint/js'", `npm i -D @eslint/js`.

- [ ] **Step 2: Write `.prettierrc`** (TKA style — the newer standard)

```json
{
	"semi": true,
	"trailingComma": "es5",
	"singleQuote": false,
	"printWidth": 100,
	"tabWidth": 2,
	"useTabs": true,
	"plugins": ["prettier-plugin-svelte"],
	"overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
}
```

- [ ] **Step 3: Write `.prettierignore`**

```
node_modules
.svelte-kit
build
dist
package-lock.json
harvest
.claude
coverage
```

- [ ] **Step 4: Write `stylelint.config.js`** (single advisory rule, TKA rationale: `!important` hides cascade bugs)

```js
export default {
	customSyntax: "postcss-html",
	rules: {
		"declaration-no-important": [true, { severity: "warning" }],
	},
};
```

- [ ] **Step 5: Run all gates**

Run: `npm run lint && npm run format && npm run check`
Expected: lint passes (0 errors), format rewrites files, check passes.

- [ ] **Step 6: Commit**

```bash
git add eslint.config.js .prettierrc .prettierignore stylelint.config.js
git add -u
git commit -m "feat: add eslint, prettier, and stylelint tooling"
```

---

### Task 3: Design tokens (`src/app.css`)

**Files:**
- Create: `src/app.css`, `static/favicon.svg`

TTFJ brand: taco gold + salsa red + guac green on a dusk-park navy, permanently dark (house doctrine: never write light/dark variant pairs). Token structure mirrors `E:\cirque-aflame\cirque-website\src\app.css`.

- [ ] **Step 1: Write `src/app.css`**

```css
@layer thirdparty, base, components, overrides;

:root {
	/* Brand */
	--color-taco-gold: #f7b32b;
	--color-salsa-red: #e63946;
	--color-guac-green: #52b788;
	--color-glow-purple: #9d6bd8;

	/* Backgrounds (dusk park, permanently dark) */
	--color-bg-primary: #12141d;
	--color-bg-secondary: #1a1d29;
	--color-bg-tertiary: #232738;
	--color-bg-card: #1e2230;
	--color-bg-card-hover: #262b3d;

	/* Text */
	--color-text-primary: #f4f1ea;
	--color-text-secondary: #c5c1b8;
	--color-text-muted: #8d8a82;
	--color-border: #333849;

	/* Gradients & shadows */
	--gradient-fiesta: linear-gradient(135deg, var(--color-taco-gold), var(--color-salsa-red));
	--shadow-card: 0 2px 12px rgb(0 0 0 / 0.35);
	--shadow-glow: 0 0 24px rgb(247 179 43 / 0.25);

	/* Spacing */
	--spacing-xs: 0.25rem;
	--spacing-sm: 0.5rem;
	--spacing-md: 1rem;
	--spacing-lg: 1.5rem;
	--spacing-xl: 2.5rem;
	--spacing-2xl: 4rem;

	/* Radius */
	--radius-sm: 6px;
	--radius-md: 10px;
	--radius-lg: 16px;
	--radius-full: 999px;

	/* Motion */
	--transition-fast: 150ms ease;
	--transition-normal: 250ms ease;

	/* Type */
	--font-body: system-ui, -apple-system, "Segoe UI", sans-serif;
	--font-size-min: 0.875rem; /* 14px floor for essential text */

	/* Accessibility */
	--min-touch-target: 44px;
	--focus-ring: 2px solid var(--color-taco-gold);

	/* Z-index */
	--z-header: 50;
	--z-modal: 90;
	--z-toast: 100;
}

@layer base {
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		background: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-family: var(--font-body);
		line-height: 1.6;
		overscroll-behavior: none;
	}

	:focus-visible {
		outline: var(--focus-ring);
		outline-offset: 2px;
	}

	::selection {
		background: var(--color-taco-gold);
		color: var(--color-bg-primary);
	}

	img,
	video {
		max-width: 100%;
		height: auto;
	}
}

@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}
}
```

(The reduced-motion `!important` block is the one sanctioned exception — stylelint flags it as a warning, which is advisory by design.)

- [ ] **Step 2: Write `static/favicon.svg`** (taco emoji placeholder until TacoCat art is prepared)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🌮</text></svg>
```

- [ ] **Step 3: Verify** — Run: `npm run dev` briefly, load `http://localhost:5177`, confirm dark background + light text; then `npm run lint:css` (expect only the sanctioned reduced-motion warnings).

- [ ] **Step 4: Commit**

```bash
git add src/app.css static/favicon.svg
git commit -m "feat: TTFJ design tokens and base styles"
```

---

### Task 4: Jam status service (TDD)

**Files:**
- Create: `src/lib/services/jam-status.ts`
- Test: `src/lib/services/jam-status.test.ts`

The homepage's core logic, from the guidebook: "Is the weather nice? Is it Tuesday?" Season: April–October (spec §2). Jam hours: 4ish–10ish. Pure function of a `Date` (weather layered on later in Phase 2 — YAGNI now).

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import { jamStatus } from "./jam-status";

// America/Chicago local times constructed explicitly to avoid TZ flakiness:
// tests pass Date objects already in local wall-clock terms.
const d = (iso: string) => new Date(iso);

describe("jamStatus", () => {
	it("is 'on-now' during a Tuesday evening in season", () => {
		const s = jamStatus(d("2026-08-18T18:00:00")); // Tue, August, 6 PM
		expect(s.state).toBe("on-now");
	});

	it("is 'today' on a Tuesday morning in season", () => {
		const s = jamStatus(d("2026-08-18T09:00:00"));
		expect(s.state).toBe("today");
	});

	it("is 'upcoming' on a Wednesday in season, pointing at next Tuesday", () => {
		const s = jamStatus(d("2026-08-19T12:00:00")); // Wed
		expect(s.state).toBe("upcoming");
		expect(s.nextJam.getDay()).toBe(2);
		expect(s.nextJam.getDate()).toBe(25);
	});

	it("is 'off-season' in January and points at the first Tuesday of April", () => {
		const s = jamStatus(d("2026-01-10T12:00:00"));
		expect(s.state).toBe("off-season");
		expect(s.nextJam.getMonth()).toBe(3); // April
		expect(s.nextJam.getDay()).toBe(2);
		expect(s.nextJam.getDate()).toBeLessThanOrEqual(7);
	});

	it("treats a Tuesday after 10 PM as 'upcoming' (tonight's jam is over)", () => {
		const s = jamStatus(d("2026-08-18T23:00:00"));
		expect(s.state).toBe("upcoming");
		expect(s.nextJam.getDate()).toBe(25);
	});

	it("is 'off-season' in November even on a Tuesday", () => {
		const s = jamStatus(d("2026-11-03T18:00:00")); // Tue in November
		expect(s.state).toBe("off-season");
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- jam-status`
Expected: FAIL — cannot resolve `./jam-status`.

- [ ] **Step 3: Write the implementation**

```ts
/**
 * "Is it on tonight?" — the site's core question.
 * Season: April through October. Jam: Tuesdays, 4ish-10ish (per the page's flyer).
 * Weather awareness layers on in a later phase; this is the pure calendar answer.
 */

export type JamState = "on-now" | "today" | "upcoming" | "off-season";

export interface JamStatus {
	state: JamState;
	/** The date of the next (or current) jam day. */
	nextJam: Date;
}

const SEASON_START_MONTH = 3; // April (0-indexed)
const SEASON_END_MONTH = 9; // October
const JAM_WEEKDAY = 2; // Tuesday
const JAM_START_HOUR = 16; // 4ish
const JAM_END_HOUR = 22; // 10ish

function inSeason(date: Date): boolean {
	const m = date.getMonth();
	return m >= SEASON_START_MONTH && m <= SEASON_END_MONTH;
}

function nextTuesdayOnOrAfter(date: Date): Date {
	const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	while (result.getDay() !== JAM_WEEKDAY) {
		result.setDate(result.getDate() + 1);
	}
	return result;
}

function firstTuesdayOfNextSeason(date: Date): Date {
	const year = date.getMonth() > SEASON_END_MONTH || !inSeason(date)
		? date.getMonth() <= SEASON_START_MONTH
			? date.getFullYear()
			: date.getFullYear() + 1
		: date.getFullYear();
	return nextTuesdayOnOrAfter(new Date(year, SEASON_START_MONTH, 1));
}

export function jamStatus(now: Date): JamStatus {
	if (!inSeason(now)) {
		return { state: "off-season", nextJam: firstTuesdayOfNextSeason(now) };
	}

	const isTuesday = now.getDay() === JAM_WEEKDAY;
	const hour = now.getHours();

	if (isTuesday && hour >= JAM_START_HOUR && hour < JAM_END_HOUR) {
		return { state: "on-now", nextJam: nextTuesdayOnOrAfter(now) };
	}
	if (isTuesday && hour < JAM_START_HOUR) {
		return { state: "today", nextJam: nextTuesdayOnOrAfter(now) };
	}

	const dayAfter = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
	const next = nextTuesdayOnOrAfter(dayAfter);
	if (!inSeason(next)) {
		return { state: "off-season", nextJam: firstTuesdayOfNextSeason(next) };
	}
	return { state: "upcoming", nextJam: next };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- jam-status`
Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/services/jam-status.ts src/lib/services/jam-status.test.ts
git commit -m "feat: jam status service — is it on tonight?"
```

---

### Task 5: Base layout + shell pages

**Files:**
- Create: `src/lib/components/Header.svelte`, `src/lib/components/Footer.svelte`
- Modify: `src/routes/+layout.svelte`, `src/routes/+page.svelte`

- [ ] **Step 1: Write `src/lib/components/Header.svelte`** (44px touch targets; links look like buttons per house rules)

```svelte
<script lang="ts">
	const links = [
		{ href: "/", label: "Home" },
		{ href: "/about", label: "About" },
		{ href: "/gallery", label: "Gallery" },
		{ href: "/events", label: "Other Events" },
		{ href: "/links", label: "Links" },
	];
</script>

<header>
	<a class="brand" href="/">🌮 Taco Tuesday Flow Jam</a>
	<nav aria-label="Main">
		{#each links as link (link.href)}
			<a href={link.href}>{link.label}</a>
		{/each}
	</nav>
</header>

<style>
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-lg);
		background: var(--color-bg-secondary);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: var(--z-header);
	}

	.brand {
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--color-taco-gold);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
	}

	nav a {
		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
		padding: 0 var(--spacing-md);
		border-radius: var(--radius-full);
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: background var(--transition-fast), color var(--transition-fast);
	}

	nav a:hover {
		background: var(--color-bg-card-hover);
		color: var(--color-text-primary);
	}
</style>
```

- [ ] **Step 2: Write `src/lib/components/Footer.svelte`**

```svelte
<footer>
	<p>
		Tuesdays 4ish–10ish, April–October · Palmer Square Park, Logan Square, Chicago
	</p>
	<p class="blessing">Our glorious deity TacoCat welcomes you with paws wide open! 🐾</p>
	<nav aria-label="Social">
		<a href="https://www.facebook.com/flowtaco" rel="external">Facebook</a>
		<a href="https://www.instagram.com/flowtaco" rel="external">Instagram</a>
	</nav>
</footer>

<style>
	footer {
		margin-top: var(--spacing-2xl);
		padding: var(--spacing-xl) var(--spacing-lg);
		background: var(--color-bg-secondary);
		border-top: 1px solid var(--color-border);
		text-align: center;
		color: var(--color-text-secondary);
		font-size: var(--font-size-min);
	}

	.blessing {
		color: var(--color-text-muted);
	}

	nav {
		display: flex;
		justify-content: center;
		gap: var(--spacing-sm);
	}

	nav a {
		display: inline-flex;
		align-items: center;
		min-height: var(--min-touch-target);
		padding: 0 var(--spacing-md);
		color: var(--color-taco-gold);
	}
</style>
```

- [ ] **Step 3: Update `src/routes/+layout.svelte`**

```svelte
<script lang="ts">
	import "../app.css";
	import type { Snippet } from "svelte";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<Header />
<main>
	{@render children()}
</main>
<Footer />

<style>
	main {
		max-width: 72rem;
		margin: 0 auto;
		padding: var(--spacing-lg);
		min-height: 60vh;
	}
</style>
```

- [ ] **Step 4: Update `src/routes/+page.svelte`** (wires the jam-status service; real hero design lands in Phase 2)

```svelte
<script lang="ts">
	import { jamStatus } from "$lib/services/jam-status";

	const status = jamStatus(new Date());

	const headline = {
		"on-now": "It's ON right now! 🔥",
		today: "It's on TONIGHT! 🌮",
		upcoming: "Next jam:",
		"off-season": "See you in spring! First jam:",
	}[status.state];

	const nextJamLabel = status.nextJam.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});
</script>

<svelte:head>
	<title>Taco Tuesday Flow Jam — Chicago</title>
	<meta
		name="description"
		content="A weekly celebration of flow arts, food, and community. Tuesdays 4ish-10ish, April-October, Palmer Square Park, Chicago."
	/>
</svelte:head>

<section class="hero">
	<h1>Taco Tuesday Flow Jam</h1>
	<p class="tagline">A weekly celebration of flow arts, food, and community. Come play!</p>
	<p class="status">
		{headline}
		{#if status.state !== "on-now" && status.state !== "today"}
			<strong>{nextJamLabel}</strong>
		{/if}
	</p>
	<p class="where">Tuesdays 4ish–10ish · Palmer Square Park, 2200 N Kedzie Blvd</p>
</section>

<style>
	.hero {
		text-align: center;
		padding: var(--spacing-2xl) 0;
	}

	h1 {
		font-size: clamp(2rem, 6vw, 3.5rem);
		background: var(--gradient-fiesta);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
		margin: 0;
	}

	.tagline {
		font-size: 1.15rem;
		color: var(--color-text-secondary);
	}

	.status {
		font-size: 1.4rem;
		margin: var(--spacing-xl) 0 var(--spacing-sm);
	}

	.where {
		color: var(--color-text-muted);
	}
</style>
```

- [ ] **Step 5: Verify** — Run: `npm run check && npm test && npm run build`
Expected: all pass, build emits `.svelte-kit/cloudflare`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components src/routes
git commit -m "feat: base layout, header/footer, and live jam-status homepage"
```

---

### Task 6: Cloudflare Pages deploy + CI

**Files:**
- Create: `wrangler.toml`, `.github/workflows/ci.yml`

- [ ] **Step 1: Write `wrangler.toml`**

```toml
name = "ttflowjam"
pages_build_output_dir = ".svelte-kit/cloudflare"
compatibility_date = "2026-08-01"
compatibility_flags = ["nodejs_compat"]
```

(R2 binding `TTFJ_MEDIA` gets added in the gallery phase when the bucket exists.)

- [ ] **Step 2: Create the Pages project and deploy**

Run:
```bash
npx wrangler pages project create ttflowjam --production-branch=main
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare --project-name=ttflowjam --branch=main --commit-dirty=true
```
Expected: a live `https://ttflowjam.pages.dev` URL. If wrangler is not authenticated, run `npx wrangler login` (user completes the OAuth prompt in the browser).

- [ ] **Step 3: Verify the deploy** — `curl -s https://ttflowjam.pages.dev | grep -o "<title>[^<]*"`
Expected: `<title>Taco Tuesday Flow Jam — Chicago`

- [ ] **Step 4: Write `.github/workflows/ci.yml`** (gate quality on every push; deploys stay manual/wrangler for now — the TKA two-workflow deploy-hook gate arrives when the site has users)

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run check
      - run: npm test
      - run: npm run build
```

- [ ] **Step 5: Commit and push; confirm CI green**

```bash
git add wrangler.toml .github/workflows/ci.yml
git commit -m "feat: Cloudflare Pages deploy and CI quality gate"
git push
gh run watch --exit-status
```
Expected: CI run passes.

---

### Task 7: Project conventions (CLAUDE.md + rules)

**Files:**
- Create: `CLAUDE.md`, `.claude/rules/styling.md`, `.claude/rules/code-style.md`, `.claude/rules/never-hand-roll.md`

- [ ] **Step 1: Write `CLAUDE.md`**

```markdown
# Taco Tuesday Flow Jam — ttflowjam

Community hub for Chicago's weekly flow arts jam. SvelteKit 2 + Svelte 5 (runes only),
strict TypeScript, Cloudflare Pages, vanilla scoped CSS over tokens in `src/app.css`.

## Commands

- `npm run dev` — dev server on :5177 (strict port)
- `npm run check && npm run lint && npm test && npm run build` — the full gate; run before every commit

## Rules

- `.claude/rules/` is authoritative: never-hand-roll, code-style, styling
- Reuse `@austencloud/*` packages (media-spotlight, theme, image-loader) before building anything they cover
- The canonical asset pile is `harvest/` (gitignored media + committed manifests). Never re-scrape a source that's already in the pile.
- The spec is `docs/superpowers/specs/2026-08-18-ttfj-website-design.md`; decisions in §9 are locked
- Verification before completion: every "done" claim needs the command output that proves it
- Writing style for site copy: warm, playful, direct. TacoCat is canon. Never publish the after-party location or any home address.
```

- [ ] **Step 2: Write `.claude/rules/code-style.md`** (condensed from ringmaster, same rules)

```markdown
# Code Style

- **No barrel exports.** Never create `index.ts` re-export files in `src/lib/`. Import from source.
- **No `utils/`, `helpers/`, or `hooks/` folders.** Shared logic: `src/lib/services/<domain>.ts`. Validation: `src/lib/schemas/`. Component-local logic stays in the component.
- Svelte 5 runes only: `$props()` with `interface Props`, prefer `$derived` over `$effect`, shared reactive state in `.svelte.ts` factories.
- No `Service` suffix in names.
- Single responsibility per file. File count is a non-issue; monolith files are.
- Tests are earned: pure algorithms, parsing, validation, twice-regressed bugs. Not UI glue.
```

- [ ] **Step 3: Write `.claude/rules/styling.md`** (condensed from ringmaster's doctrine)

```markdown
# Styling

- Tokens live in `src/app.css` on `:root`. Component styles are scoped `<style>` blocks that read only `var(--token)`. No hardcoded colors/sizes/durations.
- Permanently dark. Never write light/dark variant pairs.
- No Tailwind. No `!important` (stylelint warns; the reduced-motion global block is the one sanctioned exception).
- Text floor 14px essential / 12px supplementary. Touch targets ≥44px (`--min-touch-target`). Contrast AAA (7:1 normal, 4.5:1 large). Always-visible focus rings.
- No `<input type="checkbox">` — booleans are buttons with `aria-pressed`.
- No layout shift: reserve space for dynamic content.
```

- [ ] **Step 4: Write `.claude/rules/never-hand-roll.md`** (condensed from TKA's master rule)

```markdown
# Never Hand-Roll (One Concept, One Owner)

Before building any shared-feeling behavior:
1. Grep this repo and check `@austencloud/*` packages (media-spotlight, theme, media-manager, image-loader, drawer, sidebar, chip-toggle) for an existing owner — search at least 3 synonym terms.
2. Declare the outcome in your report: **Reuse / Extend / Compose / Create**.
3. A second parallel implementation of an owned concept is forbidden; a third is a defect.

Known owners: gallery viewer → `@austencloud/media-spotlight`; theming → `@austencloud/theme` + `src/app.css`; forms → zod schema + SvelteKit form actions + Turnstile/honeypot (cirque inquiry pattern); R2 upload → SigV4 presign (cirque `r2-signing.ts` pattern).
```

- [ ] **Step 5: Commit and push**

```bash
git add CLAUDE.md .claude/rules
git commit -m "docs: project conventions and house rules"
git push
```

---

## Phase 1 exit criteria

- `npm run lint && npm run check && npm test && npm run build` all green locally and in CI
- `https://ttflowjam.pages.dev` serves the shell with live jam status
- Repo pushed; conventions in place

Phase 2 (content core: real Home hero, About/Flow Arts, Links, Other Events — with the frontend-design skill for the visual pass) gets its own plan.
