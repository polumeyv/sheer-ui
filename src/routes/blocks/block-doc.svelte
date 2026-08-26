<script lang="ts">
	import type { Component } from 'svelte';
	import ComponentPreview from '../components/_preview.svelte';
	import type { BlockMeta } from './_registry.js';

	let { meta, demo }: { meta: BlockMeta; demo?: Component } = $props();
</script>

<svelte:head>
	<title>{meta.name} — @polumeyv/ui blocks</title>
</svelte:head>

<div class="mx-auto {meta.wide ? 'max-w-6xl' : 'max-w-3xl'}">
	<div class="space-y-2">
		<h1 class="scroll-m-20 text-3xl font-bold tracking-tight">{meta.name}</h1>
		<p class="text-muted-foreground text-lg text-balance">{meta.description}</p>
	</div>

	{#if demo}
		{@const Demo = demo}
		<ComponentPreview class="mt-6" align="start">
			<Demo />
		</ComponentPreview>
	{:else}
		<p class="text-muted-foreground mt-6">No demo available.</p>
	{/if}
</div>
