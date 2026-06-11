<script lang="ts">
	import type { Component } from 'svelte';

	let {
		value,
		options,
		href,
		class: className,
	}: {
		value: string;
		options: Array<{ value: string; label: string; icon?: Component; iconClass?: string }>;
		href?: string;
		class?: string;
	} = $props();

	const match = $derived(options.find((o) => o.value === value));
</script>

{#if match}
	{const inner = { iconClass: match.iconClass ?? 'text-muted-foreground', label: match.label }}
	{#if href}
		<a {href} class="flex w-25 items-center hover:underline {className ?? ''}">
			{#if match.icon}<match.icon class="{inner.iconClass} me-2 size-4 shrink-0" />{/if}
			<span>{inner.label}</span>
		</a>
	{:else}
		<div class="flex w-25 items-center {className ?? ''}">
			{#if match.icon}<match.icon class="{inner.iconClass} me-2 size-4 shrink-0" />{/if}
			<span>{inner.label}</span>
		</div>
	{/if}
{/if}
