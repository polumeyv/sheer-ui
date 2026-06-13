<script lang="ts">
import { cn, type WithElementRef } from '../../vendor/utils';
import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';

let {
	ref = $bindable(null),
	class: className,
	title,
	description,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
	title: string;
	description?: string;
	children?: Snippet;
} = $props();
</script>

<div
	bind:this={ref}
	data-slot="share-card"
	class={cn('flex flex-col gap-4 border p-4', className)}
	{...restProps}
>
	<div data-slot="share-card-header" class="flex flex-col gap-1">
		<h3 class="text-base font-semibold leading-none tracking-tight">{title}</h3>
		{#if description}
			<p class="text-muted-foreground text-sm">{description}</p>
		{/if}
	</div>
	{@render children?.()}
</div>
