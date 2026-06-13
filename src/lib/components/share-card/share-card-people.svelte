<script lang="ts">
import { cn, type WithElementRef } from '../../vendor/utils';
import type { HTMLAttributes } from 'svelte/elements';
import { Separator } from '../separator';

let {
	ref = $bindable(null),
	class: className,
	label = 'People with access',
	showSeparator = true,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
	label?: string;
	showSeparator?: boolean;
} = $props();
</script>

{#if showSeparator}
	<Separator class="my-2" />
{/if}

<div
	bind:this={ref}
	data-slot="share-card-people"
	class={cn('flex flex-col gap-1', className)}
	{...restProps}
>
	{#if label}
		<p class="text-sm font-medium mb-1">{label}</p>
	{/if}
	<div class="flex flex-col">
		{@render children?.()}
	</div>
</div>
