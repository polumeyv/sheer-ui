<script lang="ts">
import { cn, type WithElementRef } from "$lib/utils.js";
import type { HTMLAttributes } from 'svelte/elements';

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLHeadingElement>> = $props();
</script>

<div
	data-slot="heading-title"
	class={cn(
		'flex flex-wrap items-center justify-between gap-4',
		'has-[~[data-slot=heading-nav]]:pb-6',
		'[&:not(:has(~[data-slot=heading-nav]))]:pb-4 [&:not(:has(~[data-slot=heading-nav]))]:border-b [&:not(:has(~[data-slot=heading-nav]))]:border-border',
		className
	)}
>
	<h1 bind:this={ref} class="text-2xl md:text-3xl font-bold tracking-tight" {...restProps}>
		{@render children?.()}
	</h1>
</div>
