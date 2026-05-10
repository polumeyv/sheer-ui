<script lang="ts">
	import type { Component } from 'svelte';

	let {
		value,
		options,
	}: {
		value: string;
		options: Array<{ value: string; label: string; icon?: Component }>;
	} = $props();

	const match = $derived(options.find((o) => o.value === value));
</script>

{#if match}
	<div class="flex items-center">
		{#if match.icon}
			<match.icon class="text-muted-foreground me-2 size-4" />
		{/if}
		<span>{match.label}</span>
	</div>
{/if}
