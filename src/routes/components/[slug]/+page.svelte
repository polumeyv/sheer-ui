<script lang="ts">
	import type { Component } from 'svelte';
	import Preview from '../../Preview.svelte';

	let { data } = $props();

	// Lazy glob: each demo is loaded on demand for the current slug only, so a
	// single broken demo can't take down every component page.
	const demos = import.meta.glob('../../demos/*.svelte');

	const load = $derived(demos[`../../demos/${data.meta.slug}.svelte`]);
</script>

<div class="mx-auto max-w-4xl">
	<h1 class="text-3xl font-bold tracking-tight">{data.meta.title}</h1>
	<p class="mt-2 text-lg text-muted-foreground">{data.meta.description}</p>

	<div class="mt-8">
		{#if load}
			{#await load()}
				<div class="flex min-h-48 items-center justify-center rounded-xl border border-border text-sm text-muted-foreground">Loading…</div>
			{:then mod}
				{@const Demo = (mod as { default: Component }).default}
				<svelte:boundary>
					<Preview>
						<Demo />
					</Preview>
					{#snippet failed(error)}
						<div
							class="flex min-h-48 flex-col items-center justify-center gap-1 rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center text-sm">
							<span class="font-medium text-destructive">Failed to render this demo</span>
							<span class="text-muted-foreground">{(error as Error).message}</span>
						</div>
					{/snippet}
				</svelte:boundary>
			{:catch error}
				<div
					class="flex min-h-48 flex-col items-center justify-center gap-1 rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center text-sm">
					<span class="font-medium text-destructive">Failed to load this demo</span>
					<span class="text-muted-foreground">{error.message}</span>
				</div>
			{/await}
		{:else}
			<div class="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
				Demo coming soon.
			</div>
		{/if}
	</div>
</div>
