<script lang="ts">
	import { join } from 'overrule';
	import { Separator } from '../separator';
	import type { WithElementRef } from '../../internal/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	let {
		ref = $bindable(null),
		class: className,
		childBackground = 'bg-background',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		children?: Snippet;
		childBackground?: string;
	} = $props();
	const hasContent = $derived(!!children);
</script>

<div
	bind:this={ref}
	data-slot="field-separator"
	data-content={hasContent}
	class={join('relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2', className)}
	{...restProps}>
	<Separator class="absolute inset-0 top-1/2" />
	{#if children}
		<span class={join('relative mx-auto block w-fit px-2', childBackground)} data-slot="field-separator-content">
			{@render children()}
		</span>
	{/if}
</div>
