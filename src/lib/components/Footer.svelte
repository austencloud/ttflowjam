<footer>
	<div class="inner shell">
		<img src="/media/tacocat.png" alt="TacoCat, a cat tucked inside a taco" width="88" height="88" />
		<p>Tuesdays 4ish–10ish, April–October · Palmer Square Park, Logan Square, Chicago</p>
		<p class="blessing">Our glorious deity TacoCat welcomes you with paws wide open! 🐾</p>
		<nav aria-label="Social">
			<a href="https://www.facebook.com/flowtaco" rel="external">Facebook</a>
			<a href="https://www.instagram.com/flowtaco" rel="external">Instagram</a>
			<a href="https://photos.app.goo.gl/uNgZT4Zz6EBixmby7" rel="external">Photos</a>
		</nav>
	</div>
</footer>

<style>
	footer {
		margin-top: var(--spacing-2xl);
		padding: var(--spacing-xl) 0;
		background: oklch(0.14 0.018 270 / 0.7);
		border-top: 1px solid oklch(0.6 0.03 270 / 0.08);
		text-align: center;
		color: var(--color-text-secondary);
		font-size: var(--font-size-min);
	}

	img {
		width: 88px;
		height: 88px;
		margin-bottom: var(--spacing-sm);
	}

	.blessing {
		color: var(--color-text-muted);
	}

	nav {
		display: flex;
		flex-wrap: wrap;
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
