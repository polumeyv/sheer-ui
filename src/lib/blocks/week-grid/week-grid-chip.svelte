<script lang="ts">
	import { join } from 'overrule';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	let { accent, class: className, children }: { accent?: string; class?: ClassValue; children: Snippet } = $props();
</script>

<!-- The accent is a pill inset inside the rounded fill rather than a stripe on its edge, so the chip's radius and
     the bar's never meet as a cut arc. -->
<div
	data-slot="week-grid-chip"
	class={join(
		'relative flex h-full w-full flex-col overflow-hidden pr-1.5 text-start text-[11px] leading-[1.15] whitespace-nowrap',
		accent ? 'pl-2.5' : 'pl-1.5',
		className,
	)}>
	{#if accent}<span class={join('absolute top-1 bottom-1 left-1 w-[3px] rounded-full', accent)}></span>{/if}
	{@render children()}
</div>
