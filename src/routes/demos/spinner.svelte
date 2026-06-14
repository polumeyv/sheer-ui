<script lang="ts">
	import { Spinner } from '$lib/components/spinner/index';
	import { Button } from '$lib/components/button/index';

	// Shared chrome so each example stays copy-paste sized.
	const ROW = 'flex flex-wrap items-center gap-6';
	const EMPTY =
		'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center';

	// Sizes example — Spinner forwards class to the underlying SVG.
	const sizes = ['size-3', 'size-4', 'size-6', 'size-8'];

	// Colors example — text color drives the spinner via currentColor.
	const colors = [
		{ class: 'text-red-500', label: 'red' },
		{ class: 'text-emerald-500', label: 'green' },
		{ class: 'text-blue-500', label: 'blue' },
		{ class: 'text-amber-500', label: 'yellow' },
		{ class: 'text-violet-500', label: 'purple' }
	];

	// Loading button example — toggleable busy state.
	let loading = $state(true);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">The spinner at its default size.</p>
		</div>
		<div class={ROW}>
			<Spinner />
		</div>
	</section>

	<!-- 2 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">Resize with a <code>size-*</code> class.</p>
		</div>
		<div class={ROW}>
			{#each sizes as size (size)}
				<Spinner class={size} />
			{/each}
		</div>
	</section>

	<!-- 3 — colors -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Colors</h3>
			<p class="text-muted-foreground mt-1 text-xs">Recolor with a text color utility.</p>
		</div>
		<div class={ROW}>
			{#each colors as c (c.label)}
				<Spinner class={`size-6 ${c.class}`} />
			{/each}
		</div>
	</section>

	<!-- 4 — loading button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Loading button</h3>
			<p class="text-muted-foreground mt-1 text-xs">Spinner inside a disabled, busy button.</p>
		</div>
		<div class={ROW}>
			<Button disabled={loading} onclick={() => (loading = true)}>
				{#if loading}
					<Spinner class="size-4" />
					Please wait
				{:else}
					Submit
				{/if}
			</Button>
			<Button variant="outline" size="sm" onclick={() => (loading = !loading)}>Toggle</Button>
		</div>
	</section>

	<!-- 5 — with label -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With label</h3>
			<p class="text-muted-foreground mt-1 text-xs">Inline beside text for status rows.</p>
		</div>
		<div class={ROW}>
			<div class="text-muted-foreground flex items-center gap-2 text-sm">
				<Spinner class="size-4" />
				Syncing…
			</div>
			<div class="text-muted-foreground flex items-center gap-2 text-sm">
				<Spinner class="size-4" />
				Updating…
			</div>
		</div>
	</section>

	<!-- 6 — empty state -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Empty state</h3>
			<p class="text-muted-foreground mt-1 text-xs">Centered in a loading placeholder.</p>
		</div>
		<div class={EMPTY}>
			<Spinner class="text-muted-foreground size-8" />
			<div>
				<p class="text-sm font-medium">Loading projects</p>
				<p class="text-muted-foreground text-xs">This will only take a moment.</p>
			</div>
		</div>
	</section>
</div>
