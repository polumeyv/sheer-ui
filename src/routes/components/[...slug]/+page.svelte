<script lang="ts">
	import ComponentPreview from '../_preview.svelte';
	import { demosFor } from '../_demos.js';

	let { data } = $props();

	const meta = $derived(data.meta);

	const Markdown = $derived(data.component);
	const demos = $derived(demosFor(meta.slug));
	const primary = $derived(demos[0]);
	const examples = $derived(demos.slice(1));

	function labelFor(key: string): string {
		return key
			.replace(/^\d+[-_]/, '')
			.replace(/[-_]/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
	}
</script>

<svelte:head>
	<title>{meta.name} — @polumeyv/ui</title>
</svelte:head>

<div class="mx-auto max-w-3xl">
	<div class="space-y-2">
		<h1 class="scroll-m-20 text-3xl font-bold tracking-tight">{meta.name}</h1>
		<p class="text-muted-foreground text-lg text-balance">{meta.description}</p>
	</div>
	<div class="w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0">
		{#if primary}
			{@const Demo = primary.component}
			<ComponentPreview class="mt-6">
				<Demo />
			</ComponentPreview>
		{/if}
	</div>

	{#if examples.length}
		<h2 class="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">Examples</h2>
		{#each examples as example (example.key)}
			{@const Demo = example.component}
			<section class="mt-8 space-y-4">
				<h3 class="scroll-m-20 text-xl font-semibold tracking-tight">
					{example.title ?? labelFor(example.key)}
				</h3>
				<ComponentPreview>
					<Demo />
				</ComponentPreview>
			</section>
		{/each}
	{/if}
</div>
